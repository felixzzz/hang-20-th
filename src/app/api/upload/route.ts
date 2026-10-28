import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// GET: Retrieve list of previously uploaded media files in Supabase Storage
export async function GET() {
  try {
    await ensureBucket();
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list("uploads", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.error("Supabase list media error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const files = (data || [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => {
        const { data: publicData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`uploads/${f.name}`);
        return {
          name: f.name,
          size: f.metadata?.size || 0,
          created_at: f.created_at,
          url: publicData.publicUrl,
        };
      });

    return NextResponse.json({
      success: true,
      data: files,
    });
  } catch (err: any) {
    console.error("GET /api/upload error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
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
