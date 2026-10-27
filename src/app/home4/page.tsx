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
  Bookmark,
  Share2,
  Menu,
  Heart,
  Navigation,
  MessageSquare,
  History,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home4MaterialContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  // Active section for Material navigation
  const [activeNav, setActiveNav] = useState("hero");

  // Target countdown
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
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredGallery =
    galleryFilter === "all" ? allGallery : allGallery.filter((item) => item.category === galleryFilter);

  // Milestones
  const milestones = cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const currentMilestone = milestones[milestoneIndex] || milestones[0];

  // RSVP Form
  const [rsvpName, setRsvpName] = useState(guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName);
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "ragu" | "tidak_hadir">("hadir");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpMessage, setRsvpMessage] = useState("");
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

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

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
    if (!rsvpName.trim()) {
      setRsvpError(showId ? "Nama lengkap wajib diisi." : "請填寫姓名。");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName.trim(),
          status: rsvpStatus === "ragu" ? "tidak_hadir" : rsvpStatus,
          guests: rsvpStatus === "hadir" ? parseInt(rsvpGuests, 10) || 1 : 0,
          message: rsvpMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (rsvpStatus === "hadir") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#b3261e", "#ffdad6", "#ffd700"],
          });
        }
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
    <div className="min-h-screen bg-[#fef7f6] text-[#1d1b1a] font-sans selection:bg-[#ffdad6] selection:text-[#410002] pb-24">
      
      {/* Material 3 Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#fef7f6]/95 backdrop-blur-md border-b border-[#f3dddb] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#410002] flex items-center justify-center font-bold font-chinese text-lg shadow-xs">
              航
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#1d1b1a] tracking-tight">
                {cms.cover.titleZh || "廣航佛堂"} • 20th Anniversary
              </h1>
              <p className="text-[11px] text-[#765654] font-medium">
                Peringatan 20 Tahun Gedung (2006 — 2026)
              </p>
            </div>
          </div>

          {/* M3 Segmented Language Switcher */}
          <div className="inline-flex rounded-full border border-[#857371]/30 p-1 bg-[#fff8f7]">
            {(["all", "id", "zh"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setLang(m)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === m
                    ? "bg-[#8c1d18] text-white shadow-xs"
                    : "text-[#494544] hover:bg-[#f5ddda]"
                }`}
              >
                {m === "all" ? "Bilingual" : m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============================================================== */}
        {/* HERO: Material 3 Tonal Card with Elevated Surface               */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-[#ffffff] border border-[#f3dddb] p-6 sm:p-10 shadow-[0_4px_24px_rgba(140,29,24,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#ffdad6]/60 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* M3 Assist Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdad6] text-[#410002] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8c1d18]" />
            <span>Undangan Resmi • 官方敬邀</span>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#1d1b1a] tracking-tight mb-2">
              {cms.hero.mainTitleId}
            </h2>
            <h3 className="text-lg sm:text-xl font-chinese text-[#8c1d18] font-semibold mb-6">
              {cms.hero.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
            </h3>

            {/* M3 Elevated Tamu Container */}
            <div className="rounded-2xl bg-[#fef2f1] border border-[#f9d7d4] p-5 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#765654] block mb-1">
                Yth. Tamu Undangan / 貴賓尊鑒:
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#8c1d18] font-serif">
                {guestName}
              </div>
              <p className="text-xs sm:text-sm text-[#494544] mt-2 leading-relaxed">
                Merupakan sukacita dan kehormatan besar bagi kami menyambut kehadiran Bapak/Ibu/Saudara/i dalam Malam Syukur 20 Tahun Kuang Hang Fo Thang.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#494544] italic border-l-3 border-[#8c1d18] pl-3 py-1 mb-8">
              &ldquo;{cms.hero.quoteId}&rdquo;
            </p>

            {/* M3 Countdown Pill Grid */}
            <div className="rounded-2xl bg-[#fff8f7] border border-[#f3dddb] p-4 sm:p-6 mb-8">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#765654] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8c1d18]" /> Hitung Mundur Waktu Acara
                </span>
                <span>Sabtu, 14 Nov 2026</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 text-center">
                {[
                  { label: "Hari", val: timeLeft.days },
                  { label: "Jam", val: timeLeft.hours },
                  { label: "Menit", val: timeLeft.minutes },
                  { label: "Detik", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#f3dddb] shadow-xs">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#8c1d18] block leading-none font-mono">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#765654] mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* M3 Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#rsvp"
                className="px-6 py-3 rounded-full bg-[#8c1d18] hover:bg-[#721511] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                Konfirmasi Kehadiran (RSVP)
              </a>
              <a
                href="#agenda"
                className="px-5 py-3 rounded-full bg-[#fceae8] hover:bg-[#f8dedc] text-[#8c1d18] font-bold text-xs transition-colors"
              >
                Jadwal & Lokasi
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: Material 3 Cards for Agenda & Protocol                */}
        {/* ============================================================== */}
        <section id="agenda" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Waktu */}
          <div className="rounded-3xl bg-white border border-[#f3dddb] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8c1d18] uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Hari & Tanggal Pelaksanaan</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1d1b1a] mb-1">
                {cms.event.dateTextId}
              </h3>
              {showZh && (
                <div className="text-xs font-chinese text-[#765654] mb-3">
                  {cms.event.dateTextZh}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-[#494544] py-2 border-t border-[#f3dddb]">
                <Clock className="w-4 h-4 text-[#8c1d18] shrink-0" />
                <span>{cms.event.timeTextId} ({cms.event.timeNotesId})</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f3dddb]">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#8c1d18] hover:bg-[#721511] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Simpan di Google Calendar
              </a>
            </div>
          </div>

          {/* Card 2: Lokasi & Busana */}
          <div className="rounded-3xl bg-white border border-[#f3dddb] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8c1d18] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Tempat Acara & Dress Code</span>
              </div>
              <h3 className="text-lg font-bold text-[#1d1b1a] mb-1">
                {cms.event.venueNameId}
              </h3>
              <p className="text-xs text-[#494544] leading-relaxed mb-4">
                {cms.event.address}
              </p>

              <div className="p-3 rounded-2xl bg-[#fef2f1] border border-[#f9d7d4] flex items-start gap-2.5 text-xs text-[#494544]">
                <Shirt className="w-4 h-4 text-[#8c1d18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1d1b1a] block">
                    Dress Code: {cms.event.dresscodeId}
                  </span>
                  <span className="text-[11px] text-[#765654]">{cms.event.dresscodeNotesId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f3dddb] flex items-center gap-2">
              <button
                onClick={copyAddress}
                className="px-4 py-2 rounded-full border border-[#857371]/40 text-xs font-semibold text-[#1d1b1a] hover:bg-[#fef2f1] transition-colors"
              >
                {copiedAddress ? "✓ Tersalin" : "Salin Alamat"}
              </button>
              <a
                href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-[#8c1d18] hover:bg-[#fceae8] transition-colors inline-flex items-center gap-1"
              >
                Peta Google <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* SECTION: Wejangan Suci Maotian Shixiong                         */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-[#fff8f7] border border-[#f3dddb] p-6 sm:p-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#8c1d18] flex items-center justify-center mx-auto mb-3">
              <Flame className="w-5 h-5 text-[#8c1d18]" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#ffdad6] text-[#410002] text-xs font-chinese font-bold mb-2">
              {cms.wisdom.sealZh || "茂田師兄慈悲勉勵"}
            </span>
            <h3 className="text-2xl font-bold font-serif text-[#1d1b1a] mb-1">
              {cms.wisdom.headingId || "Untaian Wejangan Kebijaksanaan"}
            </h3>
            <span className="text-xs text-[#765654] uppercase tracking-wider block mb-4">
              {cms.wisdom.subheadingId}
            </span>

            <blockquote className="text-base sm:text-xl text-[#1d1b1a] leading-relaxed italic mb-4">
              &ldquo;{cms.wisdom.quoteId}&rdquo;
            </blockquote>
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-[#8c1d18] mb-4">
                {cms.wisdom.quoteZh}
              </p>
            )}
            <p className="text-xs text-[#765654] font-medium pt-3 border-t border-[#f3dddb]">
              {cms.wisdom.closingId}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: Milestones (M3 Interactive Filter Chips)              */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-white border border-[#f3dddb] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-[#f3dddb] gap-2">
            <div>
              <span className="text-xs font-bold text-[#8c1d18] uppercase tracking-wider block">
                Napak Tilas 20 Tahun (1997 — 2026)
              </span>
              <h3 className="text-2xl font-bold text-[#1d1b1a]">
                歲月印記 • 薪火相傳
              </h3>
            </div>

            {/* M3 Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {milestones.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setMilestoneIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    milestoneIndex === idx
                      ? "bg-[#8c1d18] text-white shadow-xs"
                      : "bg-[#fef2f1] text-[#494544] hover:bg-[#fceae8]"
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </div>

          {currentMilestone && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#fef7f6] p-6 rounded-2xl border border-[#f3dddb]">
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-bold text-[#8c1d18] uppercase tracking-wider block">
                  Tahun {currentMilestone.year} • {currentMilestone.location}
                </span>
                <h4 className="text-2xl font-bold font-serif text-[#1d1b1a]">
                  {currentMilestone.title}
                </h4>
                <span className="font-chinese text-sm text-[#765654] block">
                  {currentMilestone.chineseTitle}
                </span>
                <p className="text-xs sm:text-sm text-[#494544] leading-relaxed">
                  {showId && currentMilestone.description}
                  {showId && showZh && " "}
                  {showZh && (
                    <span className="font-chinese block text-[#765654] mt-1">
                      {currentMilestone.chineseDescription}
                    </span>
                  )}
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#f3dddb] text-xs text-[#1d1b1a] italic">
                  &ldquo;{currentMilestone.highlight}&rdquo;
                </div>
              </div>

              <div className="md:col-span-5">
                {currentMilestone.image ? (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#f3dddb]">
                    <Image
                      src={currentMilestone.image}
                      alt={currentMilestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-56 rounded-2xl bg-[#f5ddda] flex items-center justify-center text-xs text-[#765654]">
                    Foto Arsip
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SECTION: Gallery with M3 Filter Chips                          */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-white border border-[#f3dddb] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-[#f3dddb] gap-2">
            <div>
              <span className="text-xs font-bold text-[#8c1d18] uppercase tracking-wider block">
                Galeri Visual Dua Dasawarsa
              </span>
              <h3 className="text-2xl font-bold text-[#1d1b1a]">
                歲月長廊 • 影像典藏
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(["all", "sejarah", "kegiatan", "kebersamaan"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3 py-1 rounded-full capitalize font-semibold transition-all ${
                    galleryFilter === cat
                      ? "bg-[#8c1d18] text-white shadow-xs"
                      : "bg-[#fef2f1] text-[#494544] hover:bg-[#fceae8]"
                  }`}
                >
                  {cat === "all" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredGallery.slice(0, 8).map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative h-36 rounded-2xl overflow-hidden border border-[#f3dddb] cursor-pointer"
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
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: M3 RSVP Portal with Segmented Buttons                 */}
        {/* ============================================================== */}
        <section id="rsvp" className="rounded-3xl bg-white border-2 border-[#8c1d18]/40 p-6 sm:p-10 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#ffdad6] text-[#410002] text-xs font-bold uppercase mb-2">
              Konfirmasi Digital • 出席登記
            </span>
            <h3 className="text-3xl font-bold font-serif text-[#1d1b1a]">
              Buku Tamu & Untaian Doa
            </h3>
            <p className="text-xs text-[#765654] mt-1">
              Mohon berkenan mengonfirmasi kehadiran serta menitipkan doa restu Anda untuk wadah Kuang Hang Fo Thang.
            </p>

            {/* M3 Stat Badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 max-w-md mx-auto text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-[#fef2f1] border border-[#f9d7d4]">
                <span className="text-[#8c1d18] font-extrabold text-base block">{summary.totalResponses}</span>
                <span className="text-[10px] text-[#765654] uppercase">Total Doa</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#fef2f1] border border-[#f9d7d4]">
                <span className="text-emerald-700 font-extrabold text-base block">{summary.attending}</span>
                <span className="text-[10px] text-[#765654] uppercase">Pasti Hadir</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#fef2f1] border border-[#f9d7d4]">
                <span className="text-[#8c1d18] font-extrabold text-base block">{summary.totalGuests}</span>
                <span className="text-[10px] text-[#765654] uppercase">Total Jiwa</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleRsvpSubmit} className="max-w-xl mx-auto bg-[#fef7f6] p-6 sm:p-8 rounded-3xl border border-[#f3dddb] text-xs space-y-4">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#8c1d18] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold font-serif text-[#1d1b1a] mb-1">
                  Konfirmasi Anda Berhasil Tercatat
                </h4>
                <p className="text-xs text-[#765654] mb-4">
                  Terima kasih atas doa restu dan kepastian kehadiran Anda.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-full bg-white border border-[#857371]/40 text-xs font-bold text-[#1d1b1a] hover:bg-[#fef2f1]"
                >
                  Kirim Respon Lain
                </button>
              </div>
            ) : (
              <>
                {rsvpError && (
                  <div className="p-3 rounded-2xl bg-[#ffdad6] text-[#410002] font-semibold text-xs">
                    {rsvpError}
                  </div>
                )}

                {/* M3 Outlined Text Field */}
                <div>
                  <label className="block text-xs font-bold text-[#1d1b1a] mb-1">
                    Nama Lengkap / 姓名 <span className="text-[#8c1d18]">*</span>
                  </label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Contoh: Lim TC / Bpk. David & Kel."
                    className="w-full px-4 py-3 rounded-2xl border border-[#857371]/50 bg-white text-[#1d1b1a] focus:border-[#8c1d18] focus:ring-1 focus:ring-[#8c1d18] outline-hidden text-xs"
                    required
                  />
                </div>

                {/* M3 Segmented Buttons */}
                <div>
                  <label className="block text-xs font-bold text-[#1d1b1a] mb-1.5">
                    Status Kehadiran / 出席狀況 <span className="text-[#8c1d18]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white border border-[#857371]/30">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("hadir")}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        rsvpStatus === "hadir"
                          ? "bg-[#ffdad6] text-[#410002] shadow-xs"
                          : "text-[#494544] hover:bg-[#fef2f1]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("ragu")}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        rsvpStatus === "ragu"
                          ? "bg-[#ffdad6] text-[#410002] shadow-xs"
                          : "text-[#494544] hover:bg-[#fef2f1]"
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Ragu
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("tidak_hadir")}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        rsvpStatus === "tidak_hadir"
                          ? "bg-[#ffdad6] text-[#410002] shadow-xs"
                          : "text-[#494544] hover:bg-[#fef2f1]"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-stone-500" /> Izin
                    </button>
                  </div>
                </div>

                {rsvpStatus === "hadir" && (
                  <div>
                    <label className="block text-xs font-bold text-[#1d1b1a] mb-1">
                      Jumlah Hadir (Termasuk Anda) / 出席人數
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[#857371]/50 bg-white text-[#1d1b1a] outline-hidden text-xs font-mono"
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
                  <label className="block text-xs font-bold text-[#1d1b1a] mb-1">
                    Untaian Doa & Pesan / 祝福留言
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan bait doa dan kenangan indah Anda..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#857371]/50 bg-white text-[#1d1b1a] focus:border-[#8c1d18] focus:ring-1 focus:ring-[#8c1d18] outline-hidden text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#8c1d18] hover:bg-[#721511] text-white font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Mengirim Data..." : "Kirim Konfirmasi & Doa"}
                </button>
              </>
            )}
          </form>

          {/* Live Wish Stream */}
          <div className="mt-8 space-y-2.5 max-w-xl mx-auto max-h-72 overflow-y-auto pr-1">
            {wishes.slice(0, 8).map((w, idx) => (
              <div
                key={w.id || idx}
                className="p-3.5 rounded-2xl bg-[#fef7f6] border border-[#f3dddb] text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#1d1b1a] font-serif">{w.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      w.status === "hadir"
                        ? "bg-[#ffdad6] text-[#410002]"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {w.status === "hadir" ? "Pasti Hadir" : "Doa Restu"}
                  </span>
                </div>
                {w.message && (
                  <p className="text-[#494544] italic font-serif">
                    &ldquo;{w.message}&rdquo;
                  </p>
                )}
                <span className="text-[10px] text-[#765654] mt-1 block font-mono">
                  {w.timestamp || "Doa Umat"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION: Tali Kasih & Map                                      */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-white border border-[#f3dddb] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <span className="text-xs font-bold text-[#8c1d18] uppercase tracking-wider block mb-1">
                Tali Kasih & Dana Kebajikan
              </span>
              <h4 className="text-xl font-bold font-chinese text-[#1d1b1a] mb-2">
                隨喜功德 • 廣種福田
              </h4>
              <p className="text-xs text-[#494544] leading-relaxed mb-4">
                {cms.donation.descriptionId}
              </p>

              <div className="p-4 rounded-2xl bg-[#fef2f1] border border-[#f9d7d4]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#f3dddb] text-xs">
                  <span className="font-bold text-[#1d1b1a] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#8c1d18]" />
                    {cms.donation.bankName}
                  </span>
                  <span className="text-[#765654] text-[11px]">
                    {cms.donation.accountHolder}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-[#8c1d18]">
                    {cms.donation.accountNumber}
                  </span>
                  <button
                    onClick={copyAccount}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#857371]/30 text-xs font-semibold hover:bg-[#fceae8] transition-colors"
                  >
                    {copiedAccount ? "✓ Tersalin" : "Salin Rekening"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#8c1d18] uppercase tracking-wider block mb-1">
                Koordinat Lokasi Kuang Hang
              </span>
              <h4 className="text-xl font-bold font-chinese text-[#1d1b1a] mb-2">
                道場座標 • 會場交通
              </h4>
              <div className="rounded-2xl overflow-hidden border border-[#f3dddb] h-44 bg-stone-100 mb-2">
                <iframe
                  src={cms.location.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-[#765654] font-medium">
                {cms.location.fullAddress}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-[#f3dddb] text-xs text-[#765654]">
          <div className="flex items-center justify-center gap-2 text-[#1d1b1a] font-bold mb-1">
            <span className="font-chinese text-sm text-[#8c1d18]">廣航佛堂</span>
            <span>•</span>
            <span>落成廿週年堂慶紀念 (2006 — 2026)</span>
          </div>
          <p className="text-[11px] text-[#765654] mb-3">
            Palmerah, Jakarta Barat • Material 3 Design
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white border border-[#f3dddb] text-xs font-bold text-[#8c1d18] hover:bg-[#fef2f1] shadow-2xs"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Kembali ke Atas
          </button>
        </footer>

      </main>

      {/* Material 3 Floating Action Button (FAB) for RSVP */}
      <a
        href="#rsvp"
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-[#8c1d18] hover:bg-[#721511] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 transition-transform active:scale-95 group"
      >
        <Send className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span>RSVP</span>
      </a>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-80 sm:h-96 mb-3">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h5 className="font-bold text-base text-[#1d1b1a]">{activePhoto.title}</h5>
              <p className="font-chinese text-xs text-[#765654]">{activePhoto.chineseTitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home4Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fef7f6] text-[#8c1d18] font-sans">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-3 border-[#8c1d18] border-t-transparent animate-spin" />
            <span className="text-xs font-bold">Memuat Material Design...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home4MaterialContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
