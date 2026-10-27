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
  Disc,
  MailOpen,
  Home,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import AudioPlayer from "@/components/AudioPlayer";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones, sortMilestonesByYear } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home5UndanganContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  // Cover opening state
  const [isOpened, setIsOpened] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Countdown
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
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  // Milestones (Story)
  const rawMilestones = cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const milestones = sortMilestonesByYear(rawMilestones);

  // RSVP
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

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setHasStartedAudio(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    if (rawTo && rawTo.trim()) {
      fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, has_opened: true }),
      }).catch(() => {});
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");
    if (!rsvpName.trim()) {
      setRsvpError("Mohon isi nama Anda");
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
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#7c1818", "#dfba6d", "#ffffff"],
          });
        }
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirimkan.");
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

  const bgImg = cms.cover.bgImage || "/images/guang-hang-15.jpg";

  return (
    <div className="min-h-screen bg-[#2c1212] text-[#2c1d1d] font-sans relative overflow-x-hidden">
      
      {/* Floating Audio Controller */}
      <AudioPlayer autoPlayTrigger={hasStartedAudio} />

      {/* ============================================================== */}
      {/* FULLSCREEN OPENING COVER (undanganonlineaja.com style)          */}
      {/* ============================================================== */}
      {!isOpened && (
        <aside
          aria-label="Cover Undangan"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0808] text-white text-center"
        >
          {/* Background image with blur & dark overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImg}
              alt="Cover Background"
              fill
              priority
              className="object-cover opacity-35 filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0808]/90 via-[#260c0c]/80 to-[#1a0808]/95" />
          </div>

          <div className="relative z-10 max-w-md w-full px-4 py-8 flex flex-col items-center">
            
            {/* Logo Guang Ji */}
            <div className="w-16 h-16 rounded-full border-2 border-[#dfba6d] p-1 bg-white/10 mb-4 shadow-lg">
              <Image
                src={cms.cover.logoImage || "/images/logo-guang-ji.png"}
                alt="Logo Guang Ji"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#dfba6d] mb-1 font-semibold">
              The 20th Anniversary
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1">
              Guang Hang Fo Thang
            </h1>
            <p className="text-sm font-chinese text-amber-200/90 mb-6">
              廣航佛堂 • 廿週年堂慶
            </p>

            {/* Guest Invitation Box */}
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-amber-300/30 p-5 mb-6 shadow-xl">
              <p className="text-xs uppercase tracking-wider text-stone-300 mb-1">
                Dear :
              </p>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300">
                {guestName}
              </h2>
              <p className="text-xs text-stone-200 mt-2">
                You Are Invited! Mengundang semua yang turut mewarnai perjalanan Kuang Hang.
              </p>
            </div>

            {/* Open Invitation Button */}
            <button
              onClick={handleOpenInvitation}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b38638] via-[#dfba6d] to-[#b38638] hover:from-[#c59847] hover:to-[#c59847] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <MailOpen className="w-4 h-4" />
              <span>Open Invitation</span>
            </button>

            <span className="text-[11px] font-mono text-stone-400 mt-6">
              Sabtu, 14 November 2026 • Palmerah
            </span>
          </div>
        </aside>
      )}

      {/* ============================================================== */}
      {/* MAIN LAYOUT: DESKTOP SPLIT SCREEN + MOBILE FRAME               */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: Sticky Desktop Visual Panel                       */}
        {/* ============================================================== */}
        <aside className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen relative flex-col justify-between p-12 text-white bg-[#1a0808] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImg}
              alt="Guang Hang Altar"
              fill
              priority
              className="object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0808]/90 via-[#260c0c]/80 to-[#1a0808]/95" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full border border-amber-400 p-1 bg-white/10">
                <Image
                  src={cms.cover.logoImage || "/images/logo-guang-ji.png"}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#dfba6d] font-bold block">
                  Peringatan 20 Tahun Gedung
                </span>
                <span className="font-chinese font-bold text-xl text-white">
                  廣航佛堂 廿週年堂慶
                </span>
              </div>
            </div>

            <h2 className="text-4xl xl:text-5xl font-serif font-bold leading-tight mb-4 text-amber-100">
              Anniversary Guang Hang Fo Thang
            </h2>
            <p className="text-base text-stone-300 italic font-serif max-w-md leading-relaxed">
              &ldquo;{cms.hero.quoteId}&rdquo;
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-amber-500/30 flex items-center justify-between text-xs text-stone-300 font-mono">
            <div>
              <span className="text-amber-400 font-bold block">14 November 2026</span>
              <span>Kuang Hang Fo Thang, Palmerah</span>
            </div>
            <div className="font-chinese text-amber-300/80">
              天恩師德 • 薪火相傳
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Scrollable Mobile-First Invitation Stream         */}
        {/* ============================================================== */}
        <div className="w-full lg:w-1/2 bg-[#faf7f2] min-h-screen text-[#221c17] relative pb-28">
          
          {/* Top Bar for Language Toggle */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-30">
            <span className="text-xs font-serif font-bold text-[#7c1818] uppercase tracking-wider">
              20 Tahun Guang Hang Fo Thang
            </span>
            <div className="flex items-center bg-[#f0eae0] p-0.5 rounded-full border border-stone-300 text-[11px] font-sans">
              {(["all", "id", "zh"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setLang(m)}
                  className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                    lang === m ? "bg-[#7c1818] text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-10 max-w-xl mx-auto">
            
            {/* Hero Card */}
            <div id="home-sec" className="text-center pt-2">
              <span className="text-xs uppercase tracking-widest text-[#9e7631] font-bold block mb-1">
                Undangan Resmi
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#7c1818] mb-1">
                Anniversary Guang Hang
              </h2>
              <p className="text-xs text-stone-600 font-mono mb-4">
                Sabtu, 14 November 2026
              </p>

              {/* Cover Photo */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-stone-200 shadow-md mb-6">
                <Image
                  src={bgImg}
                  alt="Altar Guang Hang"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Dear Guest Message */}
              <div className="p-4 rounded-xl bg-white border border-[#dfba6d]/40 shadow-xs mb-6 text-center">
                <span className="text-xs text-stone-500 uppercase tracking-wider block mb-0.5">
                  Kepada Yth :
                </span>
                <div className="text-xl font-bold font-serif text-[#7c1818]">
                  {guestName}
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Mengundang semua yang turut mewarnai perjalanan Kuang Hang.
                </p>
              </div>

              {/* Countdown Widget */}
              <div className="p-6 rounded-2xl bg-[#7c1818] text-white shadow-lg">
                <h3 className="text-sm uppercase tracking-widest text-amber-300 font-bold mb-3">
                  Hitung Mundur Acara
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Hari", val: timeLeft.days },
                    { label: "Jam", val: timeLeft.hours },
                    { label: "Menit", val: timeLeft.minutes },
                    { label: "Detik", val: timeLeft.seconds },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/10 border border-white/20">
                      <span className="text-2xl font-bold font-mono text-amber-200 block leading-none">
                        {String(item.val).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase text-stone-300 mt-1 block">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4" /> Save The Date
                </a>
              </div>
            </div>

            {/* Acara Section */}
            <div id="acara-sec" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 text-center">
              <span className="text-xs font-bold text-[#9e7631] uppercase tracking-widest block">
                Detail Acara
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#7c1818]">
                Sabtu, 14 November 2026
              </h3>
              <p className="text-sm font-semibold text-stone-800">
                Pukul: 19.00 WIB s/d Selesai
              </p>
              <div className="w-12 h-px bg-stone-200 mx-auto" />
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-900">{cms.event.venueNameId}</p>
                <p>{cms.event.address}</p>
                <p className="text-stone-500 italic mt-2">Dress code: {cms.event.dresscodeId}</p>
              </div>

              <div className="pt-2">
                <a
                  href={cms.event.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#7c1818] hover:bg-[#681313] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
                </a>
              </div>
            </div>

            {/* Story / Sejarah Section */}
            <div id="story-sec" className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#9e7631] uppercase tracking-widest block">
                  Perjalanan Jejak Langkah
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#7c1818]">
                  Story of Guang Hang
                </h3>
              </div>

              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7c1818]/10 text-[#7c1818] font-mono text-xs font-bold">
                        {m.year}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {m.location || "Jakarta Barat"}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-stone-900 font-serif">
                      {m.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {m.description}
                    </p>
                    {m.image && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-stone-100 mt-2">
                        <Image src={m.image} alt={m.title} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Our Gallery Section */}
            <div id="gallery-sec" className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#9e7631] uppercase tracking-widest block">
                  Dokumentasi
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#7c1818]">
                  Our Gallery
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {allGallery.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(photo)}
                    className="relative h-32 rounded-xl overflow-hidden border border-stone-200 cursor-pointer shadow-xs"
                  >
                    <Image src={photo.src} alt={photo.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Amplop Digital / Tali Kasih */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold text-[#9e7631] uppercase tracking-widest block">
                Tali Kasih
              </span>
              <h3 className="text-xl font-serif font-bold text-[#7c1818]">
                Dana Kebajikan & Tali Kasih
              </h3>
              <p className="text-xs text-stone-600">
                {cms.donation.descriptionId}
              </p>

              <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#dfba6d]/40">
                <div className="text-xs font-bold text-stone-700 mb-1">
                  {cms.donation.bankName} - {cms.donation.accountHolder}
                </div>
                <div className="text-lg font-mono font-bold text-[#7c1818] mb-3">
                  {cms.donation.accountNumber}
                </div>
                <button
                  onClick={copyBank}
                  className="px-4 py-1.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-white text-xs font-bold"
                >
                  {copiedBank ? "✓ Tersalin" : "Salin No. Rekening"}
                </button>
              </div>
            </div>

            {/* RSVP Section (undanganonline style) */}
            <div id="rsvp-sec" className="p-6 rounded-2xl bg-white border-2 border-[#7c1818]/30 shadow-md space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#9e7631] uppercase tracking-widest block">
                  Konfirmasi Kehadiran
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#7c1818]">
                  RSVP & Wish
                </h3>
              </div>

              <form onSubmit={handleRsvpSubmit} className="space-y-3 text-xs">
                {submitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800">
                    <Check className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    <p className="font-bold">Terima kasih atas konfirmasi Anda!</p>
                  </div>
                ) : (
                  <>
                    {rsvpError && (
                      <p className="p-2 rounded bg-red-50 text-red-700 text-xs">{rsvpError}</p>
                    )}

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Kehadiran</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpStatus("hadir")}
                          className={`py-2 rounded-lg border font-bold text-xs ${
                            rsvpStatus === "hadir"
                              ? "bg-[#7c1818] text-white border-[#7c1818]"
                              : "bg-white text-stone-600 border-stone-200"
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus("ragu")}
                          className={`py-2 rounded-lg border font-bold text-xs ${
                            rsvpStatus === "ragu"
                              ? "bg-[#7c1818] text-white border-[#7c1818]"
                              : "bg-white text-stone-600 border-stone-200"
                          }`}
                        >
                          Masih Ragu
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus("tidak_hadir")}
                          className={`py-2 rounded-lg border font-bold text-xs ${
                            rsvpStatus === "tidak_hadir"
                              ? "bg-[#7c1818] text-white border-[#7c1818]"
                              : "bg-white text-stone-600 border-stone-200"
                          }`}
                        >
                          Tidak Hadir
                        </button>
                      </div>
                    </div>

                    {rsvpStatus === "hadir" && (
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">Jumlah Hadir</label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n} Orang</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Ucapan & Doa</label>
                      <textarea
                        rows={3}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Tulis ucapan selamat & doa..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-lg bg-[#7c1818] hover:bg-[#681313] text-white font-bold text-xs uppercase"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim"}
                    </button>
                  </>
                )}
              </form>

              {/* Wish Comments Feed */}
              <div className="space-y-2 pt-4 border-t border-stone-100 max-h-60 overflow-y-auto pr-1">
                {wishes.slice(0, 6).map((w, idx) => (
                  <div key={w.id || idx} className="p-3 rounded-lg bg-[#faf7f2] border border-stone-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-stone-800">
                      <span>{w.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{w.status}</span>
                    </div>
                    {w.message && <p className="text-stone-600 mt-1 italic">&ldquo;{w.message}&rdquo;</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Closing Thank You */}
            <div className="text-center py-6 text-xs text-stone-500">
              <h4 className="text-lg font-serif font-bold text-[#7c1818] mb-1">
                Terima Kasih
              </h4>
              <p>Anniversary Guang Hang • 14 November 2026</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Hope to see you soon, stay safe and healthy!
              </p>
            </div>

          </div>

          {/* Sticky Bottom Navigation Bar (Mobile / Right Column) */}
          <div className="fixed bottom-0 inset-x-0 lg:left-auto lg:w-1/2 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-4 flex items-center justify-around z-40 text-stone-600">
            <a href="#home-sec" className="flex flex-col items-center gap-0.5 hover:text-[#7c1818] text-[10px]">
              <Home className="w-4 h-4" /> Home
            </a>
            <a href="#acara-sec" className="flex flex-col items-center gap-0.5 hover:text-[#7c1818] text-[10px]">
              <Calendar className="w-4 h-4" /> Acara
            </a>
            <a href="#story-sec" className="flex flex-col items-center gap-0.5 hover:text-[#7c1818] text-[10px]">
              <BookOpen className="w-4 h-4" /> Story
            </a>
            <a href="#gallery-sec" className="flex flex-col items-center gap-0.5 hover:text-[#7c1818] text-[10px]">
              <ImageIcon className="w-4 h-4" /> Gallery
            </a>
            <a href="#rsvp-sec" className="flex flex-col items-center gap-0.5 text-[#7c1818] font-bold text-[10px]">
              <MessageSquare className="w-4 h-4" /> RSVP
            </a>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden p-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-72 mb-2">
              <Image src={activePhoto.src} alt={activePhoto.title} fill className="object-contain" />
            </div>
            <p className="text-center font-bold text-xs text-stone-800">{activePhoto.title}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Home5Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#2c1212] text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#dfba6d] border-t-transparent animate-spin" />
            <span className="text-xs">Memuat Undangan Online...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home5UndanganContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
