"use client";

import React, { useState } from "react";
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

  return (
    <section id="galeri" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-gold-100 border border-fothang-gold-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-fothang-gold-700" />
            <span>Dokumentasi Kenangan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-2">
            Galeri 20 Tahun Kuang Hang
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Setiap bingkai foto menyimpan jejak dedikasi, senyuman umat, dan limpahan berkah Tian En Shi De yang tak lekang oleh waktu.
          </p>
        </div>

        {/* Filter Pills */}
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-fothang-red-800 text-fothang-gold-200 shadow-md scale-105"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-fothang-gold-300 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-fothang-gold-300 font-medium">
                  {item.category === "sejarah"
                    ? "Arsip Sejarah"
                    : item.category === "kegiatan"
                    ? "Kegiatan Dharma"
                    : "Keluarga Besar"}
                </span>
                <p className="text-sm font-serif font-semibold text-stone-100">
                  {item.title}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-fothang-gold-200">
                  <Maximize2 className="w-3 h-3" />
                  <span>Lihat Ukuran Penuh</span>
                </div>
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Tutup foto"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-black/60 hover:bg-black/80 transition-colors z-10 cursor-pointer"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-black/60 hover:bg-black/80 transition-colors z-10 cursor-pointer"
              aria-label="Foto selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center text-white">
              <h3 className="text-lg font-serif font-bold text-fothang-gold-300">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Koleksi Dokumentasi 20 Tahun Kuang Hang Fo Thang
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
