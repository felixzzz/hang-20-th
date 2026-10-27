"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  Check,
  Shirt,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  X,
  CreditCard,
  Flame,
  ArrowUp,
  Compass,
  Bookmark,
  Share2,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home3ZenContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  // Countdown state
  const targetDateStr = cms.hero.countdownDate || "2026-11-14T19:00:00+07:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % 1000) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Gallery
  const allGallery: GalleryPhotoItem[] =
    cms.gallery && cms.gallery.length > 0 ? cms.gallery : (galleryItems as GalleryPhotoItem[]);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredGallery =
    galleryFilter === "all" ? allGallery : allGallery.filter((item) => item.category === galleryFilter);

  // Milestones
  const milestones =
    cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const [selectedYear, setSelectedYear] = useState(milestones[0]?.year || "1997");
  const currentMilestone =
    milestones.find((m) => m.year === selectedYear) || milestones[0];

  // RSVP
  const [name, setName] = useState(guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir">("hadir");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [summary, setSummary] = useState({
    totalResponses: initialWishes.length,
    attending: initialWishes.filter((w) => w.status === "hadir").length,
    totalGuests: initialWishes
      .filter((w) => w.status === "hadir")
      .reduce((sum, w) => sum + (w.guests || 1), 0),
  });

  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setWishes(json.data);
          if (json.summary) setSummary(json.summary);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (rawTo && rawTo.trim()) {
      fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, has_opened: true }),
      }).catch(() => {});
    }
  }, [rawTo, guestName]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");
    if (!name.trim()) {
      setRsvpError("Nama wajib dicantumkan / 請填寫姓名");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          status,
          guests: status === "hadir" ? parseInt(guests, 10) || 1 : 0,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (status === "hadir") {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.6 },
            colors: ["#a2362b", "#d6cebf", "#8c7355"],
          });
        }
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirimkan RSVP.");
      }
    } catch {
      setRsvpError("Terjadi kendala jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAddress = () => {
    const addr = cms.event.address || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Jakarta Barat";
    navigator.clipboard.writeText(addr);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const copyBank = () => {
    if (cms.donation.accountNumber) {
      navigator.clipboard.writeText(cms.donation.accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const address = cms.event.address || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(address)}`;

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#24211e] font-sans selection:bg-[#dcd4c5] selection:text-[#a2362b] pb-24">
      
      {/* 21st.dev Running Verse Marquee */}
      <div className="bg-[#24211e] text-[#f4f1ea] py-1.5 border-b border-stone-400/40">
        <Marquee repeat={5} pauseOnHover className="[--duration:32s] text-xs font-mono tracking-widest py-0">
          <span className="flex items-center gap-4 mx-4">
            <span className="font-bold text-amber-300">廣航佛堂 • 20TH ANNIVERSARY</span>
            <span>+</span>
            <span>12.11.2006 — 14.11.2026</span>
            <span>+</span>
            <span>TIAN EN SHI DE (天恩師德)</span>
            <span>+</span>
            <span>PALMERAH UTARA III NO. 186A</span>
            <span>+</span>
            <span>19:00 WIB</span>
          </span>
        </Marquee>
      </div>

      {/* Hairline Architectural Header */}
      <header className="border-b border-stone-300/80 bg-[#f4f1ea]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#a2362b]" />
            <div className="flex items-baseline gap-2">
              <span className="font-chinese font-bold text-base text-stone-900">廣航佛堂</span>
              <span className="text-xs font-mono tracking-widest uppercase text-stone-500 hidden sm:inline">
                ZEN ARCHITECTURAL BENTO • 2006 — 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-stone-600 hidden md:inline">
              14 NOV 2026 • 19:00 WIB
            </span>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#eae4d7] rounded-lg p-0.5 border border-stone-300 text-xs font-mono">
              {(["all", "id", "zh"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setLang(m)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    lang === m ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ============================================================== */}
        {/* BENTO HERO SECTION: Modular Architectural Grid                  */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Card A: Main Monograph & Guest Welcome (8 Columns) */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-stone-300/80 p-6 sm:p-10 flex flex-col justify-between shadow-xs relative">
            {/* Corner Crosshairs */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-300 select-none">+</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-300 select-none">+</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-300 select-none">+</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-300 select-none">+</div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#a2362b] font-semibold">
                  SURAT RESMI UNDANGAN • 官方敬邀
                </span>
                <span className="text-[11px] font-chinese text-stone-500">
                  天恩師德
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight mb-2">
                {cms.hero.mainTitleId}
              </h1>
              <h2 className="text-lg sm:text-xl font-chinese text-stone-600 mb-6">
                {cms.hero.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
              </h2>

              {/* Guest Dedication Box */}
              <div className="bg-[#f9f7f2] rounded-xl border border-stone-200 p-4 mb-6">
                <div className="text-[10px] font-mono uppercase text-stone-500 mb-1">
                  Yth. Tamu Undangan / 恭請 貴賓尊鑒
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-[#a2362b]">
                  {guestName}
                </div>
                <p className="text-xs text-stone-600 font-sans mt-2 leading-relaxed">
                  Merupakan kehormatan bagi wadah Kuang Hang Fo Thang untuk menyambut kehadiran Anda dalam malam syukur bersama.
                </p>
              </div>

              <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed italic border-l-2 border-[#a2362b] pl-3 py-1">
                &ldquo;{cms.hero.quoteId}&rdquo;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-500">
              <span>{cms.hero.cityId}</span>
              <span>12 Nov 2006 — 14 Nov 2026</span>
            </div>
          </div>

          {/* Card B: Live Precision Countdown Matrix (4 Columns) with NumberTicker */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-stone-300/80 p-6 flex flex-col justify-between shadow-xs relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#a2362b]" />
                  CHRONO DIAL
                </span>
                <span className="text-[10px] font-chinese text-stone-400">倒計時</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Hari / DAYS", val: timeLeft.days },
                  { label: "Jam / HOURS", val: timeLeft.hours },
                  { label: "Menit / MINUTES", val: timeLeft.minutes },
                  { label: "Detik / SECONDS", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f9f7f2] border border-stone-200"
                  >
                    <span className="text-xs font-mono text-stone-600">{item.label}</span>
                    <span className="text-2xl font-bold font-mono text-stone-900">
                      <NumberTicker value={item.val} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 text-center">
              <a
                href="#rsvp"
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Konfirmasi Kehadiran (RSVP)
              </a>
            </div>
          </div>

          {/* Card C: Time & Calendar Bento Card (4 Columns) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-stone-300/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#a2362b] uppercase mb-2">
                <Calendar className="w-4 h-4" />
                <span>WAKTU & AGENDA</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
                {cms.event.dateTextId}
              </h3>
              <p className="text-xs font-chinese text-stone-500 mb-3">
                {cms.event.dateTextZh}
              </p>
              <div className="text-xs text-stone-700 space-y-1 font-sans">
                <div><strong>Mulai:</strong> {cms.event.timeTextId}</div>
                <div className="text-stone-500 text-[11px]">{cms.event.timeNotesId}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-800 hover:text-[#a2362b] font-semibold"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#a2362b]" />
                Simpan di Google Calendar
              </a>
            </div>
          </div>

          {/* Card D: Venue & Dress Code Bento Card (4 Columns) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-stone-300/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#a2362b] uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>LOKASI & PROTOKOL</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">
                {cms.event.venueNameId}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                {cms.event.address}
              </p>
              <div className="p-2.5 rounded-lg bg-[#f9f7f2] border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
                <Shirt className="w-4 h-4 text-[#a2362b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{cms.event.dresscodeId}</span>
                  <span className="text-[11px] text-stone-500">{cms.event.dresscodeNotesId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={copyAddress}
                className="text-xs font-mono text-stone-700 hover:text-stone-950 font-semibold"
              >
                {copiedAddr ? "✓ Alamat Tersalin" : "Salin Alamat"}
              </button>
              <a
                href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#a2362b] font-semibold inline-flex items-center gap-1"
              >
                Buka Peta <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card E: Sacred Exhortation Bento Card (4 Columns) */}
          <div className="md:col-span-4 bg-[#ede7dc] rounded-2xl border border-stone-300/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#a2362b] font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  SABDA KESUCIAN
                </span>
                <span className="text-[10px] font-chinese text-stone-600">
                  茂田師兄聖訓
                </span>
              </div>
              <blockquote className="text-xs sm:text-sm font-serif text-stone-900 leading-relaxed italic my-2">
                &ldquo;{cms.wisdom.quoteId}&rdquo;
              </blockquote>
              {showZh && (
                <p className="font-chinese text-xs text-stone-700 mt-2">
                  {cms.wisdom.quoteZh}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-300/60 text-[11px] font-sans text-stone-600">
              {cms.wisdom.closingId}
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* BENTO SECTION 2: 20-Year Retrospective Time Ladder              */}
        {/* ============================================================== */}
        <section className="bg-white rounded-2xl border border-stone-300/80 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#a2362b] block">
                NAPAK TILAS 20 TAHUN GEDUNG
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                歲月印記 • 薪火相傳
              </h2>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              {milestones.map((m) => (
                <button
                  key={m.year + m.title}
                  onClick={() => setSelectedYear(m.year)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedYear === m.year
                      ? "bg-stone-900 text-white font-bold"
                      : "bg-[#f5f2eb] text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </div>

          {currentMilestone && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#f5f2eb] border border-stone-300 text-xs font-mono text-stone-700">
                  {currentMilestone.location || "Palmerah, Jakarta"}
                </div>
                <h3 className="text-2xl font-bold font-serif text-stone-900">
                  {currentMilestone.title}
                </h3>
                <h4 className="font-chinese text-sm text-[#a2362b]">
                  {currentMilestone.chineseTitle}
                </h4>
                <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed">
                  {showId && currentMilestone.description}
                  {showId && showZh && " "}
                  {showZh && (
                    <span className="font-chinese block text-stone-500 mt-2">
                      {currentMilestone.chineseDescription}
                    </span>
                  )}
                </p>
                <div className="p-3 rounded-lg bg-[#f9f7f2] border-l-2 border-[#a2362b] text-xs font-sans text-stone-800 italic">
                  &ldquo;{currentMilestone.highlight}&rdquo;
                </div>
              </div>

              <div className="md:col-span-5">
                {currentMilestone.image ? (
                  <div className="relative w-full h-60 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                    <Image
                      src={currentMilestone.image}
                      alt={currentMilestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-60 rounded-xl bg-stone-100 flex items-center justify-center text-xs font-mono text-stone-400">
                    Dokumentasi Arsip
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* BENTO SECTION 3: Minimalist RSVP & Prayer Wall                 */}
        {/* ============================================================== */}
        <section id="rsvp" className="bg-white rounded-2xl border border-stone-300/80 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a2362b] block mb-1">
                REGISTRASI DIGITAL & DOA
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-2">
                Buku Tamu & Untaian Doa
              </h2>
              <p className="text-xs text-stone-600 mb-6 font-sans">
                Mohon konfirmasi kesediaan hadir Anda untuk membantu kelancaran persiapan konsumsi & tata letak meja.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#f5f2eb] text-center border border-stone-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1">Konfirmasi Tercatat</h4>
                  <p className="text-xs text-stone-600 mb-3">Terima kasih atas partisipasi tulus Anda.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-[#a2362b] underline"
                  >
                    Kirim Form Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs font-sans">
                  {rsvpError && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700">
                      {rsvpError}
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nama Lengkap / 姓名 <span className="text-[#a2362b]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Lim TC / Bpk. David & Kel."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#fbfaf8] text-stone-900 focus:border-stone-900 outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Status Kehadiran / 出席狀況 <span className="text-[#a2362b]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus("hadir")}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          status === "hadir"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-[#fbfaf8] text-stone-600 border-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        Pasti Hadir (準時出席)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus("tidak_hadir")}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          status === "tidak_hadir"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-[#fbfaf8] text-stone-600 border-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        Berhalangan (祝福志慶)
                      </button>
                    </div>
                  </div>

                  {status === "hadir" && (
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Jumlah Tamu / 出席人數
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#fbfaf8] text-stone-900 outline-hidden font-mono"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} Orang ({n} 位)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Doa & Pesan / 祝福祈願
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan bait doa dan kenangan Anda..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#fbfaf8] text-stone-900 focus:border-stone-900 outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-[#a2362b] hover:bg-[#8b2d24] text-white font-mono uppercase tracking-wider text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi & Doa"}
                  </button>
                </form>
              )}
            </div>

            {/* Live Feed */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 text-xs font-mono text-stone-600">
                  <span>REKAPITULASI LIVE</span>
                  <div className="flex items-center gap-3">
                    <span>Hadir: <strong>{summary.attending}</strong></span>
                    <span>Jiwa: <strong>{summary.totalGuests}</strong></span>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {wishes.slice(0, 8).map((w, idx) => (
                    <div
                      key={w.id || idx}
                      className="p-3 rounded-xl bg-[#f9f7f2] border border-stone-200 text-xs font-sans"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-900">{w.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            w.status === "hadir"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {w.status === "hadir" ? "Hadir" : "Doa"}
                        </span>
                      </div>
                      {w.message && (
                        <p className="text-stone-700 italic mt-1 font-serif">
                          &ldquo;{w.message}&rdquo;
                        </p>
                      )}
                      <span className="text-[10px] font-mono text-stone-400 mt-1 block">
                        {w.timestamp || "Doa Umat"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tali Kasih Mini Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#f5f2eb] border border-stone-300 text-xs font-sans">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5 font-mono uppercase text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-[#a2362b]" />
                    {cms.donation.bankName}
                  </span>
                  <span className="text-stone-500 text-[11px] font-chinese">隨喜功德</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {cms.donation.accountNumber}
                    </span>
                    <span className="text-stone-500 text-[10px] block">
                      a.n. {cms.donation.accountHolder}
                    </span>
                  </div>
                  <button
                    onClick={copyBank}
                    className="px-2.5 py-1 rounded bg-white border border-stone-300 text-[11px] font-mono hover:bg-stone-100"
                  >
                    {copiedBank ? "✓ Tersalin" : "Salin No. Rek"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-stone-300 text-xs font-mono text-stone-500">
          <div className="flex items-center justify-center gap-2 text-stone-800 font-bold mb-1">
            <span className="font-chinese">廣航佛堂</span>
            <span>•</span>
            <span>2006 — 2026</span>
          </div>
          <p className="text-[11px] text-stone-400 mb-3">
            Jl. Palmerah Utara III No. 186A, Jakarta Barat
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-[11px]"
          >
            <ArrowUp className="w-3 h-3" /> Kembali ke Atas
          </button>
        </footer>

      </main>
    </div>
  );
}

export default function Home3Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4f1ea] text-stone-900 font-mono">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
            <span className="text-xs">LOADING ZEN SANCTUARY...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home3ZenContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
