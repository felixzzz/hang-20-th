"use client";

import React, { useState } from "react";
import Image from "next/image";
import { historyMilestones, Milestone } from "@/data/history";
import { History, Sparkles, MapPin, ChevronRight } from "lucide-react";

export default function HistoryTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(historyMilestones[0]);

  return (
    <section id="sejarah" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-fothang-cream/40 to-transparent relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-red-50 border border-fothang-red-200 text-fothang-red-800 text-xs font-semibold tracking-wider uppercase mb-3">
            <History className="w-3.5 h-3.5 text-fothang-red-700" />
            <span>Napak Tilas 20 Tahun (1997 - 2026)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-2">
            Jejak Langkah & Perjuangan Kuang Hang
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            Mengenang keikhlasan para pendahulu, keringat para perintis, dan ketulusan umat yang telah bahu-membahu membangun wadah suci ini.
          </p>
        </div>

        {/* Timeline Horizontal / Stepper Navigation on Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {historyMilestones.map((m, idx) => (
            <button
              key={m.year + idx}
              onClick={() => setSelectedMilestone(m)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-medium transition-all duration-300 cursor-pointer ${
                selectedMilestone.title === m.title
                  ? "bg-fothang-red-800 text-fothang-gold-200 border-fothang-red-900 shadow-md scale-105"
                  : "bg-white text-stone-700 border-stone-200 hover:border-fothang-gold-300 hover:bg-stone-50"
              }`}
            >
              <span className="font-serif font-bold text-sm">{m.year}</span>
              <span className="text-[11px] opacity-80 truncate max-w-[120px]">{m.title}</span>
            </button>
          ))}
        </div>

        {/* Featured Milestone Card */}
        <div className="rounded-3xl bg-white border border-fothang-gold-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 mb-12">
          {/* Image */}
          <div className="relative md:col-span-5 h-64 md:h-auto min-h-[260px] bg-stone-900 overflow-hidden">
            <Image
              src={selectedMilestone.image || "/images/guang-hang-15.jpg"}
              alt={selectedMilestone.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-fothang-red-900/90 text-fothang-gold-300 font-serif font-bold text-xs backdrop-blur-sm shadow">
                Tahun {selectedMilestone.year}
              </span>
            </div>
            {selectedMilestone.chineseTitle && (
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xl font-chinese font-bold drop-shadow text-fothang-gold-300">
                  {selectedMilestone.chineseTitle}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-fothang-gold-700 font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kilas Sejarah Kuang Hang</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-fothang-red-950 mb-2">
                {selectedMilestone.title}
              </h3>

              {selectedMilestone.location && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-fothang-gold-600" />
                  <span>{selectedMilestone.location}</span>
                </div>
              )}

              <p className="text-stone-700 text-sm leading-relaxed mb-4">
                {selectedMilestone.description}
              </p>

              {selectedMilestone.highlight && (
                <div className="p-3.5 rounded-xl bg-fothang-gold-50/70 border-l-4 border-fothang-gold-500 text-xs text-fothang-gold-900 italic">
                  &ldquo;{selectedMilestone.highlight}&rdquo;
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Masa Bakti: 1997 - Sekarang</span>
              <span className="font-chinese text-fothang-red-800 font-semibold">天恩師德</span>
            </div>
          </div>
        </div>

        {/* Full Vertical Step View */}
        <div className="relative border-l-2 border-fothang-gold-300 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {historyMilestones.map((m, i) => (
            <div key={i} className="relative group">
              {/* Dot icon */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-fothang-red-700 group-hover:scale-125 transition-transform" />

              <div className="bg-white/80 hover:bg-white p-5 rounded-2xl border border-stone-200 hover:border-fothang-gold-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-fothang-red-100 text-fothang-red-900 font-serif font-bold text-xs">
                      {m.year}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900">
                      {m.title}
                    </h4>
                  </div>
                  {m.chineseTitle && (
                    <span className="font-chinese text-xs font-semibold text-fothang-gold-700">
                      {m.chineseTitle}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2">
                  {m.description}
                </p>

                {m.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <MapPin className="w-3 h-3 text-fothang-gold-600" />
                    <span>{m.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
