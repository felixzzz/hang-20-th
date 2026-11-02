"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
  ChevronLeft,
  Maximize2,
  X,
  CreditCard,
  ArrowUp,
  Bookmark,
  Share2,
  Compass,
  Feather,
  ScrollText,
  Copy,
  CheckCheck,
  Heart,
  Award,
  Music2,
  Navigation,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { Milestone, extractYearNumber, sortMilestonesByYear, historyMilestones } from "@/data/history";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { galleryItems } from "@/data/gallery";
import { GalleryPhotoItem } from "@/types/cms";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Organic acoustic singing bowl chime via Web Audio API
const playSacredChime = (tone: "high" | "deep" | "blessing" = "deep") => {
  try {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const freqConfigs = {
      deep: [261.63, 523.25, 784.88, 1046.5], // C4 Tibetan singing bowl
      high: [440.0, 880.0, 1320.0, 1760.0],  // A4 Temple chime
      blessing: [329.63, 659.25, 987.77, 1318.5], // E4 Golden resonance
    };

    const freqs = freqConfigs[tone];
    const gains = [0.14, 0.06, 0.03, 0.015];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gains[idx], ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.4);
    });
  } catch (e) {
    // Non-blocking fallback
  }
};

function Page11MonographContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const { cms } = useCms();
  const { lang, setLang, showId, showZh } = useLanguage();

  const defaultGuestName = cms.cover.defaultGuestName || "Bapak / Ibu / Saudara/i";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : defaultGuestName;

  // Gatefold & Ambiance states
  const [isFolioOpen, setIsFolioOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const playerRef = useRef<any>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Gallery Modal
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>("all");

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState(guestName === defaultGuestName ? "" : guestName);
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "ragu" | "tidak">("hadir");
  const [rsvpGuests, setRsvpGuests] = useState<number>(1);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Live Wishes State
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [wishesSummary, setWishesSummary] = useState({
    totalResponses: initialWishes.length,
    attending: initialWishes.filter((w) => w.status === "hadir").length,
    totalGuests: initialWishes
      .filter((w) => w.status === "hadir")
      .reduce((sum, w) => sum + (w.guests || 1), 0),
  });

  // Clipboard Copied States
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Initialize YouTube background player quietly
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;
      const videoId = cms.audio?.youtubeVideoId || "__vWA6Lv9pE";
      playerRef.current = new window.YT.Player("youtube-hidden-player-page11", {
        height: "1",
        width: "1",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          rel: 0,
        },
        events: {
          onReady: () => setIsAudioLoaded(true),
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [cms.audio?.youtubeVideoId]);

  // Audio Play / Pause toggle
  const toggleAudio = () => {
    if (!playerRef.current) return;
    try {
      if (isPlayingAudio) {
        playerRef.current.pauseVideo();
        setIsPlayingAudio(false);
      } else {
        playerRef.current.playVideo();
        setIsPlayingAudio(true);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Open Folio Action
  const handleOpenFolio = () => {
    playSacredChime("deep");
    setIsFolioOpen(true);
    // Start ambient music gently if user opened
    if (playerRef.current && isAudioLoaded) {
      try {
        playerRef.current.playVideo();
        setIsPlayingAudio(true);
      } catch (e) {}
    }

    // Record guest opening
    if (rawTo && rawTo.trim()) {
      fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, has_opened: true }),
      }).catch(() => {});
    }
  };

  // Countdown timer
  useEffect(() => {
    const target = new Date(cms.hero?.countdownDate || "2026-11-14T19:00:00+07:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cms.hero?.countdownDate]);

  // Fetch real RSVP data
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

  // Handle RSVP Submit
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");
    if (!rsvpName.trim()) {
      setRsvpError(showId ? "Mohon cantumkan nama kehormatan Anda." : "請填寫您的尊姓大名。");
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
          guests: rsvpStatus === "hadir" ? rsvpGuests : 0,
          message: rsvpMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvpSubmitted(true);
        playSacredChime("blessing");
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#C5983A", "#7C1818", "#E6C275", "#FBF9F5"],
        });
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setWishesSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "Gagal mengirimkan konfirmasi.");
      }
    } catch {
      setRsvpError("Terjadi kendala jaringan. Mohon coba sesaat lagi.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const copyAddress = () => {
    const addr = cms.event?.address || "Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2400);
  };

  const copyAccount = () => {
    if (cms.donation?.accountNumber) {
      navigator.clipboard.writeText(cms.donation.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2400);
    }
  };

  const shareMonograph = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: "20 Tahun Guang Hang Fo Thang (廣航佛堂 廿週年堂慶大典)",
        text: `Undangan Resmi 20 Tahun Guang Hang Fo Thang untuk ${guestName}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2400);
    }
  };

  // Milestones sorted chronologically
  const activeMilestones: Milestone[] = sortMilestonesByYear(
    cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones
  );

  // Gallery items with fallback
  const allGalleryPhotos = (cms.gallery && cms.gallery.length > 0 ? cms.gallery : galleryItems) as GalleryPhotoItem[];
  const filteredGallery = activeGalleryFilter === "all"
    ? allGalleryPhotos
    : allGalleryPhotos.filter((p) => p.category === activeGalleryFilter);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(cms.event?.address || "Jl. Palmerah Utara III No. 186A, Jakarta Barat")}`;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1816] font-serif selection:bg-[#E6C275]/40 selection:text-[#7C1818] relative overflow-x-hidden">
      
      {/* Hidden YouTube Audio Iframe */}
      <div id="youtube-hidden-player-page11" className="sr-only pointer-events-none" />

      {/* =========================================================================
          1. SACRED CEREMONIAL FOLIO OVERLAY (ENTRANCE GATEFOLD SCROLL)
          ========================================================================= */}
      <AnimatePresence>
        {!isFolioOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#100707] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#240C0C] via-[#120505] to-[#0A0303]"
          >
            {/* Ambient Background Gold Patina */}
            <div className="absolute inset-0 bg-[radial-gradient(#C5983A_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            {/* The Ceremonial Folio Slipcase */}
            <div className="relative w-full max-w-xl mx-auto rounded-none border border-[#C5983A]/30 bg-[#1A0A0A] p-7 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-center text-[#FBF5E8] overflow-hidden">
              {/* Hairline Outer Frame Rules */}
              <div className="absolute inset-2 border border-[#C5983A]/20 pointer-events-none" />
              <div className="absolute inset-4 border border-[#C5983A]/10 pointer-events-none" />

              {/* Museum Accession Header */}
              <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5983A]/70 mb-8 border-b border-[#C5983A]/20 pb-3">
                <span>廣航典藏 • NO. 020</span>
                <span>COMMEMORATIVE MONOGRAPH</span>
                <span>2006 — 2026</span>
              </div>

              {/* Embossed Vermilion Imperial Seal */}
              <div className="inline-flex flex-col items-center justify-center mb-6">
                <div
                  onClick={() => playSacredChime("high")}
                  className="cursor-pointer group relative w-20 h-20 rounded-sm border-2 border-[#E6C275] bg-[#7C1818] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),0_8px_20px_rgba(124,24,24,0.5)] flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105 active:scale-95"
                >
                  <span className="font-chinese text-2xl font-bold text-[#FDF9F0] writing-vertical-rl tracking-widest drop-shadow-sm">
                    天恩師德
                  </span>
                  <div className="absolute -bottom-1 -right-1 text-[8px] font-sans uppercase tracking-widest text-[#E6C275]/80">
                    印
                  </div>
                </div>
                <span className="text-[11px] font-chinese text-[#E6C275]/75 mt-2.5 tracking-wider">
                  廣航佛堂 • 廿週年堂慶紀念
                </span>
              </div>

              {/* Title & Archival Inscription */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#FAF5E9] mb-2">
                廣航佛堂廿週年堂慶大典
              </h1>
              <p className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-[#E6C275]/80 mb-6">
                Peringatan 20 Tahun Peresmian Gedung Kuang Hang
              </p>

              {/* Personalized Recipient Plate */}
              <div className="my-6 py-4 px-5 bg-[#250E0E]/80 border-y border-[#C5983A]/30">
                <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5983A]/90 mb-1">
                  {cms.cover?.guestPrefixZh || "恭請 貴賓尊鑒"} • Kepada Yth.
                </div>
                <div className="text-xl sm:text-2xl font-serif text-[#FFF8E7] font-medium tracking-wide">
                  {guestName}
                </div>
                <div className="text-[11px] font-sans text-stone-400 mt-1 italic">
                  {cms.cover?.inviteTextId || "Dengan penuh hormat mengundang kehadiran Anda dalam malam syukur bersama."}
                </div>
              </div>

              {/* Open Ceremony Folio Button */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={handleOpenFolio}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#9E2222] via-[#7C1818] to-[#580F0F] text-[#FDF9F0] font-sans text-xs uppercase tracking-[0.25em] font-semibold rounded-none border border-[#E6C275]/60 shadow-[0_4px_25px_rgba(124,24,24,0.6)] hover:brightness-110 transition-all duration-300 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#E6C275] animate-pulse" />
                  <span>{cms.cover?.buttonTextZh || "恭啟尊榮邀請函"} • Buka Undangan</span>
                  <ChevronRight className="w-4 h-4 text-[#E6C275] group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[10px] font-sans tracking-widest text-[#E6C275]/50">
                  Sentuh untuk membuka lembar monograf sakral
                </span>
              </div>

              {/* Bottom Hairline Footer */}
              <div className="mt-8 pt-4 border-t border-[#C5983A]/15 flex items-center justify-between text-[10px] font-sans text-stone-500">
                <span>Palmerah, Jakarta Barat</span>
                <span>14 November 2026 • 19:00 WIB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. STICKY HAUTE MASTHEAD & NAVIGATION
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#C5983A]/25 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Signature */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 relative rounded-sm border border-[#C5983A]/50 p-1 bg-white shadow-sm flex items-center justify-center">
              <Image
                src={cms.cover?.logoImage || "/images/logo-guang-ji.png"}
                alt="Logo Guang Ji"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-chinese font-bold text-sm text-[#7C1818] tracking-widest">
                  廣航佛堂
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5983A] font-semibold">
                  20th Anniversary
                </span>
              </div>
              <p className="text-[10px] font-sans text-stone-500 hidden sm:block">
                Monograph Edition • 12 Nov 2006 — 14 Nov 2026
              </p>
            </div>
          </div>

          {/* Controls: Audio Ambiance & Bilingual Toggle */}
          <div className="flex items-center gap-3">
            {/* Audio Ambiance Toggle */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none border text-xs font-sans transition-all duration-300 ${
                isPlayingAudio
                  ? "bg-[#7C1818] text-[#FAF5E8] border-[#C5983A]"
                  : "bg-white text-stone-600 border-stone-300 hover:border-[#C5983A]"
              }`}
              title="Musik Latar Khidmat"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E6C275] animate-pulse" />
                  <span className="text-[11px] font-sans hidden md:inline">Musik: Nyala</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[11px] font-sans hidden md:inline">Musik: Hening</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-[#F2EDE2] p-0.5 border border-[#C5983A]/30 text-xs font-sans">
              {(["all", "id", "zh"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setLang(mode);
                    playSacredChime("high");
                  }}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all ${
                    lang === mode
                      ? "bg-[#7C1818] text-white font-semibold shadow-sm"
                      : "text-stone-600 hover:text-[#7C1818]"
                  }`}
                >
                  {mode === "all" ? "Bilingual" : mode === "id" ? "ID" : "繁中"}
                </button>
              ))}
            </div>

            {/* Re-open Envelope Icon */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsFolioOpen(false);
              }}
              className="p-1.5 border border-stone-300 bg-white hover:border-[#C5983A] text-stone-600 transition-colors hidden sm:flex items-center justify-center"
              title="Buka kembali amplop awal"
            >
              <ScrollText className="w-4 h-4 text-[#7C1818]" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. CHAPTER 01: THE SACRED INVOCATION (MAIN COVERAGE)
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 pt-12 pb-20 border-b border-[#C5983A]/20">
        {/* Subtle Archival Grid lines */}
        <div className="max-w-6xl mx-auto">
          
          {/* Chapter Stamp & Meta */}
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 01</span>
              <span>//</span>
              <span>堂慶大典 • SACRED INVOCATION</span>
            </div>
            <div className="hidden sm:block text-stone-400">
              PALMERAH UTARA • JAKARTA BARAT
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Monumental Typography & Hero Framing */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C1818]/10 border border-[#7C1818]/30 text-[#7C1818] text-xs font-sans font-semibold tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C1818]" />
                {cms.hero?.topBannerSealZh || "天恩師德"} • {cms.hero?.eventDateBadge || "14 November 2026"}
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#1C1816] leading-[1.05] tracking-tight mb-4">
                <span className="font-chinese block text-[#7C1818] mb-1">
                  {cms.hero?.mainTitleZh || "廣航佛堂"}
                </span>
                <span className="block font-medium">
                  {cms.hero?.mainTitleId || "Peringatan 20 Tahun Peresmian Gedung"}
                </span>
              </h2>

              <p className="text-lg sm:text-xl font-serif text-[#7C1818] italic mb-6">
                &ldquo;{cms.hero?.sloganId || "Dua Dasawarsa Menyalakan Pelita Kebajikan"}&rdquo;
              </p>

              {/* Sacred Chinese Inscription Banner */}
              {showZh && (
                <div className="my-6 p-5 bg-[#FAF3E6] border-l-4 border-[#7C1818] text-[#423A36] font-chinese text-base leading-relaxed tracking-wider">
                  <div className="font-bold text-[#7C1818] mb-1 text-lg">
                    {cms.hero?.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
                  </div>
                  <p>{cms.hero?.quoteZh || "廿載白陽開聖境，同舟共濟渡群生。願以至誠之心，薪火相傳，護持白陽慧命於永恆。"}</p>
                </div>
              )}

              {showId && (
                <div className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed space-y-4 mb-8">
                  <p>
                    {cms.hero?.storyParagraphId ||
                      "Pada tanggal 12 November 2006, berkat karunia tak terhingga dari Tian En Shi De serta ketulusan hati para pendahulu, gedung Kuang Hang Fo Thang resmi berdiri kokoh di Palmerah. Hari ini, kami mengundang Anda untuk bersama menundukkan kepala dalam syukur dan memperbaharui ikrar kebajikan."}
                  </p>
                </div>
              )}

              {/* Interactive Guest Certificate Card */}
              <div className="p-6 bg-white border border-[#C5983A]/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#C5983A_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5983A] font-bold">
                    {cms.hero?.guestHonorTitleId || "SURAT PENGHORMATAN TAMU UNDANGAN"}
                  </span>
                  <span className="font-chinese text-xs text-[#7C1818] font-bold">
                    {cms.hero?.guestHonorSealZh || "同沾法喜"}
                  </span>
                </div>
                <div className="text-xl font-serif text-[#7C1818] font-semibold mb-2">
                  {guestName}
                </div>
                <p className="text-xs text-stone-600 font-sans leading-relaxed mb-4">
                  {cms.hero?.guestHonorMessageId ||
                    "Merupakan berkah dan kehormatan yang mendalam bagi segenap pengurus dan panitia untuk menyambut kehadiran Anda dalam Malam Puncak Peringatan 20 Tahun Kuang Hang Fo Thang."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#rsvp-section"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C1818] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#601212] transition-colors"
                  >
                    <Feather className="w-3.5 h-3.5" /> Konfirmasi Kehadiran
                  </a>
                  <button
                    onClick={shareMonograph}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-stone-300 text-stone-700 text-xs font-sans tracking-wider hover:border-[#C5983A] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#7C1818]" />
                    {copiedShare ? "Tautan Disalin!" : "Bagikan Undangan"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Altar Sanctuary Portrait & Live Countdown Slate */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Altar Archival Photograph Frame */}
              <div className="relative group border border-[#C5983A]/40 p-2 bg-white shadow-lg">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image
                    src="/images/guang-hang-10.jpg"
                    alt="Altar Agung Kuang Hang Fo Thang"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#E6C275] block">
                      {cms.hero?.photoCaptionDate || "12 Nov 2006 — 14 Nov 2026"}
                    </span>
                    <span className="font-serif text-base font-semibold drop-shadow-md">
                      {cms.hero?.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang"}
                    </span>
                  </div>
                </div>
                <div className="pt-2 px-1 text-[11px] font-sans text-stone-500 italic flex justify-between items-center">
                  <span>{cms.hero?.photoCaptionDescId || "Pusat spiritual pembinaan kebajikan di Palmerah Utara."}</span>
                  <span className="font-chinese text-stone-400">廣航聖壇</span>
                </div>
              </div>

              {/* Gilded Countdown Monolith */}
              <div className="bg-[#1C1816] text-[#FAF5E8] p-6 border border-[#C5983A]/40 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#C5983A]/20 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#C5983A]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cms.hero?.countdownHeadingId || "Hitung Mundur Malam Syukur"}</span>
                  </div>
                  <span className="font-chinese text-xs text-[#E6C275]">
                    {cms.hero?.countdownHeadingZh || "倒計時迎接感恩之夜"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center my-4">
                  <div className="p-2.5 bg-[#2A2420] border border-[#C5983A]/20">
                    <div className="text-2xl sm:text-3xl font-serif text-[#E6C275] font-bold">
                      {timeLeft.days}
                    </div>
                    <div className="text-[9px] font-sans uppercase tracking-widest text-stone-400 mt-1">Hari</div>
                  </div>
                  <div className="p-2.5 bg-[#2A2420] border border-[#C5983A]/20">
                    <div className="text-2xl sm:text-3xl font-serif text-[#E6C275] font-bold">
                      {timeLeft.hours}
                    </div>
                    <div className="text-[9px] font-sans uppercase tracking-widest text-stone-400 mt-1">Jam</div>
                  </div>
                  <div className="p-2.5 bg-[#2A2420] border border-[#C5983A]/20">
                    <div className="text-2xl sm:text-3xl font-serif text-[#E6C275] font-bold">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-[9px] font-sans uppercase tracking-widest text-stone-400 mt-1">Menit</div>
                  </div>
                  <div className="p-2.5 bg-[#2A2420] border border-[#C5983A]/20">
                    <div className="text-2xl sm:text-3xl font-serif text-[#E6C275] font-bold">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-[9px] font-sans uppercase tracking-widest text-stone-400 mt-1">Detik</div>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-stone-400 text-center">
                  Sabtu, 14 November 2026 • 19:00 WIB (18:30 WIB Registrasi)
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CHAPTER 02: PATRIARCH MAOTIAN LIVING WISDOM (SACRED STELE)
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 02</span>
              <span>//</span>
              <span>茂田師兄聖訓 • LIVING WISDOM</span>
            </div>
            <div className="font-chinese text-[#7C1818] font-bold">
              {cms.wisdom?.sealZh || "茂田師兄慈悲勉勵"}
            </div>
          </div>

          <div className="relative bg-[#FAF7F2] border border-[#C5983A]/40 p-8 sm:p-14 shadow-lg">
            {/* Top Ornamental Seal Stamp */}
            <div className="text-center mb-8">
              <div className="inline-block p-1 border border-[#7C1818] rounded-sm bg-[#7C1818]/5 mb-3">
                <span className="font-chinese text-sm font-bold text-[#7C1818] px-2 py-0.5 tracking-widest">
                  茂田師兄慈悲勉勵
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1816] font-semibold">
                {cms.wisdom?.headingId || "Untaian Wejangan Kebijaksanaan"}
              </h3>
              <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mt-1">
                {cms.wisdom?.subheadingId || "Suluh Jiwa Perjalanan 20 Tahun Kuang Hang Fo Thang"}
              </p>
            </div>

            {/* Sacred Calligraphic Block */}
            <blockquote className="my-8 text-center">
              <p className="font-chinese text-xl sm:text-2xl lg:text-3xl font-serif text-[#7C1818] leading-relaxed tracking-wider mb-6">
                &ldquo;{cms.wisdom?.quoteZh || "願每個人心中有一股願力、一個志向，有大公無私的犧牲精神，有不忍眾生沉淪的大慈悲愿。"}&rdquo;
              </p>
              <div className="w-16 h-0.5 bg-[#C5983A]/40 mx-auto mb-6" />
              <p className="font-serif text-base sm:text-lg text-stone-700 italic max-w-2xl mx-auto leading-relaxed">
                &ldquo;{cms.wisdom?.quoteId ||
                  "Semoga di dalam hati setiap orang terdapat kekuatan ikrar, tekad yang bulat, semangat untuk mengorbankan kepentingan diri demi kepentingan yang lebih besar, serta memiliki sebuah tekad penuh welas asih untuk tidak meninggalkan semua makhluk."}&rdquo;
              </p>
            </blockquote>

            <div className="text-center text-xs font-sans tracking-wide text-stone-500 pt-4 border-t border-stone-200">
              <p className="font-chinese text-[#7C1818] font-semibold mb-1">
                {cms.wisdom?.closingZh || "讓我們共同護持師尊師母的慧命，齊心協力，航向光明。"}
              </p>
              <p className="italic">
                {cms.wisdom?.closingId || "Marilah kita bersama-sama menjaga dan mendukung kehidupan kebijaksanaan Shizun dan Shimu."}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. CHAPTER 03: 20-YEAR ARCHIVAL RETROSPECTIVE (CHRONICLE MILESTONES)
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 py-20 border-b border-[#C5983A]/20">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-12 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 03</span>
              <span>//</span>
              <span>廿載編年誌 • 20-YEAR CHRONICLE</span>
            </div>
            <div className="text-stone-400">1997 — 2026</div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-chinese text-sm text-[#7C1818] font-bold block mb-1">
              道脈傳承 • 歷史足跡
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1C1816] font-semibold">
              Kilas Balik Jejak Langkah Perjuangan
            </h3>
            <p className="text-xs font-sans text-stone-500 mt-2">
              Mengenang dedikasi para pendahulu yang telah meletakkan pondasi kokoh bagi kapal dharma Kuang Hang.
            </p>
          </div>

          {/* Archival Plates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMilestones.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#C5983A]/30 p-6 flex flex-col justify-between hover:border-[#7C1818] transition-all duration-300 shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <span className="text-2xl font-serif font-bold text-[#7C1818]">
                      {item.year}
                    </span>
                    <span className="font-chinese text-xs px-2 py-0.5 bg-[#FAF3E6] border border-[#C5983A]/30 text-[#7C1818]">
                      {item.chineseTitle || "堂慶紀念"}
                    </span>
                  </div>

                  {item.image && (
                    <div className="relative w-full aspect-[16/10] bg-stone-100 mb-4 overflow-hidden border border-stone-200">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>
                  )}

                  <h4 className="font-serif text-lg font-semibold text-[#1C1816] mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs font-sans text-stone-600 leading-relaxed mb-4">
                    {showId && item.description}
                  </p>
                  {showZh && item.chineseDescription && (
                    <p className="text-xs font-chinese text-stone-500 leading-relaxed border-t border-stone-100 pt-2">
                      {item.chineseDescription}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] font-sans text-stone-400">
                  <span>{item.location || "Palmerah, Jakarta Barat"}</span>
                  <span className="text-[#C5983A] font-semibold">{item.highlight || "Tonggak Sejarah"}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. CHAPTER 04: CEREMONIAL PROTOCOL & TIMETABLE (SCHEDULE & DRESSCODE)
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-12 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 04</span>
              <span>//</span>
              <span>大典日程與禮節 • ITINERARY & PROTOCOL</span>
            </div>
            <div className="text-stone-500">14 NOV 2026</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Timetable Card */}
            <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-7 shadow-md">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#7C1818] font-bold mb-4">
                <Clock className="w-4 h-4" />
                <span>Rangkaian Acara Malam Syukur</span>
              </div>
              <h3 className="text-2xl font-serif text-[#1C1816] font-semibold mb-6">
                {cms.event?.dateTextId || "Sabtu, 14 November 2026"}
              </h3>

              <div className="space-y-4 border-l-2 border-[#C5983A]/40 pl-4 py-1 font-sans text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#7C1818] border-2 border-white" />
                  <span className="font-bold text-[#7C1818] block">18:30 WIB</span>
                  <span className="font-medium text-stone-800">Registrasi & Penyambutan Tamu Undangan</span>
                  <span className="text-[10px] text-stone-500 block font-chinese">18:30 入席接待 • 簽到留念</span>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5983A] border-2 border-white" />
                  <span className="font-bold text-[#7C1818] block">19:00 WIB</span>
                  <span className="font-medium text-stone-800">Pembukaan Resmi & Sambutan Panitia</span>
                  <span className="text-[10px] text-stone-500 block font-chinese">19:00 慶典開幕 • 貴賓致辭</span>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5983A] border-2 border-white" />
                  <span className="font-bold text-[#7C1818] block">19:30 WIB</span>
                  <span className="font-medium text-stone-800">Penayangan Kilas Sejarah 20 Tahun & Doa Syukur Bersama</span>
                  <span className="text-[10px] text-stone-500 block font-chinese">19:30 廿週年歷史回顧 • 感恩祈福</span>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5983A] border-2 border-white" />
                  <span className="font-bold text-[#7C1818] block">20:30 WIB</span>
                  <span className="font-medium text-stone-800">Ramah Tamah Persaudaraan Se-Dharma & Penutupan</span>
                  <span className="text-[10px] text-stone-500 block font-chinese">20:30 素宴同樂 • 圓滿落幕</span>
                </div>
              </div>

              {/* Add to Google Calendar Action */}
              <div className="mt-8 pt-5 border-t border-stone-200">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#7C1818] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#601212] transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-[#E6C275]" />
                  Simpan ke Google Calendar
                </a>
              </div>
            </div>

            {/* Right: Venue & Dresscode Protocol Card */}
            <div className="space-y-6">
              
              <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-7 shadow-md">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#7C1818] font-bold mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Lokasi Tempat Pelaksanaan</span>
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#1C1816] mb-2">
                  {cms.event?.venueNameId || "Kuang Hang Fo Thang (廣航佛堂)"}
                </h4>
                <p className="text-xs font-sans text-stone-600 leading-relaxed mb-4">
                  {cms.event?.address || "Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 text-stone-700 text-xs font-sans hover:border-[#C5983A] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedAddress ? "Alamat Tersalin!" : "Salin Alamat"}
                  </button>
                  <a
                    href={cms.event?.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7C1818] text-white text-xs font-sans hover:bg-[#601212] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Buka Peta
                  </a>
                </div>
              </div>

              {/* Dresscode Card */}
              <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-7 shadow-md">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#7C1818] font-bold mb-3">
                  <Shirt className="w-4 h-4" />
                  <span>Etiket Berbusana (Dress Code)</span>
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#1C1816] mb-2">
                  {cms.event?.dresscodeId || "Batik / Pakaian Rapi Bernuansa Putih atau Cerah"}
                </h4>
                <p className="text-xs font-sans text-stone-600 leading-relaxed">
                  {cms.event?.dresscodeNotesId ||
                    "Disarankan mengenakan busana sopan & rapi (Kemeja Batik / Pakaian Putih Bersih / Busana Berkerah) demi menjaga kekhidmatan majelis suci."}
                </p>
                <div className="mt-3 font-chinese text-xs text-stone-500">
                  {cms.event?.dresscodeZh || "莊重得體 • 素雅端莊"}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CHAPTER 05: HAUTE RSVP STATIONERY DESK (REPLY CARD & LIVE WISHES)
          ========================================================================= */}
      <section id="rsvp-section" className="relative px-4 sm:px-8 py-20 border-b border-[#C5983A]/20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 05</span>
              <span>//</span>
              <span>貴賓赴會函覆 • RSVP CONFIRMATION</span>
            </div>
            <div className="text-stone-400">KONFIRMASI RESMI</div>
          </div>

          {/* Haute Reply Stationery Card */}
          <div className="bg-white border-2 border-[#C5983A]/50 p-7 sm:p-12 shadow-xl relative overflow-hidden">
            
            {/* Top Ornamental Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 font-chinese text-xs text-[#7C1818] font-bold border border-[#7C1818]/30 px-2.5 py-1 mb-2 bg-[#7C1818]/5">
                <span>廣航廿週年堂慶</span> • <span>敬邀函覆</span>
              </div>
              <h3 className="text-3xl font-serif text-[#1C1816] font-semibold">
                Konfirmasi Kehadiran Tamu Undangan
              </h3>
              <p className="text-xs font-sans text-stone-500 mt-1">
                Mohon kesediaan Bapak / Ibu / Saudara/i untuk mengisi konfirmasi kehadiran demi kelancaran akomodasi panitia.
              </p>
            </div>

            {/* Live Ticker Summary */}
            <div className="grid grid-cols-3 gap-3 my-6 p-4 bg-[#FAF7F2] border border-[#C5983A]/25 text-center font-sans">
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#7C1818]">
                  {wishesSummary.totalResponses}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">Total Respon</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#C5983A]">
                  {wishesSummary.attending}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">Pasti Hadir</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-stone-800">
                  {wishesSummary.totalGuests}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">Jumlah Jiwa</div>
              </div>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-10 bg-[#FAF7F2] border border-[#C5983A]/30 p-8">
                <div className="w-12 h-12 rounded-full bg-[#7C1818] text-[#E6C275] flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-serif text-[#7C1818] font-semibold mb-2">
                  Terima Kasih Atas Konfirmasi Anda
                </h4>
                <p className="text-xs font-sans text-stone-600 max-w-md mx-auto mb-4">
                  Data konfirmasi dan untaian doa Anda telah tersimpan rapi dalam buku tamu resmi panitia. Sampai jumpa di malam penuh berkah!
                </p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="text-xs font-sans text-[#7C1818] underline hover:text-[#501010]"
                >
                  Ubah data atau kirimkan doa lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-6">
                {rsvpError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                    {rsvpError}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-stone-700 font-semibold mb-2">
                    Nama Lengkap / Nama Tamu Kehormatan <span className="text-[#7C1818]">*</span>
                  </label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Contoh: Lim TC Felix Salim"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-stone-300 font-serif text-stone-900 focus:outline-none focus:border-[#7C1818] transition-colors"
                    required
                  />
                </div>

                {/* Status Selector Radio Cards */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-stone-700 font-semibold mb-2">
                    Status Kehadiran <span className="text-[#7C1818]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("hadir")}
                      className={`p-3.5 border text-left transition-all flex items-center justify-between ${
                        rsvpStatus === "hadir"
                          ? "border-[#7C1818] bg-[#7C1818]/5 text-[#7C1818] font-semibold shadow-sm"
                          : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="font-bold">Pasti Hadir</div>
                        <div className="text-[10px] text-stone-500 font-chinese">準時出席</div>
                      </div>
                      {rsvpStatus === "hadir" && <Check className="w-4 h-4 text-[#7C1818]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("ragu")}
                      className={`p-3.5 border text-left transition-all flex items-center justify-between ${
                        rsvpStatus === "ragu"
                          ? "border-[#C5983A] bg-[#C5983A]/5 text-[#8E5717] font-semibold shadow-sm"
                          : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="font-bold">Masih Ragu</div>
                        <div className="text-[10px] text-stone-500 font-chinese">暫未確定</div>
                      </div>
                      {rsvpStatus === "ragu" && <Check className="w-4 h-4 text-[#C5983A]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("tidak")}
                      className={`p-3.5 border text-left transition-all flex items-center justify-between ${
                        rsvpStatus === "tidak"
                          ? "border-stone-600 bg-stone-100 text-stone-800 font-semibold shadow-sm"
                          : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="font-bold">Berhalangan</div>
                        <div className="text-[10px] text-stone-500 font-chinese">不克出席</div>
                      </div>
                      {rsvpStatus === "tidak" && <Check className="w-4 h-4 text-stone-700" />}
                    </button>
                  </div>
                </div>

                {/* Guest Count (if attending) */}
                {rsvpStatus === "hadir" && (
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-stone-700 font-semibold mb-2">
                      Jumlah Tamu yang Hadir Bersama
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRsvpGuests(num)}
                          className={`w-11 h-11 border text-sm font-sans font-bold transition-all ${
                            rsvpGuests === num
                              ? "bg-[#7C1818] text-white border-[#7C1818]"
                              : "bg-[#FAF7F2] text-stone-700 border-stone-300 hover:border-[#C5983A]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <span className="text-xs text-stone-500 font-sans">Orang</span>
                    </div>
                  </div>
                )}

                {/* Prayer / Wishes Message */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-stone-700 font-semibold mb-2">
                    Untaian Doa & Ucapan Syukur (Wishes)
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan harapan, ucapan selamat 20 tahun, atau doa kebajikan..."
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-stone-300 font-serif text-stone-900 focus:outline-none focus:border-[#7C1818] transition-colors text-sm"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#7C1818] text-white text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#601212] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#E6C275]" />
                    {isSubmittingRsvp ? "Mengirimkan Data..." : "Kirimkan Konfirmasi Resmi"}
                  </button>
                </div>
              </form>
            )}

            {/* Public Wishes Board */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-sans uppercase tracking-wider text-[#7C1818] font-bold block">
                    Buku Doa Umat & Sahabat Se-Dharma
                  </span>
                  <span className="font-chinese text-xs text-stone-400">同修祝福留言榜</span>
                </div>
                <span className="text-xs font-sans text-stone-500">
                  {wishes.length} Pesan Terhimpun
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 no-scrollbar">
                {wishes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF7F2] border border-[#C5983A]/20 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 font-serif text-sm">
                        {item.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-semibold ${
                        item.status === "hadir"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "ragu"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-600"
                      }`}>
                        {item.status === "hadir" ? "Hadir" : item.status === "ragu" ? "Ragu" : "Berhalangan"}
                      </span>
                    </div>
                    {item.message && (
                      <p className="text-stone-700 italic font-serif text-xs">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    )}
                    <span className="text-[9px] text-stone-400 mt-1 block">
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString("id-ID") : "14 Nov 2026"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          8. CHAPTER 06: DANA KEBAJIKAN TRIBUTE & DONATION
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 06</span>
              <span>//</span>
              <span>功德芳名 • DANA KEBAJIKAN</span>
            </div>
            <div className="font-chinese text-stone-500">護持道場</div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-8 sm:p-12 shadow-md">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="font-chinese text-sm text-[#7C1818] font-bold block mb-1">
                布施利他 • 功德無量
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1816] font-semibold">
                {cms.donation?.headingId || "Tali Kasih & Dana Kebajikan"}
              </h3>
              <p className="text-xs font-sans text-stone-600 mt-2 leading-relaxed">
                Bagi saudara se-dharma yang tergerak untuk turut menyokong operasional dan kelancaran kegiatan perayaan 20 tahun Kuang Hang Fo Thang, donasi dapat disalurkan melalui rekening resmi berikut:
              </p>
            </div>

            <div className="max-w-md mx-auto p-6 bg-white border border-[#C5983A]/30 text-center shadow-sm">
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5983A] font-bold mb-1">
                Rekening Resmi Bank
              </div>
              <div className="text-lg font-serif font-bold text-stone-900 mb-1">
                {cms.donation?.bankName || "BCA / Bank Transfer"}
              </div>
              <div className="text-2xl font-mono text-[#7C1818] font-bold tracking-widest my-2 select-all">
                {cms.donation?.accountNumber || "Akan Diumumkan Segera"}
              </div>
              <div className="text-xs font-sans text-stone-600 mb-4">
                a.n. <span className="font-semibold">{cms.donation?.accountHolder || "Kuang Hang Fo Thang"}</span>
              </div>

              {cms.donation?.accountNumber && cms.donation.accountNumber !== "Akan Diumumkan Segera" && (
                <button
                  onClick={copyAccount}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-stone-300 text-stone-800 text-xs font-sans hover:border-[#C5983A] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-[#7C1818]" />
                  {copiedAccount ? "Nomor Rekening Tersalin!" : "Salin Nomor Rekening"}
                </button>
              )}
            </div>

            <p className="text-[11px] font-sans text-stone-500 text-center mt-6 italic">
              {cms.donation?.notes || "Informasi nomor rekening resmi akan segera diperbarui oleh panitia."}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. MONOGRAPH COLOPHON & FOOTER
          ========================================================================= */}
      <footer className="px-4 sm:px-8 py-16 text-center text-xs font-sans text-stone-500 bg-[#FBF9F5]">
        <div className="max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-3">
            <span className="font-chinese text-base font-bold text-[#7C1818]">廣航佛堂</span>
            <span>•</span>
            <span className="font-serif text-sm text-stone-800 font-semibold">
              Kuang Hang Fo Thang 2006 — 2026
            </span>
          </div>

          <p className="text-[11px] text-stone-400 max-w-lg mx-auto">
            Gedung Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480.
            Peringatan 20 Tahun Peresmian Gedung.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:border-[#C5983A] transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#7C1818]" /> Ke Puncak Monograf
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsFolioOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C1818] text-white hover:bg-[#601212] transition-colors"
            >
              <ScrollText className="w-3.5 h-3.5 text-[#E6C275]" /> Tutup & Simpan Folio
            </button>
          </div>

          <div className="text-[10px] text-stone-400 pt-6 border-t border-stone-200">
            © 2006 — 2026 Panitia 20 Tahun Guang Hang Fo Thang. Seluruh Hak Cipta Dilindungi.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function Page11() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#100707] text-[#E6C275] font-serif">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#E6C275] border-t-transparent animate-spin" />
            <span className="text-xs font-chinese tracking-widest">廣航典藏載入中...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Page11MonographContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
