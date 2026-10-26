"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryItems, GalleryItem } from "@/data/gallery";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PhotoGallery() {
  const { showId, showZh } = useLanguage();
  const [filter, setFilter] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  const handleNext = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedPhoto(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedPhoto(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, filteredItems]);

  return (
    <section id="galeri" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header - Bilingual */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              {showId && "Dokumentasi Foto Dua Dasawarsa"}
              {showId && showZh && " • "}
              {showZh && "廿載影像珍藏"}
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            歲月長廊 • 影像典藏
          </h2>
          {showId && (
            <p className="text-sm font-serif text-stone-700 max-w-lg">
              Setiap bingkai foto menyimpan jejak dedikasi, senyuman umat, dan limpahan berkah Tian En Shi De yang abadi.
            </p>
          )}
          {showZh && (
            <p className="text-xs font-chinese text-stone-500 max-w-lg mt-0.5">
              每一張泛黃相片，皆銘刻著道親之赤誠奉獻與天恩師德之浩瀚加被。
            </p>
          )}
        </div>

        {/* Exhibition Room Filter Tabs - Bilingual */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { key: "all", labelId: "Semua Foto", labelZh: "全部相片", count: 15 },
            { key: "sejarah", labelId: "Sejarah", labelZh: "開荒建堂", count: null },
            { key: "kegiatan", labelId: "Pembinaan", labelZh: "道務班程", count: null },
            { key: "kebersamaan", labelId: "Kebersamaan", labelZh: "同修法喜", count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === tab.key
                  ? "bg-[#831f1f] text-amber-200 shadow-sm border border-amber-400/40"
                  : "bg-white text-stone-700 hover:text-red-900 border border-stone-200"
              }`}
            >
              {showId && <span>{tab.labelId}</span>}
              {showId && showZh && <span>•</span>}
              {showZh && <span className="font-chinese text-[11px] opacity-90">{tab.labelZh}</span>}
              {tab.count !== null && (
                <span className="text-[10px] opacity-75">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Editorial Retrospective Framing with Bilingual Captions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-xl overflow-hidden bg-stone-900 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-[#faf7f2] ring-1 ring-amber-600/20"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-serif">
                    {item.category === "sejarah"
                      ? "Arsip Sejarah • 歷史建堂"
                      : item.category === "kegiatan"
                      ? "Kegiatan Dharma • 道務修持"
                      : "Keluarga Besar • 同修一家"}
                  </span>
                  {showZh && (
                    <div className="text-sm font-chinese font-bold text-amber-200 mt-0.5">
                      {item.chineseTitle}
                    </div>
                  )}
                  {showId && (
                    <p className="text-xs font-serif text-stone-200 leading-snug">
                      {item.title}
                    </p>
                  )}
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-300 font-serif">
                    <Maximize2 className="w-3 h-3" />
                    <span>
                      {showId && "Perbesar Foto"}
                      {showId && showZh && " • "}
                      {showZh && "檢視全圖"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimalist Sub-Caption bar - Bilingual */}
              <div className="p-3 bg-[#faf7f2] border-t border-amber-900/10">
                {showZh && (
                  <div className="text-xs font-chinese font-bold text-stone-900 truncate">
                    {item.chineseTitle}
                  </div>
                )}
                {showId && (
                  <div className="text-[11px] font-serif text-stone-600 truncate mt-0.5">
                    {item.title}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal - Bilingual */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1c1815] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup • 關閉"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Picture */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-950">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Lightbox Footer & Nav - Bilingual */}
            <div className="p-4 sm:p-6 bg-[#181412] text-stone-200 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-serif font-semibold">
                  Foto Dokumentasi 20 Tahun Kuang Hang • 廣航廿載攝影典藏
                </span>
                {showZh && (
                  <div className="text-base sm:text-lg font-chinese font-bold text-amber-200 mt-0.5">
                    {selectedPhoto.chineseTitle}
                  </div>
                )}
                {showId && (
                  <h4 className="text-xs sm:text-sm font-serif text-stone-300">
                    {selectedPhoto.title}
                  </h4>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-serif transition-colors cursor-pointer"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>
                    {showId && "Sebelumnya"}
                    {showId && showZh && " • "}
                    {showZh && "上一張"}
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-serif transition-colors cursor-pointer"
                  aria-label="Foto Selanjutnya"
                >
                  <span>
                    {showId && "Selanjutnya"}
                    {showId && showZh && " • "}
                    {showZh && "下一張"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
