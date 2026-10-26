"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, Flame, Users, HeartHandshake } from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { useLanguage } from "@/context/LanguageContext";

interface RsvpSectionProps {
  initialGuestName?: string;
}

export default function RsvpSection({ initialGuestName = "" }: RsvpSectionProps) {
  const { showId, showZh } = useLanguage();
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#b38638", "#7c1818", "#dfba6d"],
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
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#b38638", "#7c1818"],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            Konfirmasi Kehadiran & Doa Restu
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            功德名冊 • 祈願雅集
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-lg">
            {showId && (
              <p>
                Kehadiran serta doa tulus dari Bapak/Ibu/Saudara/i sekalian adalah suluh penerang yang menyempurnakan peringatan 20 tahun Kuang Hang.
              </p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 mt-1">
                各位前賢道親之蒞臨與至誠祈願，乃成就廣航廿週年堂慶之無上殊勝善緣。
              </p>
            )}
          </div>
        </div>

        {/* Live Attendance Ledger Tally */}
        <div className="max-w-xl mx-auto mb-10 rounded-xl bg-white border border-[#dfba6d]/30 shadow-xs p-4 grid grid-cols-3 divide-x divide-stone-100 text-center">
          <div className="px-2">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#7c1818]">
              {summary.totalResponses}
            </span>
            {showId && <span className="text-xs text-stone-500 font-serif block">Konfirmasi Masuk</span>}
            {showZh && <span className="text-[11px] text-stone-400 font-chinese font-medium">回函賜帖</span>}
          </div>
          <div className="px-2">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
              {summary.attending}
            </span>
            {showId && <span className="text-xs text-stone-500 font-serif block">Keluarga Hadir</span>}
            {showZh && <span className="text-[11px] text-stone-400 font-chinese font-medium">出席道親</span>}
          </div>
          <div className="px-2">
            <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#9e7631]">
              {summary.totalGuests}
            </span>
            {showId && <span className="text-xs text-stone-500 font-serif block">Estimasi Umat</span>}
            {showZh && <span className="text-[11px] text-stone-400 font-chinese font-medium">總人數</span>}
          </div>
        </div>

        {/* Ceremonial Form Card */}
        <div className="bg-white rounded-2xl border border-[#dfba6d]/35 shadow-sm p-6 sm:p-10 mb-14 relative">
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-4 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#211c19] mb-1">
                Terima Kasih Atas Konfirmasi Anda!
              </h3>
              <p className="text-base font-chinese font-bold text-emerald-800 mb-2">
                感謝您的殊勝賜復！
              </p>
              {showId && (
                <p className="text-xs sm:text-sm font-serif text-stone-600 max-w-md mx-auto mb-2 leading-relaxed">
                  Konfirmasi kehadiran dan doa restu Anda telah tercatat dalam buku tamu resmi panitia 20 Tahun Kuang Hang Fo Thang.
                </p>
              )}
              {showZh && (
                <p className="text-xs font-chinese text-stone-500 max-w-md mx-auto mb-4">
                  您的出席確認與祝願已妥善登記於籌備處功德名冊中，感恩天恩師德。
                </p>
              )}
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-serif font-semibold text-[#7c1818] hover:underline underline-offset-4 cursor-pointer mt-2"
              >
                Ingin mengubah data atau mengirimkan doa tambahan? • 欲修改或增添祝福請點擊
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
                <div>
                  <span className="text-xs font-serif font-bold text-[#7c1818] uppercase tracking-wider block">
                    {showId && "Formulir Konfirmasi Kehadiran"}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese font-normal">貴賓回函登記表</span>}
                  </span>
                </div>
                <span className="chinese-seal-red text-[11px] px-2 py-0.5">
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
                <label className="block text-xs font-serif font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {showId && "Nama Lengkap / Nama Keluarga"}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese font-normal">姓名 / 闔府名闈</span>} <span className="text-[#7c1818]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lim TC Felix Salim & Keluarga (林道親闔府)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7c1818] focus:ring-1 focus:ring-[#7c1818] outline-none transition text-sm text-stone-900 bg-white font-serif"
                />
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="block text-xs font-serif font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {showId && "Konfirmasi Kehadiran"}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese font-normal">出席意願</span>} <span className="text-[#7c1818]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("hadir")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-serif font-medium transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-[#7c1818] text-[#fbf5e8] border-[#7c1818] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#dfba6d]" />
                      <span className="font-semibold">{showId ? "Iya, Saya Akan Hadir" : "準時出席"}</span>
                    </div>
                    {showZh && showId && (
                      <span className="font-chinese text-xs opacity-80 mt-0.5">準時出席 • 共襄盛舉</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("tidak_hadir")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-serif font-medium transition-all cursor-pointer ${
                      status === "tidak_hadir"
                        ? "bg-stone-800 text-stone-100 border-stone-800 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span className="font-semibold">{showId ? "Maaf, Belum Dapat Hadir" : "不克出席"}</span>
                    {showZh && showId && (
                      <span className="font-chinese text-xs opacity-80 mt-0.5">不克出席 • 祈願祝福</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Jumlah Hadir */}
              {status !== "tidak_hadir" && (
                <div>
                  <label className="block text-xs font-serif font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {showId && "Jumlah Orang yang Hadir"}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese font-normal">隨行人數</span>}
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
                        className={`py-2 rounded-lg border text-xs font-serif font-medium transition-all cursor-pointer flex flex-col items-center ${
                          guests === item.num
                            ? "bg-[#9e7631] text-white border-[#9e7631]"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <span className="font-bold">{item.num === "5" ? "5+ Org" : `${item.num} Org`}</span>
                        {showZh && (
                          <span className="font-chinese text-[11px] opacity-80">
                            {item.zh}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pesan Doa / Harapan */}
              <div>
                <label className="block text-xs font-serif font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {showId && "Untaian Doa & Ucapan Syukur"}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese font-normal">祝願與感言</span>}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat 20 tahun atau doa tulus bagi Kuang Hang Fo Thang..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7c1818] focus:ring-1 focus:ring-[#7c1818] outline-none transition text-sm text-stone-900 placeholder:text-stone-400 bg-white font-serif leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50 border border-[#dfba6d]/40"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Daftar Hadir...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#dfba6d]" />
                    <span>
                      {showId && "Kirim Konfirmasi & Doa Restu"}
                      {showId && showZh && " • "}
                      {showZh && <span className="font-chinese font-normal">呈送回函與祝願</span>}
                    </span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Wishes Corridor */}
        <div className="mt-14 pt-8 border-t border-stone-200">
          
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fbf5e8] text-[#7c1818] flex items-center justify-center border border-[#dfba6d]/40">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#211c19]">
                  Lautan Doa & Restu Saudara Se-Dharma ({wishes.length})
                </h3>
                <p className="text-xs text-stone-500 font-serif">
                  Doa tulus yang menyertai langkah 20 tahun Kuang Hang • 萬家同心祈願海
                </p>
              </div>
            </div>
            <span className="chinese-seal-red text-[11px] px-2 py-0.5 hidden sm:inline">
              萬家同福
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="prayer-slip-card p-4 rounded-xl border border-stone-200 bg-white"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#7c1818] text-[#fbf5e8] font-chinese font-bold text-xs flex items-center justify-center shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-serif font-semibold text-stone-900">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-stone-400 font-serif block">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-serif font-medium border ${
                      item.status === "hadir"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                  >
                    {item.status === "hadir"
                      ? `Hadir (${item.guests || 1} org)`
                      : "Mendoakan"}
                  </span>
                </div>

                {item.message && (
                  <p className="text-xs text-stone-700 font-serif italic leading-relaxed pl-9">
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
