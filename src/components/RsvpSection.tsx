"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { HeartHandshake, Send, CheckCircle2, Flame, MessageSquare, Sparkles, Heart } from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";

interface RsvpSectionProps {
  initialGuestName?: string;
}

export default function RsvpSection({ initialGuestName = "" }: RsvpSectionProps) {
  const [name, setName] = useState(initialGuestName);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir" | "ragu">("hadir");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [summary, setSummary] = useState({
    totalResponses: initialWishes.length,
    attending: initialWishes.filter((w) => w.status === "hadir").length,
    totalGuests: initialWishes
      .filter((w) => w.status === "hadir")
      .reduce((sum, w) => sum + (w.guests || 1), 0),
  });

  useEffect(() => {
    if (initialGuestName && !name) {
      setName(initialGuestName);
    }
  }, [initialGuestName, name]);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch("/api/rsvp");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setWishes(json.data);
          if (json.summary) {
            setSummary(json.summary);
          }
        }
      } catch (e) {
        const local = localStorage.getItem("guanghang_wishes");
        if (local) {
          try {
            setWishes(JSON.parse(local));
          } catch (err) {
            // ignore
          }
        }
      }
    };

    fetchWishes();

    const hasSubmitted = localStorage.getItem("guanghang_rsvp_submitted");
    if (hasSubmitted) {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Mohon cantumkan nama Anda.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        status,
        guests: parseInt(guests) || 1,
        message: message.trim(),
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#d49b28", "#831f1f", "#fbbf24", "#f4eee4"],
        });

        setSubmitted(true);
        localStorage.setItem("guanghang_rsvp_submitted", "true");

        if (json.allWishes) {
          setWishes(json.allWishes);
          localStorage.setItem("guanghang_wishes", JSON.stringify(json.allWishes));
        } else if (json.data) {
          const updated = [json.data, ...wishes];
          setWishes(updated);
          localStorage.setItem("guanghang_wishes", JSON.stringify(updated));
        }

        setSummary((prev) => ({
          totalResponses: prev.totalResponses + 1,
          attending: status === "hadir" ? prev.attending + 1 : prev.attending,
          totalGuests:
            status === "hadir" ? prev.totalGuests + (parseInt(guests) || 1) : prev.totalGuests,
        }));
      } else {
        setErrorMessage(json.error || "Gagal mengirim konfirmasi. Silakan coba lagi.");
      }
    } catch (err) {
      const fallbackWish: WishItem = {
        id: `local-${Date.now()}`,
        name: name.trim(),
        status,
        guests: parseInt(guests) || 1,
        message: message.trim(),
        timestamp: "Baru saja",
      };
      const updated = [fallbackWish, ...wishes];
      setWishes(updated);
      localStorage.setItem("guanghang_wishes", JSON.stringify(updated));
      localStorage.setItem("guanghang_rsvp_submitted", "true");
      setSubmitted(true);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#d49b28", "#831f1f"],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fothang-red-100/80 border border-fothang-red-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-fothang-red-700" />
            <span>Konfirmasi Kehadiran & Doa Umat</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-fothang-red-950 mb-3">
            RSVP & Untaian Pelita Doa
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Kehadiran serta doa tulus dari Bapak/Ibu/Saudara/i sekalian adalah suluh penerang yang menyempurnakan hari bahagia 20 tahun Kuang Hang.
          </p>
        </div>

        {/* Live Attendance Stats Summary */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-10 text-center">
          <div className="p-4 rounded-3xl bg-white/95 border border-fothang-gold-200/80 shadow-md">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-fothang-red-900">
              {summary.totalResponses}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Tanggapan Masuk</span>
          </div>
          <div className="p-4 rounded-3xl bg-white/95 border border-fothang-gold-200/80 shadow-md">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
              {summary.attending}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Keluarga Hadir</span>
          </div>
          <div className="p-4 rounded-3xl bg-white/95 border border-fothang-gold-200/80 shadow-md">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-fothang-gold-700">
              {summary.totalGuests}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Estimasi Umat</span>
          </div>
        </div>

        {/* RSVP Card Form */}
        <div className="rounded-3xl bg-white border-2 border-fothang-gold-300 shadow-2xl p-6 sm:p-10 mb-16 relative overflow-hidden">
          {/* Top Gold Border Accent */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-fothang-gold-400 via-fothang-red-700 to-fothang-gold-400" />

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Terima Kasih Atas Konfirmasinya!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
                Konfirmasi kehadiran dan doa restu Anda telah tercatat dengan baik serta diteruskan ke panitia. Semoga Tian En Shi De senantiasa melimpahkan berkah kedamaian dan kesehatan bagi keluarga Anda.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-fothang-red-800 hover:text-fothang-red-900 underline underline-offset-4 cursor-pointer"
              >
                Ingin mengubah data atau mengirimkan doa tambahan? Klik di sini
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Input Nama */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Nama Lengkap / Nama Keluarga <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lim TC Felix Salim & Keluarga"
                  className="w-full px-4 py-3.5 rounded-2xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50"
                />
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Konfirmasi Kehadiran <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("hadir")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-fothang-red-900 text-fothang-gold-200 border-fothang-gold-400 shadow-md"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-fothang-gold-300" />
                    <span>Iya, Saya Akan Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("ragu")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "ragu"
                        ? "bg-fothang-gold-600 text-white border-fothang-gold-700 shadow-md"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Masih Belum Pasti</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("tidak_hadir")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "tidak_hadir"
                        ? "bg-stone-700 text-white border-stone-800 shadow-md"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>Maaf, Belum Bisa Hadir</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Hadir */}
              {status !== "tidak_hadir" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Jumlah Orang yang Akan Hadir
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50 cursor-pointer"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5 Orang atau Lebih</option>
                  </select>
                </div>
              )}

              {/* Pesan Doa / Harapan */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Untaian Doa & Harapan untuk Kuang Hang Fo Thang
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat 20 tahun, kenangan indah, atau doa restu terbaik Anda..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-fothang-red-950 via-fothang-red-800 to-fothang-red-950 text-fothang-gold-200 font-semibold text-sm shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Google Sheets & Arsip...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-fothang-gold-300" />
                    <span>Kirim Konfirmasi Kehadiran & Doa Restu</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Wishes Lantern Wall */}
        <div className="rounded-3xl bg-white border-2 border-fothang-gold-200/80 p-6 sm:p-10 shadow-lg">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-fothang-gold-500/10 text-fothang-gold-700 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Lautan Pelita Doa Saudara Se-Dharma ({wishes.length})
                </h3>
                <p className="text-[11px] text-stone-500">
                  Untaian doa restu yang dipersembahkan untuk Kuang Hang Fo Thang
                </p>
              </div>
            </div>
            <span className="text-xs font-chinese text-fothang-gold-700 font-bold hidden sm:inline">
              萬佛燈海 • 同沾法喜
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-fothang-ivory/80 via-white to-fothang-gold-50/40 border border-fothang-gold-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Subtle lantern lamp indicator */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/10 to-transparent pointer-events-none rounded-bl-3xl" />

                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fothang-red-800 to-fothang-red-950 text-fothang-gold-200 font-serif font-bold text-xs flex items-center justify-center shadow-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-stone-400">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.status === "hadir"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.status === "ragu"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {item.status === "hadir"
                      ? `Hadir (${item.guests || 1} orang)`
                      : item.status === "ragu"
                      ? "Masih Ragu"
                      : "Berhalangan"}
                  </span>
                </div>

                {item.message && (
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed pl-11">
                    &ldquo;{item.message}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
