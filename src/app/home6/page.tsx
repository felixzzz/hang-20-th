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
  Phone,
  Train,
  Car,
  Navigation,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { GalleryPhotoItem } from "@/types/cms";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { historyMilestones, sortMilestonesByYear } from "@/data/history";
import { galleryItems } from "@/data/gallery";

function Home6FreshContent() {
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
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  // Milestones
  const rawMilestones = cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const milestones = sortMilestonesByYear(rawMilestones);

  // Japanese style RSVP: ご出席 (Hadir), ご欠席 (Tidak Hadir), 保留 (Masih Ragu)
  const [rsvpName, setRsvpName] = useState(guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName);
  const [attendance, setAttendance] = useState<"attend" | "absent" | "pending">("attend");
  const [guestsCount, setGuestsCount] = useState("1");
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
      setRsvpError("お名前をご記入ください / Mohon isi nama lengkap Anda");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName.trim(),
          status: attendance === "attend" ? "hadir" : "tidak_hadir",
          guests: attendance === "attend" ? parseInt(guestsCount, 10) || 1 : 0,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (attendance === "attend") {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#222222", "#dfba6d", "#7c1818"],
          });
        }
        const refreshed = await fetch("/api/rsvp").then((r) => r.json());
        if (refreshed.success && Array.isArray(refreshed.data)) {
          setWishes(refreshed.data);
          if (refreshed.summary) setSummary(refreshed.summary);
        }
      } else {
        setRsvpError(data.error || "送信できませんでした / Gagal mengirim.");
      }
    } catch {
      setRsvpError("通信エラーが発生しました / Terjadi kesalahan koneksi.");
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
    <div className="min-h-screen bg-[#ffffff] text-[#1c1917] font-sans antialiased selection:bg-stone-200 selection:text-black">
      
      {/* Hairline Top Bar */}
      <nav className="border-b border-stone-200/80 sticky top-0 bg-white/95 backdrop-blur-md z-40 px-6 sm:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-chinese text-sm font-bold tracking-wider text-black">廣航佛堂</span>
          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden sm:inline">
            20TH COMMEMORATION
          </span>
        </div>

        {/* Index Links */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-widest text-stone-500 uppercase">
          <a href="#message" className="hover:text-black transition-colors">01 Message</a>
          <a href="#schedule" className="hover:text-black transition-colors">02 Schedule</a>
          <a href="#access" className="hover:text-black transition-colors">03 Access</a>
          <a href="#history" className="hover:text-black transition-colors">04 History</a>
          <a href="#reply" className="hover:text-black font-bold text-stone-900 transition-colors">05 Reply</a>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          {(["all", "id", "zh"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setLang(m)}
              className={`px-2 py-0.5 rounded transition-colors ${
                lang === m ? "bg-black text-white font-bold" : "text-stone-500 hover:text-black"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-28">
        
        {/* ============================================================== */}
        {/* HERO: Studio.Design Japanese Minimalist Typography              */}
        {/* ============================================================== */}
        <section className="text-center space-y-6 pt-4">
          
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-stone-400 block">
              COMMEMORATION & THANKSGIVING
            </span>
            <p className="font-serif italic text-2xl sm:text-3xl text-stone-600 font-light">
              20th Anniversary Invitation
            </p>
          </div>

          <div className="py-6">
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-black font-sans uppercase">
              GUANG HANG
            </h1>
            <h2 className="text-xl sm:text-2xl font-chinese font-normal text-stone-500 tracking-[0.25em] mt-2">
              落成廿週年堂慶大典
            </h2>
          </div>

          {/* Minimalist Date & Time Stamp */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm font-mono text-stone-800 border-y border-stone-200 py-3 px-8">
            <span className="font-bold tracking-wider">2026.11.14 (Sat)</span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span>18:30 受付 (Reception)</span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span>19:00 開式 (Opening)</span>
          </div>

          {/* Dedicated Guest Envelope Box (Japanese Format) */}
          <div className="pt-8 max-w-lg mx-auto">
            <div className="border border-stone-300/80 p-6 sm:p-8 rounded-sm bg-[#faf9f8] text-center space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                DEAR GUEST • 貴賓尊鑒
              </span>
              <div className="text-2xl sm:text-3xl font-serif text-black font-normal">
                {guestName} <span className="text-base text-stone-500 font-chinese">様</span>
              </div>
              <p className="text-xs text-stone-500 font-sans leading-relaxed pt-2 max-w-sm mx-auto">
                平素は格別のご厚情を賜り心より感謝申し上げます。広航佛堂落成二十周年の佳き日に、心温まるひとときをご一緒できますようご案内申し上げます。
              </p>
            </div>
          </div>

          {/* Minimalist Countdown Ticker */}
          <div className="pt-6 flex items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-stone-600">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-light text-black block">{timeLeft.days}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">Days</span>
            </div>
            <span className="text-stone-300 text-xl font-light">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-light text-black block">{timeLeft.hours}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">Hours</span>
            </div>
            <span className="text-stone-300 text-xl font-light">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-light text-black block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">Mins</span>
            </div>
            <span className="text-stone-300 text-xl font-light">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-light text-black block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">Secs</span>
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* 01 MESSAGE (メッセージ)                                         */}
        {/* ============================================================== */}
        <section id="message" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              01 MESSAGE
            </span>
            <span className="text-xs font-chinese text-stone-400">メッセージ</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 text-sm text-stone-700 font-sans leading-loose">
            <p className="font-chinese text-base text-stone-900 font-medium">
              謹啓
            </p>

            <p>
              初冬の候、皆様におかれましてはますますご清祥のこととお慶び申し上げます。
            </p>

            <blockquote className="my-6 pl-4 border-l-2 border-stone-800 italic font-serif text-base sm:text-lg text-black leading-relaxed">
              &ldquo;{cms.hero.quoteId}&rdquo;
            </blockquote>

            <p>
              {cms.hero.storyParagraphId}
            </p>

            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 leading-relaxed pt-2">
                {cms.hero.storyParagraphZh}
              </p>
            )}

            <p className="font-chinese text-right text-stone-900 pt-4 font-medium">
              謹白
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 02 SCHEDULE (日程)                                             */}
        {/* ============================================================== */}
        <section id="schedule" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              02 SCHEDULE
            </span>
            <span className="text-xs font-chinese text-stone-400">日程</span>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200 font-sans">
            
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 text-xs font-mono uppercase text-stone-400 tracking-wider">
                Day / 日程
              </span>
              <span className="sm:col-span-8 text-base font-bold text-black font-mono">
                {cms.event.dateTextId} (2026.11.14)
              </span>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 text-xs font-mono uppercase text-stone-400 tracking-wider">
                Reception / 受付
              </span>
              <span className="sm:col-span-8 text-sm text-stone-800 font-mono">
                18:30 —
              </span>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 text-xs font-mono uppercase text-stone-400 tracking-wider">
                Opening / 開始
              </span>
              <span className="sm:col-span-8 text-sm font-bold text-stone-900 font-mono">
                19:00 — (21:00 Selesai)
              </span>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 text-xs font-mono uppercase text-stone-400 tracking-wider">
                Dress Code / 服装
              </span>
              <span className="sm:col-span-8 text-xs text-stone-700">
                {cms.event.dresscodeId} ({cms.event.dresscodeNotesId})
              </span>
            </div>

          </div>

          <div className="text-center pt-2">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-black hover:bg-black hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Add To Google Calendar
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 03 ACCESS & VENUE (所在地・アクセス)                           */}
        {/* ============================================================== */}
        <section id="access" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              03 ACCESS & VENUE
            </span>
            <span className="text-xs font-chinese text-stone-400">会場・アクセス</span>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200 text-xs font-sans">
            
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 font-mono uppercase text-stone-400 tracking-wider">
                Place / 会場
              </span>
              <span className="sm:col-span-8 text-base font-bold text-black">
                {cms.event.venueNameId}
              </span>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
              <span className="sm:col-span-4 font-mono uppercase text-stone-400 tracking-wider">
                Address / 所在地
              </span>
              <div className="sm:col-span-8 space-y-1">
                <p className="text-stone-800">{cms.event.address}</p>
                <button
                  onClick={copyAddress}
                  className="text-[11px] font-mono text-stone-500 hover:text-black underline block pt-1"
                >
                  {copiedAddress ? "✓ 住所をコピーしました (Alamat tersalin)" : "Copy Address (住所コピー)"}
                </button>
              </div>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
              <span className="sm:col-span-4 font-mono uppercase text-stone-400 tracking-wider pt-1">
                Access / アクセス
              </span>
              <div className="sm:col-span-8 space-y-2 text-stone-700">
                <div className="flex items-start gap-2">
                  <Train className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>KRL Commuter Line: Stasiun Palmerah (徒歩 5分)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>TransJakarta: Koridor 9 / Halte Slipi Petamburan (徒歩 8分)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Car className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>Tol Dalam Kota: Exit Slipi / Palmerah (車 3分)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Minimalist Google Maps Embed */}
          <div className="rounded-sm overflow-hidden border border-stone-200 h-64 bg-stone-100">
            <iframe
              src={cms.location.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <div className="text-center">
            <a
              href={cms.location.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black underline"
            >
              Open Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 04 HISTORY (二十年の歩み)                                      */}
        {/* ============================================================== */}
        <section id="history" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              04 HISTORY
            </span>
            <span className="text-xs font-chinese text-stone-400">二十年の歩み</span>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {milestones.map((m, idx) => (
              <div key={idx} className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-3">
                  <span className="text-lg font-mono font-bold text-black block">{m.year}</span>
                  <span className="text-[11px] font-chinese text-stone-400">{m.chineseTitle}</span>
                </div>
                <div className="sm:col-span-9 space-y-2 text-xs text-stone-700 leading-relaxed font-sans">
                  <h4 className="text-sm font-bold text-black font-serif">{m.title}</h4>
                  <p>{m.description}</p>
                  <p className="italic text-stone-500 font-serif">&ldquo;{m.highlight}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 05 GALLERY (ギャラリー)                                         */}
        {/* ============================================================== */}
        <section id="gallery" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              05 GALLERY
            </span>
            <span className="text-xs font-chinese text-stone-400">ギャラリー</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allGallery.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="relative h-44 rounded-xs overflow-hidden border border-stone-200 cursor-pointer group bg-stone-100"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 06 YOUR REPLY / ご出欠 (wedding.s-tmro.com style)              */}
        {/* ============================================================== */}
        <section id="reply" className="space-y-8">
          <div className="border-b border-black pb-2 flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              06 YOUR REPLY
            </span>
            <span className="text-xs font-chinese text-stone-400">ご出欠</span>
          </div>

          <div className="text-center space-y-2 py-4">
            <p className="font-serif text-lg text-black">お返事はこちらから</p>
            <p className="text-xs text-stone-500 font-mono">
              恐れ入りますが 11月7日（土）までに出席の可否をお知らせください
            </p>
            <p className="text-[11px] text-stone-400">
              Mohon konfirmasi kehadiran Anda untuk membantu kelancaran persiapan.
            </p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="max-w-lg mx-auto border border-stone-300 p-6 sm:p-10 rounded-sm space-y-6 text-xs font-sans bg-[#faf9f8]">
            {submitted ? (
              <div className="text-center py-8 space-y-2">
                <Check className="w-8 h-8 text-black mx-auto mb-2" />
                <h4 className="text-base font-bold text-black font-serif">
                  ご回答ありがとうございました
                </h4>
                <p className="text-xs text-stone-500">
                  Konfirmasi Anda telah kami terima dengan baik.
                </p>
              </div>
            ) : (
              <>
                {rsvpError && (
                  <p className="p-2 border border-red-300 bg-red-50 text-red-700 text-xs">
                    {rsvpError}
                  </p>
                )}

                {/* 出席の可否 (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-black">出席の可否 / Status Kehadiran</span>
                    <span className="text-[10px] font-mono text-red-600">（必須 / Required）</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "attend", label: "ご出席", sub: "Hadir" },
                      { id: "absent", label: "ご欠席", sub: "Tidak Hadir" },
                      { id: "pending", label: "保留", sub: "Masih Ragu" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAttendance(opt.id as any)}
                        className={`py-3 px-2 rounded-xs border text-center transition-colors ${
                          attendance === opt.id
                            ? "border-black bg-black text-white font-bold"
                            : "border-stone-300 bg-white text-stone-700 hover:border-black"
                        }`}
                      >
                        <span className="font-chinese block text-sm">{opt.label}</span>
                        <span className="text-[10px] opacity-75">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* お名前 (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-black">お名前 / Nama Lengkap</span>
                    <span className="text-[10px] font-mono text-red-600">（必須 / Required）</span>
                  </div>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="山田 太郎 / Lim TC Felix Salim"
                    className="w-full px-3 py-2.5 rounded-xs border border-stone-300 bg-white text-black outline-hidden focus:border-black text-xs"
                    required
                  />
                </div>

                {attendance === "attend" && (
                  <div>
                    <label className="block font-bold text-black mb-1">
                      ご同伴者人数 / Jumlah Tamu (Termasuk Anda)
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xs border border-stone-300 bg-white text-black text-xs font-mono outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} 名 ({n} Orang)</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* メッセージ (Optional) */}
                <div>
                  <label className="block font-bold text-black mb-1">
                    メッセージ / Untaian Doa & Pesan
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="温かいメッセージをお待ちしております..."
                    className="w-full px-3 py-2.5 rounded-xs border border-stone-300 bg-white text-black text-xs outline-hidden focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-black hover:bg-stone-800 text-white font-mono uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "送信中..." : "送信する / Submit Reply"}
                </button>
              </>
            )}
          </form>

          {/* Minimalist Live Responses List */}
          <div className="max-w-lg mx-auto pt-4 space-y-2 text-xs font-sans">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block text-center">
              RECENT REPLIES
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {wishes.slice(0, 5).map((w, idx) => (
                <div key={w.id || idx} className="p-2.5 border-b border-stone-100 flex items-center justify-between">
                  <span className="font-medium text-black">{w.name}</span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {w.status === "hadir" ? "ご出席 (Hadir)" : "ご欠席 (Restu)"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 07 DANA KEBAJIKAN & FOOTER                                     */}
        {/* ============================================================== */}
        <section className="border-t border-stone-200 pt-12 space-y-8 text-center text-xs font-sans">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
              DANA KEBAJIKAN • 隨喜功德
            </span>
            <p className="text-stone-600 text-xs">{cms.donation.descriptionId}</p>
            <div className="p-3 border border-stone-200 rounded-xs bg-[#faf9f8] inline-block">
              <span className="font-mono font-bold text-black text-sm">{cms.donation.accountNumber}</span>
              <span className="text-[10px] text-stone-500 block">({cms.donation.bankName} - {cms.donation.accountHolder})</span>
              <button
                onClick={copyAccount}
                className="text-[10px] font-mono text-black underline mt-1"
              >
                {copiedAccount ? "✓ Copied" : "Copy Account Number"}
              </button>
            </div>
          </div>

          <div className="pt-12 text-stone-400 text-[11px] font-mono space-y-1">
            <p className="font-chinese text-stone-700">廣航佛堂 • 二十周年感謝の集い</p>
            <p>12.11.2006 — 14.11.2026 • PALMERAH, JAKARTA</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-black underline mt-2 block mx-auto hover:text-stone-600"
            >
              Back To Top ↑
            </button>
          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-white p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
            <div className="relative w-full h-80 sm:h-96">
              <Image src={activePhoto.src} alt={activePhoto.title} fill className="object-contain" />
            </div>
            <p className="text-center font-mono text-xs py-2 text-black">{activePhoto.title}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Home6Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <span className="text-xs uppercase tracking-widest">LOADING FRESH EDITION...</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <Home6FreshContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
