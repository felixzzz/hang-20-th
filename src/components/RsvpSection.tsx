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
    <section id="rsvp" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Konfirmasi Kehadiran & Doa Umat
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            功德名冊 • 祈願雅集
          </h2>
          <p className="text-sm font-serif text-stone-600 max-w-lg">
            Kehadiran serta doa tulus dari Bapak/Ibu/Saudara/i sekalian adalah suluh penerang yang menyempurnakan peringatan 20 tahun Kuang Hang.
          </p>
        </div>

        {/* Live Attendance Ledger Tally */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto mb-10 text-center">
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-red-950">
              {summary.totalResponses}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif">Konfirmasi Masuk</span>
          </div>
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
              {summary.attending}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif">Keluarga Hadir</span>
          </div>
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-800">
              {summary.totalGuests}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif">Estimasi Jiwa Umat</span>
          </div>
        </div>

        {/* Ceremonial Inscription Form (簽到名冊) */}
        <div className="xuan-paper-card rounded-2xl border border-amber-600/30 shadow-xl p-6 sm:p-10 mb-14 relative overflow-hidden">
          
          {/* Top Gold Inscription Hairline */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Terima Kasih Atas Konfirmasi Anda!
              </h3>
              <p className="text-xs sm:text-sm font-serif text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
                Konfirmasi kehadiran dan doa restu Anda telah tercatat dalam buku tamu resmi panitia 20 Tahun Kuang Hang Fo Thang.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-serif font-semibold text-red-900 hover:text-red-950 underline underline-offset-4 cursor-pointer"
              >
                Ingin mengubah data atau mengirimkan doa tambahan? Klik di sini
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 mb-2">
                <span className="text-xs font-serif font-bold text-red-950 uppercase tracking-widest">
                  Formulir Konfirmasi Kehadiran
                </span>
                <span className="chinese-seal-red text-xs px-2 py-0.5">
                  敬請賜復
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-serif">
                  {errorMessage}
                </div>
              )}

              {/* Input Nama */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Nama Lengkap / Nama Keluarga <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lim TC Felix Salim & Keluarga"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 outline-none transition text-sm text-stone-900 bg-white font-serif"
                />
              </div>

              {/* Status Kehadiran - Traditional Choice Tiles */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Konfirmasi Kehadiran <span className="text-red-700">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("hadir")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-[#831f1f] text-amber-200 border-amber-500 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Hadir Bersyukur (出席)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("ragu")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      status === "ragu"
                        ? "bg-amber-700 text-white border-amber-800 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Masih Menyesuaikan (待定)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("tidak_hadir")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      status === "tidak_hadir"
                        ? "bg-stone-800 text-stone-200 border-stone-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>Belum Dapat Hadir (祝福)</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Hadir */}
              {status !== "tidak_hadir" && (
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Jumlah Orang yang Akan Hadir
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {["1", "2", "3", "4", "5"].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`py-2 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer ${
                          guests === num
                            ? "bg-amber-700 text-white border-amber-800 shadow-inner"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        {num === "5" ? "5+ Orang" : `${num} Orang`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pesan Doa / Harapan */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Untaian Doa & Ucapan Syukur
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat 20 tahun, kenangan masa lampau, atau doa tulus bagi Kuang Hang Fo Thang..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 outline-none transition text-sm text-stone-900 bg-white font-serif leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#831f1f] via-[#751919] to-[#831f1f] text-amber-200 font-serif font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 border border-amber-500/40"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Daftar Hadir...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Bubuhkan Tanda Kehadiran & Doa Restu</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Wishes Corridor of Blessing Slips (祈願長廊) */}
        <div className="bg-[#faf7f2] rounded-2xl border border-amber-700/20 p-6 sm:p-9 shadow-lg">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-600/15 text-amber-800 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                  Lautan Doa & Restu Saudara Se-Dharma ({wishes.length})
                </h3>
                <p className="text-[11px] text-stone-500 font-serif">
                  Doa tulus yang terpahat abadi menyertai langkah 20 tahun Kuang Hang
                </p>
              </div>
            </div>
            <span className="chinese-seal-red text-xs px-2 py-0.5 hidden sm:inline">
              萬家同福
            </span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="prayer-slip-card p-4 sm:p-5 rounded-xl border border-amber-800/10 transition-all hover:border-amber-600/30"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded bg-[#831f1f] text-amber-200 font-chinese font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-serif">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-serif font-medium border ${
                      item.status === "hadir"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.status === "ragu"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {item.status === "hadir"
                      ? `Hadir (${item.guests || 1} orang)`
                      : item.status === "ragu"
                      ? "Masih Menyesuaikan"
                      : "Mendoakan Dari Jauh"}
                  </span>
                </div>

                {item.message && (
                  <p className="text-xs sm:text-sm font-serif italic text-stone-700 leading-relaxed pl-9">
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
