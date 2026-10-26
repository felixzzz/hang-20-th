"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, Flame, Sparkles } from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";

interface RsvpSectionProps {
  initialGuestName?: string;
}

export default function RsvpSection({ initialGuestName = "" }: RsvpSectionProps) {
  const [name, setName] = useState(initialGuestName);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir">("hadir");
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
      setErrorMessage("Mohon cantumkan nama Anda. • 請填寫您的姓名。");
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
        
        {/* Section Header - Bilingual */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Konfirmasi Kehadiran & Doa Umat • 出席確認與祈福賜帖
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            功德名冊 • 祈願雅集
          </h2>
          <p className="text-sm font-serif text-stone-700 max-w-lg">
            Kehadiran serta doa tulus dari Bapak/Ibu/Saudara/i sekalian adalah suluh penerang yang menyempurnakan peringatan 20 tahun Kuang Hang.
          </p>
          <p className="text-xs font-chinese text-stone-500 max-w-lg mt-0.5">
            各位前賢道親之蒞臨與至誠祈願，乃成就廣航廿週年堂慶之無上殊勝善緣。
          </p>
        </div>

        {/* Live Attendance Ledger Tally - Bilingual */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto mb-10 text-center">
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-red-950">
              {summary.totalResponses}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif block">Konfirmasi Masuk</span>
            <span className="text-[10px] text-amber-800 font-chinese font-medium">回函賜帖</span>
          </div>
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
              {summary.attending}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif block">Keluarga Hadir</span>
            <span className="text-[10px] text-emerald-700 font-chinese font-medium">出席道親</span>
          </div>
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-800/15 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-800">
              {summary.totalGuests}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-serif block">Estimasi Jiwa Umat</span>
            <span className="text-[10px] text-amber-900 font-chinese font-medium">總人數</span>
          </div>
        </div>

        {/* Ceremonial Inscription Form (簽到名冊) - Bilingual */}
        <div className="xuan-paper-card rounded-2xl border border-amber-600/30 shadow-xl p-6 sm:p-10 mb-14 relative overflow-hidden">
          
          {/* Top Gold Inscription Hairline */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1">
                Terima Kasih Atas Konfirmasi Anda!
              </h3>
              <p className="text-base font-chinese font-bold text-emerald-800 mb-3">
                感謝您的殊勝賜復！
              </p>
              <p className="text-xs sm:text-sm font-serif text-stone-600 max-w-md mx-auto mb-2 leading-relaxed">
                Konfirmasi kehadiran dan doa restu Anda telah tercatat dalam buku tamu resmi panitia 20 Tahun Kuang Hang Fo Thang.
              </p>
              <p className="text-xs font-chinese text-stone-500 max-w-md mx-auto mb-6">
                您的出席確認與祝願已妥善登記於籌備處功德名冊中，感恩天恩師德。
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-serif font-semibold text-red-900 hover:text-red-950 underline underline-offset-4 cursor-pointer"
              >
                Ingin mengubah data atau mengirimkan doa tambahan? • 欲修改或增添祝福請點擊
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 mb-2">
                <div>
                  <span className="text-xs font-serif font-bold text-red-950 uppercase tracking-widest block">
                    Formulir Konfirmasi Kehadiran
                  </span>
                  <span className="text-[11px] font-chinese text-stone-500">
                    貴賓回函登記表
                  </span>
                </div>
                <span className="chinese-seal-red text-xs px-2 py-0.5">
                  敬請賜復
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-serif">
                  {errorMessage}
                </div>
              )}

              {/* Input Nama - Bilingual */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Nama Lengkap / Nama Keluarga • 姓名 / 闔府名闈 <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lim TC Felix Salim & Keluarga (林道親闔府)"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 outline-none transition text-sm text-stone-900 bg-white font-serif"
                />
              </div>

              {/* Status Kehadiran - Traditional Choice Tiles (Bilingual) */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Konfirmasi Kehadiran • 出席意願 <span className="text-red-700">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("hadir")}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-[#831f1f] text-amber-200 border-amber-500 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Iya, Saya Akan Hadir</span>
                    </div>
                    <span className="font-chinese text-[11px] opacity-90 mt-0.5">準時出席 • 共襄盛舉</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("tidak_hadir")}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      status === "tidak_hadir"
                        ? "bg-stone-800 text-stone-200 border-stone-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>Maaf, Belum Dapat Hadir</span>
                    <span className="font-chinese text-[11px] opacity-90 mt-0.5">不克出席 • 祈願祝福</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Hadir - Bilingual */}
              {status !== "tidak_hadir" && (
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Jumlah Orang yang Akan Hadir • 隨行人數
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { num: "1", zh: "1位" },
                      { num: "2", zh: "2位" },
                      { num: "3", zh: "3位" },
                      { num: "4", zh: "4位" },
                      { num: "5", zh: "5位以上" },
                    ].map((item) => (
                      <button
                        key={item.num}
                        type="button"
                        onClick={() => setGuests(item.num)}
                        className={`py-2 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center ${
                          guests === item.num
                            ? "bg-amber-700 text-white border-amber-800 shadow-inner"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <span>{item.num === "5" ? "5+ Org" : `${item.num} Org`}</span>
                        <span className="font-chinese text-[10px] font-normal opacity-90">{item.zh}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pesan Doa / Harapan - Bilingual */}
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Untaian Doa & Ucapan Syukur • 祝願與感言
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat 20 tahun, kenangan masa lampau, atau doa tulus bagi Kuang Hang Fo Thang... / 請留下對廣航佛堂廿週年之祝福與感言..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 outline-none transition text-sm text-stone-900 bg-white font-serif leading-relaxed"
                />
              </div>

              {/* Submit Button - Bilingual */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#831f1f] via-[#751919] to-[#831f1f] text-amber-200 font-serif font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 border border-amber-500/40"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Daftar Hadir • 正在呈送回函...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Bubuhkan Tanda Kehadiran & Doa Restu • 呈送回函與祝願</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Wishes Corridor of Blessing Slips (祈願長廊) - Bilingual */}
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
                  Doa tulus yang terpahat abadi menyertai langkah 20 tahun Kuang Hang • 萬家同心祈願海
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
                    className={`px-2.5 py-0.5 rounded text-[10px] font-serif font-medium border flex items-center gap-1 ${
                      item.status === "hadir"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.status === "ragu"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    <span>
                      {item.status === "hadir"
                        ? `Hadir (${item.guests || 1} orang)`
                        : item.status === "ragu"
                        ? "Masih Menyesuaikan"
                        : "Mendoakan"}
                    </span>
                    <span className="font-chinese text-[10px] opacity-80">
                      • {item.status === "hadir" ? "出席" : item.status === "ragu" ? "待定" : "祈願"}
                    </span>
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
