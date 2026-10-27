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
  ChevronLeft,
  Maximize2,
  X,
  CreditCard,
  Flame,
  ArrowUp,
  Share2,
  Compass,
  Heart,
  Layers,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import VariationSwitcher from "@/components/VariationSwitcher";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home2GalaContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  // Audio trigger
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Gallery state
  const allGallery: GalleryPhotoItem[] =
    cms.gallery && cms.gallery.length > 0 ? cms.gallery : (galleryItems as GalleryPhotoItem[]);
  const [galleryCategory, setGalleryCategory] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredGallery =
    galleryCategory === "all"
      ? allGallery
      : allGallery.filter((item) => item.category === galleryCategory);

  // Milestones Carousel / Horizontal Slider
  const milestones =
    cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);

  const nextMilestone = () => {
    setActiveMilestoneIdx((prev) => (prev + 1) % milestones.length);
  };
  const prevMilestone = () => {
    setActiveMilestoneIdx((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  // RSVP state
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

  // Load RSVP
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

  // Track guest opening
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
      setRsvpError("Mohon isi nama lengkap Anda / 請填寫您的姓名");
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
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ffd700", "#ff6b6b", "#dfba6d", "#ffffff"],
        });
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirim RSVP.");
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

  const currentMilestone = milestones[activeMilestoneIdx] || milestones[0];

  return (
    <div className="min-h-screen bg-[#0d0404] text-[#fbf5e8] font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      
      {/* Ambient Glowing Candlelight Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#7c1818]/30 via-amber-600/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-red-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-600/15 blur-3xl rounded-full" />
      </div>

      {/* Floating Glassmorphic Top Navbar */}
      <nav className="sticky top-4 z-40 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#1a0a0a]/80 backdrop-blur-md border border-amber-500/30 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-amber-400/60 p-0.5 bg-[#2a0e0e] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-chinese font-bold text-amber-300 tracking-wider">
                廣航佛堂 • 廿週年堂慶
              </span>
              <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                Malam Syukur 14 Nov 2026
              </span>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="hidden md:flex items-center gap-4 text-xs font-serif text-stone-300">
            <a href="#agenda" className="hover:text-amber-300 transition-colors">Jadwal</a>
            <a href="#wejangan" className="hover:text-amber-300 transition-colors">Wejangan</a>
            <a href="#sejarah" className="hover:text-amber-300 transition-colors">20 Tahun</a>
            <a href="#galeri" className="hover:text-amber-300 transition-colors">Galeri</a>
            <a href="#rsvp" className="text-amber-300 font-bold hover:underline">Pelita Doa (RSVP)</a>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#250d0d] p-0.5 rounded-full border border-amber-500/30 text-[11px]">
            <button
              onClick={() => setLang("all")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                lang === "all" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:text-white"
              }`}
            >
              Dwi
            </button>
            <button
              onClick={() => setLang("id")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                lang === "id" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:text-white"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                lang === "zh" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:text-white"
              }`}
            >
              中
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20 space-y-20">
        
        {/* ============================================================== */}
        {/* HERO: Grand Ceremonial Temple Medallion & Luminous Atmosphere   */}
        {/* ============================================================== */}
        <section className="text-center pt-8 sm:pt-14 relative">
          
          {/* Sacred Seal Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#351010] border border-amber-500/50 text-amber-300 text-xs font-chinese tracking-widest mb-6 shadow-[0_0_20px_rgba(245,197,99,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>天恩師德 • 落成廿週年堂慶大典</span>
          </div>

          {/* Golden Medallion Crest */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-amber-400/70 p-2 bg-[#200a0a] shadow-[0_0_30px_rgba(217,119,6,0.4)] flex items-center justify-center">
              <Image
                src={cms.cover.logoImage || "/images/logo-guang-ji.png"}
                alt="Logo Guang Ji"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-chinese font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wider mb-3 drop-shadow-md">
            {cms.cover.titleZh || "廣航佛堂"}
          </h1>
          <p className="text-base sm:text-xl font-serif text-amber-200/90 tracking-widest uppercase mb-4">
            {cms.hero.mainTitleId} (2006 — 2026)
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-serif text-stone-300 italic leading-relaxed mb-8">
            &ldquo;{cms.hero.quoteId}&rdquo;
          </p>

          {/* Luminous Guest Honor Card (Imperial Decree Style) */}
          <div className="max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-[#250d0d] to-[#170606] border border-amber-500/50 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-amber-400/80">
              <span className="uppercase tracking-widest">Surat Penghormatan Tamu</span>
              <span className="font-chinese">貴賓席位</span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-serif text-white mb-2 tracking-wide">
              {guestName}
            </div>

            <p className="text-xs sm:text-sm font-sans text-stone-300 leading-relaxed">
              {showId && "Dengan penuh kerendahan hati dan rasa syukur mendalam, kami mengundang kehadiran Anda dalam Malam Puncak Perayaan 20 Tahun Kuang Hang Fo Thang."}
              {showId && showZh && " "}
              {showZh && (
                <span className="font-chinese block text-amber-200/80 mt-1.5 text-xs">
                  誠摯敬邀貴賓撥冗蒞臨，同沐聖恩，共沾法喜。
                </span>
              )}
            </p>

            <div className="mt-5 pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#rsvp"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <Flame className="w-3.5 h-3.5" />
                Nyalakan Pelita Doa (RSVP)
              </a>
              <a
                href="#agenda"
                className="px-4 py-2 rounded-full bg-[#351212] hover:bg-[#451818] border border-amber-500/30 text-amber-200 text-xs font-medium transition-colors"
              >
                Lihat Jadwal & Arah
              </a>
            </div>
          </div>

          {/* Luminous Countdown Dial */}
          <div className="mt-10 max-w-lg mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400/80 mb-3">
              Hitung Mundur Menuju Malam Syukur • 倒計時
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#1d0a0a]/90 border border-amber-500/40 p-3 shadow-inner text-center"
                >
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 block">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-stone-400">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 01: The Golden Decree (Waktu & Tempat)                 */}
        {/* ============================================================== */}
        <section id="agenda" className="rounded-3xl bg-gradient-to-b from-[#1c0808] to-[#120505] border border-amber-500/40 p-6 sm:p-10 shadow-2xl relative">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 block mb-1">
              Petunjuk Waktu & Protokol
            </span>
            <h2 className="text-2xl sm:text-4xl font-chinese font-bold text-amber-200">
              {cms.event.headingZh || "慶典日程 • 會場導引"}
            </h2>
            <p className="text-xs sm:text-sm font-serif text-stone-400 mt-1">
              {cms.event.subheadingId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Waktu & Kalender */}
            <div className="rounded-2xl bg-[#280c0c]/80 border border-amber-500/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Waktu Pelaksanaan</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-white mb-1">
                  {cms.event.dateTextId}
                </div>
                {showZh && (
                  <div className="text-xs font-chinese text-amber-300/80 mb-3">
                    {cms.event.dateTextZh}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-stone-300 py-2 border-t border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{cms.event.timeTextId} ({cms.event.timeNotesId})</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-500/20">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Simpan di Google Calendar
                </a>
              </div>
            </div>

            {/* Tempat & Busana */}
            <div className="rounded-2xl bg-[#280c0c]/80 border border-amber-500/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Titik Kumpul & Lokasi</span>
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {cms.event.venueNameId}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {cms.event.address}
                </p>

                <div className="p-3 rounded-xl bg-[#1c0808] border border-amber-500/20 flex items-start gap-2.5 text-xs text-stone-300">
                  <Shirt className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-200 block">
                      Dress Code: {cms.event.dresscodeId}
                    </span>
                    <span className="text-[11px] text-stone-400">{cms.event.dresscodeNotesId}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center gap-3">
                <button
                  onClick={copyAddress}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#351212] hover:bg-[#451818] border border-amber-500/30 text-xs font-semibold text-amber-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  {copiedAddr ? "Alamat Tersalin" : "Salin Alamat"}
                </button>
                <a
                  href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#351212] hover:bg-[#451818] border border-amber-500/30 text-xs font-semibold text-amber-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  Buka Peta <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 02: Wejangan Suci Maotian Shixiong (Altar Sabda Emas)   */}
        {/* ============================================================== */}
        <section id="wejangan" className="rounded-3xl bg-gradient-to-b from-[#230909] via-[#1a0606] to-[#120404] border border-amber-500/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chinese text-9xl font-black text-amber-500/5 pointer-events-none select-none">
            道
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>

            <span className="inline-block px-3 py-0.5 rounded-full bg-[#3e1414] border border-amber-400/50 text-amber-300 font-chinese text-xs mb-3">
              {cms.wisdom.sealZh || "茂田師兄慈悲勉勵"}
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-2">
              {cms.wisdom.headingId || "Untaian Wejangan Kebijaksanaan"}
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80 mb-6">
              {cms.wisdom.subheadingId}
            </p>

            <blockquote className="text-lg sm:text-2xl font-serif text-white leading-relaxed italic mb-6">
              &ldquo;{cms.wisdom.quoteId}&rdquo;
            </blockquote>

            {showZh && (
              <p className="font-chinese text-sm sm:text-base text-amber-300/90 leading-relaxed mb-6">
                {cms.wisdom.quoteZh}
              </p>
            )}

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4" />

            <p className="text-xs text-stone-300 font-sans">
              {cms.wisdom.closingId}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 03: 20-Year Retrospective Horizontal Stage              */}
        {/* ============================================================== */}
        <section id="sejarah" className="rounded-3xl bg-[#170505] border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-amber-500/20 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80 block">
                Napak Tilas 20 Tahun Gedung (1997 — 2026)
              </span>
              <h2 className="text-2xl sm:text-3xl font-chinese font-bold text-amber-200">
                歲月印記 • 薪火相傳
              </h2>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMilestone}
                className="w-9 h-9 rounded-full bg-[#2a0e0e] hover:bg-[#3d1414] border border-amber-500/40 text-amber-200 flex items-center justify-center transition-colors"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-amber-300 px-2">
                {activeMilestoneIdx + 1} / {milestones.length}
              </span>
              <button
                onClick={nextMilestone}
                className="w-9 h-9 rounded-full bg-[#2a0e0e] hover:bg-[#3d1414] border border-amber-500/40 text-amber-200 flex items-center justify-center transition-colors"
                title="Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Milestone Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#240b0b] rounded-2xl border border-amber-500/30 p-6 sm:p-8">
            <div className="md:col-span-7">
              <div className="inline-block px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold mb-2">
                Tahun {currentMilestone.year} • {currentMilestone.location}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 font-serif">
                {currentMilestone.title}
              </h3>
              <p className="font-chinese text-sm text-amber-300/80 mb-4">
                {currentMilestone.chineseTitle}
              </p>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                {showId && currentMilestone.description}
                {showId && showZh && " "}
                {showZh && (
                  <span className="font-chinese block text-stone-400 mt-2 text-xs">
                    {currentMilestone.chineseDescription}
                  </span>
                )}
              </p>
              <div className="p-3 rounded-xl bg-[#150404] border-l-2 border-amber-400 text-xs text-amber-200 italic font-serif">
                &ldquo;{currentMilestone.highlight}&rdquo;
              </div>
            </div>

            <div className="md:col-span-5">
              {currentMilestone.image ? (
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-amber-500/30">
                  <Image
                    src={currentMilestone.image}
                    alt={currentMilestone.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-56 rounded-xl bg-[#150404] flex items-center justify-center text-xs text-stone-500 font-mono">
                  Dokumentasi Arsip
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 04: Curated Photo Lightbox Wall                        */}
        {/* ============================================================== */}
        <section id="galeri" className="rounded-3xl bg-[#150505] border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-amber-500/20 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80 block">
                Galeri Visual Dua Dasawarsa
              </span>
              <h2 className="text-2xl sm:text-3xl font-chinese font-bold text-amber-200">
                歲月長廊 • 影像典藏
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              {(["all", "sejarah", "kegiatan", "kebersamaan"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3 py-1 rounded-full transition-all capitalize ${
                    galleryCategory === cat
                      ? "bg-amber-500 text-stone-950 font-bold"
                      : "bg-[#250d0d] text-stone-300 hover:text-white border border-amber-500/20"
                  }`}
                >
                  {cat === "all" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredGallery.slice(0, 9).map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxPhoto(item)}
                className="group relative h-40 sm:h-48 rounded-xl overflow-hidden border border-amber-500/20 cursor-pointer bg-[#200a0a]"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-amber-200 font-serif line-clamp-1">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 05: Pelita Doa & Ikrar Bersama (RSVP)                  */}
        {/* ============================================================== */}
        <section id="rsvp" className="rounded-3xl bg-gradient-to-b from-[#240a0a] to-[#140404] border-2 border-amber-500/50 p-6 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-chinese mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>祈願明燈 • 萬緣普濟</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Pelita Doa & Konfirmasi Hadir
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              {showId && "Sematkan doa berkah dan pastikan kehadiran Anda pada malam puncak perayaan."}
              {showId && showZh && " • "}
              {showZh && <span className="font-chinese text-amber-200">同舟共濟，誠祈法筵圓滿</span>}
            </p>

            {/* Live Counters */}
            <div className="grid grid-cols-3 gap-2 mt-6 max-w-md mx-auto text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[#1c0808] border border-amber-500/30">
                <span className="text-amber-400 text-base font-bold block">{summary.totalResponses}</span>
                <span className="text-[10px] text-stone-400 uppercase">Pelita Doa</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1c0808] border border-amber-500/30">
                <span className="text-emerald-400 text-base font-bold block">{summary.attending}</span>
                <span className="text-[10px] text-stone-400 uppercase">Pasti Hadir</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1c0808] border border-amber-500/30">
                <span className="text-amber-400 text-base font-bold block">{summary.totalGuests}</span>
                <span className="text-[10px] text-stone-400 uppercase">Total Jiwa</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRsvpSubmit} className="max-w-xl mx-auto bg-[#1b0707] p-6 sm:p-8 rounded-2xl border border-amber-500/40 mb-10 shadow-xl">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold font-serif text-amber-200 mb-1">
                  Pelita Doa Anda Telah Menyala
                </h4>
                <p className="text-xs text-stone-300 mb-4">
                  Terima kasih atas doa dan konfirmasi kehadiran Anda untuk Kuang Hang Fo Thang.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-1.5 rounded-full bg-[#2d0e0e] border border-amber-500/30 text-xs text-amber-200 hover:bg-[#3d1414] transition-colors"
                >
                  Kirim Doa Lain
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-sans">
                {rsvpError && (
                  <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200">
                    {rsvpError}
                  </div>
                )}

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Nama Lengkap / 姓名 <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Lim TC / Bpk. David & Kel."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#120404] text-amber-100 placeholder-stone-600 focus:border-amber-400 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1.5">
                    Konfirmasi Kehadiran / 出席狀況 <span className="text-amber-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                        status === "hadir"
                          ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                          : "border-stone-800 text-stone-400 hover:bg-[#250d0d]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="nightStatus"
                        value="hadir"
                        checked={status === "hadir"}
                        onChange={() => setStatus("hadir")}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <span>Pasti Hadir (準時出席)</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                        status === "tidak_hadir"
                          ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                          : "border-stone-800 text-stone-400 hover:bg-[#250d0d]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="nightStatus"
                        value="tidak_hadir"
                        checked={status === "tidak_hadir"}
                        onChange={() => setStatus("tidak_hadir")}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <span>Mohon Izin (祈願祝福)</span>
                    </label>
                  </div>
                </div>

                {status === "hadir" && (
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Jumlah Tamu Yang Hadir (Termasuk Anda) / 出席人數
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#120404] text-amber-100 outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} className="bg-stone-900 text-white">
                          {n} Orang ({n} 位)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Untaian Doa & Ungkapan Syukur / 祈福銘言
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan bait doa berkah untuk 20 tahun Kuang Hang..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#120404] text-amber-100 placeholder-stone-600 focus:border-amber-400 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Menyalakan Pelita Doa..." : "Nyalakan Pelita Doa & Kirim RSVP"}
                </button>
              </div>
            )}
          </form>

          {/* Floating Wishes Wall */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {wishes.slice(0, 8).map((w, i) => (
              <div
                key={w.id || i}
                className="p-4 rounded-2xl bg-[#1c0808]/90 border border-amber-500/30 relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-100 font-serif text-sm">
                      {w.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      w.status === "hadir"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                        : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {w.status === "hadir" ? "Pasti Hadir" : "Doa Restu"}
                  </span>
                </div>
                {w.message && (
                  <p className="text-xs text-stone-300 font-serif italic">
                    &ldquo;{w.message}&rdquo;
                  </p>
                )}
                <span className="text-[10px] font-mono text-stone-500 mt-2 block">
                  {w.timestamp || "Doa Umat"}
                </span>
              </div>
            ))}
          </div>

        </section>

        {/* ============================================================== */}
        {/* SECTION 06: Dana Kebajikan & Koordinat Peta                    */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-[#170505] border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Tali Kasih */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                {cms.donation.headingId || "Tali Kasih & Dana Kebajikan"}
              </span>
              <h3 className="text-xl font-bold font-chinese text-amber-200 mb-2">
                隨喜功德 • 廣種福田
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {cms.donation.descriptionId}
              </p>

              <div className="p-4 rounded-2xl bg-[#230909] border border-amber-500/30">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-500/20 text-xs">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    {cms.donation.bankName}
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    {cms.donation.accountHolder}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-mono font-bold text-white tracking-wider">
                    {cms.donation.accountNumber}
                  </span>
                  <button
                    onClick={copyBank}
                    className="px-3 py-1.5 rounded-lg bg-[#381111] hover:bg-[#481616] border border-amber-500/30 text-[11px] font-semibold text-amber-200 transition-colors flex items-center gap-1"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    {copiedBank ? "Tersalin" : "Salin Rekening"}
                  </button>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                Koordinat Altar Suci
              </span>
              <h3 className="text-xl font-bold font-chinese text-amber-200 mb-2">
                道場座標 • 會場交通
              </h3>
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 h-44 bg-stone-900 mb-2">
                <iframe
                  src={cms.location.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-stone-400 font-mono line-clamp-1">
                {cms.location.fullAddress}
              </p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-amber-500/20 text-stone-500 font-mono text-xs">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-chinese text-sm mb-1">
            <span>廣航佛堂</span>
            <span>•</span>
            <span>落成廿週年紀念 (2006 — 2026)</span>
          </div>
          <p className="text-[11px] text-stone-500 mb-4">
            Palmerah, Jakarta Barat • Tian En Shi De
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#200a0a] border border-amber-500/30 text-amber-300 text-xs hover:bg-[#2f1010] transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Kembali ke Puncak
          </button>
        </footer>

      </main>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#1c0808] rounded-2xl overflow-hidden border border-amber-500/50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-80 sm:h-96 mb-3">
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white">
              <h5 className="font-bold text-base font-serif text-amber-300">{lightboxPhoto.title}</h5>
              <p className="font-chinese text-xs text-stone-400">{lightboxPhoto.chineseTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Variation Switcher */}
      <VariationSwitcher />
    </div>
  );
}

export default function Home2Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0d0404] text-amber-300 font-serif">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-chinese">盛典夜宴載入中...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home2GalaContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
