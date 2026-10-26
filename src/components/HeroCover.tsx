"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

interface HeroCoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function HeroCover({ guestName, isOpen, onOpen }: HeroCoverProps) {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const [isOpening, setIsOpening] = useState(false);

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
    }, 600);
  };

  const bgImg = cms.cover.bgImage || "/images/guang-hang-15.jpg";
  const logoImg = cms.cover.logoImage || "/images/logo-guang-ji.png";

  return (
    <aside
      aria-label="Sampul Undangan Resmi Kuang Hang Fo Thang"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#160a0a] text-stone-100 transition-all duration-700 overflow-y-auto ${
        isOpening ? "opacity-0 scale-98 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Sacred Ambient Wash */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <Image
          src={bgImg}
          alt="Altar Suci Kuang Hang Fo Thang"
          fill
          priority
          className="object-cover filter blur-md scale-105"
          unoptimized={bgImg.startsWith("http")}
        />
        <div className="absolute inset-0 bg-[#160a0a]/85" />
      </div>

      {/* Main Ceremonial Invitation Folio */}
      <div className="relative w-full max-w-lg my-auto bg-[#faf8f5] text-[#211c19] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.65)] border border-[#dfba6d]/50 overflow-hidden">
        
        {/* Top Lacquer Crimson Header Band */}
        <div className="bg-[#7c1818] text-[#fbf5e8] px-6 py-5 text-center relative border-b border-[#dfba6d]/40">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#dfba6d]">
              {showId && (cms.cover.badgeId || "Peringatan 20 Tahun Gedung")}
              {showId && showZh && " • "}
              {showZh && (
                <span className="font-chinese font-normal">
                  {cms.cover.badgeZh || "廿週年堂慶紀念"}
                </span>
              )}
            </span>
          </div>

          <div className="relative w-12 h-12 mx-auto mb-2 rounded-full p-0.5 bg-gradient-to-b from-[#dfba6d] to-[#9e7631]">
            <div className="w-full h-full rounded-full bg-[#7c1818] p-1 flex items-center justify-center">
              <Image
                src={logoImg}
                alt="Logo Guang Ji"
                width={36}
                height={36}
                className="object-contain rounded-full"
                unoptimized={logoImg.startsWith("http")}
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-chinese font-bold tracking-widest text-[#fbf5e8]">
            {cms.cover.titleZh || "廣航佛堂"}
          </h1>
          <p className="text-xs font-serif tracking-widest text-[#dfba6d] mt-1 uppercase">
            {cms.cover.titleId || "Kuang Hang Fo Thang • 2006 — 2026"}
          </p>
        </div>

        {/* Inner Card Body */}
        <div className="p-6 sm:p-9 text-center flex flex-col items-center">
          
          {/* Subtitle / Theme */}
          <div className="mb-6 max-w-sm">
            {showId && (
              <p className="font-serif text-base sm:text-lg text-stone-800 italic leading-relaxed">
                &ldquo;{cms.cover.subtitleId || "Mengarungi Samudra Kebajikan, Menyalakan Pelita Kebijaksanaan"}&rdquo;
              </p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-600 tracking-wider mt-1.5">
                {cms.cover.subtitleZh || "同舟共濟度眾生 • 薪火相傳護慧命"}
              </p>
            )}
          </div>

          {/* Guest Nameplate (題名簽) */}
          <div className="w-full bg-[#f3efe6] rounded-xl p-4 sm:p-5 border border-[#dfba6d]/30 mb-6 relative">
            <div className="text-[11px] font-serif font-semibold tracking-widest text-[#7c1818] uppercase mb-1">
              {showId && <span>Yth. Tamu Undangan Terkasih</span>}
              {showId && showZh && <span> • </span>}
              {showZh && <span className="font-chinese">恭請 貴賓尊鑒</span>}
            </div>

            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1c1815] tracking-wide my-1">
              {guestName || "Saudara Se-Dharma & Umat Terkasih"}
            </div>

            <p className="text-xs text-stone-600 font-serif italic mt-1">
              {showId && "Dengan penuh hormat mengundang kehadiran Anda dalam malam syukur bersama."}
              {showZh && (
                <span className="block font-chinese not-italic text-xs text-stone-500 mt-0.5">
                  謹代表廣航佛堂全體道親，誠摯敬邀閣下撥冗蒞臨，同沾法喜。
                </span>
              )}
            </p>
          </div>

          {/* Event Brief Schedule */}
          <div className="w-full border-t border-b border-stone-200 py-3 mb-6 text-xs text-stone-700 flex flex-col sm:flex-row items-center justify-around gap-2 font-serif">
            <div>
              <span className="font-semibold text-[#7c1818]">{cms.event.dateTextId}</span>
              {showZh && <span className="block font-chinese text-stone-500 text-[11px]">{cms.event.dateTextZh}</span>}
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-stone-300" />
            <div>
              <span className="font-semibold text-[#7c1818]">{cms.event.timeTextId}</span>
              {showZh && <span className="block font-chinese text-stone-500 text-[11px]">{cms.event.timeTextZh}</span>}
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-stone-300" />
            <div>
              <span className="font-medium text-stone-600">{cms.event.venueNameId}</span>
              {showZh && <span className="block font-chinese text-stone-500 text-[11px]">{cms.event.venueNameZh}</span>}
            </div>
          </div>

          {/* Open Invitation Action Button */}
          <button
            onClick={handleOpen}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer border border-[#dfba6d]/60"
          >
            <span>{showId ? (cms.cover.buttonTextId || "Buka Undangan") : "啟封"}</span>
            {showId && showZh && <span className="opacity-80">•</span>}
            {showZh && <span className="font-chinese font-normal">{cms.cover.buttonTextZh || "敬請啟封"}</span>}
          </button>

          <span className="text-[11px] text-stone-500 font-serif mt-3 tracking-wide">
            {showId ? "Sentuh tombol untuk membuka surat undangan resmi" : "點擊按鈕開啟正式邀請函"}
          </span>

        </div>

        {/* Bottom Gold Accent Hairline */}
        <div className="h-1 w-full bg-gradient-to-r from-[#dfba6d] via-[#b38638] to-[#dfba6d]" />
      </div>
    </aside>
  );
}
