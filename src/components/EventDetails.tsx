"use client";

import React, { useState } from "react";
import { Clock, MapPin, Sparkles, CalendarPlus, Check, Shirt } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EventDetails() {
  const { showId, showZh } = useLanguage();
  const [copied, setCopied] = useState(false);

  const address =
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";

  // Google Calendar URL generator
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang (Sabtu, 14 November 2026). Mengarungi Samudra Kebajikan Menabur Kasih Semesta. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat"
  )}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="acara" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              {showId && "Waktu & Tempat Pelaksanaan"}
              {showId && showZh && " • "}
              {showZh && "慶典時間與會場導引"}
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            慶典日程 • 會場導引
          </h2>
          {showId && (
            <p className="text-sm font-serif text-stone-700 max-w-lg">
              Detail Pelaksanaan Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang
            </p>
          )}
          {showZh && (
            <p className="font-chinese text-xs text-stone-500 mt-0.5">
              廣航佛堂成立廿週年感恩大典會場導引
            </p>
          )}
        </div>

        {/* Main Event Details Plaque */}
        <div className="bg-gradient-to-b from-[#2d0e0e] via-[#200909] to-[#170505] text-stone-100 p-8 sm:p-12 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
          {/* Traditional Corner Ornaments */}
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />
          <div className="corner-ornament-bl" />
          <div className="corner-ornament-br" />
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-serif font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {showId && "Malam Puncak Peringatan"}
                {showId && showZh && " • "}
                {showZh && "堂慶感恩晚會"}
              </span>
            </div>

            <div className="text-xs font-serif text-amber-400 tracking-widest uppercase mb-1">
              {showId && "Hari & Tanggal"}
              {showId && showZh && " • "}
              {showZh && "慶典日期"}
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 mb-1">
              Sabtu, 14 November 2026
            </h3>
            {showZh && (
              <p className="font-chinese text-base text-amber-300">
                2026年11月14日（星期六）
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 mb-8">
            {/* Waktu */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-400 font-serif block mb-0.5">
                {showId && "Waktu Mulai"}
                {showId && showZh && " • "}
                {showZh && "時間"}
              </span>
              <strong className="text-sm text-stone-100 font-serif block">
                19.00 WIB s/d Selesai
              </strong>
              {showZh && <span className="font-chinese text-xs text-amber-300 mt-0.5">晚間七時正</span>}
              <p className="text-[11px] text-stone-400 mt-2 font-serif">
                Registrasi dibuka 18.30 WIB (18:30 入席)
              </p>
            </div>

            {/* Tempat */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-400 font-serif block mb-0.5">
                {showId && "Lokasi Ibadah"}
                {showId && showZh && " • "}
                {showZh && "地點"}
              </span>
              <strong className="text-sm text-stone-100 font-serif block">
                Kuang Hang Fo Thang
              </strong>
              <span className="font-chinese text-xs text-amber-300 mt-0.5">廣航佛堂</span>
              <p className="text-[11px] text-stone-400 mt-2 font-serif">
                Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat
              </p>
            </div>

            {/* Dress code */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-400 font-serif block mb-0.5">
                {showId && "Tata Busana"}
                {showId && showZh && " • "}
                {showZh && "服裝儀容"}
              </span>
              <strong className="text-sm text-stone-100 font-serif block">
                Busana Rapi & Sopan
              </strong>
              {showZh && <span className="font-chinese text-xs text-amber-300 mt-0.5">端莊得體</span>}
              <p className="text-[11px] text-stone-400 mt-2 font-serif">
                Batik / Kemeja Putih / Busana Wadah (白襯衫/蠟染)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-white/10">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-serif font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>
                {showId && "Simpan ke Google Calendar"}
                {showId && showZh && " • "}
                {showZh && "加入行事曆"}
              </span>
            </a>

            <button
              onClick={copyAddress}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-stone-100 text-xs font-serif transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">
                    {showId && "Alamat Lengkap Disalin!"}
                    {showId && showZh && " • "}
                    {showZh && "地址已複製"}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {showId && "Salin Alamat Lengkap"}
                    {showId && showZh && " • "}
                    {showZh && "複製會場地址"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 text-center text-[11px] text-stone-400 font-serif border-t border-white/10">
            * Mohon hadir tepat waktu demi kelancaran kekhidmatan upacara. • 為維護典禮莊嚴順暢，敬請準時入席。
          </div>

        </div>

      </div>
    </section>
  );
}
