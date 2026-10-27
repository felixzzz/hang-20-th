"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { historyMilestones, sortMilestonesByYear } from "@/data/history";
import { MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function HistoryTimeline() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const rawMilestones = cms.milestones && cms.milestones.length > 0 ? cms.milestones : historyMilestones;
  const milestones = useMemo(() => sortMilestonesByYear(rawMilestones), [rawMilestones]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = milestones[selectedIdx] || milestones[0];

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % milestones.length);
  };

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  return (
    <section id="sejarah" className="py-16 sm:py-24 px-4 sm:px-6 relative bg-[#f5efe6]/40">
      
      {/* Background Archival Seal */}
      <div className="absolute right-4 top-12 select-none pointer-events-none opacity-[0.02]" aria-hidden="true">
        <svg aria-hidden="true" role="presentation" className="w-56 h-56 sm:w-80 sm:h-80" viewBox="0 0 100 100">
          <text x="50" y="80" textAnchor="middle" fontSize="85" fontFamily="serif" fontWeight="900" fill="#211c19">史</text>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            Napak Tilas 20 Tahun Gedung (1997 — 2026)
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            歲月印記 • 薪火相傳
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-xl">
            {showId && (
              <p>
                Mengenang jejak tetesan keringat, doa tulus, dan pengorbanan para perintis awal yang memungkinkan pelita Kuang Hang bersinar terang hari ini.
              </p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 mt-1">
                追思前賢開荒啟航之大願與辛勞，一磚一瓦凝聚願力，薪火相傳二十載，廣航慧燈恆久普照。
              </p>
            )}
          </div>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {milestones.map((m, idx) => (
            <button
              key={m.year + idx}
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                selectedIdx === idx
                  ? "bg-[#7c1818] text-[#fbf5e8] shadow-sm border border-[#dfba6d]/50"
                  : "bg-white text-stone-700 hover:text-[#7c1818] hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <span className="font-serif font-bold text-sm leading-none">
                {m.year}
              </span>
              <span className="text-[10px] uppercase tracking-wider mt-1 font-serif opacity-80 truncate max-w-[90px]">
                {m.title}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Milestone Card */}
        {current && (
          <div className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/35 shadow-sm p-6 sm:p-10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Text Narrative */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#7c1818]">
                    {current.year}
                  </span>
                  {current.location && (
                    <div className="flex items-center gap-1 text-xs text-stone-500 font-serif">
                      <MapPin className="w-3.5 h-3.5 text-[#9e7631]" />
                      <span>{current.location}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#211c19] mb-1">
                  {showId && current.title}
                  {showId && showZh && current.chineseTitle && " • "}
                  {showZh && <span className="font-chinese font-bold text-[#7c1818]">{current.chineseTitle}</span>}
                </h3>

                <div className="my-4 text-stone-700 font-serif text-sm sm:text-base leading-relaxed space-y-2">
                  {showId && <p>{current.description}</p>}
                  {showZh && current.chineseDescription && (
                    <p className="font-chinese text-xs sm:text-sm text-stone-600 leading-relaxed mt-2 pt-2 border-t border-stone-100">
                      {current.chineseDescription}
                    </p>
                  )}
                </div>

                {/* Highlight Plaque */}
                {(current.highlight || current.chineseHighlight) && (
                  <div className="mt-4 p-4 rounded-xl bg-[#faf8f5] border-l-3 border-[#dfba6d] text-xs sm:text-sm text-stone-800 font-serif italic">
                    {showId && current.highlight && <p>&ldquo;{current.highlight}&rdquo;</p>}
                    {showZh && current.chineseHighlight && (
                      <p className="font-chinese not-italic text-stone-600 mt-1">
                        「{current.chineseHighlight}」
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-100">
                  <button
                    onClick={handlePrev}
                    aria-label="Tahap Sebelumnya"
                    className="p-2 rounded-full border border-stone-200 text-stone-700 hover:bg-[#7c1818] hover:text-[#fbf5e8] hover:border-[#7c1818] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-serif text-stone-500 px-2">
                    {selectedIdx + 1} / {milestones.length}
                  </span>
                  <button
                    onClick={handleNext}
                    aria-label="Tahap Selanjutnya"
                    className="p-2 rounded-full border border-stone-200 text-stone-700 hover:bg-[#7c1818] hover:text-[#fbf5e8] hover:border-[#7c1818] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Archival Photo */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                  {current.image ? (
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      unoptimized={current.image.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif text-xs">
                      Foto Dokumentasi Kuang Hang
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
