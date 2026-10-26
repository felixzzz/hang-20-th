"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { GalleryPhotoItem } from "@/types/cms";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function PhotoGallery() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const allGalleryItems: GalleryPhotoItem[] =
    cms.gallery && cms.gallery.length > 0 ? cms.gallery : (galleryItems as GalleryPhotoItem[]);

  const [filter, setFilter] = useState<"all" | "sejarah" | "kegiatan" | "kebersamaan">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredItems =
    filter === "all"
      ? allGalleryItems
      : allGalleryItems.filter((item) => item.category === filter);

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
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            Dokumentasi Foto Dua Dasawarsa
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            歲月長廊 • 影像典藏
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-lg">
            {showId && (
              <p>
                Setiap bingkai foto menyimpan jejak dedikasi, senyuman umat, dan limpahan berkah Tian En Shi De yang abadi.
              </p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 mt-1">
                每一張泛黃相片，皆銘刻著道親之赤誠奉獻與天恩師德之浩瀚加被。
              </p>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", labelId: "Semua", labelZh: "全部" },
            { id: "sejarah", labelId: "Sejarah & Pembangunan", labelZh: "創堂歷史" },
            { id: "kegiatan", labelId: "Kegiatan Pembinaan", labelZh: "道育共修" },
            { id: "kebersamaan", labelId: "Kebersamaan Umat", labelZh: "道親情誼" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-[#7c1818] text-[#fbf5e8] shadow-xs border border-[#dfba6d]/40"
                  : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <span>{showId ? tab.labelId : tab.labelZh}</span>
              {showId && showZh && <span className="opacity-80 font-chinese ml-1.5">{tab.labelZh}</span>}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={item.src.startsWith("http")}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-[#fbf5e8]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-serif text-[#dfba6d]">
                    {item.category}
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 text-[#dfba6d]" />
                </div>
                <h4 className="text-xs font-serif font-medium leading-snug line-clamp-1">
                  {showId && item.title}
                  {showZh && <span className="block font-chinese text-[11px] font-normal">{item.chineseTitle}</span>}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#1c1815] rounded-2xl overflow-hidden border border-[#dfba6d]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 text-[#fbf5e8]">
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base">
                    {showId && selectedPhoto.title}
                    {showId && showZh && selectedPhoto.chineseTitle && " • "}
                    {showZh && <span className="font-chinese text-amber-300">{selectedPhoto.chineseTitle}</span>}
                  </h3>
                  <span className="text-[11px] font-serif text-[#dfba6d] uppercase tracking-widest">
                    廣航佛堂典藏紀錄 • {selectedPhoto.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Tutup Tampilan Foto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Display */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  unoptimized={selectedPhoto.src.startsWith("http")}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between p-3 bg-[#161311] border-t border-white/10 text-stone-300">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-serif transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Foto Sebelumnya</span>
                </button>

                <span className="text-xs font-serif text-stone-400">
                  {filteredItems.findIndex((p) => p.id === selectedPhoto.id) + 1} / {filteredItems.length}
                </span>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-serif transition-colors cursor-pointer"
                >
                  <span>Foto Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
