import { NextResponse } from "next/server";
import { initialWishes, WishItem } from "@/data/defaultWishes";

// In-memory cache for serverless lifecycle
let cachedWishes: WishItem[] = [...initialWishes];

export async function GET() {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(webhookUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        cachedWishes = json.data;
      }
    } catch (err) {
      // fallback to cachedWishes on timeout or offline
    }
  }

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

    // Forward to Google Sheets Webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        });
      } catch (sheetError) {
        console.error("Gagal mengirim ke Google Sheets:", sheetError);
      }
    }

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
