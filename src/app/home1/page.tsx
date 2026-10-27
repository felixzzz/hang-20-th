"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Users,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  X,
  CreditCard,
  Flame,
  ArrowUp,
  Bookmark,
  Share2,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { Marquee } from "@/components/ui/Marquee";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TicketCard } from "@/components/ui/TicketCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home1EditorialContent() {
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

  // Gallery filter & modal
  const allGallery: GalleryPhotoItem[] =
    cms.gallery && cms.gallery.length > 0 ? cms.gallery : (galleryItems as GalleryPhotoItem[]);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredGallery =
    galleryFilter === "all" ? allGallery : allGallery.filter((item) => item.category === galleryFilter);

  // Milestones
  const milestones =
    cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const [activeMilestoneYear, setActiveMilestoneYear] = useState(milestones[0]?.year || "1997");
  const currentMilestone =
    milestones.find((m) => m.year === activeMilestoneYear) || milestones[0];

  // RSVP state
  const [rsvpName, setRsvpName] = useState(guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName);
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak_hadir">("hadir");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [wishesSummary, setWishesSummary] = useState({
    totalResponses: initialWishes.length,
    attending: initialWishes.filter((w) => w.status === "hadir").length,
    totalGuests: initialWishes
      .filter((w) => w.status === "hadir")
      .reduce((sum, w) => sum + (w.guests || 1), 0),
  });

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Fetch initial RSVP wishes
  useEffect(() => {
    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setWishes(json.data);
          if (json.summary) setWishesSummary(json.summary);
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
    if (!rsvpName.trim()) {
      setRsvpError(showId ? "Mohon cantumkan nama lengkap Anda." : "請填寫您的尊姓大名。");
      return;
    }

    setIsSubmittingRsvp(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName.trim(),
          status: rsvpStatus,
          guests: rsvpStatus === "hadir" ? parseInt(rsvpGuests, 10) || 1 : 0,
          message: rsvpMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvpSubmitted(true);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#b88a3b", "#7c1818", "#f4ecd8"],
        });
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setWishesSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirim RSVP.");
      }
    } catch {
      setRsvpError("Terjadi kendala koneksi.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const copyAddress = () => {
    const addr = cms.event.address || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Jakarta Barat";
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyAccount = () => {
    if (cms.donation.accountNumber) {
      navigator.clipboard.writeText(cms.donation.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const address = cms.event.address || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(address)}`;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#221c17] font-serif selection:bg-[#dfba6d]/30 selection:text-[#7c1818]">
      
      {/* 21st.dev Top Infinite Running Marquee */}
      <div className="bg-[#7c1818] text-[#fbf5e8] py-1.5 border-b border-[#dfba6d]/40 overflow-hidden">
        <Marquee repeat={5} pauseOnHover className="[--duration:28s] py-0 text-xs font-mono tracking-widest">
          <span className="flex items-center gap-4 mx-4">
            <span className="font-chinese font-bold text-amber-300">廣航佛堂 廿週年堂慶大典</span>
            <span>•</span>
            <span>12 NOV 2006 — 14 NOV 2026</span>
            <span>•</span>
            <span className="chinese-seal-filled text-[10px] px-1.5 py-0.2">天恩師德</span>
            <span>•</span>
            <span>PALMERAH, JAKARTA BARAT</span>
            <span>•</span>
            <span>19:00 WIB</span>
          </span>
        </Marquee>
      </div>

      {/* Editorial Header */}
      <header className="sticky top-0 z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#dfba6d]/30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full border border-[#dfba6d] p-0.5 bg-white">
              <Image
                src={cms.cover.logoImage || "/images/logo-guang-ji.png"}
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#7c1818] block">
                {cms.cover.titleZh || "廣航佛堂"} • 廿週年紀念
              </span>
              <span className="text-[10px] font-sans text-stone-500">
                Museum Monograph Edition (2006 — 2026)
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#eae4d7] p-0.5 rounded-xl border border-stone-300 text-xs font-sans">
            {(["all", "id", "zh"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setLang(mode)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === mode
                    ? "bg-[#7c1818] text-white font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {mode === "all" ? "Dwi-Bahasa" : mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        
        {/* ============================================================== */}
        {/* HERO: 21st.dev 3D Holographic VIP Pass + Editorial Proclamation */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 21st.dev Holographic Ticket / Pass */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c1818]/10 border border-[#7c1818]/30 text-[#7c1818] text-xs font-sans font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sertifikat Kehormatan Tamu Undangan
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#7c1818] leading-tight mb-2">
              {cms.hero.mainTitleId}
            </h1>
            <h2 className="text-xl sm:text-2xl font-chinese font-normal text-stone-700 mb-6">
              {cms.hero.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
            </h2>

            {/* Interactive 3D Holographic Pass */}
            <TicketCard
              guestName={guestName}
              eventName={cms.hero.mainTitleId}
              eventDate={cms.event.dateTextId}
              eventTime={cms.event.timeTextId}
              venueName={cms.event.venueNameId}
              address={cms.event.address}
              chineseTitle="落成廿週年堂慶大典"
              onSaveCalendar={() => window.open(googleCalendarUrl, "_blank")}
              theme="gold-silk"
            />
          </div>

          {/* Right Column: Antique Astronomical HUD Countdown & Sacred Verse */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Number Ticker HUD */}
            <SpotlightCard className="p-6 border-2 border-[#dfba6d]/50 bg-gradient-to-br from-white to-[#faf6ee]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-sans uppercase tracking-widest text-[#9e7631] font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#7c1818]" />
                  Hitung Mundur Waktu Acara
                </span>
                <span className="chinese-seal-red text-[10px] px-2 py-0.5">
                  倒計時
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Hari", val: timeLeft.days },
                  { label: "Jam", val: timeLeft.hours },
                  { label: "Menit", val: timeLeft.minutes },
                  { label: "Detik", val: timeLeft.seconds },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-[#dfba6d]/30 shadow-xs">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#7c1818] block leading-none">
                      <NumberTicker value={item.val} />
                    </span>
                    <span className="text-[10px] font-sans text-stone-500 uppercase mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 text-xs font-sans text-stone-600 text-center">
                Sabtu, 14 November 2026 • 19.00 WIB s/d Selesai
              </div>
            </SpotlightCard>

            {/* Sacred Verse Monograph Card */}
            <SpotlightCard className="p-6 border border-[#dfba6d]/40 bg-white">
              <span className="text-xs font-sans uppercase tracking-widest text-stone-500 block mb-2 font-semibold">
                Untaian Doa & Rasa Syukur
              </span>
              <blockquote className="italic text-base text-stone-800 leading-relaxed border-l-2 border-[#dfba6d] pl-3 py-1">
                &ldquo;{cms.hero.quoteId}&rdquo;
              </blockquote>
              {showZh && (
                <p className="font-chinese text-xs text-[#9e7631] mt-2">
                  {cms.hero.quoteZh}
                </p>
              )}
            </SpotlightCard>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: 21st.dev Infinite Testimonial Wishes Marquee          */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-[#dfba6d]/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#9e7631] block">
                Untaian Doa & Harapan Umat
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#7c1818]">
                Buku Doa Digital Berjalan • 萬眾祈福
              </h3>
            </div>
            <a
              href="#buku-tamu"
              className="text-xs font-sans font-semibold text-[#7c1818] hover:underline flex items-center gap-1"
            >
              Tulis Doa Anda <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Marquee Row 1 */}
          <Marquee pauseOnHover className="[--duration:40s]">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="w-80 p-4 rounded-2xl bg-[#faf7f2] border border-[#dfba6d]/30 text-xs shrink-0 shadow-2xs font-sans"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-900 font-serif text-sm">
                    {w.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      w.status === "hadir"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {w.status === "hadir" ? "Pasti Hadir" : "Doa Restu"}
                  </span>
                </div>
                <p className="text-stone-700 italic font-serif line-clamp-2">
                  &ldquo;{w.message}&rdquo;
                </p>
                <span className="text-[10px] font-mono text-stone-400 mt-2 block">
                  {w.timestamp || "Doa Umat"}
                </span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* ============================================================== */}
        {/* SECTION: Agenda & Protocol Spotlight Grid                       */}
        {/* ============================================================== */}
        <section id="agenda" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Waktu Pelaksanaan */}
          <SpotlightCard className="p-6 sm:p-8 bg-white border border-[#dfba6d]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#9e7631] uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-[#7c1818]" />
                <span>Hari & Waktu Pelaksanaan</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-1">
                {cms.event.dateTextId}
              </h3>
              {showZh && (
                <div className="text-xs font-chinese text-stone-600 mb-3">
                  {cms.event.dateTextZh}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs font-sans text-stone-700 pt-3 border-t border-stone-200">
                <Clock className="w-4 h-4 text-[#7c1818] shrink-0" />
                <span>{cms.event.timeTextId} ({cms.event.timeNotesId})</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7c1818] hover:bg-[#681313] text-white text-xs font-sans font-bold shadow-xs transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Simpan di Google Calendar
              </a>
            </div>
          </SpotlightCard>

          {/* Lokasi & Busana */}
          <SpotlightCard className="p-6 sm:p-8 bg-white border border-[#dfba6d]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#9e7631] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-[#7c1818]" />
                <span>Tempat Acara & Busana</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                {cms.event.venueNameId}
              </h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed mb-4">
                {cms.event.address}
              </p>

              <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#dfba6d]/30 flex items-start gap-2.5 text-xs font-sans text-stone-700">
                <Shirt className="w-4 h-4 text-[#9e7631] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">
                    Tata Busana: {cms.event.dresscodeId}
                  </span>
                  <span className="text-[11px] text-stone-500">{cms.event.dresscodeNotesId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
              <button
                onClick={copyAddress}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-sans text-stone-800 hover:bg-[#f6efe1] transition-colors"
              >
                {copiedAddress ? "✓ Alamat Tersalin" : "Salin Alamat"}
              </button>
              <a
                href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans text-[#7c1818] font-bold inline-flex items-center gap-1 hover:underline"
              >
                Buka Peta <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </SpotlightCard>

        </section>

        {/* ============================================================== */}
        {/* SECTION: Sacred Wisdom Monograph Card                          */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-br from-[#faf6ee] to-[#f4ecd8] rounded-3xl border-2 border-[#dfba6d]/50 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-[#7c1818]/10 text-[#7c1818] flex items-center justify-center mx-auto mb-3">
              <Flame className="w-5 h-5 text-[#7c1818]" />
            </div>
            <span className="chinese-seal-red text-xs px-2.5 py-0.5 mb-2 inline-block">
              {cms.wisdom.sealZh || "茂田師兄慈悲勉勵"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#7c1818] mb-1">
              {cms.wisdom.headingId || "Untaian Wejangan Kebijaksanaan"}
            </h3>
            <span className="text-xs font-sans text-stone-600 block uppercase tracking-widest mb-6">
              {cms.wisdom.subheadingId}
            </span>

            <blockquote className="text-lg sm:text-2xl text-stone-900 leading-relaxed italic mb-4">
              &ldquo;{cms.wisdom.quoteId}&rdquo;
            </blockquote>
            {showZh && (
              <p className="font-chinese text-sm sm:text-base text-[#9e7631] leading-relaxed mb-4">
                {cms.wisdom.quoteZh}
              </p>
            )}
            <div className="w-16 h-px bg-[#dfba6d] mx-auto my-3" />
            <p className="text-xs font-sans text-stone-600">
              {cms.wisdom.closingId}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: 20-Year Retrospective Chronology                      */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-[#dfba6d]/40 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-2">
            <div>
              <span className="text-xs font-sans font-bold text-[#9e7631] uppercase tracking-wider block">
                Napak Tilas 20 Tahun (1997 — 2026)
              </span>
              <h3 className="text-2xl font-bold text-[#7c1818]">
                歲月印記 • 薪火相傳
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 font-sans text-xs">
              {milestones.map((m) => (
                <button
                  key={m.year + m.title}
                  onClick={() => setActiveMilestoneYear(m.year)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeMilestoneYear === m.year
                      ? "bg-[#7c1818] text-white font-bold shadow-xs"
                      : "bg-[#faf7f2] hover:bg-stone-200 text-stone-700 border border-stone-200"
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </div>

          {currentMilestone && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#faf7f2] p-6 sm:p-8 rounded-2xl border border-[#dfba6d]/30">
              <div className="md:col-span-7 space-y-3 font-sans">
                <span className="text-xs font-bold text-[#7c1818] uppercase tracking-widest block">
                  Tahun {currentMilestone.year} • {currentMilestone.location}
                </span>
                <h4 className="text-2xl font-bold font-serif text-stone-900">
                  {currentMilestone.title}
                </h4>
                <span className="font-chinese text-sm text-[#9e7631] block">
                  {currentMilestone.chineseTitle}
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {showId && currentMilestone.description}
                  {showId && showZh && " "}
                  {showZh && (
                    <span className="font-chinese block text-stone-600 mt-2">
                      {currentMilestone.chineseDescription}
                    </span>
                  )}
                </p>
                <div className="bg-white p-3.5 rounded-xl border-l-2 border-[#dfba6d] text-xs text-stone-800 italic font-serif">
                  &ldquo;{currentMilestone.highlight}&rdquo;
                </div>
              </div>

              <div className="md:col-span-5">
                {currentMilestone.image ? (
                  <div className="relative w-full h-60 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                    <Image
                      src={currentMilestone.image}
                      alt={currentMilestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-60 rounded-xl bg-stone-200 flex items-center justify-center text-xs font-sans text-stone-500">
                    Dokumentasi Arsip
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SECTION: Golden Registry & Interactive RSVP Portal              */}
        {/* ============================================================== */}
        <section id="buku-tamu" className="bg-white rounded-3xl border-2 border-[#dfba6d]/60 p-6 sm:p-10 shadow-md relative">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="chinese-seal-filled text-xs px-2.5 py-0.5 font-chinese mb-2 inline-block">
              金石誓願
            </span>
            <h3 className="text-3xl font-bold text-[#7c1818]">
              Buku Tamu & Untaian Doa
            </h3>
            <p className="text-xs font-sans text-stone-600 mt-1">
              Mohon berkenan mengonfirmasi kehadiran serta menitipkan doa berkah untuk wadah suci Kuang Hang Fo Thang.
            </p>

            {/* Counters */}
            <div className="flex items-center justify-center gap-3 mt-4 font-sans text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                Total Doa: <strong className="text-[#7c1818]">{wishesSummary.totalResponses}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                Pasti Hadir: <strong className="text-emerald-700">{wishesSummary.attending}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                Total Jiwa: <strong className="text-[#7c1818]">{wishesSummary.totalGuests}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleRsvpSubmit} className="max-w-xl mx-auto bg-[#faf7f2] p-6 sm:p-8 rounded-2xl border border-[#dfba6d]/40 font-sans text-xs">
            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-stone-900 font-serif mb-1">
                  Terima Kasih Atas Konfirmasi & Doa Anda
                </h4>
                <p className="text-stone-600 mb-4">
                  Nama Anda telah tercatat dengan baik di buku tamu digital kami.
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSubmitted(false)}
                  className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {rsvpError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {rsvpError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Lengkap / 姓名 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Contoh: Lim TC / Bpk. David & Kel."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:border-[#7c1818] outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Konfirmasi Kehadiran / 出席狀況 <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("hadir")}
                      className={`py-2.5 px-3 rounded-xl border font-bold transition-all ${
                        rsvpStatus === "hadir"
                          ? "bg-[#7c1818] text-white border-[#7c1818] shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      Pasti Hadir (準時出席)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("tidak_hadir")}
                      className={`py-2.5 px-3 rounded-xl border font-bold transition-all ${
                        rsvpStatus === "tidak_hadir"
                          ? "bg-[#7c1818] text-white border-[#7c1818] shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      Mohon Izin (不克出席)
                    </button>
                  </div>
                </div>

                {rsvpStatus === "hadir" && (
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Jumlah Hadir (Termasuk Anda) / 出席人數
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 outline-hidden font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Orang ({num} 位)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Untaian Doa & Ucapan Syukur / 祝福留言
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan doa restu, kenangan indah, atau harapan tulus Anda..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:border-[#7c1818] outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full py-3 px-4 rounded-xl bg-[#7c1818] hover:bg-[#681313] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingRsvp ? "Mengirimkan Data..." : "Kirimkan Konfirmasi & Doa"}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-stone-200 text-stone-500 font-sans text-xs">
          <div className="flex items-center justify-center gap-2 font-bold text-stone-800 mb-1">
            <span className="font-chinese text-sm text-[#7c1818]">廣航佛堂</span>
            <span>•</span>
            <span>落成廿週年紀念 (2006 — 2026)</span>
          </div>
          <p className="text-[11px] text-stone-400 mb-3">
            Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-[#faf7f2] transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#7c1818]" /> Kembali ke Puncak
          </button>
        </footer>

      </main>
    </div>
  );
}

export default function Home1Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] text-[#7c1818]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#7c1818] border-t-transparent animate-spin" />
            <span className="text-xs font-chinese">廣航典藏載入中...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home1EditorialContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
