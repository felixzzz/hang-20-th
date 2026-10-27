"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
  Minimize2,
  X,
  CreditCard,
  Flame,
  ArrowUp,
  Bookmark,
  Share2,
  Phone,
  Train,
  Car,
  Navigation,
  Monitor,
  Folder,
  FileText,
  Music,
  Trash2,
  HelpCircle,
  Play,
  Pause,
  Square,
  FastForward,
  Rewind,
  Copy,
  Info,
  Sliders,
  Terminal,
  Download,
  Search,
  Power,
  RotateCw,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones, sortMilestonesByYear } from "@/data/history";
import { galleryItems } from "@/data/gallery";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// 8-bit retro sound synthesizer using Web Audio API
const playRetroClick = (freq = 900) => {
  try {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {
    // Non-blocking
  }
};

function Home7RetroComputerContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  // Active Window & Tab State
  type TabType = "welcome" | "sejarah" | "acara" | "galeri" | "rsvp" | "donasi";
  const [activeTab, setActiveTab] = useState<TabType>("welcome");
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const [showWinamp, setShowWinamp] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [crtEffect, setCrtEffect] = useState(false);
  const [showRecycleBinModal, setShowRecycleBinModal] = useState(false);

  // Real YouTube Audio Player Integration
  const ytPlayerRef = useRef<any>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(85);
  const [audioCurrentSeconds, setAudioCurrentSeconds] = useState(0);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    const initPlayer = () => {
      if (ytPlayerRef.current) return;
      try {
        ytPlayerRef.current = new window.YT.Player("home7-youtube-audio-player", {
          height: "1",
          width: "1",
          videoId: "__vWA6Lv9pE",
          playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: "__vWA6Lv9pE",
            controls: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsAudioReady(true);
              try {
                event.target.setVolume(audioVolume);
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlayingAudio(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlayingAudio(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn("YouTube player init error:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById("yt-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }
  }, [audioVolume]);

  // Audio Playback Controls
  const togglePlayAudio = () => {
    playRetroClick();
    if (!ytPlayerRef.current) return;
    try {
      if (isPlayingAudio) {
        ytPlayerRef.current.pauseVideo();
        setIsPlayingAudio(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlayingAudio(true);
      }
    } catch (e) {
      console.warn("togglePlayAudio error:", e);
    }
  };

  const stopAudio = () => {
    playRetroClick(400);
    if (!ytPlayerRef.current) return;
    try {
      ytPlayerRef.current.stopVideo();
      setIsPlayingAudio(false);
      setAudioCurrentSeconds(0);
    } catch (e) {}
  };

  const changeVolume = (newVol: number) => {
    setAudioVolume(newVol);
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      try {
        ytPlayerRef.current.setVolume(newVol);
      } catch (e) {}
    }
  };

  // Equalizer Spectrum & Timer Simulation
  const [spectrumHeights, setSpectrumHeights] = useState([35, 60, 80, 55, 90, 75, 45, 70, 85, 50]);

  useEffect(() => {
    let timer: any;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioCurrentSeconds((prev) => prev + 1);
        setSpectrumHeights(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 15)
        );
      }, 1000);
    } else {
      setSpectrumHeights([15, 20, 25, 20, 15, 20, 25, 20, 15, 10]);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const formatAudioTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Live Real-Time Clock
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Target Countdown
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

  // Milestones (Sorted by Year Chronologically!)
  const rawMilestones = cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const milestones = sortMilestonesByYear(rawMilestones);
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(0);
  const currentMilestone = milestones[selectedMilestoneIdx] || milestones[0];

  // RSVP Form State
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
    playRetroClick(1200);
    setRsvpError("");

    if (!rsvpName.trim()) {
      setRsvpError("Nama wajib diisi. • 請填寫您的姓名。");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName.trim(),
          status: rsvpStatus,
          guests: parseInt(rsvpGuests) || 1,
          message: rsvpMessage.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setSubmitted(true);
        if (Array.isArray(json.data)) {
          setWishes(json.data);
          if (json.summary) setSummary(json.summary);
        }
      } else {
        setRsvpError(json.error || "Gagal mengirim data konfirmasi.");
      }
    } catch (err) {
      setRsvpError("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAddress = () => {
    playRetroClick();
    const addr =
      cms.event.address ||
      "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyAccount = () => {
    playRetroClick();
    navigator.clipboard.writeText(cms.donation.accountNumber || "5271888206");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang (1997-2026). Sabtu, 14 November 2026 Pukul 19.00 WIB."
  )}&location=${encodeURIComponent(
    cms.event.address || "Jl. Palmerah Utara III No. 186A, Jakarta Barat"
  )}`;

  // iCal Download URL
  const generateIcsUrl = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kuang Hang Fo Thang//20th Anniversary//ID",
      "BEGIN:VEVENT",
      "UID:guanghang-20th-anniversary-2026@fothang.org",
      "DTSTAMP:20261114T120000Z",
      "DTSTART:20261114T120000Z",
      "DTEND:20261114T150000Z",
      "SUMMARY:20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)",
      "DESCRIPTION:Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang (Sabtu, 14 November 2026). Mengarungi Samudra Kebajikan.",
      "LOCATION:Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  const openTab = (tab: TabType) => {
    playRetroClick();
    setActiveTab(tab);
    setIsWindowMinimized(false);
    setShowStartMenu(false);
  };

  return (
    <div
      className={`min-h-screen bg-[#008080] text-black font-sans selection:bg-[#000080] selection:text-white relative overflow-x-hidden pb-14 ${
        crtEffect ? "crt-scanlines" : ""
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, #008b8b 0%, #007070 100%)`,
      }}
    >
      {/* Hidden YouTube Audio Player Container (Preserves Audio Playback without being paused by browser) */}
      <div
        className="fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <div id="home7-youtube-audio-player" />
      </div>

      {/* CRT Scanline Filter Overlay (Toggleable in Menu) */}
      {crtEffect && (
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))`,
            backgroundSize: `100% 3px, 6px 100%`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Desktop Container */}
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-start relative z-10">
        
        {/* ============================================================== */}
        {/* DESKTOP ICONS                                                  */}
        {/* ============================================================== */}
        <div className="w-full lg:w-28 flex lg:flex-col flex-wrap gap-2 lg:gap-3 shrink-0 select-none pb-1 lg:pb-0">
          
          {/* Main Temple / Undangan Icon with Guang Ji Logo */}
          <button
            onClick={() => openTab("welcome")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 p-1.5 group-active:translate-y-0.5">
              <Image
                src="/images/logo-guang-ji.png"
                alt="Logo Guang Ji"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Undangan.doc
            </span>
          </button>

          <button
            onClick={() => openTab("sejarah")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Clock className="w-6 h-6 text-[#7c1818]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              NapakTilas.exe
            </span>
          </button>

          <button
            onClick={() => openTab("acara")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Calendar className="w-6 h-6 text-[#b5791c]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Jadwal.cal
            </span>
          </button>

          <button
            onClick={() => openTab("galeri")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Sparkles className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Galeri.bmp
            </span>
          </button>

          <button
            onClick={() => openTab("rsvp")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Send className="w-6 h-6 text-[#831f1f]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              RSVP_Form.exe
            </span>
          </button>

          <button
            onClick={() => openTab("donasi")}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <CreditCard className="w-6 h-6 text-[#006600]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Donasi.txt
            </span>
          </button>

          <button
            onClick={() => {
              playRetroClick(600);
              setShowWinamp(!showWinamp);
            }}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#292929] border-t-2 border-l-2 border-t-stone-400 border-l-stone-400 border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Music className="w-6 h-6 text-[#00ff00]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Winamp.exe
            </span>
          </button>

          <button
            onClick={() => {
              playRetroClick(300);
              setShowRecycleBinModal(true);
            }}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 active:bg-white/20 text-white group cursor-pointer transition w-20 sm:w-24 lg:w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black flex items-center justify-center shadow-md mb-1 group-active:translate-y-0.5">
              <Trash2 className="w-6 h-6 text-stone-700" />
            </div>
            <span className="text-[11px] font-mono font-bold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1">
              Recycle Bin
            </span>
          </button>

        </div>

        {/* ============================================================== */}
        {/* MAIN APPLICATION WINDOW (Guang Hang 97 OS)                      */}
        {/* ============================================================== */}
        {!isWindowMinimized && (
          <div
            className={`w-full transition-all duration-200 bg-[#c0c0c0] border-t-2 border-l-2 border-t-[#ffffff] border-l-[#ffffff] border-b-2 border-r-2 border-b-[#000000] border-r-[#000000] shadow-[3px_3px_0px_rgba(0,0,0,0.7)] ${
              isWindowMaximized ? "fixed inset-2 z-40 max-w-none overflow-y-auto" : "relative"
            }`}
          >
            
            {/* Window Title Bar */}
            <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] text-white px-2 py-1.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 truncate pr-2">
                <div className="relative w-4 h-4 shrink-0">
                  <Image
                    src="/images/logo-guang-ji.png"
                    alt="Logo Guang Ji"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-mono font-bold text-xs sm:text-sm tracking-wide truncate">
                  Guang Hang '97 — 20 Tahun Peringatan Gedung (1997 - 2026)
                </span>
              </div>

              {/* Window Control Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    playRetroClick();
                    setIsWindowMinimized(true);
                  }}
                  title="Minimize"
                  className="w-4 h-4 sm:w-5 sm:h-5 bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black flex items-center justify-center text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white cursor-pointer"
                >
                  <Minimize2 className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => {
                    playRetroClick();
                    setIsWindowMaximized(!isWindowMaximized);
                  }}
                  title="Maximize"
                  className="w-4 h-4 sm:w-5 sm:h-5 bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black flex items-center justify-center text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white cursor-pointer"
                >
                  <Square className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => {
                    playRetroClick();
                    setIsWindowMinimized(true);
                  }}
                  title="Close"
                  className="w-4 h-4 sm:w-5 sm:h-5 bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black flex items-center justify-center text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Retro Explorer Menubar */}
            <div className="bg-[#c0c0c0] border-b border-stone-400 px-2 py-1 flex items-center gap-3 text-xs font-mono select-none overflow-x-auto no-scrollbar">
              <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">
                <u>B</u>erkas
              </span>
              <button
                onClick={togglePlayAudio}
                className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer font-bold text-emerald-800 flex items-center gap-1"
              >
                <Music className="w-3 h-3" />
                <span><u>M</u>usik: {isPlayingAudio ? "[PLAYING]" : "[PAUSED]"}</span>
              </button>
              <button
                onClick={() => {
                  playRetroClick();
                  setLang(lang === "id" ? "zh" : "id");
                }}
                className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer font-bold"
              >
                <u>B</u>ahasa: {lang === "id" ? "INDONESIA" : "中文"}
              </button>
              <button
                onClick={() => {
                  playRetroClick();
                  setCrtEffect(!crtEffect);
                }}
                className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer"
              >
                <u>C</u>RT-FX: {crtEffect ? "[ON]" : "[OFF]"}
              </button>
              <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">
                <u>B</u>antuan
              </span>
            </div>

            {/* Address Bar */}
            <div className="bg-[#c0c0c0] border-b border-stone-400 p-1.5 flex items-center gap-2 text-xs font-mono select-none">
              <span className="text-stone-700 font-bold shrink-0">Alamat:</span>
              <div className="grow bg-white border-t border-l border-t-[#808080] border-l-[#808080] border-b border-r border-b-[#ffffff] border-r-[#ffffff] px-2 py-0.5 truncate text-stone-800">
                C:\GuangHang_1997_2026\{activeTab.toUpperCase()}.EXE
              </div>
            </div>

            {/* Classic 90s Tab Strip */}
            <div className="bg-[#c0c0c0] pt-2 px-2 border-b border-stone-400 flex items-center gap-1 overflow-x-auto no-scrollbar select-none">
              {[
                { id: "welcome", label: "📄 Surat Undangan", short: "Surat" },
                { id: "sejarah", label: "⏳ Napak Tilas (1997-2026)", short: "Sejarah" },
                { id: "acara", label: "📅 Waktu & Acara", short: "Acara" },
                { id: "galeri", label: "🖼️ Galeri Foto", short: "Galeri" },
                { id: "rsvp", label: "✍️ Buku Tamu / RSVP", short: "RSVP" },
                { id: "donasi", label: "💳 Dana Kebajikan", short: "Donasi" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => openTab(tab.id as TabType)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold cursor-pointer rounded-t-sm transition-none border-t-2 border-l-2 border-r-2 whitespace-nowrap ${
                      isActive
                        ? "bg-[#ffffff] text-black border-t-white border-l-white border-r-black pb-2.5 -mb-1 relative z-10 shadow-xs"
                        : "bg-[#c0c0c0] text-stone-700 hover:text-black border-t-white border-l-white border-r-black"
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Sunken Main Content Well */}
            <div className="p-3 sm:p-6 bg-white min-h-[520px] max-h-[75vh] overflow-y-auto border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-b-2 border-r-2 border-b-white border-r-white">
              
              {/* ============================================================== */}
              {/* TAB 1: SURAT UNDANGAN & SAMBUTAN                               */}
              {/* ============================================================== */}
              {activeTab === "welcome" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  {/* Top VIP Badge Certificate */}
                  <div className="p-4 bg-[#faf7f0] border-2 border-[#831f1f] rounded-xs shadow-xs text-center space-y-2">
                    <div className="inline-block px-2.5 py-0.5 bg-[#831f1f] text-white font-mono text-[11px] font-bold tracking-widest uppercase">
                      OFFICIAL INVITATION • 尊榮邀請函
                    </div>
                    <h1 className="text-xl sm:text-3xl font-chinese font-bold text-[#831f1f]">
                      廣航佛堂 • 成立廿週年堂慶紀念 (1997 — 2026)
                    </h1>
                    <p className="font-mono text-xs text-stone-600">
                      Peringatan 20 Tahun Peresmian Gedung Kuang Hang Fo Thang • Palmerah, Jakarta Barat
                    </p>
                  </div>

                  {/* Personal Guest Card */}
                  <div className="p-4 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-700 block font-bold">
                      SURAT PENGHORMATAN KEPADA:
                    </span>
                    <div className="p-3 bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-b-2 border-r-2 border-b-white border-r-white">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#831f1f]">
                        {guestName}
                      </h2>
                      <p className="text-xs font-mono text-stone-600 mt-1">
                        {showId && "Dengan penuh hormat mengundang kehadiran Anda dalam malam syukur dua dasawarsa Kuang Hang."}
                        {showId && showZh && " • "}
                        {showZh && <span className="font-chinese">謹代表全體道親，誠摯敬邀閣下撥冗蒞臨，同沾法喜。</span>}
                      </p>
                    </div>
                  </div>

                  {/* Audio Starter Callout if Audio not yet playing */}
                  {!isPlayingAudio && (
                    <div className="p-3 bg-emerald-50 border border-emerald-500 flex items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Music className="w-4 h-4 animate-bounce" />
                        <span>Musik hymne perayaan belum diputar. Sentuh tombol untuk memulai musik.</span>
                      </div>
                      <button
                        onClick={togglePlayAudio}
                        className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-xs hover:bg-emerald-800 cursor-pointer shrink-0"
                      >
                        ▶ Putar Lagu
                      </button>
                    </div>
                  )}

                  {/* Retro 90s LED Green Digital Countdown Box */}
                  <div className="p-4 bg-black border-2 border-stone-600 rounded-xs text-center space-y-2 select-none shadow-inner">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                      SYSTEM TIMER • COUNTDOWN TO 14 NOVEMBER 2026 (19:00 WIB)
                    </span>
                    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-emerald-400 font-mono">
                      <div className="p-2 bg-[#051a0d] border border-emerald-900 rounded-xs">
                        <span className="text-2xl sm:text-4xl font-bold block">
                          {String(timeLeft.days).padStart(3, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600">DAYS</span>
                      </div>
                      <div className="p-2 bg-[#051a0d] border border-emerald-900 rounded-xs">
                        <span className="text-2xl sm:text-4xl font-bold block">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600">HOURS</span>
                      </div>
                      <div className="p-2 bg-[#051a0d] border border-emerald-900 rounded-xs">
                        <span className="text-2xl sm:text-4xl font-bold block">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600">MINS</span>
                      </div>
                      <div className="p-2 bg-[#051a0d] border border-emerald-900 rounded-xs">
                        <span className="text-2xl sm:text-4xl font-bold block">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600">SECS</span>
                      </div>
                    </div>
                  </div>

                  {/* Sacred Story & Commemorative Photo */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                    <div className="md:col-span-7 space-y-3 font-serif">
                      <div className="p-3 bg-[#fffbe6] border-l-4 border-amber-500 text-xs sm:text-sm text-stone-800 leading-relaxed italic">
                        &ldquo;{cms.hero.quoteId || "Mengarungi samudra kebajikan selama dua dasawarsa, merajut persaudaraan se-dharma, menyalakan pelita suci Shizun dan Shimu."}&rdquo;
                        {showZh && (
                          <p className="font-chinese not-italic text-stone-600 mt-1">
                            「{cms.hero.quoteZh || "廿載白陽開聖境，同舟共濟渡群生。願以至誠之心，薪火相傳，護持白陽慧命於永恆。"}」
                          </p>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                        {showId && (
                          <p>
                            {cms.hero.storyParagraphId ||
                              "Pada tanggal 12 November 2006, berkat karunia tak terhingga dari Tian En Shi De serta ketulusan hati para pendahulu, gedung Kuang Hang Fo Thang resmi berdiri kokoh di Palmerah. Hari ini, kami mengundang Anda untuk bersama menundukkan kepala dalam syukur dan memperbaharui ikrar kebajikan."}
                          </p>
                        )}
                        {showZh && (
                          <p className="font-chinese text-xs sm:text-sm text-stone-600 pt-2 border-t border-stone-200">
                            {cms.hero.storyParagraphZh ||
                              "廿年前（2006年11月12日），在天恩師德庇佑與前賢們無私奉獻下，廣航佛堂正式落成安座。廿載韶華，慧光普照。今日誠摯恭請十方善信大德共聚一堂，追思感恩，同沾法喜。"}
                          </p>
                        )}
                      </div>

                      {/* Quick Action Navigation Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={() => openTab("sejarah")}
                          className="px-4 py-2 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Lihat Napak Tilas (1997-2026) &gt;</span>
                        </button>
                        <button
                          onClick={() => openTab("rsvp")}
                          className="px-4 py-2 bg-[#000080] text-white border-t-2 border-l-2 border-t-[#8080ff] border-l-[#8080ff] border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-[#8080ff] active:border-r-[#8080ff] font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Isi RSVP Kehadiran</span>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="p-2 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black shadow-md">
                        <div className="relative aspect-[4/3] bg-stone-900 border border-stone-400 overflow-hidden">
                          <Image
                            src="/images/guang-hang-10.jpg"
                            alt="Kebersamaan & Perjuangan Kuang Hang Fo Thang"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                        <div className="p-1 text-[10px] font-mono text-center text-stone-700 bg-stone-100 border-t border-stone-300 mt-1">
                          FILE: GUANGHANG_10.BMP (同舟共濟 • 2000)
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: NAPAK TILAS 20 TAHUN (SORTED BY YEAR!)                  */}
              {/* ============================================================== */}
              {activeTab === "sejarah" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  <div className="border-b border-stone-300 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-mono font-bold text-sm sm:text-base text-[#831f1f] flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Napak Tilas 20 Tahun • 歲月印記 (1997 — 2026)</span>
                      </h3>
                      <p className="text-xs font-mono text-stone-500">
                        Urutan kronologis sejarah perintisan (Otomatis tersortir berdasarkan tahun).
                      </p>
                    </div>

                    <span className="text-[11px] font-mono bg-stone-100 px-2 py-1 border border-stone-300 font-bold">
                      Tahapan: {selectedMilestoneIdx + 1} / {milestones.length}
                    </span>
                  </div>

                  {/* Year Step Buttons Track */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                    {milestones.map((m, idx) => (
                      <button
                        key={m.year + idx}
                        onClick={() => {
                          playRetroClick();
                          setSelectedMilestoneIdx(idx);
                        }}
                        className={`px-3 py-1.5 text-xs font-mono font-bold shrink-0 cursor-pointer border-t-2 border-l-2 border-b-2 border-r-2 ${
                          selectedMilestoneIdx === idx
                            ? "bg-[#000080] text-white border-t-[#000080] border-l-[#000080] border-b-white border-r-white"
                            : "bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black hover:bg-stone-200"
                        }`}
                      >
                        {m.year}
                      </button>
                    ))}
                  </div>

                  {/* Active Milestone Card */}
                  {currentMilestone && (
                    <div className="p-4 sm:p-6 bg-[#faf8f5] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black space-y-4">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl sm:text-3xl font-mono font-bold text-[#831f1f]">
                            {currentMilestone.year}
                          </span>
                          {currentMilestone.location && (
                            <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#b5791c]" />
                              {currentMilestone.location}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              playRetroClick();
                              setSelectedMilestoneIdx((prev) =>
                                (prev - 1 + milestones.length) % milestones.length
                              );
                            }}
                            className="px-2.5 py-1 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black text-xs font-mono font-bold cursor-pointer"
                          >
                            &lt; Prev
                          </button>
                          <button
                            onClick={() => {
                              playRetroClick();
                              setSelectedMilestoneIdx((prev) => (prev + 1) % milestones.length);
                            }}
                            className="px-2.5 py-1 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black text-xs font-mono font-bold cursor-pointer"
                          >
                            Next &gt;
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-7 space-y-3 font-serif">
                          <h4 className="text-xl sm:text-2xl font-bold text-stone-900">
                            {showId && currentMilestone.title}
                            {showId && showZh && currentMilestone.chineseTitle && " • "}
                            {showZh && (
                              <span className="font-chinese text-[#831f1f]">
                                {currentMilestone.chineseTitle}
                              </span>
                            )}
                          </h4>

                          <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                            {showId && <p>{currentMilestone.description}</p>}
                            {showZh && currentMilestone.chineseDescription && (
                              <p className="font-chinese text-xs sm:text-sm text-stone-600 border-t border-stone-200 pt-2">
                                {currentMilestone.chineseDescription}
                              </p>
                            )}
                          </div>

                          {(currentMilestone.highlight || currentMilestone.chineseHighlight) && (
                            <div className="p-3 bg-[#fff8e7] border-l-3 border-[#dfba6d] text-xs font-mono text-stone-800 italic">
                              &ldquo;{currentMilestone.highlight}&rdquo;
                              {showZh && currentMilestone.chineseHighlight && (
                                <p className="font-chinese not-italic text-stone-600 mt-1">
                                  「{currentMilestone.chineseHighlight}」
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-5">
                          <div className="p-2 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black">
                            <div className="relative aspect-[4/3] bg-stone-900 border border-stone-400 overflow-hidden">
                              {currentMilestone.image ? (
                                <Image
                                  src={currentMilestone.image}
                                  alt={currentMilestone.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 350px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-stone-400">
                                  [NO_IMAGE.BMP]
                                </div>
                              )}
                            </div>
                            <div className="p-1 text-[10px] font-mono text-center text-stone-600 bg-stone-100 border-t border-stone-300 mt-1 truncate">
                              MILESTONE_{currentMilestone.year}.JPG
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: WAKTU & ACARA                                           */}
              {/* ============================================================== */}
              {activeTab === "acara" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  <div className="border-b border-stone-300 pb-3">
                    <h3 className="font-mono font-bold text-sm sm:text-base text-[#831f1f] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Jadwal & Lokasi Pelaksanaan • 慶典日程</span>
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Rincian waktu, busana, dan petunjuk navigasi menuju Kuang Hang Fo Thang.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tanggal */}
                    <div className="p-4 bg-[#f8f9fa] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black text-center space-y-1">
                      <Calendar className="w-6 h-6 mx-auto text-[#831f1f]" />
                      <span className="text-[10px] font-mono uppercase text-stone-500 block">TANGGAL</span>
                      <h4 className="text-base font-bold font-mono text-stone-900">{cms.event.dateTextId}</h4>
                      {showZh && <span className="font-chinese text-xs text-stone-600 block">{cms.event.dateTextZh}</span>}
                    </div>

                    {/* Waktu */}
                    <div className="p-4 bg-[#f8f9fa] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black text-center space-y-1">
                      <Clock className="w-6 h-6 mx-auto text-[#000080]" />
                      <span className="text-[10px] font-mono uppercase text-stone-500 block">WAKTU</span>
                      <h4 className="text-base font-bold font-mono text-stone-900">{cms.event.timeTextId}</h4>
                      <p className="text-[11px] font-mono text-stone-600">{cms.event.timeNotesId}</p>
                    </div>

                    {/* Dress Code */}
                    <div className="p-4 bg-[#f8f9fa] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black text-center space-y-1">
                      <Shirt className="w-6 h-6 mx-auto text-[#b5791c]" />
                      <span className="text-[10px] font-mono uppercase text-stone-500 block">DRESS CODE</span>
                      <h4 className="text-base font-bold font-mono text-stone-900">{cms.event.dresscodeId}</h4>
                      <p className="text-[11px] font-mono text-stone-600">{cms.event.dresscodeNotesId}</p>
                    </div>
                  </div>

                  {/* Lokasi Card */}
                  <div className="p-4 bg-[#faf7f0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#831f1f]" />
                      <h4 className="font-mono font-bold text-sm text-stone-900">
                        {cms.event.venueNameId || "Kuang Hang Fo Thang (廣航佛堂)"}
                      </h4>
                    </div>
                    <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 border border-stone-300">
                      {cms.event.address || "Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480"}
                    </p>

                    {/* Action Buttons for Navigation & Calendar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                      <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold flex items-center gap-1.5"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Google Calendar</span>
                      </a>

                      <a
                        href={generateIcsUrl()}
                        download="Undangan_20Tahun_KuangHang.ics"
                        className="px-3 py-1.5 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Apple Calendar (.ICS)</span>
                      </a>

                      <button
                        onClick={copyAddress}
                        className="px-3 py-1.5 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold flex items-center gap-1.5"
                      >
                        {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAddress ? "Tersalin!" : "Salin Alamat"}</span>
                      </button>

                      <a
                        href={cms.event.googleMapsUrl || "https://maps.google.com/?q=Kuang+Hang+Fo+Thang"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#000080] text-white border-t-2 border-l-2 border-t-[#8080ff] border-l-[#8080ff] border-b-2 border-r-2 border-b-black border-r-black font-bold flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Buka Google Maps</span>
                      </a>

                      <a
                        href="https://waze.com/ul?q=Kuang%20Hang%20Fo%20Thang"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#33ccff] text-stone-900 border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black font-bold flex items-center gap-1.5"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Waze Navigasi</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: GALERI FOTO (90s PICTURE VIEWER)                        */}
              {/* ============================================================== */}
              {activeTab === "galeri" && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  
                  <div className="border-b border-stone-300 pb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div>
                      <h3 className="font-bold text-[#831f1f] flex items-center gap-1.5">
                        <Monitor className="w-4 h-4" />
                        <span>Image Viewer 98 — C:\GuangHang\Photos\ ({filteredGallery.length} files)</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {(["all", "sejarah", "kegiatan", "kebersamaan"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            playRetroClick();
                            setGalleryFilter(cat);
                          }}
                          className={`px-2 py-0.5 border text-[11px] font-mono cursor-pointer font-bold ${
                            galleryFilter === cat
                              ? "bg-[#000080] text-white border-[#000080]"
                              : "bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black"
                          }`}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail Explorer Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredGallery.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => {
                          playRetroClick();
                          setActivePhoto(item);
                        }}
                        className="p-1.5 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black cursor-pointer hover:bg-stone-200 transition group select-none"
                      >
                        <div className="relative aspect-square bg-stone-900 border border-stone-400 overflow-hidden">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        </div>
                        <div className="mt-1">
                          <span className="text-[10px] font-mono font-bold text-stone-900 block truncate">
                            {item.title}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 block truncate">
                            IMAGE_{idx + 1}.BMP (256 KB)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: BUKU TAMU & RSVP (90s MIRC / BBS CHAT)                  */}
              {/* ============================================================== */}
              {activeTab === "rsvp" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  <div className="border-b border-stone-300 pb-3">
                    <h3 className="font-mono font-bold text-sm sm:text-base text-[#831f1f] flex items-center gap-1.5">
                      <Send className="w-4 h-4" />
                      <span>RSVP_Form.exe — Konfirmasi Kehadiran & Doa Restu</span>
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Mohon konfirmasikan kehadiran Anda untuk persiapan logistik dan konsumsi vegetarian.
                    </p>
                  </div>

                  {/* Summary Counters */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="p-2 bg-[#f0f0f0] border border-stone-300 text-center">
                      <span className="text-stone-500 block text-[10px]">TOTAL RESPON</span>
                      <strong className="text-base text-stone-900">{summary.totalResponses}</strong>
                    </div>
                    <div className="p-2 bg-[#e6f4ea] border border-emerald-300 text-center">
                      <span className="text-emerald-700 block text-[10px]">HADIR</span>
                      <strong className="text-base text-emerald-800">{summary.attending}</strong>
                    </div>
                    <div className="p-2 bg-[#e8f0fe] border border-blue-300 text-center">
                      <span className="text-blue-700 block text-[10px]">TOTAL PAX/KURSI</span>
                      <strong className="text-base text-blue-800">{summary.totalGuests}</strong>
                    </div>
                  </div>

                  {/* Retro Form */}
                  <form onSubmit={handleRsvpSubmit} className="p-4 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black space-y-3 font-mono text-xs">
                    
                    {submitted ? (
                      <div className="p-4 bg-emerald-100 border border-emerald-500 text-emerald-900 text-center space-y-2">
                        <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="font-bold text-sm">TERIMA KASIH! KONFIRMASI TELAH DITERIMA</h4>
                        <p className="text-xs">
                          Semoga berkah Tian En Shi De senantiasa menyertai Anda dan keluarga.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          className="px-3 py-1 bg-white border border-emerald-600 text-xs font-bold text-emerald-800 mt-2"
                        >
                          Ubah / Kirim Respons Baru
                        </button>
                      </div>
                    ) : (
                      <>
                        {rsvpError && (
                          <div className="p-2 bg-red-100 border border-red-500 text-red-700 text-xs font-bold">
                            ERROR: {rsvpError}
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800 block">
                            Nama Lengkap / 姓名:
                          </label>
                          <input
                            type="text"
                            value={rsvpName}
                            onChange={(e) => setRsvpName(e.target.value)}
                            placeholder="Contoh: Lim TC Felix"
                            className="w-full px-3 py-1.5 bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-b-2 border-r-2 border-b-white border-r-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800 block">
                            Status Kehadiran / 出席確認:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "hadir", label: "(•) Hadir (出席)" },
                              { id: "ragu", label: "(?) Ragu (保留)" },
                              { id: "tidak_hadir", label: "(x) Doa Restu" },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  playRetroClick();
                                  setRsvpStatus(opt.id as any);
                                }}
                                className={`p-2 border text-left font-bold ${
                                  rsvpStatus === opt.id
                                    ? "bg-[#000080] text-white border-[#000080]"
                                    : "bg-white text-stone-800 border-stone-400"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {rsvpStatus === "hadir" && (
                          <div className="space-y-1">
                            <label className="font-bold text-stone-800 block">
                              Jumlah Tamu Hadir / 人數:
                            </label>
                            <select
                              value={rsvpGuests}
                              onChange={(e) => setRsvpGuests(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-b-2 border-r-2 border-b-white border-r-white outline-none"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num} Orang (Pax)
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800 block">
                            Pesan Doa Restu / 祝禱心願:
                          </label>
                          <textarea
                            rows={3}
                            value={rsvpMessage}
                            onChange={(e) => setRsvpMessage(e.target.value)}
                            placeholder="Tuliskan ucapan selamat atau doa syukur Anda..."
                            className="w-full px-3 py-1.5 bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-b-2 border-r-2 border-b-white border-r-white outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-mono text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? "TRANSMITTING DATA..." : "[ SUBMIT_CONFIRMATION.EXE ]"}
                        </button>
                      </>
                    )}

                  </form>

                  {/* 90s mIRC / BBS Live Chat Log */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-stone-600">
                      <span className="font-bold">#guanghang-20th-chat-log ({wishes.length} messages)</span>
                      <span>IRC v2.9</span>
                    </div>

                    <div className="p-3 bg-[#000000] text-[#00ff00] font-mono text-xs border border-stone-800 rounded-xs max-h-56 overflow-y-auto space-y-1.5 shadow-inner">
                      <div className="text-stone-500 pb-1 border-b border-stone-800">
                        *** Channel #guanghang-20th joined on 14-Nov-2026. Mode is +tn.
                      </div>
                      {wishes.map((w, idx) => (
                        <div key={w.id || idx} className="leading-relaxed">
                          <span className="text-amber-400 font-bold">&lt;{w.name}&gt;</span>{" "}
                          <span className="text-stone-300">{w.message || "(Menghadiri dengan penuh syukur)"}</span>{" "}
                          <span className="text-[10px] text-stone-600">
                            [{w.status === "hadir" ? "HADIR" : "RESTU"}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 6: DANA KEBAJIKAN (NOTEPAD.EXE STYLE)                      */}
              {/* ============================================================== */}
              {activeTab === "donasi" && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  
                  {/* Notepad style window */}
                  <div className="p-4 bg-[#fffff0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black font-mono text-xs space-y-4 shadow-sm">
                    <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
                      <span className="font-bold text-stone-800">
                        NOTEPAD.EXE - C:\GuangHang\DANA_KEBAJIKAN.TXT
                      </span>
                      <span className="text-stone-500 text-[10px]">DOS Text Document</span>
                    </div>

                    <div className="space-y-2 text-stone-800 leading-relaxed">
                      <p>
                        =======================================================
                        <br />
                        DANA KEBAJIKAN &bull; 隨喜功德 (KUANG HANG FO THANG)
                        <br />
                        =======================================================
                      </p>
                      <p>
                        {cms.donation.descriptionId ||
                          "Bagi umat yang tergerak menyisihkan kebajikan untuk operasional wadah ketuhanan dan pemeliharaan gedung."}
                      </p>
                      {showZh && (
                        <p className="font-chinese text-stone-600">
                          {cms.donation.descriptionZh ||
                            "誠摯感恩各位前賢隨喜護持道場弘法利生聖業，功德無量。"}
                        </p>
                      )}
                    </div>

                    {/* Bank Account Info Box */}
                    <div className="p-4 bg-white border border-stone-400 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 text-[11px]">BANK ACCOUNT:</span>
                        <span className="font-bold text-[#831f1f]">{cms.donation.bankName || "BCA"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 text-[11px]">NOMOR REKENING:</span>
                        <span className="font-bold text-base sm:text-lg tracking-wider text-black">
                          {cms.donation.accountNumber || "5271888206"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 text-[11px]">ATAS NAMA:</span>
                        <span className="font-bold text-stone-800">{cms.donation.accountHolder || "FELIX SALIM"}</span>
                      </div>

                      <button
                        onClick={copyAccount}
                        className="w-full mt-2 py-1.5 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? "NOMOR REKENING TERSALIN!" : "SALIN NOMOR REKENING"}</span>
                      </button>
                    </div>

                    {/* QRIS Display if Available */}
                    {cms.donation.qrisImage && (
                      <div className="p-3 bg-white border border-stone-400 text-center space-y-2">
                        <span className="text-[11px] font-bold text-stone-700 block">QRIS PEMBAYARAN DIGITAL</span>
                        <div className="relative w-48 h-48 mx-auto border border-stone-300">
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

                </div>
              )}

            </div>

            {/* Retro Status Bar */}
            <div className="bg-[#c0c0c0] border-t border-stone-400 px-2 py-1 flex items-center justify-between text-[11px] font-mono text-stone-700 select-none">
              <div className="flex items-center gap-2 truncate">
                <span className="px-1.5 py-0.2 bg-stone-300 border border-stone-400">Ready</span>
                <span className="truncate">Tamu: {guestName}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span>14-NOV-2026</span>
                <span className="hidden sm:inline">WINDOWS 97 v1.997</span>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* RETRO WINAMP 2.91 AUDIO PLAYER (FLOATING / MOVEABLE)           */}
        {/* ============================================================== */}
        {showWinamp && (
          <div className="w-full lg:w-72 bg-[#292929] border-t-2 border-l-2 border-t-stone-400 border-l-stone-400 border-b-2 border-r-2 border-b-black border-r-black shadow-2xl p-1 select-none font-mono shrink-0">
            
            {/* Winamp Titlebar */}
            <div className="bg-gradient-to-r from-[#000080] via-[#0000aa] to-[#000080] text-[#00ff00] text-[10px] px-1.5 py-0.5 flex items-center justify-between font-bold">
              <span className="tracking-widest">WINAMP 2.91 - FO THANG</span>
              <button
                onClick={() => {
                  playRetroClick();
                  setShowWinamp(false);
                }}
                className="text-white hover:text-red-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* LCD Display */}
            <div className="bg-black p-2 border border-stone-700 my-1 space-y-1.5">
              <div className="flex items-center justify-between text-[#00ff00] text-[11px]">
                <div className="flex items-center gap-1">
                  <span className={isPlayingAudio ? "text-emerald-400 animate-pulse" : "text-stone-600"}>●</span>
                  <span className="font-bold">{isPlayingAudio ? "PLAY" : "PAUSED"}</span>
                </div>
                <span className="tracking-wider">{formatAudioTime(audioCurrentSeconds)}</span>
              </div>

              {/* Scrolling Track Name Ticker */}
              <div className="overflow-hidden bg-[#0a1a0f] border border-emerald-950 px-1 py-0.5">
                <div className="text-[10px] text-emerald-400 whitespace-nowrap animate-marquee">
                  *** 01. KUANG HANG FO THANG - HYMNE 20 TAHUN (1997-2026) [128 KBPS / 44 KHZ] ***
                </div>
              </div>

              {/* 10-Band Equalizer Spectrum Visualization */}
              <div className="h-8 flex items-end justify-between gap-1 px-1 bg-[#050e08] border border-emerald-950/50">
                {spectrumHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-xs transition-all duration-150"
                    style={{
                      height: `${h}%`,
                      backgroundColor: h > 75 ? "#ff3333" : h > 45 ? "#ffff00" : "#00ff00",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Winamp Control Buttons */}
            <div className="flex items-center justify-between gap-1 p-1 bg-[#3a3a3a] border border-stone-700">
              <button
                onClick={() => playRetroClick()}
                className="p-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white border border-stone-500 text-[10px] cursor-pointer"
                title="Previous Track"
              >
                <Rewind className="w-3 h-3" />
              </button>
              <button
                onClick={togglePlayAudio}
                className="grow py-1.5 px-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#00ff00] border border-stone-500 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAudio ? "PAUSE" : "PLAY"}</span>
              </button>
              <button
                onClick={stopAudio}
                className="p-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white border border-stone-500 text-[10px] cursor-pointer"
                title="Stop Audio"
              >
                <Square className="w-3 h-3" />
              </button>
              <button
                onClick={() => playRetroClick()}
                className="p-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white border border-stone-500 text-[10px] cursor-pointer"
                title="Next Track"
              >
                <FastForward className="w-3 h-3" />
              </button>
            </div>

            {/* Volume Slider Bar */}
            <div className="p-1.5 bg-[#2d2d2d] border border-stone-700 mt-1 flex items-center gap-2 text-[10px] text-stone-300">
              <Volume2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => changeVolume(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-black rounded cursor-pointer"
              />
              <span className="w-6 text-right font-mono text-emerald-400">{audioVolume}%</span>
            </div>

            <div className="p-1 text-[9px] text-stone-400 text-center font-mono">
              AUDIO: INSTRUMENTAL HARMONI FO THANG
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* WINDOWS 95 BOTTOM TASKBAR (FIXED)                              */}
      {/* ============================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-t-white border-b-2 border-b-black z-50 flex items-center justify-between px-1.5 select-none font-mono">
        
        {/* Left: Start Button & Taskbar Windows */}
        <div className="flex items-center gap-2">
          
          {/* Start Button with Official Guang Ji Logo */}
          <button
            onClick={() => {
              playRetroClick(showStartMenu ? 500 : 1000);
              setShowStartMenu(!showStartMenu);
            }}
            className={`h-7 sm:h-7.5 flex items-center gap-1.5 px-2 sm:px-2.5 text-xs font-bold font-sans cursor-pointer select-none transition-none shadow-xs ${
              showStartMenu
                ? "bg-[#c0c0c0] border-t-2 border-l-2 border-t-black border-l-black border-b-2 border-r-2 border-b-white border-r-white pt-0.5"
                : "bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
            }`}
          >
            <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo-guang-ji.png"
                alt="Logo Guang Ji"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="font-bold tracking-normal text-stone-900 text-xs">
              Start
            </span>
          </button>

          {/* Running Windows Task Tabs */}
          <button
            onClick={() => {
              playRetroClick();
              setIsWindowMinimized(!isWindowMinimized);
            }}
            className={`h-7 hidden sm:flex items-center gap-1.5 px-3 text-xs font-mono font-bold cursor-pointer max-w-[200px] truncate ${
              !isWindowMinimized
                ? "bg-[#e0e0e0] border-t-2 border-l-2 border-t-black border-l-black border-b-2 border-r-2 border-b-white border-r-white text-black"
                : "bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black text-stone-700"
            }`}
          >
            <div className="relative w-3.5 h-3.5 shrink-0">
              <Image
                src="/images/logo-guang-ji.png"
                alt="Logo Guang Ji"
                width={14}
                height={14}
                className="object-contain"
              />
            </div>
            <span className="truncate">Guang Hang '97</span>
          </button>

          <button
            onClick={() => {
              playRetroClick();
              setShowWinamp(!showWinamp);
            }}
            className={`h-7 hidden md:flex items-center gap-1.5 px-3 text-xs font-mono font-bold cursor-pointer max-w-[140px] truncate ${
              showWinamp
                ? "bg-[#e0e0e0] border-t-2 border-l-2 border-t-black border-l-black border-b-2 border-r-2 border-b-white border-r-white text-black"
                : "bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black text-stone-700"
            }`}
          >
            <Music className="w-3.5 h-3.5 shrink-0 text-emerald-800" />
            <span className="truncate">WinAmp</span>
          </button>

        </div>

        {/* Right: System Tray & Clock */}
        <div className="border-t border-l border-t-[#808080] border-l-[#808080] border-b border-r border-b-[#ffffff] border-r-[#ffffff] px-2.5 py-0.5 flex items-center gap-2.5 text-xs font-mono bg-[#c0c0c0] h-7">
          
          <button
            onClick={togglePlayAudio}
            title={isPlayingAudio ? "Mute / Pause Musik" : "Play Musik Latar"}
            className="text-stone-700 hover:text-black cursor-pointer flex items-center gap-1"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            )}
          </button>

          <button
            onClick={() => {
              playRetroClick();
              setLang(lang === "id" ? "zh" : "id");
            }}
            className="font-bold text-[10px] px-1.5 py-0.5 bg-stone-300 border border-stone-400 cursor-pointer hover:bg-stone-200"
            title="Switch Language (ID / 中文)"
          >
            {lang === "id" ? "ID" : "ZH"}
          </button>

          <span className="text-stone-900 font-bold tracking-wider text-[11px] min-w-[58px] text-right">
            {currentTime || "19:00:00"}
          </span>
        </div>

      </footer>

      {/* ============================================================== */}
      {/* START MENU POPUP (WINDOWS 95 STYLE)                             */}
      {/* ============================================================== */}
      {showStartMenu && (
        <>
          {/* Backdrop Overlay to close Start Menu on click outside */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setShowStartMenu(false)}
          />

          <div className="fixed bottom-10 sm:bottom-10.5 left-1.5 z-50 w-64 sm:w-72 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black shadow-2xl flex select-none font-sans">
            
            {/* Vertical Blue Ribbon with Guang Ji Emblem */}
            <div className="w-9 bg-gradient-to-t from-[#000080] via-[#0040a0] to-[#1084d0] flex flex-col justify-between items-center py-2 text-white">
              <div className="relative w-6 h-6">
                <Image
                  src="/images/logo-guang-ji.png"
                  alt="Logo Guang Ji"
                  fill
                  className="object-contain filter brightness-110 drop-shadow-md"
                />
              </div>
              <span className="font-bold font-mono text-xs tracking-widest -rotate-90 origin-center whitespace-nowrap mb-6 text-amber-300">
                GUANG HANG '97
              </span>
            </div>

            {/* Menu Items */}
            <div className="grow p-1 text-xs space-y-0.5">
              <button
                onClick={() => openTab("welcome")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer group"
              >
                <div className="relative w-4 h-4 shrink-0">
                  <Image
                    src="/images/logo-guang-ji.png"
                    alt="Logo Guang Ji"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>Surat Undangan Resmi</span>
              </button>

              <button
                onClick={() => openTab("sejarah")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#7c1818]" />
                <span>Napak Tilas 20 Tahun (1997-2026)</span>
              </button>

              <button
                onClick={() => openTab("acara")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#b5791c]" />
                <span>Jadwal & Lokasi Acara</span>
              </button>

              <button
                onClick={() => openTab("galeri")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>Galeri Foto Arsip</span>
              </button>

              <button
                onClick={() => openTab("rsvp")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#831f1f]" />
                <span>Konfirmasi Kehadiran (RSVP)</span>
              </button>

              <button
                onClick={() => openTab("donasi")}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#006600]" />
                <span>Dana Kebajikan & QRIS</span>
              </button>

              <div className="border-t border-stone-400 my-1" />

              <button
                onClick={() => {
                  togglePlayAudio();
                  setShowStartMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer text-emerald-900 font-bold"
              >
                <Music className="w-4 h-4 text-emerald-700" />
                <span>{isPlayingAudio ? "Pause Musik Latar" : "▶ Putar Musik Latar"}</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick();
                  setShowWinamp(!showWinamp);
                  setShowStartMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-purple-800" />
                <span>{showWinamp ? "Tutup WinAmp" : "Buka WinAmp Player"}</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick();
                  setLang(lang === "id" ? "zh" : "id");
                  setShowStartMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-stone-700" />
                <span>Ganti Bahasa ({lang === "id" ? "Ke 中文" : "Ke Indonesia"})</span>
              </button>

              <div className="border-t border-stone-400 my-1" />

              <button
                onClick={() => {
                  playRetroClick(200);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowStartMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer text-stone-700"
              >
                <Power className="w-4 h-4 text-red-600" />
                <span>Shut Down / Reset Layar...</span>
              </button>
            </div>

          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* LIGHTBOX MODAL (90s IMAGE PREVIEW)                            */}
      {/* ============================================================== */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black shadow-2xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Titlebar */}
            <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between font-mono text-xs font-bold select-none">
              <span className="truncate">IMAGE PREVIEW - {activePhoto.title}</span>
              <button
                onClick={() => setActivePhoto(null)}
                className="w-4 h-4 bg-[#c0c0c0] text-black border border-black flex items-center justify-center text-[10px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-stone-900 border-2 border-stone-600 mt-1">
              <div className="relative w-full h-72 sm:h-96">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="p-2 font-mono text-xs flex items-center justify-between text-stone-800">
              <span className="font-bold">{activePhoto.title}</span>
              <span className="font-chinese text-stone-600">{activePhoto.chineseTitle}</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EASTER EGG RECYCLE BIN MODAL                                   */}
      {/* ============================================================== */}
      {showRecycleBinModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowRecycleBinModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black shadow-2xl p-1 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between font-bold">
              <span>RECYCLE BIN</span>
              <button onClick={() => setShowRecycleBinModal(false)} className="cursor-pointer">✕</button>
            </div>
            <div className="p-4 space-y-3 bg-white border border-stone-400 mt-1 text-center">
              <Trash2 className="w-10 h-10 text-stone-500 mx-auto" />
              <h4 className="font-bold text-sm text-stone-900">Folder Recycle Bin Kosong</h4>
              <p className="text-stone-600 text-xs">
                Segala beban batin, rintangan masa lalu, dan karma buruk telah dibersihkan berkat ketulusan doa dan pembinaan di Fo Thang 🙏
              </p>
              <button
                onClick={() => setShowRecycleBinModal(false)}
                className="px-4 py-1.5 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black font-bold cursor-pointer"
              >
                Tutup (OK)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Home7Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#008080] text-white font-mono">
          <div className="flex flex-col items-center gap-2 p-6 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-black border-r-black shadow-xl">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">
              BOOTING GUANG HANG 97 OS...
            </span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home7RetroComputerContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
