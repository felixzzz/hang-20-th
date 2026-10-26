import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/guests error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      summary: {
        totalInvited: data?.length || 0,
        opened: data?.filter((g) => g.has_opened).length || 0,
        confirmedHadir: data?.filter((g) => g.rsvp_status === "hadir").length || 0,
        confirmedTidakHadir: data?.filter((g) => g.rsvp_status === "tidak_hadir").length || 0,
        pending: data?.filter((g) => !g.rsvp_status || g.rsvp_status === "pending").length || 0,
      },
    });
  } catch (err) {
    console.error("GET /api/guests error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { names, category, phone } = body;

    let namesList: string[] = [];
    if (Array.isArray(names)) {
      namesList = names;
    } else if (typeof names === "string") {
      namesList = names
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    }

    if (namesList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tidak ada nama tamu yang valid untuk ditambahkan." },
        { status: 400 }
      );
    }

    const rows = namesList.map((name) => ({
      name: name.trim(),
      category: category || "Umum",
      phone: phone || "",
      has_opened: false,
      rsvp_status: "pending",
    }));

    // Upsert guests by name
    const { data, error } = await supabaseAdmin
      .from("guests")
      .upsert(rows, { onConflict: "name", ignoreDuplicates: true })
      .select();

    if (error) {
      console.error("POST /api/guests error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil menambahkan ${namesList.length} tamu undangan.`,
      data,
    });
  } catch (err) {
    console.error("POST /api/guests error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { name, has_opened } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Nama tamu dibutuhkan." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("guests")
      .update({
        has_opened: has_opened ?? true,
        opened_at: new Date().toISOString(),
      })
      .ilike("name", name.trim());

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Status tamu diperbarui." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID tamu dibutuhkan." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("guests").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
