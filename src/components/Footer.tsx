"use client";

import React from "react";
import { Heart, Instagram, MailOpen, ArrowUp } from "lucide-react";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export default function Footer({ onReopenEnvelope }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-16 bg-gradient-to-b from-[#240b0b] to-[#140606] text-white border-t-2 border-fothang-gold-400/30 pt-14 pb-20 px-4 sm:px-6 relative text-center">
      <div className="max-w-3xl mx-auto">
        {/* Sacred Character Banner */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fothang-gold-500 to-fothang-gold-700 text-fothang-red-950 font-chinese font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-fothang-gold-500/20">
          廣
        </div>

        <h3 className="text-2xl sm:text-3xl font-chinese font-bold text-fothang-gold-300 tracking-wider mb-1">
          廣航佛堂
        </h3>
        <p className="text-sm font-chinese text-stone-300 tracking-widest mb-4">
          廿載同舟 · 續航萬里 (2006 - 2026)
        </p>

        <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-500 to-transparent mb-6" />

        <p className="font-serif text-sm sm:text-base text-stone-300 italic max-w-md mx-auto mb-6">
          &ldquo;Tiada kata yang mampu melukiskan rasa syukur atas Tian En Shi De serta ketulusan seluruh umat yang telah menyatukan hati dalam mengarungi samudra kebajikan.&rdquo;
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <a
            href="https://www.instagram.com/guanghangfotang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-stone-200 transition cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>@guanghangfotang</span>
          </a>

          <button
            onClick={onReopenEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-fothang-gold-300 transition cursor-pointer"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>Lihat Sampul Depan</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-stone-300 transition cursor-pointer"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Ke Atas</span>
          </button>
        </div>

        {/* Address summary */}
        <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed mb-6">
          Kuang Hang Fo Thang • Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat
        </p>

        <div className="pt-6 border-t border-white/10 text-[11px] text-stone-300 flex items-center justify-center gap-1">
          <span>Dipersembahkan dengan ketulusan oleh</span>
          <Heart className="w-3 h-3 text-fothang-red-500 fill-fothang-red-500" />
          <span className="text-stone-200 font-medium">Keluarga Besar Kuang Hang Fo Thang</span>
        </div>
      </div>
    </footer>
  );
}
