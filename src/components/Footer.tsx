"use client";

import React from "react";
import Image from "next/image";
import { Heart, Instagram, MailOpen, ArrowUp } from "lucide-react";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export default function Footer({ onReopenEnvelope }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 bg-gradient-to-b from-[#250d0d] via-[#1a0707] to-[#110404] text-stone-200 border-t border-amber-500/30 pt-16 pb-24 px-4 sm:px-6 relative text-center">
      <div className="max-w-3xl mx-auto">
        
        {/* Guang Ji Sacred Emblem */}
        <div className="relative w-16 h-16 mx-auto mb-4 group-hover:scale-105 transition-transform drop-shadow-[0_8px_20px_rgba(212,155,40,0.35)]">
          <Image
            src="/images/logo-guang-ji.png"
            alt="Logo Guang Ji"
            fill
            sizes="64px"
            className="object-contain rounded-full"
          />
        </div>

        <h3 className="text-3xl sm:text-4xl font-chinese font-bold text-amber-200 tracking-widest mb-1">
          廣航佛堂
        </h3>
        <p className="text-xs sm:text-sm font-chinese text-amber-400/80 tracking-widest mb-4">
          成立二十週年堂慶紀念 (2006 — 2026)
        </p>

        <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-6" />

        <div className="max-w-lg mx-auto mb-6 space-y-2">
          <p className="font-serif text-sm sm:text-base text-stone-300 italic leading-relaxed">
            &ldquo;Tiada kata yang mampu melukiskan rasa syukur atas Tian En Shi De serta ketulusan seluruh umat yang telah menyatukan hati dalam mengarungi samudra kebajikan selama dua dasawarsa.&rdquo;
          </p>
          <p className="font-chinese text-xs sm:text-sm text-amber-300/90 leading-relaxed font-normal">
            「叩謝天恩師德浩瀚加被，感恩前賢大德至誠護持。廿載同舟普化，萬里慈航不捨眾生。」
          </p>
        </div>

        {/* Action Controls - Bilingual */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <a
            href="https://www.instagram.com/guanghangfotang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-stone-200 transition cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5 text-amber-400" />
            <span>@guanghangfotang</span>
          </a>

          <button
            onClick={onReopenEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-amber-300 transition cursor-pointer"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>Buka Sampul Undangan • 重啟禮函</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-stone-300 transition cursor-pointer"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Ke Atas • 頂部</span>
          </button>
        </div>

        {/* Address and Sanctuary Notation */}
        <p className="text-xs text-stone-400 font-serif max-w-sm mx-auto leading-relaxed mb-1">
          Kuang Hang Fo Thang • Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480
        </p>
        <p className="text-[11px] font-chinese text-stone-500 mb-6">
          雅加達西區巴美拉北三路186A號
        </p>

        {/* Colophon */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-center text-[11px] text-stone-400 font-serif">
          <div className="flex items-center gap-1.5">
            <span>Dipersembahkan dengan ketulusan oleh</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span className="text-stone-300">Keluarga Besar Kuang Hang (廣航佛堂闔體)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
