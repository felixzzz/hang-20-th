"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

interface HeroSectionProps {
  guestName: string;
}

export default function HeroSection({ guestName }: HeroSectionProps) {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();

  const hero = cms.hero;

  // Target countdown date from CMS or default to Saturday, Nov 14, 2026, 19:00 WIB
  const targetDateStr = hero.countdownDate || "2026-11-14T19:00:00+07:00";
  const targetDate = new Date(targetDateStr).getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const heroImg = cms.cover.bgImage || "/images/guang-hang-15.jpg";

  return (
    <section id="top" className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      
      {/* Subtle Background Watermark */}
      <div className="absolute top-8 right-4 sm:right-12 select-none pointer-events-none opacity-[0.03]" aria-hidden="true">
        <span className="text-[16rem] sm:text-[26rem] font-chinese font-black text-[#7c1818] leading-none">
          航
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Editorial Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#dfba6d]/30 pb-3 mb-10 text-xs text-stone-600 font-serif">
          <div className="flex items-center gap-2.5">
            <span className="chinese-seal-filled text-[11px] px-2 py-0.5">
              {hero.topBannerSealZh || "天恩師德"}
            </span>
            <span className="tracking-widest uppercase">
              {showId && (hero.topBannerId || "Peringatan 20 Tahun Gedung (2006 — 2026)")}
              {showId && showZh && " • "}
              {showZh && (
                <span className="font-chinese font-normal">
                  {hero.topBannerZh || "落成廿週年堂慶大典"}
                </span>
              )}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-stone-600">
            <span>
              {showZh && !showId ? hero.cityZh : hero.cityId}
            </span>
            <span>•</span>
            <span className="font-semibold text-[#7c1818]">{hero.eventDateBadge || "14 November 2026"}</span>
          </div>
        </div>

        {/* 1. Main Hero Grid: Balanced Landscape Duo (Monograph & Landscape Archival Photo) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-10 sm:mb-12">
          
          {/* Left Column: Monograph Title & Sacred Verse */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="mb-3">
              <span className="inline-block text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
                {showId && (hero.sloganId || "Dua Dasawarsa Menyalakan Pelita Kebajikan")}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese">{hero.sloganZh || "廿載同修 • 慧命永續"}</span>}
              </span>
              <h1 className="text-4xl sm:text-6xl font-chinese font-bold text-[#7c1818] tracking-wide leading-tight">
                {hero.mainTitleZh || "廣航佛堂"}
                <span className="block text-2xl sm:text-3xl font-serif text-[#211c19] font-normal tracking-wide mt-2">
                  {showId && (hero.mainTitleId || "Peringatan 20 Tahun Peresmian Gedung")}
                  {showId && showZh && " • "}
                  {showZh && (
                    <span className="font-chinese">
                      {hero.themeZh || "成立廿週年堂慶紀念 (2006 — 2026)"}
                    </span>
                  )}
                </span>
              </h1>
            </div>

            {/* Poetic Inscription */}
            <div className="my-3.5 pl-4 border-l-2 border-[#dfba6d]">
              {showId && (
                <p className="font-serif text-base sm:text-lg text-stone-800 italic leading-relaxed">
                  &ldquo;{hero.quoteId}&rdquo;
                </p>
              )}
              {showZh && (
                <p className="font-chinese text-sm sm:text-base text-stone-600 mt-1 tracking-wider leading-relaxed">
                  {hero.quoteZh}
                </p>
              )}
            </div>

            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif mb-5">
              {showId && (
                <p>{hero.storyParagraphId}</p>
              )}
              {showZh && (
                <p className="font-chinese text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                  {hero.storyParagraphZh}
                </p>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs sm:text-sm shadow-xs transition cursor-pointer"
              >
                <span>{showZh && !showId ? "填寫回函 (RSVP)" : "Konfirmasi Kehadiran (RSVP)"}</span>
                {showId && showZh && <span className="font-chinese opacity-80 text-xs">回函</span>}
              </a>
              <a
                href="#sejarah"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-serif font-medium text-xs sm:text-sm border border-stone-200 transition cursor-pointer"
              >
                <span>{showZh && !showId ? "重溫廿載光輝史話" : "Napak Tilas 20 Tahun"}</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>

          </div>

          {/* Right Column: Hero Archival Photo in Full Landscape Museum Frame */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="relative w-full rounded-2xl overflow-hidden bg-white p-3 shadow-md border border-[#dfba6d]/30 group">
              {/* Landscape Aspect Ratio Container (Matches uncropped 1600x1172 Altar Photo) */}
              <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-900">
                <Image
                  src={heroImg}
                  alt={hero.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang"}
                  fill
                  priority
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                  unoptimized={heroImg.startsWith("http")}
                />
                
                {/* Archival Seal Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#211c19]/85 backdrop-blur-sm border border-white/20 text-[#fbf5e8] text-[11px] font-chinese tracking-widest shadow-sm">
                    {hero.photoCaptionTitleZh || "廣航聖壇"} • {hero.photoCaptionDate || "2006安座"}
                  </span>
                </div>
              </div>

              {/* Museum Photo Caption Plate */}
              <div className="p-3 text-stone-800">
                <div className="flex items-center justify-between text-xs font-serif mb-1">
                  <span className="font-semibold text-[#7c1818]">
                    {showId && (hero.photoCaptionTitleId || "Altar Agung Kuang Hang Fo Thang")}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese font-normal">{hero.photoCaptionTitleZh || "廣航聖壇大殿"}</span>}
                  </span>
                  <span className="text-stone-500 text-[11px]">{hero.photoCaptionDate || "12 Nov 2006"}</span>
                </div>
                {showId && (
                  <p className="text-xs text-stone-600 font-serif leading-snug">
                    {hero.photoCaptionDescId}
                  </p>
                )}
                {showZh && (
                  <p className="font-chinese text-[11px] text-stone-500 mt-0.5">
                    {hero.photoCaptionDescZh}
                  </p>
                )}
              </div>
            </div>

            {/* Commemorative Ribbon */}
            <div className="w-full mt-2.5 text-center text-[11px] text-stone-500 font-serif tracking-wider">
              {hero.commemorativeRibbon || "廣結善緣 • 航向光明 • 廿載同舟共濟"}
            </div>

          </div>

        </div>

        {/* 2. Full-Width Horizontal Landscape Honored Guest Card (題名貴賓席) */}
        <div className="w-full bg-[#ffffff] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#dfba6d]/40 shadow-sm relative mb-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left 7 Columns: Personal Salutation & Message */}
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center gap-2">
                <span className="chinese-seal-red text-[11px] px-2 py-0.5">
                  {hero.guestHonorSealZh || "同沾法喜"}
                </span>
                <span className="text-[11px] font-serif font-semibold tracking-widest text-[#9e7631] uppercase">
                  {showId && (hero.guestHonorTitleId || "SURAT PENGHORMATAN TAMU UNDANGAN")}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese">{hero.guestHonorTitleZh || "貴賓敬邀函"}</span>}
                </span>
              </div>

              <div className="text-xs text-stone-600 font-serif pt-1">
                {showId && <span>{hero.guestHonorGreetingId || "Kepada Yth. Bapak / Ibu / Saudara/i:"}</span>}
                {showZh && <span className="font-chinese text-stone-700 ml-1">{hero.guestHonorGreetingZh || "恭請 尊鑒："}</span>}
              </div>

              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#7c1818] tracking-wide">
                {guestName || "Saudara Se-Dharma & Umat Terkasih"}
              </div>

              <div className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed pt-1">
                {showId && (
                  <p>{hero.guestHonorMessageId}</p>
                )}
                {showZh && (
                  <p className="font-chinese text-xs text-stone-500 mt-1">
                    {hero.guestHonorMessageZh}
                  </p>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Compact Schedule & RSVP Action */}
            <div className="md:col-span-5 bg-[#faf8f5] rounded-2xl p-4 sm:p-5 border border-[#dfba6d]/30 space-y-3">
              <div className="flex items-start gap-2.5 text-xs font-serif text-stone-800">
                <Calendar className="w-4 h-4 text-[#7c1818] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">{cms.event.dateTextId}</span>
                  <span className="text-stone-600">{cms.event.timeTextId}</span>
                  {showZh && <span className="text-[11px] font-chinese text-stone-500 block">{cms.event.dateTextZh}</span>}
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs font-serif text-stone-800 pt-2 border-t border-stone-200/60">
                <MapPin className="w-4 h-4 text-[#7c1818] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">{cms.event.venueNameId}</span>
                  <span className="text-stone-600 text-[11px] block">{cms.event.address}</span>
                </div>
              </div>

              <a
                href="#rsvp"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs shadow-xs transition cursor-pointer"
              >
                <span>{showZh && !showId ? "填寫回函 (RSVP)" : "Konfirmasi Kehadiran (RSVP)"}</span>
                {showId && showZh && <span className="font-chinese opacity-80 text-xs">回函</span>}
              </a>
            </div>

          </div>
        </div>

        {/* Clean Typographic Countdown Card */}
        <div className="bg-[#ffffff] p-6 sm:p-8 rounded-2xl border border-[#dfba6d]/30 shadow-sm relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-serif font-semibold uppercase tracking-wider text-[#9e7631] mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9e7631]" />
                <span>
                  {showId && (hero.countdownHeadingId || "Hitung Mundur Menuju Malam Syukur")}
                  {showId && showZh && " • "}
                  {showZh && <span className="font-chinese font-normal">{hero.countdownHeadingZh || "倒計時迎接感恩之夜"}</span>}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#7c1818]">
                {cms.event.dateTextId} • {cms.event.timeTextId}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1">
                {showId && (hero.countdownSubtextId || "Waktu bersama untuk bersyukur, mengenang jejak perintis, dan mempererat tali dharma.")}
                {showZh && <span className="block font-chinese text-xs text-stone-500">{hero.countdownSubtextZh}</span>}
              </p>
            </div>

            {/* Countdown Blocks */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 shrink-0">
              {[
                { labelId: "Hari", labelZh: "天", val: timeLeft.days },
                { labelId: "Jam", labelZh: "時", val: timeLeft.hours },
                { labelId: "Menit", labelZh: "分", val: timeLeft.minutes },
                { labelId: "Detik", labelZh: "秒", val: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.labelId}
                  className="flex flex-col items-center justify-center w-16 sm:w-20 h-18 sm:h-20 rounded-xl bg-[#faf8f5] border border-[#dfba6d]/30 text-center"
                >
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#7c1818] leading-none">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  
                  <div className="text-[11px] text-stone-600 font-serif font-medium mt-1">
                    {showId && <span>{item.labelId}</span>}
                    {showId && showZh && <span className="text-stone-400">/</span>}
                    {showZh && <span className="font-chinese text-stone-500">{item.labelZh}</span>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
