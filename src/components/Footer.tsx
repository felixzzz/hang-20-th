"use client";

import React from "react";
import Image from "next/image";
import { Heart, Instagram, MailOpen, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export default function Footer({ onReopenEnvelope }: FooterProps) {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoImg = cms.cover.logoImage || "/images/logo-guang-ji.png";

  return (
    <footer className="mt-20 bg-[#1c1815] text-[#fbf5e8] border-t border-[#dfba6d]/30 pt-16 pb-20 px-4 sm:px-6 relative text-center">
      <div className="max-w-3xl mx-auto">
        
        {/* Guang Ji Sacred Emblem */}
        <div className="relative w-14 h-14 mx-auto mb-3">
          <Image
            src={logoImg}
            alt="Logo Guang Ji"
            fill
            sizes="56px"
            className="object-contain rounded-full shadow-sm"
            unoptimized={logoImg.startsWith("http")}
          />
        </div>

        <h3 className="text-3xl sm:text-4xl font-chinese font-bold text-[#fbf5e8] tracking-widest mb-1">
          {cms.cover.titleZh || "廣航佛堂"}
        </h3>
        <p className="text-xs sm:text-sm font-chinese text-[#dfba6d] tracking-widest mb-4">
          成立二十週年堂慶紀念 (2006 — 2026)
        </p>

        <div className="w-16 h-px mx-auto bg-[#dfba6d]/40 mb-6" />

        <div className="max-w-lg mx-auto mb-6 space-y-2">
          {showId && (
            <p className="font-serif text-sm text-stone-300 italic leading-relaxed">
              &ldquo;Tiada kata yang mampu melukiskan rasa syukur atas Tian En Shi De serta ketulusan seluruh umat yang telah menyatukan hati dalam mengarungi samudra kebajikan selama dua dasawarsa.&rdquo;
            </p>
          )}
          {showZh && (
            <p className="font-chinese text-xs sm:text-sm text-[#dfba6d]/90 leading-relaxed font-normal">
              「叩謝天恩師德浩瀚加被，感恩前賢大德至誠護持。廿載同舟普化，萬里慈航不捨眾生。」
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <a
            href="https://www.instagram.com/guanghangfotang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-stone-200 transition cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5 text-[#dfba6d]" />
            <span>@guanghangfotang</span>
          </a>

          <button
            onClick={onReopenEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-[#dfba6d] transition cursor-pointer"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>{showId ? "Buka Ulang Sampul" : "重啟封套"}</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-stone-200 transition cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#dfba6d]" />
            <span>{showId ? "Kembali ke Atas" : "回頂部"}</span>
          </button>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 border-t border-white/10 text-xs text-stone-400 font-serif flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>© 2006 — 2026 Kuang Hang Fo Thang. Seluruh Hak Dilindungi.</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Dirajut dengan ketulusan hati</span>
            <Heart className="w-3.5 h-3.5 text-[#7c1818] fill-[#7c1818]" />
            <span>demi kelestarian dharma</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
