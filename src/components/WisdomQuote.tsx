"use client";

import React from "react";
import { Sparkles, Flame } from "lucide-react";

export default function WisdomQuote() {
  return (
    <section id="wejangan" className="py-14 sm:py-20 relative px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Sacred Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#361010] via-[#240b0b] to-[#1a0707] text-white p-7 sm:p-12 border-2 border-fothang-gold-400/40 shadow-2xl shadow-fothang-red-950/30 overflow-hidden">
          {/* Subtle Corner Patterns */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-fothang-gold-400/60 pointer-events-none" />

          {/* Incense / Lamp of Wisdom motif */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-fothang-gold-500/15 border border-fothang-gold-400/40 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-fothang-gold-400 animate-pulse" />
            </div>
            <span className="text-[11px] font-chinese tracking-widest text-fothang-gold-300 uppercase">
              茂田師兄慈悲勉勵
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-fothang-gold-200 mt-1">
              Wejangan Welas Asih Maotian Shixiong
            </h2>
          </div>

          {/* Quote Body */}
          <div className="relative my-4 text-center">
            {/* Opening Decorative Quote Mark */}
            <span className="text-5xl sm:text-6xl font-serif text-fothang-gold-500/30 select-none block -mb-4">
              “
            </span>

            <blockquote className="font-serif text-lg sm:text-2xl leading-relaxed text-stone-100 font-normal italic px-2 sm:px-6">
              Semoga di dalam hati setiap orang terdapat kekuatan ikrar, tekad yang bulat, semangat untuk mengorbankan kepentingan diri demi kepentingan yang lebih besar, serta memiliki sebuah tekad penuh welas asih untuk tidak meninggalkan semua makhluk.
            </blockquote>

            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-400 to-transparent my-4" />

            <p className="font-serif text-base sm:text-xl text-fothang-gold-300 font-medium italic">
              Marilah kita bersama-sama menjaga dan mendukung kehidupan kebijaksanaan Shizun dan Shimu.
            </p>

            <span className="text-5xl sm:text-6xl font-serif text-fothang-gold-500/30 select-none block -mt-2">
              ”
            </span>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-fothang-gold-400/20">
            <p className="text-xs text-stone-300 tracking-wider">
              Menjadi suluh penerang batin dalam 20 tahun dedikasi wadah ketuhanan Kuang Hang Fo Thang
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
