"use client";

import React from "react";
import { Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function WisdomQuote() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();

  return (
    <section id="wejangan" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#f5efe6]/40">
      
      {/* Background Watermark Inscription */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02]" aria-hidden="true">
        <span className="text-[18rem] sm:text-[28rem] font-chinese font-black text-[#211c19] leading-none">
          道
        </span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Memorial Inscription Card */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 p-8 sm:p-14 shadow-sm text-center relative">
          
          {/* Subtle Cinnabar Seal & Sacred Flame */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[#fbf5e8] border border-[#dfba6d]/60 flex items-center justify-center mb-3 text-[#7c1818]">
              <Flame className="w-5 h-5 text-[#7c1818]" />
            </div>

            <div className="chinese-seal-red text-xs px-3 py-1 mb-2">
              {cms.wisdom.sealZh || "茂田師兄慈悲勉勵"}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#7c1818]">
              {showId && (cms.wisdom.headingId || "Untaian Wejangan Kebijaksanaan")}
              {showId && showZh && " • "}
              {showZh && <span className="font-chinese">{cms.wisdom.headingZh || "茂田師兄聖訓"}</span>}
            </h2>
            <p className="text-xs text-[#9e7631] font-serif tracking-widest mt-1 uppercase">
              {showId && (cms.wisdom.subheadingId || "Suluh Jiwa Perjalanan 20 Tahun Kuang Hang Fo Thang")}
              {showId && showZh && " • "}
              {showZh && <span className="font-chinese font-normal">{cms.wisdom.subheadingZh || "廿載慧命指路明燈"}</span>}
            </p>
          </div>

          {/* Calligraphic Divider */}
          <div className="w-16 h-px mx-auto bg-[#dfba6d] my-4" />

          {/* Primary Quote Content */}
          <div className="max-w-2xl mx-auto my-6">
            {showId && (
              <blockquote className="font-serif text-lg sm:text-2xl text-stone-900 font-normal leading-relaxed italic px-2 sm:px-6">
                &ldquo;{cms.wisdom.quoteId}&rdquo;
              </blockquote>
            )}

            {showId && cms.wisdom.closingId && (
              <p className="font-serif text-base sm:text-xl text-[#7c1818] font-medium italic mt-5">
                {cms.wisdom.closingId}
              </p>
            )}

            {showZh && (
              <div className={`${showId ? "mt-6 pt-6 border-t border-stone-100" : "my-4"} text-sm sm:text-base font-chinese text-stone-800 tracking-wide leading-loose font-normal`}>
                「{cms.wisdom.quoteZh}」
              </div>
            )}
          </div>

          {/* Seal Marks */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-center gap-3 text-xs font-chinese text-stone-500">
            <span className="chinese-seal-filled text-[11px] px-2 py-0.5">
              佛光普照
            </span>
            <span className="font-serif italic text-stone-600 text-xs">
              {showId && "Peringatan Dua Dasawarsa (2006 — 2026)"}
              {showId && showZh && " • "}
              {showZh && <span>廿載誌慶</span>}
            </span>
            <span className="chinese-seal-filled text-[11px] px-2 py-0.5">
              薪火相傳
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}
