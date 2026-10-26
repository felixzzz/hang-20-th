"use client";

import React, { useState } from "react";
import Image from "next/image";
import { historyMilestones, Milestone } from "@/data/history";
import { History, Sparkles, MapPin, Building, Award } from "lucide-react";

export default function HistoryTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(historyMilestones[0]);

  return (
    <section id="sejarah" className="py-20 sm:py-28 px-4 sm:px-6 relative bg-gradient-to-b from-transparent via-[#f3eae0]/50 to-transparent">
      {/* Decorative background Chinese characters */}
      <div className="absolute right-4 top-20 text-[10rem] font-chinese text-fothang-red-950/[0.03] select-none pointer-events-none">
        同舟
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fothang-red-100/80 border border-fothang-red-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <History className="w-3.5 h-3.5 text-fothang-red-700" />
            <span>Napak Tilas Perjalanan (1997 – 2026)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-fothang-red-950 mb-3">
            20 Tahun Menabur Cinta Kasih
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Menelusuri kembali setiap tetes keringat, doa tulus, dan pengorbanan para perintis awal yang memungkinkan pelita Kuang Hang bersinar terang hari ini.
          </p>
        </div>

        {/* Horizontal Year Strip Nav */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {historyMilestones.map((m, idx) => (
            <button
              key={m.year + idx}
              onClick={() => setSelectedMilestone(m)}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs transition-all duration-300 cursor-pointer ${
                selectedMilestone.title === m.title
                  ? "bg-fothang-red-900 text-fothang-gold-200 border-fothang-gold-400 shadow-lg scale-105"
                  : "bg-white/90 text-stone-700 border-stone-200 hover:border-fothang-gold-300 hover:bg-stone-50"
              }`}
            >
              <span className="font-serif font-bold text-sm">{m.year}</span>
              <span className="text-[11px] font-medium opacity-90 truncate max-w-[130px]">{m.title}</span>
            </button>
          ))}
        </div>

        {/* Featured Milestone Card - Museum Style */}
        <div className="rounded-3xl bg-white border-2 border-fothang-gold-300/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 mb-14">
          {/* Historical Photograph with frame */}
          <div className="relative md:col-span-6 h-72 md:h-auto min-h-[300px] bg-stone-950 overflow-hidden">
            <Image
              src={selectedMilestone.image || "/images/guang-hang-15.jpg"}
              alt={selectedMilestone.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />

            {/* Vintage archival stamp */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-fothang-red-900/90 text-fothang-gold-300 font-serif font-bold text-xs backdrop-blur-md shadow-md border border-fothang-gold-400/30">
                Tahun {selectedMilestone.year}
              </span>
            </div>

            {selectedMilestone.chineseTitle && (
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-2xl font-chinese font-bold drop-shadow-md text-fothang-gold-300">
                  {selectedMilestone.chineseTitle}
                </span>
              </div>
            )}
          </div>

          {/* Story & Context */}
          <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-fothang-gold-700 font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dokumentasi Sejarah Wadah</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-fothang-red-950 mb-2">
                {selectedMilestone.title}
              </h3>

              {selectedMilestone.location && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-fothang-gold-600 shrink-0" />
                  <span>{selectedMilestone.location}</span>
                </div>
              )}

              <p className="text-stone-700 text-sm leading-relaxed mb-6">
                {selectedMilestone.description}
              </p>

              {selectedMilestone.highlight && (
                <div className="p-4 rounded-2xl bg-fothang-gold-50/80 border-l-4 border-fothang-gold-500 text-xs sm:text-sm text-fothang-gold-950 italic">
                  &ldquo;{selectedMilestone.highlight}&rdquo;
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-serif">Arsip Kuang Hang Fo Thang</span>
              <span className="font-chinese text-fothang-red-800 font-bold text-sm">天恩師德</span>
            </div>
          </div>
        </div>

        {/* Chronological Step List */}
        <div className="relative border-l-2 border-fothang-gold-400 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
          {historyMilestones.map((m, i) => (
            <div key={i} className="relative group">
              {/* Dot icon with gold ring */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-fothang-red-800 ring-4 ring-fothang-gold-300/40 group-hover:scale-125 transition-transform" />

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 hover:border-fothang-gold-300 shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-0.5 rounded-full bg-fothang-red-100 text-fothang-red-900 font-serif font-bold text-xs">
                      {m.year}
                    </span>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                      {m.title}
                    </h4>
                  </div>
                  {m.chineseTitle && (
                    <span className="font-chinese text-xs sm:text-sm font-bold text-fothang-gold-700">
                      {m.chineseTitle}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                  {m.description}
                </p>

                {m.location && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
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
