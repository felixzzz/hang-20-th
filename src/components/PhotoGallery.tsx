"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryItems, GalleryItem } from "@/data/gallery";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function PhotoGallery() {
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
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Dokumentasi Foto Dua Dasawarsa
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            歲月長廊 • 影像典藏
          </h2>
          <p className="text-sm font-serif text-stone-600 max-w-lg">
            Setiap bingkai foto menyimpan jejak dedikasi, senyuman umat, dan limpahan berkah Tian En Shi De yang abadi.
          </p>
        </div>

        {/* Exhibition Room Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { key: "all", label: "Semua Foto (15)" },
            { key: "sejarah", label: "Sejarah & Pembangunan" },
            { key: "kegiatan", label: "Kegiatan Pembinaan" },
            { key: "kebersamaan", label: "Kebersamaan Umat" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-[#831f1f] text-amber-200 shadow-sm border border-amber-400/40"
                  : "bg-white text-stone-700 hover:text-red-900 border border-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Editorial Retrospective Framing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item, idx) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-serif">
                    {item.category === "sejarah"
                      ? "Arsip Sejarah"
                      : item.category === "kegiatan"
                      ? "Kegiatan Dharma"
                      : "Keluarga Besar"}
                  </span>
                  <p className="text-sm font-serif font-semibold text-stone-100 leading-snug">
                    {item.title}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-200 font-serif">
                    <Maximize2 className="w-3 h-3" />
                    <span>Perbesar Foto</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Sub-Caption bar */}
              <div className="p-3 bg-[#faf7f2] border-t border-amber-900/10 flex items-center justify-between">
                <p className="text-xs font-serif text-stone-800 font-medium truncate">
                  {item.title}
                </p>
                <span className="text-[10px] text-amber-800 font-chinese ml-2 shrink-0">
                  廣航
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
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
              aria-label="Tutup"
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

            {/* Lightbox Footer & Nav */}
            <div className="p-4 sm:p-6 bg-[#181412] text-stone-200 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-serif font-semibold">
                  Foto Dokumentasi 20 Tahun Kuang Hang
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-stone-100">
                  {selectedPhoto.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors cursor-pointer"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors cursor-pointer"
                  aria-label="Foto Selanjutnya"
                >
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
