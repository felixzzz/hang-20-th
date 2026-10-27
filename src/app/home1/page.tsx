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
  Languages,
  Send,
  Users,
  HeartHandshake,
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
import VariationSwitcher from "@/components/VariationSwitcher";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home1EditorialContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms, isLoading } = useCms();

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasTriggeredAudio, setHasTriggeredAudio] = useState(false);

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

  // Copy states
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
      setRsvpError(
        showId
          ? "Mohon cantumkan nama lengkap Anda."
          : "請填寫您的尊姓大名。"
      );
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
        if (rsvpStatus === "hadir") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#b88a3b", "#7c1818", "#f4ecd8"],
          });
        }
        // Refresh wishes
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setWishesSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirim RSVP.");
      }
    } catch {
      setRsvpError("Terjadi kendala koneksi. Silakan coba kembali.");
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
      
      {/* Top Archival Header Bar */}
      <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#dfba6d]/30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="chinese-seal-filled text-xs px-2 py-0.5 font-chinese">
              天恩師德
            </span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#7c1818]">
                Monograf Peringatan 20 Tahun • 廣航佛堂廿週年
              </span>
              <span className="text-[11px] text-stone-500 font-sans">
                {cms.hero.cityId} • 14 November 2026
              </span>
            </div>
          </div>

          {/* Controls: Language & Audio */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#f0eae0] p-0.5 rounded-lg border border-[#dfba6d]/40 text-xs font-sans">
              <button
                onClick={() => setLang("all")}
                className={`px-2 py-1 rounded-md transition-all ${
                  lang === "all" ? "bg-[#7c1818] text-[#fbf5e8] font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Dwi-Bahasa
              </button>
              <button
                onClick={() => setLang("id")}
                className={`px-2 py-1 rounded-md transition-all ${
                  lang === "id" ? "bg-[#7c1818] text-[#fbf5e8] font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang("zh")}
                className={`px-2 py-1 rounded-md transition-all ${
                  lang === "zh" ? "bg-[#7c1818] text-[#fbf5e8] font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Asymmetric Split Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Sticky Commemorative Spine (Buku Monograf & Tamu)  */}
          {/* ============================================================== */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
            
            {/* Spine Folio Card */}
            <div className="bg-[#ffffff] rounded-2xl border-2 border-[#dfba6d]/50 shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#7c1818] via-[#dfba6d] to-[#7c1818]" />
              
              {/* Sacred Crest & Seal */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full border border-[#dfba6d] p-1 bg-[#faf7f2]">
                    <Image
                      src={cms.cover.logoImage || "/images/logo-guang-ji.png"}
                      alt="Logo Guang Ji"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-chinese font-bold text-[#7c1818] leading-tight">
                      {cms.cover.titleZh || "廣航佛堂"}
                    </h1>
                    <span className="text-[11px] font-sans uppercase tracking-widest text-stone-500 block">
                      2006 — 2026
                    </span>
                  </div>
                </div>

                <div className="writing-vertical-rl text-[11px] font-chinese text-[#9e7631] border-l border-[#dfba6d]/40 pl-2">
                  廿載法舟 • 薪火相傳
                </div>
              </div>

              {/* Dedicated Guest Certificate */}
              <div className="bg-[#faf6ee] rounded-xl border border-[#dfba6d]/40 p-4 mb-5 text-center relative">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#9e7631] block mb-1">
                  {showId && "Sertifikat Kehormatan Tamu"}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese">貴賓敬邀函</span>}
                </span>

                <div className="text-base sm:text-lg font-bold text-[#7c1818] mb-1">
                  {guestName}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {showId && "Merupakan sukacita dan kehormatan besar bagi kami menyambut kehadiran Anda dalam Malam Puncak Syukur 20 Tahun."}
                  {showId && showZh && " "}
                  {showZh && (
                    <span className="font-chinese block text-stone-500 mt-1">
                      謹此誠摯奉邀閣下蒞臨大典，共沐天恩師德。
                    </span>
                  )}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#dfba6d]/30 flex items-center justify-center gap-2">
                  <span className="chinese-seal-red text-[10px] px-2 py-0.5">
                    尊榮席位
                  </span>
                  <span className="text-[11px] font-sans text-stone-500">
                    Undangan Resmi
                  </span>
                </div>
              </div>

              {/* Antique Astronomical Countdown */}
              <div className="border border-stone-200 rounded-xl p-4 bg-[#fdfcfb]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-sans font-semibold tracking-wider uppercase text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7c1818]" />
                    Hitung Mundur
                  </span>
                  <span className="text-[11px] font-chinese text-[#9e7631]">
                    倒計時
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-[#dfba6d]/30 shadow-xs">
                    <span className="text-xl font-bold font-sans text-[#7c1818] block leading-none">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] font-sans text-stone-500 uppercase">Hari</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#dfba6d]/30 shadow-xs">
                    <span className="text-xl font-bold font-sans text-[#7c1818] block leading-none">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[10px] font-sans text-stone-500 uppercase">Jam</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#dfba6d]/30 shadow-xs">
                    <span className="text-xl font-bold font-sans text-[#7c1818] block leading-none">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[10px] font-sans text-stone-500 uppercase">Mnt</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#dfba6d]/30 shadow-xs">
                    <span className="text-xl font-bold font-sans text-[#7c1818] block leading-none">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[10px] font-sans text-stone-500 uppercase">Dtk</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 text-center mt-2.5 font-sans">
                  Sabtu, 14 November 2026 • 19.00 WIB
                </div>
              </div>

              {/* Quick Jump Index */}
              <div className="mt-5 pt-4 border-t border-stone-100 font-sans text-xs space-y-1.5">
                <a
                  href="#agenda"
                  className="flex items-center justify-between text-stone-600 hover:text-[#7c1818] p-1.5 rounded hover:bg-[#faf6ee] transition-colors"
                >
                  <span>1. Jadwal & Tempat</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </a>
                <a
                  href="#sabda"
                  className="flex items-center justify-between text-stone-600 hover:text-[#7c1818] p-1.5 rounded hover:bg-[#faf6ee] transition-colors"
                >
                  <span>2. Untaian Sabda Suci</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </a>
                <a
                  href="#kronik"
                  className="flex items-center justify-between text-stone-600 hover:text-[#7c1818] p-1.5 rounded hover:bg-[#faf6ee] transition-colors"
                >
                  <span>3. Kronik Napak Tilas</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </a>
                <a
                  href="#galeri-arsip"
                  className="flex items-center justify-between text-stone-600 hover:text-[#7c1818] p-1.5 rounded hover:bg-[#faf6ee] transition-colors"
                >
                  <span>4. Galeri Pusaka</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </a>
                <a
                  href="#buku-tamu"
                  className="flex items-center justify-between text-[#7c1818] font-bold p-1.5 rounded bg-[#7c1818]/10 hover:bg-[#7c1818]/15 transition-colors"
                >
                  <span>5. Konfirmasi RSVP & Doa</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#7c1818]" />
                </a>
              </div>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Continuous Editorial Monograph Stream             */}
          {/* ============================================================== */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* Prologue: Editorial Hero Banner */}
            <article className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none font-chinese text-8xl font-black text-[#7c1818]">
                航
              </div>

              <div className="max-w-2xl">
                <span className="text-xs font-sans tracking-[0.25em] text-[#9e7631] uppercase font-bold block mb-2">
                  {cms.hero.sloganId || "Dua Dasawarsa Menyalakan Pelita Kebajikan"}
                </span>

                <h2 className="text-3xl sm:text-5xl font-bold text-[#7c1818] leading-tight mb-2">
                  {cms.hero.mainTitleId}
                </h2>
                <h3 className="text-xl sm:text-2xl font-chinese font-normal text-stone-700 mb-6">
                  {cms.hero.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
                </h3>

                <blockquote className="border-l-2 border-[#dfba6d] pl-4 italic text-base sm:text-lg text-stone-800 my-4 leading-relaxed bg-[#fdfcfb] py-2 rounded-r-lg">
                  {showId && <p>&ldquo;{cms.hero.quoteId}&rdquo;</p>}
                  {showZh && (
                    <p className="font-chinese text-sm text-[#9e7631] not-italic mt-2">
                      {cms.hero.quoteZh}
                    </p>
                  )}
                </blockquote>

                <p className="text-sm font-sans text-stone-700 leading-relaxed mt-4">
                  {showId && cms.hero.storyParagraphId}
                  {showId && showZh && " "}
                  {showZh && (
                    <span className="font-chinese block text-stone-600 mt-2">
                      {cms.hero.storyParagraphZh}
                    </span>
                  )}
                </p>
              </div>

              {/* Archival Photo Plate */}
              <div className="mt-8 pt-6 border-t border-stone-100">
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-stone-200">
                  <Image
                    src={cms.cover.bgImage || "/images/guang-hang-15.jpg"}
                    alt="Altar Suci Kuang Hang Fo Thang"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-sans uppercase tracking-widest text-[#dfba6d] font-semibold block">
                      {cms.hero.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang"}
                    </span>
                    <p className="text-xs text-stone-200 font-sans mt-0.5 line-clamp-1">
                      {cms.hero.photoCaptionDescId}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 01: Agenda & Meeting Point */}
            <section id="agenda" className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="chinese-seal-filled text-xs px-2 py-0.5 font-chinese">
                  慶典日程
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7c1818]">
                    {cms.event.headingId || "Waktu & Tempat Pelaksanaan"}
                  </h3>
                  <span className="text-xs font-sans text-stone-500">
                    {cms.event.subheadingId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Waktu Pelaksanaan */}
                <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#dfba6d]/30">
                  <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4 text-[#7c1818]" />
                    <span>Hari & Tanggal</span>
                  </div>
                  <div className="text-lg font-bold text-stone-900 mb-1">
                    {cms.event.dateTextId}
                  </div>
                  {showZh && (
                    <div className="text-xs font-chinese text-stone-600 mb-3">
                      {cms.event.dateTextZh}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-sans text-stone-700 pt-2 border-t border-stone-200/60">
                    <Clock className="w-4 h-4 text-[#7c1818]" />
                    <span>{cms.event.timeTextId} ({cms.event.timeNotesId})</span>
                  </div>

                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c1818] hover:bg-[#681313] text-white text-xs font-sans font-semibold shadow-xs transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Simpan ke Google Calendar
                  </a>
                </div>

                {/* Lokasi Gedung */}
                <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#dfba6d]/30">
                  <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-[#7c1818]" />
                    <span>Tempat Acara</span>
                  </div>
                  <div className="text-base font-bold text-stone-900 mb-1">
                    {cms.event.venueNameId}
                  </div>
                  <p className="text-xs font-sans text-stone-600 leading-relaxed mb-3">
                    {cms.event.address}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                    <button
                      onClick={copyAddress}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#dfba6d]/50 text-xs font-sans text-stone-800 hover:bg-[#f6efe1] transition-colors"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-[#9e7631]" />
                          <span>Salin Alamat</span>
                        </>
                      )}
                    </button>
                    <a
                      href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans text-[#7c1818] hover:underline"
                    >
                      Buka Peta <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Dress Code Note */}
              <div className="bg-[#ffffff] p-4 rounded-xl border border-stone-200 flex items-start gap-3">
                <Shirt className="w-5 h-5 text-[#9e7631] shrink-0 mt-0.5" />
                <div className="text-xs font-sans text-stone-700">
                  <strong className="text-stone-900 font-semibold block mb-0.5">
                    Tata Busana (Dress Code): {cms.event.dresscodeId}
                  </strong>
                  <span>{cms.event.dresscodeNotesId}</span>
                </div>
              </div>
            </section>

            {/* Section 02: Sacred Wisdom Scroll */}
            <section id="sabda" className="bg-[#faf6ee] rounded-2xl border-2 border-[#dfba6d]/50 shadow-sm p-6 sm:p-10 relative">
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="w-8 h-8 rounded-full bg-[#7c1818]/10 text-[#7c1818] flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-4 h-4 text-[#7c1818]" />
                </div>
                <span className="chinese-seal-red text-xs px-2.5 py-0.5 mb-1 inline-block">
                  {cms.wisdom.sealZh || "茂田師兄慈悲勉勵"}
                </span>
                <h3 className="text-2xl font-bold text-[#7c1818]">
                  {cms.wisdom.headingId || "Untaian Wejangan Kebijaksanaan"}
                </h3>
                <span className="text-xs font-sans text-stone-500 block uppercase tracking-widest mt-1">
                  {cms.wisdom.subheadingId}
                </span>
              </div>

              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-[#dfba6d]/30 shadow-xs text-center">
                <blockquote className="text-lg sm:text-xl text-stone-900 leading-relaxed italic mb-4">
                  &ldquo;{cms.wisdom.quoteId}&rdquo;
                </blockquote>
                {showZh && (
                  <p className="font-chinese text-sm sm:text-base text-[#9e7631] leading-relaxed mb-4">
                    {cms.wisdom.quoteZh}
                  </p>
                )}
                <div className="w-12 h-px bg-[#dfba6d] mx-auto my-3" />
                <p className="text-xs font-sans text-stone-600">
                  {cms.wisdom.closingId}
                </p>
              </div>
            </section>

            {/* Section 03: 20-Year Retrospective Chronology */}
            <section id="kronik" className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-100">
                <div>
                  <span className="text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider block">
                    Napak Tilas 20 Tahun (1997 — 2026)
                  </span>
                  <h3 className="text-2xl font-bold text-[#7c1818]">
                    歲月印記 • 薪火相傳
                  </h3>
                </div>
                <span className="chinese-seal-filled text-xs px-2 py-0.5 font-chinese hidden sm:inline">
                  法舟啟航
                </span>
              </div>

              {/* Year Switcher Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {milestones.map((m) => (
                  <button
                    key={m.year + m.title}
                    onClick={() => setActiveMilestoneYear(m.year)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all ${
                      activeMilestoneYear === m.year
                        ? "bg-[#7c1818] text-[#fbf5e8] shadow-xs"
                        : "bg-[#faf7f2] hover:bg-stone-200 text-stone-700 border border-stone-200"
                    }`}
                  >
                    Tahun {m.year}
                  </button>
                ))}
              </div>

              {/* Active Milestone Card */}
              {currentMilestone && (
                <div className="bg-[#faf7f2] rounded-xl border border-[#dfba6d]/30 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <span className="text-xs font-sans font-bold text-[#7c1818] uppercase tracking-widest block mb-1">
                      {currentMilestone.year} • {currentMilestone.location}
                    </span>
                    <h4 className="text-xl font-bold text-stone-900 mb-1">
                      {currentMilestone.title}
                    </h4>
                    <span className="font-chinese text-sm text-[#9e7631] block mb-3">
                      {currentMilestone.chineseTitle}
                    </span>
                    <p className="text-xs font-sans text-stone-700 leading-relaxed mb-3">
                      {showId && currentMilestone.description}
                      {showId && showZh && " "}
                      {showZh && (
                        <span className="font-chinese block text-stone-600 mt-1">
                          {currentMilestone.chineseDescription}
                        </span>
                      )}
                    </p>
                    <div className="bg-white p-3 rounded-lg border-l-2 border-[#dfba6d] text-xs font-sans text-stone-800 italic">
                      &ldquo;{currentMilestone.highlight}&rdquo;
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    {currentMilestone.image ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-stone-200">
                        <Image
                          src={currentMilestone.image}
                          alt={currentMilestone.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 rounded-lg bg-stone-200 flex items-center justify-center text-xs font-sans text-stone-500">
                        Foto Arsip
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Section 04: Curated Photo Gallery */}
            <section id="galeri-arsip" className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-6 border-b border-stone-100 gap-2">
                <div>
                  <span className="text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider block">
                    Dokumentasi Dua Dasawarsa
                  </span>
                  <h3 className="text-2xl font-bold text-[#7c1818]">
                    歲月長廊 • 影像典藏
                  </h3>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 font-sans text-xs">
                  {(["all", "sejarah", "kegiatan", "kebersamaan"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGalleryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                        galleryFilter === cat
                          ? "bg-[#7c1818] text-white font-semibold"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat === "all" ? "Semua" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filteredGallery.slice(0, 9).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative h-36 sm:h-44 rounded-xl overflow-hidden border border-stone-200 cursor-pointer shadow-xs"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-[11px] font-sans truncate">
                      {photo.title}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 05: Golden Registry & RSVP */}
            <section id="buku-tamu" className="bg-[#ffffff] rounded-2xl border-2 border-[#dfba6d]/60 shadow-md p-6 sm:p-10 relative">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="chinese-seal-filled text-xs px-2.5 py-0.5 font-chinese mb-2 inline-block">
                  金石誓願
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#7c1818]">
                  Buku Tamu & Untaian Doa
                </h3>
                <p className="text-xs font-sans text-stone-600 mt-1">
                  {showId && "Mohon berkenan mengonfirmasi kehadiran serta menitipkan doa berkah untuk wadah suci Kuang Hang Fo Thang."}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese">敬請確認回執並敬題祈願</span>}
                </p>

                {/* Counters */}
                <div className="flex items-center justify-center gap-4 mt-4 font-sans text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                    Total Doa: <strong className="text-[#7c1818]">{wishesSummary.totalResponses}</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                    Konfirmasi Hadir: <strong className="text-emerald-700">{wishesSummary.attending}</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#faf7f2] border border-[#dfba6d]/30 text-stone-700">
                    Total Jiwa: <strong className="text-[#7c1818]">{wishesSummary.totalGuests}</strong>
                  </div>
                </div>
              </div>

              {/* RSVP Form */}
              <form onSubmit={handleRsvpSubmit} className="max-w-xl mx-auto bg-[#faf7f2] p-5 sm:p-7 rounded-xl border border-[#dfba6d]/40 mb-8 font-sans">
                {rsvpSubmitted ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-stone-900 font-serif mb-1">
                      Terima Kasih Atas Konfirmasi & Doa Anda
                    </h4>
                    <p className="text-xs text-stone-600 mb-4">
                      Konfirmasi Anda telah tercatat dengan baik di buku tamu digital kami.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRsvpSubmitted(false)}
                      className="px-4 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rsvpError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                        {rsvpError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nama Lengkap / 姓名 <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Contoh: Lim TC / Bpk. David & Kel."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs focus:ring-1 focus:ring-[#7c1818] focus:border-[#7c1818] outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Konfirmasi Kehadiran / 出席狀況 <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            rsvpStatus === "hadir"
                              ? "bg-white border-[#7c1818] text-[#7c1818] font-bold shadow-xs"
                              : "border-stone-200 text-stone-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="rsvpStatus"
                            value="hadir"
                            checked={rsvpStatus === "hadir"}
                            onChange={() => setRsvpStatus("hadir")}
                            className="text-[#7c1818] focus:ring-[#7c1818]"
                          />
                          <span>Pasti Hadir (準時出席)</span>
                        </label>
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            rsvpStatus === "tidak_hadir"
                              ? "bg-white border-[#7c1818] text-[#7c1818] font-bold shadow-xs"
                              : "border-stone-200 text-stone-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="rsvpStatus"
                            value="tidak_hadir"
                            checked={rsvpStatus === "tidak_hadir"}
                            onChange={() => setRsvpStatus("tidak_hadir")}
                            className="text-[#7c1818] focus:ring-[#7c1818]"
                          />
                          <span>Berhalangan Hadir (不克出席)</span>
                        </label>
                      </div>
                    </div>

                    {rsvpStatus === "hadir" && (
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Jumlah Hadir (Termasuk Anda) / 出席人數
                        </label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs focus:ring-1 focus:ring-[#7c1818] outline-hidden"
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
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Untaian Doa & Ucapan Syukur / 祝福留言
                      </label>
                      <textarea
                        rows={3}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Tuliskan doa restu, kenangan indah, atau harapan tulus Anda..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs focus:ring-1 focus:ring-[#7c1818] outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#7c1818] hover:bg-[#681313] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmittingRsvp ? "Mengirimkan Data..." : "Kirimkan Konfirmasi & Doa"}
                    </button>
                  </div>
                )}
              </form>

              {/* Prayer Wishes Stream */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {wishes.slice(0, 10).map((w, idx) => (
                  <div
                    key={w.id || idx}
                    className="p-3.5 rounded-xl bg-[#faf7f2] border border-stone-200 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between mb-1">
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
                        {w.status === "hadir" ? "Hadir" : "Doa Restu"}
                      </span>
                    </div>
                    {w.message && (
                      <p className="text-stone-700 italic font-serif mt-1">
                        &ldquo;{w.message}&rdquo;
                      </p>
                    )}
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {w.timestamp || "Doa Umat"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 06: Donation & Map Embed */}
            <section className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Tali Kasih */}
                <div>
                  <span className="text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider block mb-1">
                    {cms.donation.headingId || "Tali Kasih & Dana Kebajikan"}
                  </span>
                  <h4 className="text-xl font-bold text-[#7c1818] mb-2">
                    隨喜功德 • 廣種福田
                  </h4>
                  <p className="text-xs font-sans text-stone-600 leading-relaxed mb-4">
                    {cms.donation.descriptionId}
                  </p>

                  <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#dfba6d]/30 font-sans">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-200">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#9e7631]" />
                        {cms.donation.bankName}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {cms.donation.accountHolder}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-mono font-bold text-[#7c1818]">
                        {cms.donation.accountNumber}
                      </span>
                      <button
                        onClick={copyAccount}
                        className="px-2.5 py-1 rounded bg-white border border-[#dfba6d]/50 text-[11px] font-semibold text-stone-700 hover:bg-[#f6efe1] transition-colors flex items-center gap-1"
                      >
                        {copiedAccount ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                        {copiedAccount ? "Tersalin" : "Salin No. Rek"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Map Embed */}
                <div>
                  <span className="text-xs font-sans font-semibold text-[#9e7631] uppercase tracking-wider block mb-1">
                    Koordinat Lokasi Kuang Hang
                  </span>
                  <h4 className="text-xl font-bold text-[#7c1818] mb-2">
                    道場座標 • 交通指引
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-stone-200 h-44 bg-stone-100 mb-2">
                    <iframe
                      src={cms.location.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] font-sans text-stone-500 line-clamp-1">
                    {cms.location.fullAddress}
                  </p>
                </div>
              </div>
            </section>

            {/* Colophon & Return Top */}
            <footer className="text-center pt-6 pb-12 border-t border-stone-200 text-stone-500 font-sans text-xs">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-chinese font-bold text-[#7c1818] text-sm">廣航佛堂</span>
                <span>•</span>
                <span>成立二十週年堂慶紀念 (2006 — 2026)</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Palmerah, Jakarta Barat • Tian En Shi De (天恩師德)
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-[11px] text-stone-700 hover:bg-[#faf7f2] transition-colors"
              >
                <ArrowUp className="w-3 h-3 text-[#7c1818]" /> Kembali ke Atas
              </button>
            </footer>

          </main>
        </div>
      </div>

      {/* Gallery Modal Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#1c1815] rounded-2xl overflow-hidden border border-[#dfba6d]/40 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-80 sm:h-96 mb-3">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white font-sans">
              <h5 className="font-bold text-base font-serif text-amber-200">{activePhoto.title}</h5>
              <p className="font-chinese text-xs text-stone-300">{activePhoto.chineseTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Layout Template Switcher */}
      <VariationSwitcher />
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
