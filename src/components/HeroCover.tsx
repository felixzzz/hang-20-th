"use client";

import React from "react";
import Image from "next/image";
import { MailOpen, Calendar, MapPin, Sparkles } from "lucide-react";

interface HeroCoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function HeroCover({ guestName, isOpen, onOpen }: HeroCoverProps) {
  if (isOpen) return null;

  return (
    <aside
      aria-label="Sampul Undangan Digital"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#2a0e0e] via-[#450c0c] to-[#1c0808] text-white p-4 transition-all duration-1000 overflow-hidden"
    >
      {/* Background ambient pattern & glowing halos */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light">
        <Image
          src="/images/guang-hang-15.jpg"
          alt="Guang Hang Fo Thang"
          fill
          priority
          className="object-cover scale-110 filter blur-sm"
        />
      </div>

      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-fothang-gold-500/15 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-fothang-red-500/20 filter blur-3xl pointer-events-none" />

      {/* Traditional Frame Border */}
      <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#3d1212]/95 to-[#240b0b]/95 border border-fothang-gold-400/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60 text-center backdrop-blur-xl animate-fade-in">
        {/* Ornate Corner Accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-fothang-gold-400/70 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-fothang-gold-400/70 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-fothang-gold-400/70 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-fothang-gold-400/70 rounded-br-sm pointer-events-none" />

        {/* Sacred Header Motif */}
        <div className="inline-flex items-center justify-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-fothang-gold-500/10 border border-fothang-gold-400/30">
          <Sparkles className="w-3.5 h-3.5 text-fothang-gold-300" />
          <span className="text-xs uppercase tracking-widest text-fothang-gold-300 font-medium">
            Tian En Shi De • 天恩師德
          </span>
          <Sparkles className="w-3.5 h-3.5 text-fothang-gold-300" />
        </div>

        {/* Chinese Main Heading */}
        <h2 className="text-3xl sm:text-4xl font-chinese font-bold tracking-wider text-fothang-gold-300 mt-2 mb-1 drop-shadow">
          廣航佛堂
        </h2>
        <p className="text-sm font-chinese text-fothang-gold-200/80 tracking-widest mb-4">
          廿週年堂慶紀念 (2006 - 2026)
        </p>

        {/* Roman Title */}
        <div className="relative my-4">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-fothang-gold-400 to-transparent mb-3" />
          <h1 className="text-xl sm:text-2xl font-serif tracking-wide text-stone-100 font-semibold leading-relaxed">
            Peringatan 20 Tahun <br />
            <span className="text-fothang-gold-400 font-bold">Kuang Hang Fo Thang</span>
          </h1>
          <p className="text-xs text-stone-300 tracking-wider mt-1.5 font-light">
            Mengarungi Samudra Kebajikan Menabur Kasih Semesta
          </p>
        </div>

        {/* Recipient Card */}
        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-white/5 border border-fothang-gold-400/20 backdrop-blur-sm">
          <p className="text-xs font-light text-stone-300 uppercase tracking-widest mb-1.5">
            Kepada Yth. Bapak / Ibu / Saudara/i
          </p>
          <div className="text-lg sm:text-xl font-serif font-bold text-fothang-gold-200 drop-shadow">
            {guestName || "Keluarga Besar & Umat Terkasih"}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 italic">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir bersama merayakan momentum bersejarah ini.
          </p>
        </div>

        {/* Date & Location Snapshot */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-300 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>Sabtu, 14 November 2026</span>
          </div>
          <span className="hidden sm:inline text-fothang-gold-500">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-fothang-gold-400" />
            <span>Palmerah, Jakarta Barat</span>
          </div>
        </div>

        {/* Open Button */}
        <button
          onClick={onOpen}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-fothang-gold-600 via-fothang-gold-500 to-fothang-gold-600 text-fothang-red-950 font-semibold text-sm tracking-wide shadow-lg shadow-fothang-gold-500/30 hover:shadow-fothang-gold-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <MailOpen className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>Buka Undangan</span>
        </button>

        <p className="text-[10px] text-stone-400 mt-4 tracking-wider">
          Sentuh untuk membuka undangan & memutar alunan musik
        </p>
      </div>
    </aside>
  );
}
