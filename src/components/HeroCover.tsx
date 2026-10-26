"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface HeroCoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function HeroCover({ guestName, isOpen, onOpen }: HeroCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  if (isOpen) return null;

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <aside
      aria-label="Sampul Resmi Undangan Guang Hang"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140505] text-stone-100 transition-all duration-700 overflow-hidden ${
        isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Sacred Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
        <Image
          src="/images/guang-hang-15.jpg"
          alt="Altar Suci Guang Hang Fo Thang"
          fill
          priority
          className="object-cover scale-110 filter blur-sm"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#1c0606]/80 to-[#120303]" />
      </div>

      {/* Warm Golden Candlelight Halos */}
      <div className="absolute top-1/4 -left-16 w-80 h-80 rounded-full bg-amber-500/15 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-80 h-80 rounded-full bg-red-600/20 filter blur-3xl pointer-events-none" />

      {/* Main Ceremonial Silk Envelope Folio */}
      <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#310c0c] via-[#240808] to-[#180505] border border-amber-600/40 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Top & Bottom Gold Filigree Borders */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 opacity-80" />

        {/* Traditional Corner Bracket Ornaments */}
        <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

        <div className="p-7 sm:p-11 text-center relative z-10 flex flex-col items-center">
          
          {/* Imperial Seal Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-chinese tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>天恩師德 • 萬里同舟</span>
          </div>

          {/* Majestic Chinese Monograph Title */}
          <h1 className="text-4xl sm:text-5xl font-chinese font-bold tracking-widest text-amber-200 drop-shadow mb-1">
            廣航佛堂
          </h1>
          <p className="text-xs sm:text-sm font-chinese text-amber-400/90 tracking-widest mb-6">
            成立二十週年堂慶紀念 (2006 — 2026)
          </p>

          {/* Fine Hairline Divider with Traditional Center Diamond */}
          <div className="w-full flex items-center justify-center gap-3 my-2 opacity-60">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-amber-300 text-xs rotate-45">◆</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* Invitation Subtitle */}
          <p className="font-serif text-lg sm:text-xl text-stone-100 tracking-wide font-normal italic my-2">
            Undangan Resmi Peringatan 20 Tahun Gedung
          </p>
          <p className="text-[11px] sm:text-xs text-stone-300/80 font-light tracking-wider max-w-sm">
            Mengarungi Samudra Kebajikan • Menyalakan Pelita Kebijaksanaan
          </p>

          {/* Inset Gold-Leaf Rice Paper Sash (金箔腰封) for Guest Name */}
          <div className="w-full my-6 p-4 sm:p-5 rounded-xl bg-[#faf6ee] text-[#1c1815] shadow-lg border border-amber-300/80 relative text-center">
            {/* Traditional Ribbon Accent on sides */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-7 bg-amber-600 rounded-r" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-7 bg-amber-600 rounded-l" />

            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block mb-1">
              Yth. Tamu Undangan Terkasih • 尊鑒
            </span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-red-950 tracking-wide truncate max-w-full px-2">
              {guestName || "Saudara Se-Dharma & Umat Terkasih"}
            </div>
            <p className="text-[11px] text-stone-600 mt-1 italic font-serif">
              Dengan penuh hormat mengundang kehadiran Anda dalam doa syukur bersama.
            </p>
          </div>

          {/* Key Event Details Snippet */}
          <div className="text-xs text-stone-300/90 font-light tracking-wide space-y-1 mb-8">
            <div className="font-serif text-amber-200 font-medium">
              Sabtu, 14 November 2026 • 19.00 WIB
            </div>
            <div className="text-[11px] text-stone-400">
              Kuang Hang Fo Thang, Palmerah Utara III No. 186A, Jakarta Barat
            </div>
          </div>

          {/* Interactive Cinnabar Wax Stamp (朱砂火漆印章) */}
          <div className="relative flex flex-col items-center">
            <button
              onClick={handleOpen}
              className="group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 hover:scale-105"
              aria-label="Buka Segel Undangan"
            >
              {/* Pulsing Golden Aura behind Seal */}
              <div className="absolute -inset-2 rounded-full bg-amber-500/25 filter blur-md group-hover:bg-amber-400/40 transition-colors" />

              {/* Embossed Wax Seal */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#5a1212] border-2 border-amber-400 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-amber-200 ring-4 ring-amber-500/20">
                <span className="font-chinese font-bold text-lg leading-none tracking-widest text-amber-200 drop-shadow-md">
                  廣航
                </span>
                <span className="font-chinese text-[11px] leading-tight text-amber-300 mt-0.5 tracking-wider">
                  廿載
                </span>
                <span className="text-[8px] font-sans uppercase tracking-tighter text-amber-300/90 mt-1 border-t border-amber-400/40 pt-0.5 px-1.5">
                  BUKA
                </span>
              </div>
            </button>

            <span className="text-[11px] text-amber-300/90 font-medium tracking-widest mt-3 animate-pulse">
              Ketuk Segel Emas untuk Membuka
            </span>
          </div>

        </div>

        {/* Bottom Gold Filigree Line */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 opacity-80" />
      </div>
    </aside>
  );
}
