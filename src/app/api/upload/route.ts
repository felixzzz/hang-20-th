import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = "cms-media";

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: true });
    }
  } catch (err) {
    console.error("ensureBucket error in upload:", err);
  }
}

export async function POST(request: Request) {
  try {
    await ensureBucket();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    // Check size (Max 12MB)
    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran berkas terlalu besar (maksimal 12MB)." },
        { status: 400 }
      );
    }

    // Sanitize filename & extension
    const originalName = file.name || "image.jpg";
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
    const cleanBase = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);

    const filename = `uploads/${Date.now()}-${cleanBase}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase image upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah foto ke Supabase: " + uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      message: "Foto berhasil diunggah ke Supabase Storage.",
      url: publicData.publicUrl,
      path: filename,
    });
  } catch (err: any) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
