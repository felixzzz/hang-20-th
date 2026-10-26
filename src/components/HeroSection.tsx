"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Sparkles, HeartHandshake, History, Flame } from "lucide-react";

interface HeroSectionProps {
  guestName: string;
}

export default function HeroSection({ guestName }: HeroSectionProps) {
  // Countdown to Saturday, Nov 14, 2026, 19:00:00 WIB (UTC+7)
  const targetDate = new Date("2026-11-14T19:00:00+07:00").getTime();

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

  return (
    <section id="top" className="relative pt-6 pb-20 sm:py-24 overflow-hidden">
      {/* Massive Layered Watermark Typography behind Hero */}
      <div className="absolute top-12 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <span className="text-[14rem] sm:text-[22rem] font-chinese font-black text-fothang-red-950 leading-none tracking-tighter">
          廿載
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
        {/* Sacred Header Motif */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-px bg-fothang-gold-400" />
          <span className="text-xs uppercase tracking-widest text-fothang-red-900 font-semibold">
            Peringatan 20 Tahun Gedung Kuang Hang Fo Thang
          </span>
          <div className="w-8 h-px bg-fothang-gold-400" />
        </div>

        {/* Majestic Chinese Typography */}
        <h1 className="text-4xl sm:text-7xl font-chinese font-bold text-fothang-red-950 tracking-wider mb-2 drop-shadow-sm">
          廣航佛堂
        </h1>
        <p className="text-base sm:text-2xl font-chinese text-fothang-gold-700 font-semibold tracking-widest mb-6">
          二十週年堂慶紀念 (2006 - 2026)
        </p>

        {/* Theme Slogan */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-500 to-transparent mb-4" />
          <p className="font-serif text-xl sm:text-3xl text-stone-900 font-normal italic leading-relaxed">
            &ldquo;Mengarungi Samudra Kebajikan Selama 20 Tahun Bersama Saudara Se-Dharma&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-stone-600 tracking-wider mt-3">
            Mengenang Jejak Ketulusan Para Pendahulu • Menyalakan Pelita Kebijaksanaan Shizun & Shimu
          </p>
        </div>

        {/* Guest Recipient Silk Card */}
        <div className="max-w-xl mx-auto mb-12 p-6 rounded-3xl bg-gradient-to-b from-white/95 to-fothang-ivory/95 border-2 border-fothang-gold-300 shadow-xl shadow-fothang-gold-500/10 backdrop-blur-sm relative">
          <div className="absolute top-2 right-4 text-[10px] font-chinese text-fothang-gold-600 font-bold">
            同沾法喜
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-fothang-red-800 mb-1">
            Kepada Yth. Bapak / Ibu / Saudara/i
          </p>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-fothang-dark tracking-wide my-1">
            {guestName || "Umat Kuang Hang Fo Thang"}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto mt-2">
            Dengan penuh rasa syukur atas Tian En Shi De (天恩師德), kami mengundang Bapak/Ibu/Saudara/i untuk hadir bersama dalam doa syukur dan ramah tamah memperingati dua dasawarsa peresmian gedung Kuang Hang Fo Thang.
          </p>
        </div>

        {/* Hero Archival Photo Spotlight */}
        <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-fothang-gold-300 shadow-2xl mb-12 group">
          <div className="relative aspect-[16/9] w-full bg-stone-900">
            <Image
              src="/images/guang-hang-15.jpg"
              alt="Altar Agung Kuang Hang Fo Thang"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-5 inset-x-5 text-left text-white p-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fothang-gold-500 text-fothang-red-950 text-xs font-bold tracking-wider uppercase mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Gedung Kuang Hang Fo Thang</span>
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold drop-shadow">
                Diresmikan 12 November 2006 di Palmerah Utara III No. 186A
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Menjadi mercusuar kebajikan dan pelabuhan suci bagi seluruh umat lintas generasi.
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Pelita Timer */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#380e0e] to-[#200606] text-white border-2 border-fothang-gold-400/40 shadow-2xl mb-10 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-fothang-gold-400" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-fothang-gold-300">
              Hitung Mundur Menuju Malam Syukur
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
            <div className="bg-white/10 rounded-2xl p-3 border border-fothang-gold-400/30 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Hari
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-fothang-gold-400/30 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Jam
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-fothang-gold-400/30 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Menit
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-fothang-gold-400/30 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Detik
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-300 mt-4 font-light">
            Sabtu, 14 November 2026 • Pukul 19.00 WIB s/d Selesai
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#rsvp"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-fothang-red-800 to-fothang-red-700 text-fothang-gold-200 font-semibold text-sm shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-fothang-gold-300" />
            <span>Konfirmasi Kehadiran (RSVP)</span>
          </a>
          <a
            href="#sejarah"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-stone-800 border-2 border-fothang-gold-400 hover:bg-stone-50 font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-fothang-gold-600" />
            <span>Napak Tilas 20 Tahun</span>
          </a>
        </div>
      </div>
    </section>
  );
}
