"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { HeartHandshake, Send, CheckCircle2, Users, MessageSquare, Sparkles, Heart } from "lucide-react";
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

  // Sync initial name when prop changes
  useEffect(() => {
    if (initialGuestName && !name) {
      setName(initialGuestName);
    }
  }, [initialGuestName, name]);

  // Load latest wishes on mount from API or localStorage
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
        // Fallback to localStorage if offline
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

    // Check if current user already submitted previously
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
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d49b28", "#831f1f", "#fbbf24", "#f4eee4"],
        });

        // Update state
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

        // Recalculate summary
        setSummary((prev) => ({
          totalResponses: prev.totalResponses + 1,
          attending: status === "hadir" ? prev.attending + 1 : prev.attending,
          totalGuests: status === "hadir" ? prev.totalGuests + (parseInt(guests) || 1) : prev.totalGuests,
        }));
      } else {
        setErrorMessage(json.error || "Gagal mengirim konfirmasi. Silakan coba lagi.");
      }
    } catch (err) {
      // Local fallback in case network issues occur
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
    <section id="rsvp" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-red-50 border border-fothang-red-200 text-fothang-red-800 text-xs font-semibold tracking-wider uppercase mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-fothang-red-700" />
            <span>Konfirmasi Kehadiran & Doa Umat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-2">
            RSVP & Ungkapan Doa
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Merupakan suatu kebahagiaan bagi kami dapat menerima konfirmasi kehadiran serta doa restu dari Bapak/Ibu/Saudara/i sekalian.
          </p>
        </div>

        {/* Live Attendance Stats Summary */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-10 text-center">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif font-bold text-fothang-red-900">
              {summary.totalResponses}
            </span>
            <span className="text-[11px] text-stone-500">Tanggapan Masuk</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif font-bold text-emerald-700">
              {summary.attending}
            </span>
            <span className="text-[11px] text-stone-500">Keluarga Hadir</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif font-bold text-fothang-gold-700">
              {summary.totalGuests}
            </span>
            <span className="text-[11px] text-stone-500">Estimasi Umat</span>
          </div>
        </div>

        {/* RSVP Card Form */}
        <div className="rounded-3xl bg-white border-2 border-fothang-gold-300 shadow-2xl p-6 sm:p-10 mb-16 relative overflow-hidden">
          {/* Subtle gold ribbon top */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-fothang-gold-400 via-fothang-red-700 to-fothang-gold-400" />

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Terima Kasih Atas Konfirmasinya!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                Konfirmasi kehadiran dan doa restu Anda telah tercatat dengan baik. Semoga Tian En Shi De senantiasa melimpahkan berkah kedamaian dan kesehatan bagi keluarga.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-fothang-red-800 hover:text-fothang-red-900 underline underline-offset-4 cursor-pointer"
              >
                Ingin mengubah data atau mengirim doa tambahan? Klik di sini
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
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50"
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
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-fothang-red-800 text-fothang-gold-200 border-fothang-red-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-fothang-gold-300" />
                    <span>Iya, Saya Akan Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("ragu")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "ragu"
                        ? "bg-fothang-gold-600 text-white border-fothang-gold-700 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Masih Belum Pasti</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("tidak_hadir")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === "tidak_hadir"
                        ? "bg-stone-700 text-white border-stone-800 shadow-sm"
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
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50 cursor-pointer"
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
                  placeholder="Tuliskan ucapan selamat 20 tahun, kesan, atau doa restu terbaik Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-fothang-gold-500 focus:ring-2 focus:ring-fothang-gold-200 outline-none transition text-sm text-stone-800 bg-stone-50/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-fothang-red-900 via-fothang-red-800 to-fothang-red-900 text-fothang-gold-200 font-semibold text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirimkan Konfirmasi...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-fothang-gold-300" />
                    <span>Kirim Konfirmasi Kehadiran & Doa</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Wishes Wall (Buku Tamu Doa Restu) */}
        <div className="rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-fothang-red-800" />
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Untaian Doa Saudara Se-Dharma ({wishes.length})
              </h3>
            </div>
            <span className="text-xs font-chinese text-fothang-gold-700 font-semibold">
              同沾法喜
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-fothang-ivory/60 border border-stone-200/60 hover:border-fothang-gold-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-fothang-red-100 text-fothang-red-900 font-serif font-bold text-xs flex items-center justify-center">
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
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.status === "hadir"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "ragu"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-200 text-stone-700"
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
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed pl-10">
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
