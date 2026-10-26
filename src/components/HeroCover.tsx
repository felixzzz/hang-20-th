"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface HeroCoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function HeroCover({ guestName, isOpen, onOpen }: HeroCoverProps) {
  const { showId, showZh } = useLanguage();
  const [isOpening, setIsOpening] = useState(false);

  // Reset opening animation state whenever the envelope is closed / reopened
  useEffect(() => {
    if (!isOpen) {
      setIsOpening(false);
    }
  }, [isOpen]);

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
          
          {/* Majestic Chinese Monograph Title */}
          <h1 className="text-4xl sm:text-5xl font-chinese font-bold tracking-widest text-amber-200 drop-shadow mb-1">
            廣航佛堂
          </h1>
          <p className="text-sm font-chinese text-amber-300 tracking-widest mb-4">
            成立二十週年堂慶紀念 (2006 — 2026)
          </p>

          {/* Fine Hairline Divider with Traditional Center Diamond */}
          <div className="w-full flex items-center justify-center gap-3 my-2 opacity-70">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-amber-300 text-sm rotate-45">◆</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* Bilingual Invitation Subtitle */}
          <div className="my-2">
            {showId && (
              <p className="font-serif text-lg sm:text-xl text-stone-100 tracking-wide font-normal italic">
                Undangan Resmi Peringatan 20 Tahun Gedung
              </p>
            )}
            {showZh && (
              <p className="text-sm font-chinese text-amber-300 tracking-widest mt-1">
                佛堂落成二十週年 • 官方敬邀函
              </p>
            )}
          </div>

          <div className="text-xs sm:text-sm text-stone-200 font-serif max-w-sm mb-3">
            {showId && <p>Mengarungi Samudra Kebajikan • Menyalakan Pelita Kebijaksanaan</p>}
            {showZh && (
              <p className="font-chinese text-stone-300 text-xs mt-1">
                同舟共濟度眾生 • 薪火相傳護慧命
              </p>
            )}
          </div>

          {/* Inset Gold-Leaf Rice Paper Sash (金箔腰封) for Guest Name - Edge-to-edge ceremonial band */}
          <div className="-mx-7 sm:-mx-11 w-[calc(100%+3.5rem)] sm:w-[calc(100%+5.5rem)] my-4 px-7 sm:px-11 py-4 bg-[#faf6ee] text-[#1c1815] border-y border-amber-400/60 relative text-center">
            <div className="flex items-center justify-center gap-2 text-xs uppercase text-amber-900 font-semibold mb-1">
              {showId && <span>Yth. Tamu Undangan Terkasih</span>}
              {showZh && <span className="font-chinese text-red-900 font-bold">恭請 貴賓尊鑒</span>}
            </div>

            <div className="text-xl sm:text-2xl font-serif font-bold text-red-950 tracking-wide truncate max-w-full px-2">
              {guestName || "Saudara Se-Dharma & Umat Terkasih"}
            </div>

            <div className="text-xs text-stone-700 mt-1 italic font-serif">
              {showId && (
                <p>Dengan penuh hormat mengundang kehadiran Anda dalam doa syukur bersama.</p>
              )}
              {showZh && (
                <p className="font-chinese text-xs text-stone-600 not-italic mt-0.5">
                  謹代表廣航佛堂全體道親，誠摯敬邀閣下撥冗蒞臨，同沾法喜。
                </p>
              )}
            </div>
          </div>

          {/* Key Event Details Snippet - Bilingual */}
          <div className="text-xs sm:text-sm text-stone-200 font-light space-y-1 mb-6">
            <div className="font-serif text-amber-200 font-medium">
              {showId && <span>Sabtu, 14 November 2026 • 19.00 WIB</span>}
              {showZh && (
                <span className="block font-chinese text-amber-300 text-xs">
                  2026年11月14日（星期六）晚間七時正
                </span>
              )}
            </div>
            <div className="text-xs text-stone-300">
              {showId && <span>Kuang Hang Fo Thang, Palmerah Utara III No. 186A, Jakarta Barat</span>}
              {showZh && (
                <span className="block font-chinese text-stone-300 text-xs">
                  雅加達西區巴美拉北三路186A號
                </span>
              )}
            </div>
          </div>

          {/* Interactive Cinnabar Wax Stamp (朱砂火漆印章) */}
          <div className="relative flex flex-col items-center">
            <button
              onClick={handleOpen}
              className="group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 hover:scale-105"
              aria-label="Buka Segel Undangan • 啟封"
            >
              {/* Golden Aura behind Seal */}
              <div className="absolute -inset-2 rounded-full bg-amber-500/25 filter blur-md group-hover:bg-amber-400/40 transition-colors" />

              {/* Embossed Wax Seal */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#5a1212] border-2 border-amber-400 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-amber-200 ring-4 ring-amber-500/20">
                <span className="font-chinese font-bold text-lg leading-none tracking-widest text-amber-200 drop-shadow-md">
                  廣航
                </span>
                <span className="font-chinese text-xs leading-tight text-amber-300 mt-1 tracking-wider">
                  廿載
                </span>
              </div>
            </button>

            <span className="text-xs text-amber-300 font-serif tracking-normal mt-3">
              {showId && "Ketuk Segel Emas untuk Membuka"}
              {showId && showZh && " • "}
              {showZh && "敬請啟封"}
            </span>
          </div>

        </div>

        {/* Bottom Gold Filigree Line */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 opacity-80" />
      </div>
    </aside>
  );
}
