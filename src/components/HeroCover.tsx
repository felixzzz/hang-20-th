"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MailOpen, Calendar, MapPin, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";

interface HeroCoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function HeroCover({ guestName, isOpen, onOpen }: HeroCoverProps) {
  const [sealBreaking, setSealBreaking] = useState(false);

  if (isOpen) return null;

  const handleSealClick = () => {
    setSealBreaking(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <aside
      aria-label="Sampul Undangan Utama"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#240808] via-[#380e0e] to-[#180505] text-white transition-opacity duration-700 overflow-hidden ${
        sealBreaking ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-screen">
        <Image
          src="/images/guang-hang-15.jpg"
          alt="Altar Suci Kuang Hang"
          fill
          priority
          className="object-cover scale-110 filter blur-[2px]"
        />
      </div>

      {/* Floating golden aura halos */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-fothang-gold-500/20 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-fothang-red-600/25 filter blur-3xl pointer-events-none" />

      {/* Traditional Auspicious Envelope Container */}
      <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#3a1010]/95 via-[#290a0a]/95 to-[#1c0606]/95 border-2 border-fothang-gold-400/50 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-center backdrop-blur-2xl">
        {/* Intricate Corner Knot Ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-fothang-gold-400/80 rounded-tl-sm pointer-events-none">
          <div className="w-2 h-2 bg-fothang-gold-400 rounded-full -mt-1 -ml-1" />
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-fothang-gold-400/80 rounded-tr-sm pointer-events-none">
          <div className="w-2 h-2 bg-fothang-gold-400 rounded-full -mt-1 -mr-1 float-right" />
        </div>
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-fothang-gold-400/80 rounded-bl-sm pointer-events-none">
          <div className="w-2 h-2 bg-fothang-gold-400 rounded-full -mb-1 -ml-1" />
        </div>
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-fothang-gold-400/80 rounded-br-sm pointer-events-none">
          <div className="w-2 h-2 bg-fothang-gold-400 rounded-full -mb-1 -mr-1 float-right" />
        </div>

        {/* Sacred Header Badge */}
        <div className="inline-flex items-center justify-center gap-2 mb-3 px-4 py-1 rounded-full bg-fothang-gold-500/15 border border-fothang-gold-400/40">
          <Sparkles className="w-3.5 h-3.5 text-fothang-gold-300" />
          <span className="text-[11px] uppercase tracking-widest text-fothang-gold-300 font-medium">
            天恩師德 • 萬里同舟
          </span>
          <Sparkles className="w-3.5 h-3.5 text-fothang-gold-300" />
        </div>

        {/* Grand Chinese Heading */}
        <h2 className="text-3xl sm:text-5xl font-chinese font-bold tracking-widest text-fothang-gold-300 mt-2 mb-1 drop-shadow-lg">
          廣航佛堂
        </h2>
        <p className="text-xs sm:text-sm font-chinese text-fothang-gold-200/90 tracking-widest mb-4">
          成立二十週年堂慶紀念 (2006 - 2026)
        </p>

        {/* Title */}
        <div className="relative my-3">
          <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-400 to-transparent mb-3" />
          <h1 className="text-xl sm:text-2xl font-serif tracking-wide text-stone-100 font-semibold leading-relaxed">
            Undangan Resmi Peringatan 20 Tahun <br />
            <span className="text-fothang-gold-400 font-bold">Kuang Hang Fo Thang</span>
          </h1>
          <p className="text-xs text-stone-300 tracking-wider mt-1.5 font-light">
            Mengarungi Samudra Kebajikan Menabur Kasih Semesta
          </p>
        </div>

        {/* Guest Recipient Box */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-white/5 border border-fothang-gold-400/30 backdrop-blur-sm relative">
          <p className="text-[11px] font-light text-stone-300 uppercase tracking-widest mb-1.5">
            Kepada Yth. Bapak / Ibu / Saudara/i
          </p>
          <div className="text-xl sm:text-2xl font-serif font-bold text-fothang-gold-200 drop-shadow">
            {guestName || "Keluarga Besar & Umat Terkasih"}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 italic">
            Merupakan kehormatan bagi kami mengundang Anda untuk hadir bersama dalam hari peringatan bersejarah ini.
          </p>
        </div>

        {/* Date & Location */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-300 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>Sabtu, 14 November 2026</span>
          </div>
          <span className="hidden sm:inline text-fothang-gold-500">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>Palmerah, Jakarta Barat</span>
          </div>
        </div>

        {/* Interactive Wax Seal / Cinnabar Stamp Button */}
        <div className="relative my-2 flex flex-col items-center">
          <button
            onClick={handleSealClick}
            className="group relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95 hover:scale-105"
            aria-label="Buka segel undangan"
          >
            {/* Glowing seal aura */}
            <div className="absolute inset-0 rounded-full bg-fothang-gold-500/30 filter blur-md group-hover:bg-fothang-gold-400/50 transition-colors" />

            {/* Traditional Wax Stamp Circle */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-4 border-fothang-gold-400 shadow-2xl flex flex-col items-center justify-center text-fothang-gold-200 ring-4 ring-fothang-gold-500/20">
              <span className="font-chinese font-bold text-base leading-none tracking-wider text-fothang-gold-200 drop-shadow">
                廣航
              </span>
              <span className="font-chinese text-[11px] leading-none tracking-widest text-fothang-gold-300 mt-0.5">
                廿載
              </span>
              <span className="text-[8px] uppercase tracking-tighter text-fothang-gold-300/80 mt-1">
                BUKA
              </span>
            </div>
          </button>
          <span className="text-[11px] text-fothang-gold-300 font-medium tracking-wider mt-3 animate-pulse">
            Sentuh Segel Emas untuk Membuka Undangan
          </span>
        </div>

        {/* Direct Link to 3D Building Comparison */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
          <Link
            href="/3d"
            className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-fothang-gold-300 transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>Lihat Eksplorasi Gedung 3D (Halaman Pembanding)</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
