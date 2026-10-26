"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Sparkles, HeartHandshake } from "lucide-react";

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
    <section id="top" className="relative pt-6 pb-16 sm:py-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-fothang-cream/70 via-fothang-ivory/50 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
        {/* Sacred Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-fothang-gold-300 shadow-sm mb-6">
          <Sparkles className="w-4 h-4 text-fothang-gold-600" />
          <span className="text-xs uppercase tracking-widest text-fothang-red-900 font-semibold">
            Peringatan 20 Tahun Gedung Kuang Hang Fo Thang
          </span>
          <span className="text-xs font-chinese text-fothang-gold-700">廿載同舟</span>
        </div>

        {/* Chinese Main Typography */}
        <h1 className="text-4xl sm:text-6xl font-chinese font-bold text-fothang-red-950 tracking-wider mb-2">
          廣航佛堂
        </h1>
        <p className="text-lg sm:text-2xl font-chinese text-fothang-gold-700 font-medium tracking-widest mb-4">
          二十週年堂慶紀念
        </p>

        {/* Subtitle / Theme */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-500 to-transparent mb-4" />
          <p className="font-serif text-xl sm:text-2xl text-stone-800 italic leading-relaxed">
            &ldquo;Mengundang Semua Saudara Se-Dharma yang Turut Mewarnai Perjalanan Kuang Hang Selama 20 Tahun&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-stone-600 tracking-wide mt-2">
            Mengenang Jejak Ketulusan Para Pendahulu • Menyalakan Pelita Kebijaksanaan Lintas Generasi
          </p>
        </div>

        {/* Personalized Welcome Card */}
        <div className="max-w-xl mx-auto mb-10 p-5 sm:p-6 rounded-2xl bg-white/90 border border-fothang-gold-300 shadow-xl shadow-fothang-gold-500/5 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-fothang-red-800 mb-1">
            Kepada Yth. Bapak / Ibu / Saudara/i
          </p>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-fothang-dark tracking-wide my-1">
            {guestName || "Umat Kuang Hang Fo Thang"}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto mt-2">
            Dengan penuh rasa syukur dan sukacita atas Tian En Shi De (天恩師德), kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam doa bersama dan ramah tamah memperingati 20 tahun Kuang Hang Fo Thang.
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-fothang-gold-300 shadow-2xl mb-12 group">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/images/guang-hang-15.jpg"
              alt="Altar Agung Kuang Hang Fo Thang"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-left text-white p-3 sm:p-4">
              <span className="inline-block px-2.5 py-1 rounded bg-fothang-gold-500 text-fothang-red-950 text-[11px] font-bold tracking-wider uppercase mb-1">
                Gedung Kuang Hang Fo Thang
              </span>
              <p className="text-sm sm:text-base font-serif font-semibold drop-shadow">
                Diresmikan 12 November 2006 • Menjadi Pelabuhan Suci Kebijaksanaan Umat
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#3d1212] to-[#260a0a] text-white border border-fothang-gold-400/40 shadow-xl shadow-fothang-red-950/20 mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-fothang-gold-400" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-fothang-gold-300">
              Hitung Mundur Menuju Hari Bahagia
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3.5 border border-fothang-gold-400/20 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Hari
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3.5 border border-fothang-gold-400/20 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Jam
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3.5 border border-fothang-gold-400/20 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Menit
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3.5 border border-fothang-gold-400/20 backdrop-blur-sm">
              <span className="block text-2xl sm:text-4xl font-serif font-bold text-fothang-gold-300">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider">
                Detik
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-300 mt-4 font-light">
            Sabtu, 14 November 2026 • Pukul 19.00 WIB
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#rsvp"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-fothang-red-800 to-fothang-red-700 text-fothang-gold-200 font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-fothang-gold-300" />
            <span>Konfirmasi Kehadiran (RSVP)</span>
          </a>
          <a
            href="#acara"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-stone-700 border border-stone-300 hover:border-fothang-gold-400 font-medium text-sm shadow-sm hover:bg-stone-50 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-fothang-gold-600" />
            <span>Detail Rangkaian Acara</span>
          </a>
        </div>
      </div>
    </section>
  );
}
