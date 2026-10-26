import { NextResponse } from "next/server";
import { initialWishes, WishItem } from "@/data/defaultWishes";

// In-memory cache for serverless lifecycle
let cachedWishes: WishItem[] = [...initialWishes];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: cachedWishes,
    summary: {
      totalResponses: cachedWishes.length,
      attending: cachedWishes.filter((w) => w.status === "hadir").length,
      totalGuests: cachedWishes
        .filter((w) => w.status === "hadir")
        .reduce((sum, w) => sum + (w.guests || 1), 0),
    },
  });
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

    const validStatus = ["hadir", "tidak_hadir", "ragu"].includes(status)
      ? status
      : "hadir";
    const guestCount = Math.max(1, Math.min(10, parseInt(guests) || 1));

    const newWish: WishItem = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      status: validStatus as "hadir" | "tidak_hadir" | "ragu",
      guests: guestCount,
      message: (message || "").trim(),
      timestamp: new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    // Prepend to top of list
    cachedWishes = [newWish, ...cachedWishes];

    return NextResponse.json({
      success: true,
      message: "Konfirmasi kehadiran dan doa restu berhasil dikirimkan.",
      data: newWish,
      allWishes: cachedWishes,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat menyimpan konfirmasi." },
      { status: 500 }
    );
  }
}
