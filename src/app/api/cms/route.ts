import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { defaultCms } from "@/data/defaultCms";
import { sortMilestonesByYear } from "@/data/history";
import { SiteCmsConfig } from "@/types/cms";

const BUCKET_NAME = "cms-media";
const CONFIG_FILE_PATH = "cms-settings.json";

// Helper: Ensure bucket exists
async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: true });
    }
  } catch (err) {
    console.error("ensureBucket error:", err);
  }
}

export async function GET() {
  try {
    await ensureBucket();

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(CONFIG_FILE_PATH);

    if (error || !data) {
      // If not yet uploaded in Supabase, return default configuration
      return NextResponse.json({
        success: true,
        source: "default",
        data: defaultCms,
      });
    }

    const text = await data.text();
    const parsed: SiteCmsConfig = JSON.parse(text);

    // Deep merge with defaultCms to guarantee all keys exist even after schema expansion
    const merged: SiteCmsConfig = {
      navbar: { ...defaultCms.navbar, ...(parsed.navbar || {}) },
      cover: { ...defaultCms.cover, ...(parsed.cover || {}) },
      hero: { ...defaultCms.hero, ...(parsed.hero || {}) },
      wisdom: { ...defaultCms.wisdom, ...(parsed.wisdom || {}) },
      event: { ...defaultCms.event, ...(parsed.event || {}) },
      donation: { ...defaultCms.donation, ...(parsed.donation || {}) },
      location: { ...defaultCms.location, ...(parsed.location || {}) },
      shareMessage: { ...defaultCms.shareMessage, ...(parsed.shareMessage || {}) },
      milestones: sortMilestonesByYear(
        Array.isArray(parsed.milestones) ? parsed.milestones : defaultCms.milestones
      ),
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaultCms.gallery,
    };

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: merged,
    });
  } catch (err) {
    console.error("GET /api/cms error:", err);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: defaultCms,
    });
  }
}

export async function POST(request: Request) {
  try {
    await ensureBucket();

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Data konfigurasi tidak valid." },
        { status: 400 }
      );
    }

    // Merge incoming changes with defaults or current values
    const configToSave: SiteCmsConfig = {
      navbar: { ...defaultCms.navbar, ...(body.navbar || {}) },
      cover: { ...defaultCms.cover, ...(body.cover || {}) },
      hero: { ...defaultCms.hero, ...(body.hero || {}) },
      wisdom: { ...defaultCms.wisdom, ...(body.wisdom || {}) },
      event: { ...defaultCms.event, ...(body.event || {}) },
      donation: { ...defaultCms.donation, ...(body.donation || {}) },
      location: { ...defaultCms.location, ...(body.location || {}) },
      shareMessage: { ...defaultCms.shareMessage, ...(body.shareMessage || {}) },
      milestones: sortMilestonesByYear(
        Array.isArray(body.milestones) ? body.milestones : defaultCms.milestones
      ),
      gallery: Array.isArray(body.gallery) ? body.gallery : defaultCms.gallery,
    };

    const payloadBuffer = Buffer.from(JSON.stringify(configToSave, null, 2), "utf-8");

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(CONFIG_FILE_PATH, payloadBuffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase CMS save error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan konfigurasi ke Supabase: " + uploadError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Konfigurasi CMS berhasil disimpan ke Supabase.",
      data: configToSave,
    });
  } catch (err: any) {
    console.error("POST /api/cms error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await ensureBucket();
    await supabaseAdmin.storage.from(BUCKET_NAME).remove([CONFIG_FILE_PATH]);

    return NextResponse.json({
      success: true,
      message: "Konfigurasi berhasil direset ke pengaturan bawaan.",
      data: defaultCms,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
