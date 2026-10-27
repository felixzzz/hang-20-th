"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Sparkles, MailOpen } from "lucide-react";
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

  const bgImg = cms.cover.bgImage || "/images/guang-hang-10.jpg";
  const logoImg = cms.cover.logoImage || "/images/logo-guang-ji.png";

  return (
    <aside
      aria-label="Sampul Undangan Resmi Kuang Hang Fo Thang"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#140808] text-stone-100 transition-all duration-700 overflow-y-auto ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
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

      {/* Main Ceremonial Landscape Invitation Folio */}
      <div className="relative w-full max-w-4xl my-auto bg-[#faf8f5] text-[#211c19] rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.75)] border-2 border-[#dfba6d]/60 overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          
          {/* Left / Front Ceremonial Lacquer Flap (Landscape Left Panel) */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#7c1818] via-[#6a1313] to-[#540d0d] text-[#fbf5e8] p-6 sm:p-8 flex flex-col justify-between items-center text-center relative border-b md:border-b-0 md:border-r border-[#dfba6d]/40">
            
            {/* Subtle Texture & Atmospheric Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#dfba6d_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04]" aria-hidden="true">
              <span className="text-[12rem] font-chinese font-bold leading-none text-[#dfba6d]">
                航
              </span>
            </div>

            {/* Top Seal */}
            <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-[#dfba6d]/20">
              <span className="chinese-seal-filled text-[10px] px-2 py-0.5 border-[#dfba6d]/60">
                天恩師德
              </span>
              <span className="text-[10px] font-serif tracking-[0.2em] text-[#dfba6d] uppercase">
                {showId && "Undangan Resmi"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese font-normal">尊榮請柬</span>}
              </span>
            </div>

            {/* Central Emblems & Monograph */}
            <div className="relative z-10 my-4 flex flex-col items-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full p-1 bg-gradient-to-b from-[#dfba6d] via-[#b38638] to-[#9e7631] shadow-lg">
                <div className="w-full h-full rounded-full bg-[#7c1818] p-1.5 flex items-center justify-center">
                  <Image
                    src={logoImg}
                    alt="Logo Guang Ji"
                    width={56}
                    height={56}
                    className="object-contain rounded-full"
                    unoptimized={logoImg.startsWith("http")}
                  />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-chinese font-bold tracking-widest text-[#fbf5e8] drop-shadow-sm">
                {cms.cover.titleZh || "廣航佛堂"}
              </h1>
              
              <p className="text-xs font-serif tracking-[0.18em] text-[#dfba6d] mt-1.5 uppercase font-medium">
                {cms.cover.titleId || "Kuang Hang Fo Thang • 2006 — 2026"}
              </p>

              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#dfba6d] to-transparent my-3" />

              <div className="max-w-xs space-y-1">
                {showId && (
                  <p className="font-serif text-xs sm:text-sm text-[#fbf5e8]/90 italic leading-relaxed">
                    &ldquo;{cms.cover.subtitleId || "Mengarungi Samudra Kebajikan, Menyalakan Pelita Kebijaksanaan"}&rdquo;
                  </p>
                )}
                {showZh && (
                  <p className="font-chinese text-xs text-[#dfba6d] tracking-wider font-normal">
                    {cms.cover.subtitleZh || "同舟共濟度眾生 • 薪火相傳護慧命"}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Lacquer Seal Inscription */}
            <div className="relative z-10 w-full pt-3 border-t border-[#dfba6d]/20 text-[10px] font-chinese text-[#dfba6d]/80 tracking-widest">
              二零零六 — 二零二六 • 廿載同舟
            </div>
          </div>

          {/* Right / Inside Invitation Body (Landscape Right Panel) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            
            {/* Top Badge Ribbon */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#9e7631]" />
                <span className="text-[11px] font-serif font-semibold tracking-wider uppercase text-[#7c1818]">
                  {showId && (cms.cover.badgeId || "Peringatan 20 Tahun Gedung")}
                  {showId && showZh && " • "}
                  {showZh && (
                    <span className="font-chinese font-normal">
                      {cms.cover.badgeZh || "廿週年堂慶紀念"}
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-serif">
                {cms.event.dateTextId}
              </span>
            </div>

            {/* Honored Guest Nameplate (題名簽) */}
            <div className="my-4 bg-gradient-to-r from-[#f7f2e8] via-[#fbf8f2] to-[#f7f2e8] rounded-xl p-4 sm:p-5 border border-[#dfba6d]/40 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-serif font-semibold tracking-widest text-[#7c1818] uppercase mb-1">
                {showId && <span>{cms.cover.guestPrefixId || "Yth. Tamu Undangan Terkasih"}</span>}
                {showId && showZh && <span> • </span>}
                {showZh && <span className="font-chinese">{cms.cover.guestPrefixZh || "恭請 貴賓尊鑒"}</span>}
              </div>

              <div className="text-xl sm:text-2xl font-serif font-bold text-[#1c1815] tracking-wide my-1">
                {guestName || "Saudara Se-Dharma & Umat Terkasih"}
              </div>

              <p className="text-xs text-stone-600 font-serif italic mt-1 leading-relaxed">
                {showId && (cms.cover.inviteTextId || "Dengan penuh hormat mengundang kehadiran Anda dalam malam syukur bersama.")}
                {showZh && (
                  <span className="block font-chinese not-italic text-xs text-stone-500 mt-0.5">
                    {cms.cover.inviteTextZh || "謹代表廣航佛堂全體道親，誠摯敬邀閣下撥冗蒞臨，同沾法喜。"}
                  </span>
                )}
              </p>
            </div>

            {/* Concise Event Schedule Plaque */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3 px-3.5 rounded-xl bg-white border border-stone-200 text-xs font-serif mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#7c1818] shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 block truncate">{cms.event.dateTextId}</span>
                  {showZh && <span className="text-[10px] font-chinese text-stone-500 block truncate">{cms.event.dateTextZh}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:border-x sm:border-stone-100 sm:px-2">
                <Clock className="w-3.5 h-3.5 text-[#7c1818] shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 block truncate">{cms.event.timeTextId}</span>
                  {showZh && <span className="text-[10px] font-chinese text-stone-500 block truncate">{cms.event.timeTextZh}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7c1818] shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium text-stone-800 block truncate">{cms.event.venueNameId}</span>
                  {showZh && <span className="text-[10px] font-chinese text-stone-500 block truncate">{cms.event.venueNameZh}</span>}
                </div>
              </div>
            </div>

            {/* Call to Action: Open Invitation Button */}
            <div className="flex flex-col items-center pt-2">
              <button
                onClick={handleOpen}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 cursor-pointer border border-[#dfba6d]/60"
              >
                <MailOpen className="w-4 h-4 text-[#dfba6d] group-hover:scale-110 transition-transform" />
                <span>{showId ? (cms.cover.buttonTextId || "Buka Undangan Resmi") : "啟封"}</span>
                {showId && showZh && <span className="opacity-80">•</span>}
                {showZh && <span className="font-chinese font-normal">{cms.cover.buttonTextZh || "恭啟尊榮邀請函"}</span>}
              </button>

              <span className="text-[11px] text-stone-500 font-serif mt-2 tracking-wide text-center">
                {showId
                  ? (cms.cover.buttonSubtextId || "Sentuh tombol untuk membuka surat undangan resmi")
                  : (cms.cover.buttonSubtextZh || "點擊按鈕開啟正式邀請函")}
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Gold Foil Hairline */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#dfba6d] via-[#b38638] to-[#dfba6d]" />
      </div>
    </aside>
  );
}
