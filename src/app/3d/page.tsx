"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Building3DScene from "@/components/Building3DScene";
import { ArrowLeft, Calendar, MapPin, HeartHandshake, Sparkles, Navigation, X } from "lucide-react";
import RsvpSection from "@/components/RsvpSection";

function Building3DPageContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "";
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#140606] text-white">
      {/* 3D Scene Canvas */}
      <div className="absolute inset-0">
        <Building3DScene />
      </div>

      {/* Top Header Bar */}
      <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <Link
          href={`/${rawTo ? `?to=${encodeURIComponent(rawTo)}` : ""}`}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-fothang-gold-400/40 text-xs font-medium text-stone-200 transition shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-fothang-gold-400" />
          <span>Kembali ke Halaman Undangan</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowRsvpModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fothang-red-800 to-fothang-red-700 text-fothang-gold-200 font-semibold text-xs shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-fothang-gold-300" />
            <span>RSVP Sekarang</span>
          </button>
        </div>
      </header>

      {/* Bottom Floating Info Pill */}
      <aside aria-label="Informasi Singkat Acara" className="absolute bottom-16 sm:bottom-6 left-4 sm:left-8 z-20 pointer-events-none hidden md:block">
        <div className="max-w-md p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-fothang-gold-400/30 text-white pointer-events-auto shadow-2xl">
          <div className="flex items-center gap-2 text-fothang-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20 Tahun Kuang Hang Fo Thang</span>
          </div>
          <h2 className="text-base font-serif font-bold text-stone-100">
            Gedung Kuang Hang Palmerah
          </h2>
          <p className="text-xs text-stone-300 mt-1 mb-3">
            Diresmikan 12 November 2006 di atas tanah 538 m² melalui keteguhan ikrar para pendahulu dan umat.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-fothang-gold-200/90 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-fothang-gold-400" />
              <span>14 Nov 2026 • 19.00 WIB</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-fothang-gold-400" />
              <span>Palmerah Utara III No. 186A</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RSVP Modal Popup */}
      {showRsvpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowRsvpModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-fothang-ivory text-fothang-dark rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-fothang-gold-400 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              aria-label="Tutup modal RSVP"
            >
              <X className="w-5 h-5" />
            </button>
            <RsvpSection initialGuestName={guestName} />
          </div>
        </div>
      )}
    </main>
  );
}

export default function Building3DPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-[#140606] text-white flex items-center justify-center font-serif">Memuat Eksplorasi 3D...</div>}>
      <Building3DPageContent />
    </Suspense>
  );
}
