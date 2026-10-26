"use client";

import React, { useState } from "react";
import Image from "next/image";
import { historyMilestones, Milestone } from "@/data/history";
import { History, Sparkles, MapPin, ChevronRight, ChevronLeft } from "lucide-react";

export default function HistoryTimeline() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = historyMilestones[selectedIdx];

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % historyMilestones.length);
  };

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev - 1 + historyMilestones.length) % historyMilestones.length);
  };

  return (
    <section id="sejarah" className="py-16 sm:py-24 px-4 sm:px-6 relative bg-[#f5efe4]/60">
      
      {/* Background Archival Seal */}
      <div className="absolute right-4 top-12 select-none pointer-events-none opacity-[0.03]">
        <span className="text-[14rem] sm:text-[20rem] font-chinese font-black text-stone-900 leading-none">
          史
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Napak Tilas 20 Tahun Gedung Kuang Hang (1997 — 2026)
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            歲月印記 • 薪火相傳
          </h2>
          <p className="text-sm font-serif text-stone-600 max-w-xl">
            Mengenang jejak tetesan keringat, doa tulus, dan pengorbanan para perintis awal yang memungkinkan pelita Kuang Hang bersinar terang hari ini.
          </p>
        </div>

        {/* Horizontal Timeline Ribbon with Years */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {historyMilestones.map((m, idx) => (
            <button
              key={m.year + idx}
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                selectedIdx === idx
                  ? "bg-[#831f1f] text-amber-200 shadow-md scale-105 border border-amber-400/40"
                  : "bg-white/70 text-stone-700 hover:bg-white hover:text-red-900 border border-stone-200/80"
              }`}
            >
              <span className="font-serif font-bold text-sm sm:text-base leading-none">
                {m.year}
              </span>
              <span className="text-[10px] font-chinese mt-1 opacity-90 truncate max-w-[90px]">
                {m.chineseTitle || m.title}
              </span>
            </button>
          ))}
        </div>

        {/* Monograph Book Spread (典藏書刊開頁) */}
        <div className="rounded-2xl bg-[#faf7f2] border border-amber-700/25 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
          
          {/* Left Column: Archival Photograph (Museum Matting Frame) */}
          <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[420px] bg-stone-950 overflow-hidden flex flex-col justify-end p-6">
            <Image
              src={current.image || "/images/guang-hang-15.jpg"}
              alt={current.title}
              fill
              className="object-cover transition-all duration-700 opacity-90 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

            {/* Archival Reference Tag */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="chinese-seal-filled text-xs px-2.5 py-0.5 shadow-md">
                Tahun {current.year}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] text-stone-300 font-serif">
                Bab {selectedIdx + 1} dari {historyMilestones.length}
              </span>
            </div>

            {/* Inset Photo Caption */}
            <div className="relative z-10 text-white">
              <div className="text-xl sm:text-2xl font-chinese font-bold text-amber-300 mb-1 drop-shadow">
                {current.chineseTitle}
              </div>
              <p className="text-xs text-stone-300 font-serif italic">
                {current.highlight}
              </p>
            </div>
          </div>

          {/* Right Column: Historical Narrative Text */}
          <div className="lg:col-span-6 p-7 sm:p-11 flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 mb-4">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
                  Kilas Balik Sejarah Perintisan
                </span>
                <span className="font-chinese text-xs text-stone-500">
                  廣航佛堂文獻
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-red-950 mb-2">
                {current.title}
              </h3>

              {current.location && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-serif mb-4">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{current.location}</span>
                </div>
              )}

              <p className="text-stone-700 text-sm leading-relaxed mb-6 font-serif">
                {current.description}
              </p>

              {/* Archival Pull Quote Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border-l-2 border-amber-600 text-xs text-stone-800 font-serif italic leading-relaxed">
                &ldquo;{current.highlight}&rdquo;
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="mt-8 pt-4 border-t border-amber-900/10 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 text-xs font-serif font-medium text-stone-600 hover:text-red-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-[11px] font-serif text-stone-500">
                {selectedIdx + 1} / {historyMilestones.length}
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1 text-xs font-serif font-medium text-stone-600 hover:text-red-900 transition-colors cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
