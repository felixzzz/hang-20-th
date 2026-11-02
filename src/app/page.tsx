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
  ChevronDown,
  ChevronUp,
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
  Instagram,
  Images,
  ZoomIn,
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

interface LightboxState {
  src: string;
  title: string;
  chineseTitle?: string;
  subtitle?: string;
  description?: string;
  category?: string;
}

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

  // Lightbox Modal for any clicked photo
  const [lightboxPhoto, setLightboxPhoto] = useState<LightboxState | null>(null);

  // Gallery filter state
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");

  // Timeline expanded descriptions state
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState(guestName === defaultGuestName ? "" : guestName);
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak">("hadir");
  const [rsvpGuests, setRsvpGuests] = useState<number>(1);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Multilingual Header Navigation Items
  const navItems = [
    { href: "#section-hero", id: "Beranda", zh: "首頁" },
    { href: "#section-wisdom", id: "Wejangan", zh: "聖訓" },
    { href: "#section-chronicle", id: "Sejarah", zh: "歷史" },
    { href: "#section-gallery", id: "Galeri", zh: "光影" },
    { href: "#section-event", id: "Jadwal", zh: "日程" },
    { href: "#rsvp-section", id: "RSVP", zh: "赴會", isHighlight: true },
    { href: "#section-location", id: "Lokasi", zh: "座標" },
  ];

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

  // Helper to format testimonial date with today as default fallback
  const formatTestimonialDate = (rawTimestamp?: string) => {
    const todayStr = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    if (!rawTimestamp || !rawTimestamp.trim()) {
      return todayStr;
    }
    try {
      const d = new Date(rawTimestamp);
      if (isNaN(d.getTime())) return todayStr;
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return todayStr;
    }
  };

  // Keyboard escape listener for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      playerRef.current = new window.YT.Player("youtube-hidden-player-home", {
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
    if (playerRef.current && isAudioLoaded) {
      try {
        playerRef.current.playVideo();
        setIsPlayingAudio(true);
      } catch (e) {}
    }

    // Record guest opening in Supabase
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
          timestamp: new Date().toISOString(),
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
    const addr = cms.location?.fullAddress || cms.event?.address || "Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";
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
    const rawTemplate = cms.shareMessage?.template || `*Undangan Resmi 20 Tahun Guang Hang Fo Thang*\n\nKepada Yth: *{nama}*\n\n{url}`;
    const formattedText = rawTemplate
      .replace(/{nama}/g, guestName)
      .replace(/{url}/g, url)
      .replace(/{tanggal}/g, cms.event?.dateTextId || "Sabtu, 14 November 2026")
      .replace(/{waktu}/g, cms.event?.timeTextId || "19.00 WIB")
      .replace(/{tempat}/g, cms.event?.venueNameId || "Kuang Hang Fo Thang, Palmerah");

    if (navigator.share) {
      navigator.share({
        title: "20 Tahun Guang Hang Fo Thang (廣航佛堂 廿週年堂慶大典)",
        text: formattedText,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(formattedText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2400);
    }
  };

  // Toggle timeline expansion
  const toggleMilestoneExpand = (idx: number) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
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
    cms.event?.calendarTitle || "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    cms.event?.calendarDescription || "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(cms.event?.address || "Jl. Palmerah Utara III No. 186A, Jakarta Barat")}`;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1816] font-serif selection:bg-[#E6C275]/40 selection:text-[#7C1818] relative overflow-x-clip">
      
      {/* Hidden YouTube Audio Iframe */}
      <div id="youtube-hidden-player-home" className="sr-only pointer-events-none" />

      {/* =========================================================================
          LIGHTBOX MODAL FOR CLICKABLE HIGH-RES PHOTOS
          ========================================================================= */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#181210] border border-[#C5983A]/40 shadow-2xl p-4 sm:p-6 text-[#FAF5E8] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-[#2E201B] border border-[#C5983A]/40 text-stone-300 hover:text-white hover:bg-[#7C1818] transition-colors z-10"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image View */}
              <div className="relative w-full h-[55vh] sm:h-[70vh] bg-black/40 overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Inscription & Meta */}
              <div className="border-t border-[#C5983A]/30 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-serif text-[#FFF8E7] font-semibold">
                      {lightboxPhoto.title}
                    </h4>
                    {lightboxPhoto.chineseTitle && (
                      <span className="font-chinese text-sm text-[#E6C275] border-l border-stone-600 pl-2">
                        {lightboxPhoto.chineseTitle}
                      </span>
                    )}
                  </div>
                  {lightboxPhoto.description && (
                    <p className="text-xs font-sans text-stone-400 mt-1 max-w-2xl leading-relaxed">
                      {lightboxPhoto.description}
                    </p>
                  )}
                </div>

                {lightboxPhoto.category && (
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] px-2.5 py-1 bg-[#7C1818]/40 border border-[#C5983A]/40 text-[#E6C275] self-start sm:self-auto">
                    {lightboxPhoto.category}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span>{cms.cover?.badgeZh || "廿週年堂慶紀念"}</span>
                <span>{cms.cover?.badgeId || "Peringatan 20 Tahun Gedung"}</span>
                <span>2006 — 2026</span>
              </div>

              {/* Embossed Vermilion Imperial Seal */}
              <div className="inline-flex flex-col items-center justify-center mb-6">
                <div
                  onClick={() => playSacredChime("high")}
                  className="cursor-pointer group relative w-20 h-20 rounded-sm border-2 border-[#E6C275] bg-[#7C1818] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),0_8px_20px_rgba(124,24,24,0.5)] flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105 active:scale-95"
                >
                  <span className="font-chinese text-2xl font-bold text-[#FDF9F0] writing-vertical-rl tracking-widest drop-shadow-sm">
                    {cms.cover?.sealTopZh || "天恩師德"}
                  </span>
                  <div className="absolute -bottom-1 -right-1 text-[8px] font-sans uppercase tracking-widest text-[#E6C275]/80">
                    印
                  </div>
                </div>
                <span className="text-[11px] font-chinese text-[#E6C275]/75 mt-2.5 tracking-wider">
                  {cms.cover?.bottomInscriptionZh || "二零零六 — 二零二六 • 廿載同舟"}
                </span>
              </div>

              {/* Title & Archival Inscription */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#FAF5E9] mb-2">
                {cms.cover?.titleZh || "廣航佛堂"} 廿週年堂慶大典
              </h1>
              <p className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-[#E6C275]/80 mb-2">
                {cms.cover?.titleId || "Kuang Hang Fo Thang • 2006 — 2026"}
              </p>
              <p className="text-xs font-serif italic text-stone-400 mb-6">
                &ldquo;{cms.cover?.subtitleId || "Mengarungi Samudra Kebajikan, Menyalakan Pelita Kebijaksanaan"}&rdquo;
              </p>

              {/* Personalized Recipient Plate */}
              <div className="my-6 py-4 px-5 bg-[#250E0E]/80 border-y border-[#C5983A]/30">
                <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5983A]/90 mb-1">
                  {cms.cover?.guestPrefixZh || "恭請 貴賓尊鑒"} • {cms.cover?.guestPrefixId || "Yth. Tamu Undangan Terkasih"}
                </div>
                <div className="text-xl sm:text-2xl font-serif text-[#FFF8E7] font-medium tracking-wide">
                  {guestName}
                </div>
                <div className="text-[11px] font-sans text-stone-400 mt-1 italic">
                  {showId && cms.cover?.inviteTextId}
                  {showZh && <span className="block font-chinese mt-1 text-[#E6C275]/70">{cms.cover?.inviteTextZh}</span>}
                </div>
              </div>

              {/* Open Ceremony Folio Button */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={handleOpenFolio}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#9E2222] via-[#7C1818] to-[#580F0F] text-[#FDF9F0] font-sans text-xs uppercase tracking-[0.25em] font-semibold rounded-none border border-[#E6C275]/60 shadow-[0_4px_25px_rgba(124,24,24,0.6)] hover:brightness-110 transition-all duration-300 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#E6C275] animate-pulse" />
                  <span>
                    {cms.cover?.buttonTextZh || "恭啟尊榮邀請函"} • {cms.cover?.buttonTextId || "Buka Undangan Resmi"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#E6C275] group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[10px] font-sans tracking-widest text-[#E6C275]/50">
                  {cms.cover?.buttonSubtextId || "Sentuh tombol untuk membuka surat undangan resmi"}
                </span>
              </div>

              {/* Bottom Hairline Footer */}
              <div className="mt-8 pt-4 border-t border-[#C5983A]/15 flex items-center justify-between text-[10px] font-sans text-stone-500">
                <span>{cms.hero?.cityId || "Palmerah, Jakarta Barat"}</span>
                <span>{cms.event?.dateTextId || "14 November 2026"} • {cms.event?.timeTextId || "19:00 WIB"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. STICKY HAUTE MASTHEAD & NAVIGATION
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#C5983A]/25 px-4 sm:px-8 py-3 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
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
                  {cms.navbar?.brandTitleZh || "廣航佛堂"}
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5983A] font-semibold">
                  {cms.navbar?.brandSubtitleId || "Peringatan 20 Tahun Gedung"}
                </span>
              </div>
              <p className="text-[10px] font-sans text-stone-500 hidden sm:block">
                {cms.navbar?.brandTitleId || "Kuang Hang Fo Thang"} • {cms.navbar?.brandSubtitleZh || "成立廿週年堂慶"}
              </p>
            </div>
          </div>

          {/* Multilingual Quick Anchor Jumps */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-sans uppercase tracking-widest text-stone-600">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group transition-all py-1 px-1.5 flex flex-col items-center ${
                  item.isHighlight
                    ? "font-bold text-[#7C1818] border-b-2 border-[#7C1818]"
                    : "hover:text-[#7C1818]"
                }`}
              >
                {lang === "zh" ? (
                  <span className="font-chinese text-sm font-semibold tracking-wider">{item.zh}</span>
                ) : lang === "id" ? (
                  <span>{item.id}</span>
                ) : (
                  <span className="inline-flex flex-col items-center leading-tight text-center">
                    <span className="text-[11px] font-sans uppercase tracking-wider font-semibold">
                      {item.id}
                    </span>
                    <span
                      className={`font-chinese text-[10px] tracking-widest font-normal ${
                        item.isHighlight
                          ? "text-[#7C1818]/85 font-medium"
                          : "text-stone-400 group-hover:text-[#7C1818]/80 transition-colors"
                      }`}
                    >
                      {item.zh}
                    </span>
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Controls: Audio Ambiance (Icon-only) & Bilingual Toggle */}
          <div className="flex items-center gap-3">
            {/* Audio Ambiance Toggle - Icon Only */}
            <button
              onClick={toggleAudio}
              className={`w-9 h-9 flex items-center justify-center rounded-none border text-xs font-sans transition-all duration-300 ${
                isPlayingAudio
                  ? "bg-[#7C1818] text-[#FAF5E8] border-[#C5983A] shadow-sm"
                  : "bg-white text-stone-500 border-stone-300 hover:border-[#C5983A] hover:text-[#7C1818]"
              }`}
              aria-label={isPlayingAudio ? "Mute audio" : "Play audio"}
              title={isPlayingAudio ? (showZh ? "靜音" : "Heningkan Musik") : (showZh ? "播放音樂" : "Putar Musik")}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-[#E6C275] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
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
      <section id="section-hero" className="relative px-4 sm:px-8 pt-10 pb-20 border-b border-[#C5983A]/20">
        <div className="max-w-6xl mx-auto">
          
          {/* Chapter Stamp & Meta */}
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-6 sm:mb-8 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 01</span>
              <span>//</span>
              <span>堂慶大典 • SACRED INVOCATION</span>
            </div>
            <div className="hidden sm:block text-stone-400">
              {cms.hero?.cityId || "Palmerah, Jakarta Barat"} • {cms.hero?.cityZh || "雅加達巴美拉"}
            </div>
          </div>

          {/* 1. FULL-WIDTH HERO SANCTUARY PHOTOGRAPH (IMAGE FIRST ON ALL DEVICES) */}
          <div className="mb-8">
            <div
              onClick={() =>
                setLightboxPhoto({
                  src: "/images/guang-hang-10.jpg",
                  title: cms.hero?.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang",
                  chineseTitle: cms.hero?.photoCaptionTitleZh || "廣航聖壇大殿",
                  subtitle: cms.hero?.photoCaptionDate || "12 Nov 2006 — 14 Nov 2026",
                  description: cms.hero?.photoCaptionDescId || "Pusat spiritual pembinaan kebajikan dan persaudaraan se-dharma di Palmerah Utara.",
                  category: "Altar Suci",
                })
              }
              className="relative group border border-[#C5983A]/40 p-2 sm:p-3 bg-white shadow-xl cursor-zoom-in overflow-hidden"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.4/1] overflow-hidden bg-stone-100">
                <Image
                  src="/images/guang-hang-10.jpg"
                  alt="Altar Agung Kuang Hang Fo Thang"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-[#E6C275]/40 text-[#E6C275] text-[10px] sm:text-xs font-sans tracking-wider uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6C275] animate-pulse" />
                  <span>{cms.hero?.topBannerSealZh || "天恩師德"} • {cms.hero?.topBannerZh || "廿週年誌慶"}</span>
                </div>

                {/* Top Right Zoom Pill */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-[#C5983A]/40 text-white text-[10px] sm:text-xs font-sans flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-[#E6C275]" />
                  <span className="hidden sm:inline">Klik perbesar</span>
                  <span className="font-chinese text-[#E6C275]">(點擊放大)</span>
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#E6C275] block mb-1">
                    {cms.hero?.photoCaptionDate || "12 Nov 2006 — 14 Nov 2026"} • Palmerah, Jakarta Barat
                  </span>
                  <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-semibold drop-shadow-md">
                    {cms.hero?.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang"}
                    <span className="font-chinese font-normal ml-3 text-lg sm:text-2xl text-[#E6C275] hidden sm:inline">
                      {cms.hero?.photoCaptionTitleZh || "廣航聖壇大殿"}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Photo Inscription Ribbon */}
              <div className="pt-2 px-1 text-[11px] font-sans text-stone-500 italic flex flex-wrap justify-between items-center gap-2">
                <span>{cms.hero?.photoCaptionDescId || "Pusat spiritual pembinaan kebajikan di Palmerah Utara."}</span>
                <span className="font-chinese text-stone-400">
                  {cms.hero?.photoCaptionDescZh || "立足巴美拉，開拓萬家光明，度化十方有緣善信回歸覺路。"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. FULL-WIDTH COUNTDOWN & DATE MONOLITH */}
          <div className="bg-[#1C1816] text-[#FAF5E8] p-5 sm:p-7 border border-[#C5983A]/40 mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C5983A]/25 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#C5983A] font-semibold">
                  <Clock className="w-4 h-4 text-[#E6C275]" />
                  <span>{cms.hero?.countdownHeadingId || "Hitung Mundur Malam Syukur"}</span>
                  <span className="font-chinese text-xs text-[#E6C275] ml-1">
                    ({cms.hero?.countdownHeadingZh || "倒計時迎接感恩之夜"})
                  </span>
                </div>
                <p className="text-xs font-sans text-stone-400 mt-1">
                  {cms.hero?.countdownSubtextId || "Waktu bersama untuk bersyukur, mengenang jejak perintis, dan mempererat tali dharma."}
                </p>
              </div>

              <div className="text-xs font-sans text-[#E6C275] md:text-right shrink-0">
                <span className="font-semibold block">{cms.event?.dateTextId || "Sabtu, 14 November 2026"}</span>
                <span className="text-stone-400 text-[11px]">
                  {cms.event?.timeTextId || "19:00 WIB"} ({cms.event?.timeNotesId || "18:30 WIB Registrasi"})
                </span>
              </div>
            </div>

            {/* Countdown Digits */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="p-3 sm:p-4 bg-[#2A2420] border border-[#C5983A]/25">
                <div className="text-2xl sm:text-4xl font-serif text-[#E6C275] font-bold">
                  {timeLeft.days}
                </div>
                <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-widest text-stone-400 mt-1">Hari (天)</div>
              </div>
              <div className="p-3 sm:p-4 bg-[#2A2420] border border-[#C5983A]/25">
                <div className="text-2xl sm:text-4xl font-serif text-[#E6C275] font-bold">
                  {timeLeft.hours}
                </div>
                <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-widest text-stone-400 mt-1">Jam (時)</div>
              </div>
              <div className="p-3 sm:p-4 bg-[#2A2420] border border-[#C5983A]/25">
                <div className="text-2xl sm:text-4xl font-serif text-[#E6C275] font-bold">
                  {timeLeft.minutes}
                </div>
                <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-widest text-stone-400 mt-1">Menit (分)</div>
              </div>
              <div className="p-3 sm:p-4 bg-[#2A2420] border border-[#C5983A]/25">
                <div className="text-2xl sm:text-4xl font-serif text-[#E6C275] font-bold">
                  {timeLeft.seconds}
                </div>
                <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-widest text-stone-400 mt-1">Detik (秒)</div>
              </div>
            </div>
          </div>

          {/* 3. EDITORIAL NARRATIVE & GUEST HONOR CARD (TWO-COLUMN DESKTOP / BALANCED MOBILE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Main Titles, Slogan & Story */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C1818]/10 border border-[#7C1818]/30 text-[#7C1818] text-xs font-sans font-semibold tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C1818]" />
                {cms.hero?.topBannerSealZh || "天恩師德"} • {cms.hero?.eventDateBadge || "14 November 2026"}
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#1C1816] leading-[1.08] tracking-tight mb-3">
                <span className="font-chinese block text-[#7C1818] mb-1">
                  {cms.hero?.mainTitleZh || "廣航佛堂"}
                </span>
                <span className="block font-medium">
                  {cms.hero?.mainTitleId || "Peringatan 20 Tahun Peresmian Gedung"}
                </span>
              </h2>

              <p className="text-base sm:text-xl font-serif text-[#7C1818] italic mb-6">
                &ldquo;{cms.hero?.sloganId || "Dua Dasawarsa Menyalakan Pelita Kebajikan"}&rdquo;
              </p>

              {/* Sacred Chinese Inscription Banner */}
              {showZh && (
                <div className="my-5 p-5 bg-[#FAF3E6] border-l-4 border-[#7C1818] text-[#423A36] font-chinese text-base leading-relaxed tracking-wider">
                  <div className="font-bold text-[#7C1818] mb-1 text-lg">
                    {cms.hero?.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
                  </div>
                  <p>{cms.hero?.quoteZh || "廿載白陽開聖境，同舟共濟渡群生。願以至誠之心，薪火相傳，護持白陽慧命於永恆。"}</p>
                </div>
              )}

              {showId && (
                <div className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    {cms.hero?.storyParagraphId ||
                      "Pada tanggal 12 November 2006, berkat karunia tak terhingga dari Tian En Shi De serta ketulusan hati para pendahulu, gedung Kuang Hang Fo Thang resmi berdiri kokoh di Palmerah. Hari ini, kami mengundang Anda untuk bersama menundukkan kepala dalam syukur dan memperbaharui ikrar kebajikan."}
                  </p>
                  {showZh && cms.hero?.storyParagraphZh && (
                    <p className="font-chinese text-xs sm:text-sm text-stone-500 border-t border-stone-200 pt-3">
                      {cms.hero.storyParagraphZh}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right: Interactive Guest Certificate Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 bg-white border border-[#C5983A]/40 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#C5983A_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5983A] font-bold">
                    {cms.hero?.guestHonorTitleId || "SURAT PENGHORMATAN TAMU UNDANGAN"}
                  </span>
                  <span className="font-chinese text-xs text-[#7C1818] font-bold">
                    {cms.hero?.guestHonorSealZh || "同沾法喜"}
                  </span>
                </div>
                
                <div className="text-xs font-sans text-stone-500 uppercase tracking-wider mb-1">
                  {cms.hero?.guestHonorGreetingId || "Kepada Yth. Bapak / Ibu / Saudara/i:"}
                </div>
                <div className="text-2xl font-serif text-[#7C1818] font-semibold mb-3">
                  {guestName}
                </div>
                
                <p className="text-xs text-stone-600 font-sans leading-relaxed mb-6">
                  {cms.hero?.guestHonorMessageId ||
                    "Merupakan berkah dan kehormatan yang mendalam bagi segenap pengurus dan panitia untuk menyambut kehadiran Anda dalam Malam Puncak Peringatan 20 Tahun Kuang Hang Fo Thang."}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-stone-100">
                  <a
                    href="#rsvp-section"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7C1818] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#601212] transition-colors shadow-sm"
                  >
                    <Feather className="w-3.5 h-3.5" /> Konfirmasi Kehadiran
                  </a>
                  <button
                    onClick={shareMonograph}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] border border-stone-300 text-stone-700 text-xs font-sans tracking-wider hover:border-[#C5983A] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#7C1818]" />
                    {copiedShare ? "Undangan Disalin!" : "Bagikan Undangan"}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. CHAPTER 02: PATRIARCH MAOTIAN LIVING WISDOM (SACRED STELE)
          ========================================================================= */}
      <section id="section-wisdom" className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
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
                  {cms.wisdom?.sealZh || "茂田師兄慈悲勉勵"}
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
      <section id="section-chronicle" className="relative px-4 sm:px-8 py-20 border-b border-[#C5983A]/20">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-12 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 03</span>
              <span>//</span>
              <span>
                {cms.historySection?.badgeZh || "歲月印記 • 薪火相傳"} • {cms.historySection?.badgeId || "Napak Tilas 20 Tahun"}
              </span>
            </div>
            <div className="text-stone-400">1997 — 2026</div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-chinese text-sm text-[#7C1818] font-bold block mb-1">
              {cms.historySection?.headingZh || "歲月印記 • 薪火相傳"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1C1816] font-semibold">
              {cms.historySection?.headingId || "Napak Tilas 20 Tahun Gedung"}
            </h3>
            <p className="text-xs font-sans text-stone-500 mt-2">
              {cms.historySection?.descriptionId ||
                "Mengenang jejak tetesan keringat, doa tulus, dan pengorbanan para perintis awal yang memungkinkan pelita Kuang Hang bersinar terang hari ini."}
            </p>
          </div>

          {/* Archival Plates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMilestones.map((item, idx) => {
              const isExpanded = !!expandedMilestones[idx];
              const isLongText = (item.description && item.description.length > 130) || (item.chineseDescription && item.chineseDescription.length > 65);

              return (
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

                    {/* Milestone Photo - Click to Enlarge */}
                    {item.image && (
                      <div
                        onClick={() =>
                          setLightboxPhoto({
                            src: item.image!,
                            title: item.title,
                            chineseTitle: item.chineseTitle,
                            subtitle: `Tahun ${item.year} • ${item.location || "Palmerah"}`,
                            description: item.description,
                            category: "Kilas Sejarah",
                          })
                        }
                        className="relative w-full aspect-[16/10] bg-stone-100 mb-4 overflow-hidden border border-stone-200 cursor-zoom-in group/img"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 350px"
                        />
                        <div className="absolute top-2 right-2 p-1 bg-black/60 text-[#E6C275] opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}

                    <h4 className="font-serif text-lg font-semibold text-[#1C1816] mb-2">
                      {item.title}
                    </h4>

                    {/* Truncated Description with "Baca Selanjutnya" */}
                    <div className="text-xs font-sans text-stone-600 leading-relaxed mb-2">
                      {showId && (
                        <p>
                          {isExpanded || !isLongText
                            ? item.description
                            : `${item.description.slice(0, 130)}...`}
                        </p>
                      )}

                      {showZh && item.chineseDescription && (
                        <p className="text-xs font-chinese text-stone-500 leading-relaxed border-t border-stone-100 pt-2 mt-2">
                          {isExpanded || !isLongText
                            ? item.chineseDescription
                            : `${item.chineseDescription.slice(0, 65)}...`}
                        </p>
                      )}
                    </div>

                    {/* Toggle Button for Long Text */}
                    {isLongText && (
                      <button
                        type="button"
                        onClick={() => toggleMilestoneExpand(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-[#7C1818] hover:text-[#551010] mt-1 mb-3 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <span>Ciutkan</span>
                            <span className="font-chinese font-normal">(收起)</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Baca Selengkapnya</span>
                            <span className="font-chinese font-normal">(閱讀更多)</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] font-sans text-stone-400">
                    <span>{item.location || "Palmerah, Jakarta Barat"}</span>
                    <span className="text-[#C5983A] font-semibold">{item.highlight || "Tonggak Sejarah"}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. CHAPTER 04: VISUAL ANTHOLOGY & PHOTO GALLERY (GALLERY SECTION)
          ========================================================================= */}
      <section id="section-gallery" className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-12 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 04</span>
              <span>//</span>
              <span>
                {cms.gallerySection?.headingZh || "歲月長廊 • 影像典藏"} • {cms.gallerySection?.badgeId || "Galeri Foto"}
              </span>
            </div>
            <div className="text-stone-400">DOKUMENTASI FOTO</div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-chinese text-sm text-[#7C1818] font-bold block mb-1">
              {cms.gallerySection?.headingZh || "歲月長廊 • 影像典藏"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1C1816] font-semibold">
              {cms.gallerySection?.headingId || "Dokumentasi Foto Dua Dasawarsa"}
            </h3>
            <p className="text-xs font-sans text-stone-500 mt-2">
              {cms.gallerySection?.descriptionId ||
                "Setiap bingkai foto menyimpan jejak dedikasi, senyuman umat, dan limpahan berkah Tian En Shi De yang abadi."}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveGalleryFilter("all")}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wider transition-all ${
                activeGalleryFilter === "all"
                  ? "bg-[#7C1818] text-white font-semibold shadow-sm"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-[#C5983A]"
              }`}
            >
              {cms.gallerySection?.tabAllId || "Semua"} • {cms.gallerySection?.tabAllZh || "全部"}
            </button>
            <button
              onClick={() => setActiveGalleryFilter("sejarah")}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wider transition-all ${
                activeGalleryFilter === "sejarah"
                  ? "bg-[#7C1818] text-white font-semibold shadow-sm"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-[#C5983A]"
              }`}
            >
              {cms.gallerySection?.tabHistoryId || "Sejarah & Pembangunan"} • {cms.gallerySection?.tabHistoryZh || "創堂歷史"}
            </button>
            <button
              onClick={() => setActiveGalleryFilter("kegiatan")}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wider transition-all ${
                activeGalleryFilter === "kegiatan"
                  ? "bg-[#7C1818] text-white font-semibold shadow-sm"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-[#C5983A]"
              }`}
            >
              {cms.gallerySection?.tabActivityId || "Kegiatan Pembinaan"} • {cms.gallerySection?.tabActivityZh || "道育共修"}
            </button>
            <button
              onClick={() => setActiveGalleryFilter("kebersamaan")}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wider transition-all ${
                activeGalleryFilter === "kebersamaan"
                  ? "bg-[#7C1818] text-white font-semibold shadow-sm"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-[#C5983A]"
              }`}
            >
              {cms.gallerySection?.tabFellowshipId || "Kebersamaan Umat"} • {cms.gallerySection?.tabFellowshipZh || "道親情誼"}
            </button>
          </div>

          {/* Photo Gallery Grid with Zoom Inspection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() =>
                  setLightboxPhoto({
                    src: photo.src,
                    title: photo.title,
                    chineseTitle: photo.chineseTitle,
                    category:
                      photo.category === "sejarah"
                        ? "Sejarah & Pembangunan"
                        : photo.category === "kegiatan"
                        ? "Kegiatan Pembinaan"
                        : "Kebersamaan Umat",
                  })
                }
                className="group relative bg-white border border-[#C5983A]/30 p-2.5 shadow-sm hover:border-[#7C1818] transition-all duration-300 cursor-zoom-in"
              >
                <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-2 right-2 p-1.5 bg-black/60 text-[#E6C275] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-3 px-1.5 flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#7C1818] transition-colors">
                      {photo.title}
                    </h5>
                    {photo.chineseTitle && (
                      <span className="font-chinese text-xs text-stone-500 block">
                        {photo.chineseTitle}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#C5983A] font-semibold">
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CHAPTER 05: CEREMONIAL PROTOCOL & TIMETABLE (SCHEDULE & DRESSCODE)
          ========================================================================= */}
      <section id="section-event" className="relative px-4 sm:px-8 py-20 border-b border-[#C5983A]/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-12 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 05</span>
              <span>//</span>
              <span>
                {cms.event?.headingZh || "慶典日程 • 會場導引"} • {cms.event?.headingId || "Waktu & Tempat Pelaksanaan"}
              </span>
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
              <h3 className="text-2xl font-serif text-[#1C1816] font-semibold mb-2">
                {cms.event?.dateTextId || "Sabtu, 14 November 2026"}
              </h3>
              <p className="text-xs font-chinese text-stone-500 mb-6">
                {cms.event?.dateTextZh || "2026年11月14日（星期六）"} • {cms.event?.timeTextZh || "晚間七時正 (19:00 WIB)"}
              </p>

              <div className="space-y-4 border-l-2 border-[#C5983A]/40 pl-4 py-1 font-sans text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#7C1818] border-2 border-white" />
                  <span className="font-bold text-[#7C1818] block">18:30 WIB</span>
                  <span className="font-medium text-stone-800">Registrasi & Penyambutan Tamu Undangan</span>
                  <span className="text-[10px] text-stone-500 block font-chinese">
                    {cms.event?.timeNotesZh || "18:30 入席接待"}
                  </span>
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
                <p className="text-[10px] text-stone-400 text-center mt-2 italic">
                  {cms.event?.footerNotesId || "* Mohon hadir tepat waktu demi kelancaran kekhidmatan upacara."}
                </p>
              </div>
            </div>

            {/* Right: Venue & Dresscode Protocol Card */}
            <div className="space-y-6">
              
              <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-7 shadow-md">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#7C1818] font-bold mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Lokasi Tempat Pelaksanaan</span>
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#1C1816] mb-1">
                  {cms.event?.venueNameId || "Kuang Hang Fo Thang (廣航佛堂)"}
                </h4>
                <div className="font-chinese text-xs text-stone-500 mb-2">
                  {cms.event?.venueNameZh || "雅加達廣航佛堂"}
                </div>
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
          8. CHAPTER 06: HAUTE RSVP STATIONERY DESK (REPLY CARD & LIVE WISHES)
          ========================================================================= */}
      <section id="rsvp-section" className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 06</span>
              <span>//</span>
              <span>
                {cms.rsvpSection?.headingZh || "功德名冊 • 祈願雅集"} • {cms.rsvpSection?.badgeId || "RSVP"}
              </span>
            </div>
            <div className="text-stone-400">KONFIRMASI RESMI</div>
          </div>

          {/* Haute Reply Stationery Card */}
          <div className="bg-white border-2 border-[#C5983A]/50 p-7 sm:p-12 shadow-xl relative overflow-hidden">
            
            {/* Top Ornamental Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 font-chinese text-xs text-[#7C1818] font-bold border border-[#7C1818]/30 px-2.5 py-1 mb-2 bg-[#7C1818]/5">
                <span>{cms.rsvpSection?.headingZh || "功德名冊 • 祈願雅集"}</span>
              </div>
              <h3 className="text-3xl font-serif text-[#1C1816] font-semibold">
                {cms.rsvpSection?.headingId || "Konfirmasi Kehadiran Tamu Undangan"}
              </h3>
              <p className="text-xs font-sans text-stone-500 mt-1">
                {cms.rsvpSection?.descriptionId ||
                  "Kehadiran serta doa tulus dari Bapak/Ibu/Saudara/i sekalian adalah suluh penerang yang menyempurnakan peringatan 20 tahun Kuang Hang."}
              </p>
            </div>

            {/* Live Ticker Summary */}
            <div className="grid grid-cols-3 gap-3 my-6 p-4 bg-[#FAF7F2] border border-[#C5983A]/25 text-center font-sans">
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#7C1818]">
                  {wishesSummary.totalResponses}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">
                  {cms.rsvpSection?.ledgerLabelResponsesId || "Total Respon"}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#C5983A]">
                  {wishesSummary.attending}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">
                  {cms.rsvpSection?.ledgerLabelAttendingId || "Pasti Hadir"}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-stone-800">
                  {wishesSummary.totalGuests}
                </div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">
                  {cms.rsvpSection?.ledgerLabelGuestsId || "Jumlah Jiwa"}
                </div>
              </div>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-10 bg-[#FAF7F2] border border-[#C5983A]/30 p-8">
                <div className="w-12 h-12 rounded-full bg-[#7C1818] text-[#E6C275] flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-serif text-[#7C1818] font-semibold mb-2">
                  {cms.rsvpSection?.successTitleId || "Terima Kasih Atas Konfirmasi Anda!"}
                </h4>
                <p className="text-xs font-sans text-stone-600 max-w-md mx-auto mb-4">
                  {cms.rsvpSection?.successDescId ||
                    "Konfirmasi kehadiran dan doa restu Anda telah tercatat dalam buku tamu resmi panitia 20 Tahun Kuang Hang Fo Thang."}
                </p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="text-xs font-sans text-[#7C1818] underline hover:text-[#501010]"
                >
                  {cms.rsvpSection?.reopenFormTextId || "Ingin mengubah data atau mengirimkan doa tambahan?"}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("hadir")}
                      className={`p-4 border text-left transition-all flex items-center justify-between ${
                        rsvpStatus === "hadir"
                          ? "border-[#7C1818] bg-[#7C1818]/5 text-[#7C1818] font-semibold shadow-sm"
                          : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Pasti Hadir</div>
                        <div className="text-[11px] text-stone-500 font-chinese mt-0.5">準時出席</div>
                      </div>
                      {rsvpStatus === "hadir" && <Check className="w-5 h-5 text-[#7C1818]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("tidak")}
                      className={`p-4 border text-left transition-all flex items-center justify-between ${
                        rsvpStatus === "tidak"
                          ? "border-stone-600 bg-stone-100 text-stone-800 font-semibold shadow-sm"
                          : "border-stone-200 bg-[#FAF7F2] text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Berhalangan</div>
                        <div className="text-[11px] text-stone-500 font-chinese mt-0.5">不克出席</div>
                      </div>
                      {rsvpStatus === "tidak" && <Check className="w-5 h-5 text-stone-700" />}
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
                      {formatTestimonialDate(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          9. CHAPTER 07: DANA KEBAJIKAN TRIBUTE & DONATION
          ========================================================================= */}
      <section className="relative px-4 sm:px-8 py-20 border-b border-[#C5983A]/20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 07</span>
              <span>//</span>
              <span>
                {cms.donation?.headingZh || "隨喜功德 • 廣種福田"} • {cms.donation?.headingId || "Dana Kebajikan"}
              </span>
            </div>
            <div className="font-chinese text-stone-500">護持道場</div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#C5983A]/40 p-8 sm:p-12 shadow-md">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="font-chinese text-sm text-[#7C1818] font-bold block mb-1">
                {cms.donation?.subheadingZh || "隨喜功德 · 廣種福田"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1816] font-semibold">
                {cms.donation?.headingId || "Tali Kasih & Dana Kebajikan"}
              </h3>
              <p className="text-xs font-sans text-stone-600 mt-2 leading-relaxed">
                {cms.donation?.descriptionId ||
                  "Doa restu serta kehadiran Bapak/Ibu/Saudara/i adalah karunia terindah bagi kami. Bagi yang hendak menyalurkan tali kasih sukarela demi kelancaran kegiatan wadah keTuhanan Kuang Hang:"}
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

              {/* QRIS Image if available */}
              {cms.donation?.qrisImage && (
                <div className="mt-5 pt-4 border-t border-stone-200">
                  <div className="text-xs font-sans text-stone-500 mb-2 font-semibold">QRIS Resmi Donasi</div>
                  <div
                    onClick={() =>
                      setLightboxPhoto({
                        src: cms.donation!.qrisImage!,
                        title: "QRIS Resmi Dana Kebajikan",
                        chineseTitle: "功德隨喜 QRIS 碼",
                        description: "Scan melalui aplikasi mobile banking atau dompet digital Anda.",
                        category: "Donasi",
                      })
                    }
                    className="relative w-48 h-48 mx-auto border border-stone-200 cursor-zoom-in"
                  >
                    <Image
                      src={cms.donation.qrisImage}
                      alt="QRIS Donasi"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] font-sans text-stone-500 text-center mt-6 italic">
              {cms.donation?.notes || "Informasi nomor rekening resmi akan segera diperbarui oleh panitia."}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. CHAPTER 08: SANCTUARY COORDINATES & TRANSIT GUIDANCE (LOCATION)
          ========================================================================= */}
      <section id="section-location" className="relative px-4 sm:px-8 py-20 bg-[#F4EFE6] border-b border-[#C5983A]/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-[#C5983A]/30 pb-3 mb-10 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5983A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">SECTION 08</span>
              <span>//</span>
              <span>
                {cms.location?.headingZh || "道場座標 • 交通導引"} • {cms.location?.headingId || "Petunjuk Lokasi"}
              </span>
            </div>
            <div className="text-stone-400">PETA LOKASI</div>
          </div>

          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-3xl font-serif text-[#1C1816] font-semibold">
              {cms.location?.headingId || "Petunjuk Lokasi & Arah Menuju Gedung"}
            </h3>
            <p className="text-xs font-sans text-stone-600 mt-2">
              {cms.location?.descriptionId ||
                "Gedung Kuang Hang Fo Thang berlokasi strategis di Palmerah Utara, mudah dijangkau dari segala penjuru Jakarta."}
            </p>
          </div>

          {/* Map Embed Card */}
          <div className="bg-white border border-[#C5983A]/40 shadow-md overflow-hidden mb-8">
            <div className="relative w-full h-72 sm:h-96 bg-stone-100">
              <iframe
                src={cms.location?.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Lokasi Kuang Hang Fo Thang"
              />
            </div>

            <div className="p-6 bg-[#FAF7F2] border-t border-[#C5983A]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#7C1818] font-bold block mb-1">
                  Alamat Lengkap Resmi
                </span>
                <p className="text-xs font-serif text-stone-800 leading-relaxed max-w-xl">
                  {cms.location?.fullAddress || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480"}
                </p>
                {cms.location?.addressZh && (
                  <p className="font-chinese text-xs text-stone-500 mt-0.5">
                    {cms.location.addressZh}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-sans hover:border-[#C5983A] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedAddress ? "Tersalin!" : "Salin Alamat"}
                </button>
                <a
                  href={cms.location?.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C1818] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#601212] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          11. MONOGRAPH COLOPHON & FOOTER
          ========================================================================= */}
      <footer className="px-4 sm:px-8 py-16 text-center text-xs font-sans text-stone-500 bg-[#FBF9F5]">
        <div className="max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-3">
            <span className="font-chinese text-base font-bold text-[#7C1818]">
              {cms.footer?.titleZh || "廣航佛堂"}
            </span>
            <span>•</span>
            <span className="font-serif text-sm text-stone-800 font-semibold">
              {cms.footer?.subtitleId || "Peringatan 20 Tahun Gedung Kuang Hang Fo Thang (2006 — 2026)"}
            </span>
          </div>

          {/* Sacred Footer Quote from CMS */}
          <p className="text-xs font-serif italic text-stone-600 max-w-xl mx-auto">
            &ldquo;{cms.footer?.quoteId ||
              "Tiada kata yang mampu melukiskan rasa syukur atas Tian En Shi De serta ketulusan seluruh umat yang telah menyatukan hati dalam mengarungi samudra kebajikan selama dua dasawarsa."}&rdquo;
          </p>
          {cms.footer?.quoteZh && (
            <p className="font-chinese text-xs text-stone-500">
              {cms.footer.quoteZh}
            </p>
          )}

          {/* Social Instagram Link from CMS */}
          {cms.footer?.instagramUrl && (
            <div className="pt-2">
              <a
                href={cms.footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#7C1818] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C5983A]" />
                <span>{cms.footer.instagramHandle || "@guanghangfotang"}</span>
              </a>
            </div>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:border-[#C5983A] transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#7C1818]" />
              <span>{cms.footer?.backToTopTextId || "Kembali ke Atas"}</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsFolioOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C1818] text-white hover:bg-[#601212] transition-colors"
            >
              <ScrollText className="w-3.5 h-3.5 text-[#E6C275]" />
              <span>{cms.footer?.reopenTextId || "Buka Ulang Sampul"}</span>
            </button>
          </div>

          <div className="text-[10px] text-stone-400 pt-6 border-t border-stone-200">
            {cms.footer?.copyrightText || "© 2006 — 2026 Kuang Hang Fo Thang. Seluruh Hak Dilindungi."}
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function HomePage() {
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
