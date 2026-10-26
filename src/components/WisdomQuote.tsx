"use client";

import React from "react";
import { Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WisdomQuote() {
  const { showId, showZh } = useLanguage();

  return (
    <section id="wejangan" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Watermark Inscription */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02]">
        <span className="text-[16rem] sm:text-[24rem] font-chinese font-black text-stone-900 leading-none">
          道
        </span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Ancient Ceremonial Calligraphy Scroll (古風宣紙卷軸) */}
        <div className="relative">
          
          {/* Top Mahogany Scroll Rod with Brass Caps */}
          <div className="h-4 w-full bg-gradient-to-r from-[#2c130d] via-[#4a2218] to-[#2c130d] rounded-full shadow-md relative flex items-center justify-between px-2">
            <div className="w-2.5 h-5 -my-0.5 rounded-l bg-amber-400 border border-amber-600 shadow" />
            <div className="w-2.5 h-5 -my-0.5 rounded-r bg-amber-400 border border-amber-600 shadow" />
          </div>

          {/* Scroll Canvas Body */}
          <div className="bg-[#f7f2e7] border-x-4 border-[#3e1b12] px-6 sm:px-14 py-10 sm:py-14 shadow-2xl relative">
            
            {/* Subtle Vertical Red Column Lines (朱絲欄) */}
            <div className="absolute inset-y-6 inset-x-8 sm:inset-x-16 border border-red-900/15 pointer-events-none flex justify-between opacity-30">
              <div className="h-full w-px bg-red-900/15" />
              <div className="h-full w-px bg-red-900/15 hidden sm:block" />
              <div className="h-full w-px bg-red-900/15 hidden sm:block" />
              <div className="h-full w-px bg-red-900/15" />
            </div>

            {/* Sacred Lamp Icon & Seal */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative z-10">
              <div className="w-12 h-12 rounded-full bg-amber-600/10 border border-amber-600/30 flex items-center justify-center mb-3 text-amber-700 shadow-inner">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>

              <div className="chinese-seal-red text-xs px-3 py-1 mb-2">
                茂田師兄慈悲勉勵
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-red-950">
                {showId && "Untaian Wejangan Kebijaksanaan"}
                {showId && showZh && " • "}
                {showZh && "茂田師兄聖訓"}
              </h2>
              <p className="text-xs text-amber-800 font-serif tracking-widest mt-1 uppercase">
                {showId && "Suluh Jiwa Perjalanan 20 Tahun Kuang Hang Fo Thang"}
                {showId && showZh && " • "}
                {showZh && "廿載慧命指路明燈"}
              </p>
            </div>

            {/* Primary Quote Content */}
            <div className="relative my-6 text-center z-10 max-w-2xl mx-auto">
              
              <div className="text-4xl text-amber-600/40 font-serif select-none -mb-3">“</div>

              {showId && (
                <blockquote className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-relaxed italic px-2 sm:px-6">
                  Semoga di dalam hati setiap orang terdapat kekuatan ikrar, tekad yang bulat, semangat untuk mengorbankan kepentingan diri demi kepentingan yang lebih besar, serta memiliki sebuah tekad penuh welas asih untuk tidak meninggalkan semua makhluk.
                </blockquote>
              )}

              {showId && (
                <>
                  <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent my-6" />

                  <p className="font-serif text-lg sm:text-xl text-red-900 font-medium italic">
                    Marilah kita bersama-sama menjaga dan mendukung kehidupan kebijaksanaan Shizun dan Shimu.
                  </p>
                </>
              )}

              {showZh && (
                <div className={`${showId ? "mt-6 pt-6 border-t border-amber-900/10" : "my-4"} text-sm sm:text-base font-chinese text-stone-800 tracking-widest leading-loose font-normal`}>
                  「願人人心中有大愿力 • 捨己為公 • 慈悲不捨眾生 • 共同護持師尊師母慧命」
                </div>
              )}

              <div className="text-4xl text-amber-600/40 font-serif select-none -mt-1">”</div>
            </div>

            {/* Seal Marks at bottom of scroll */}
            <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-chinese text-stone-500">
              <span className="chinese-seal-filled text-[10px] px-2 py-0.5">
                佛光普照
              </span>
              <span className="font-serif italic text-stone-600">
                {showId && "Peringatan Dua Dasawarsa"}
                {showId && showZh && " • "}
                {showZh && "廣航同舟"}
              </span>
              <span className="chinese-seal-red text-[10px] px-2 py-0.5">
                永續長航
              </span>
            </div>

          </div>

          {/* Bottom Mahogany Scroll Rod with Brass Caps */}
          <div className="h-4 w-full bg-gradient-to-r from-[#2c130d] via-[#4a2218] to-[#2c130d] rounded-full shadow-lg relative flex items-center justify-between px-2">
            <div className="w-2.5 h-5 -my-0.5 rounded-l bg-amber-400 border border-amber-600 shadow" />
            <div className="w-2.5 h-5 -my-0.5 rounded-r bg-amber-400 border border-amber-600 shadow" />
          </div>

        </div>

      </div>

    </section>
  );
}
