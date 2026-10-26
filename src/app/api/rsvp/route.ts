import { NextResponse } from "next/server";
import { initialWishes, WishItem } from "@/data/defaultWishes";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({
        success: true,
        data: initialWishes,
        summary: {
          totalResponses: initialWishes.length,
          attending: initialWishes.filter((w) => w.status === "hadir").length,
          totalGuests: initialWishes
            .filter((w) => w.status === "hadir")
            .reduce((sum, w) => sum + (w.guests || 1), 0),
        },
      });
    }

    const wishes: WishItem[] = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status as "hadir" | "tidak_hadir" | "ragu",
      guests: Number(row.guests) || 1,
      message: row.message || "",
      timestamp: row.timestamp || new Date(row.created_at).toLocaleString("id-ID"),
    }));

    return NextResponse.json({
      success: true,
      data: wishes,
      summary: {
        totalResponses: wishes.length,
        attending: wishes.filter((w) => w.status === "hadir").length,
        totalGuests: wishes
          .filter((w) => w.status === "hadir")
          .reduce((sum, w) => sum + (w.guests || 1), 0),
      },
    });
  } catch (err) {
    console.error("GET /api/rsvp unexpected error:", err);
    return NextResponse.json({
      success: true,
      data: initialWishes,
      summary: {
        totalResponses: initialWishes.length,
        attending: initialWishes.filter((w) => w.status === "hadir").length,
        totalGuests: initialWishes
          .filter((w) => w.status === "hadir")
          .reduce((sum, w) => sum + (w.guests || 1), 0),
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, status, guests, message } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Mohon cantumkan nama Anda (minimal 2 karakter)." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const validStatus = ["hadir", "tidak_hadir", "ragu"].includes(status)
      ? status
      : "hadir";
    const guestCount = Math.max(1, Math.min(10, parseInt(guests) || 1));

    const newWish: WishItem = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      status: validStatus as "hadir" | "tidak_hadir" | "ragu",
      guests: guestCount,
      message: (message || "").trim(),
      timestamp: new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    // Insert into Supabase rsvps table
    const { error: insertError } = await supabaseAdmin.from("rsvps").insert([
      {
        id: newWish.id,
        name: newWish.name,
        status: newWish.status,
        guests: newWish.guests,
        message: newWish.message,
        timestamp: newWish.timestamp,
      },
    ]);

    if (insertError) {
      console.error("Supabase RSVP insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan konfirmasi ke basis data." },
        { status: 500 }
      );
    }

    // Sync guest table if name exists
    try {
      await supabaseAdmin
        .from("guests")
        .update({
          rsvp_status: validStatus,
          has_opened: true,
          opened_at: new Date().toISOString(),
        })
        .ilike("name", trimmedName);
    } catch (guestSyncErr) {
      // Non-blocking
    }

    // Retrieve fresh list
    const { data: updatedList } = await supabaseAdmin
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    const allWishes: WishItem[] = (updatedList || []).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status as "hadir" | "tidak_hadir" | "ragu",
      guests: Number(row.guests) || 1,
      message: row.message || "",
      timestamp: row.timestamp,
    }));

    return NextResponse.json({
      success: true,
      message: "Konfirmasi kehadiran dan doa restu berhasil dikirimkan.",
      data: newWish,
      allWishes,
    });
  } catch (error) {
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memproses konfirmasi." },
      { status: 500 }
    );
  }
}
