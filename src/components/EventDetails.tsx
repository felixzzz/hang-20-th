"use client";

import React, { useState } from "react";
import { Clock, MapPin, CalendarPlus, Check, Shirt } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function EventDetails() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const [copied, setCopied] = useState(false);

  const address = cms.event.address || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";

  // Google Calendar URL generator
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂廿週年堂慶)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang (Sabtu, 14 November 2026). Mengarungi Samudra Kebajikan Menabur Kasih Semesta. 廣航佛堂落成廿週年堂慶大典。"
  )}&location=${encodeURIComponent(address)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="acara" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            {cms.event.headingId || "Waktu & Tempat Pelaksanaan"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            {cms.event.headingZh || "慶典日程 • 會場導引"}
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-lg">
            {showId && (cms.event.subheadingId || "Detail Pelaksanaan Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang")}
            {showId && showZh && " • "}
            {showZh && <span className="font-chinese">{cms.event.subheadingZh || "廣航佛堂成立廿週年感恩大典會場導引"}</span>}
          </div>
        </div>

        {/* Main Event Details Card */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#dfba6d]/40 shadow-sm p-6 sm:p-10 relative">
          
          {/* Top Date Header Banner */}
          <div className="text-center pb-6 border-b border-stone-100">
            <span className="text-[11px] font-serif text-[#9e7631] tracking-widest uppercase font-semibold block mb-1">
              {showId && "Hari & Tanggal Pelaksanaan"}
              {showId && showZh && " • "}
              {showZh && <span className="font-chinese font-normal">慶典日期</span>}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#7c1818]">
              {cms.event.dateTextId}
            </h3>
            {showZh && (
              <p className="font-chinese text-sm text-stone-600 mt-0.5">
                {cms.event.dateTextZh}
              </p>
            )}
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            
            {/* Waktu */}
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-11 h-11 rounded-full bg-[#fbf5e8] border border-[#dfba6d]/60 flex items-center justify-center text-[#7c1818] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-serif block mb-0.5">
                {showId && "Waktu Mulai"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese">時間</span>}
              </span>
              <strong className="text-base text-[#211c19] font-serif block">
                {cms.event.timeTextId}
              </strong>
              {showZh && <span className="font-chinese text-xs text-stone-500 mt-0.5">{cms.event.timeTextZh}</span>}
              <p className="text-xs text-stone-500 mt-2 font-serif">
                {cms.event.timeNotesId}
              </p>
            </div>

            {/* Tempat */}
            <div className="flex flex-col items-center text-center p-3 md:border-x md:border-stone-100">
              <div className="w-11 h-11 rounded-full bg-[#fbf5e8] border border-[#dfba6d]/60 flex items-center justify-center text-[#7c1818] mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-serif block mb-0.5">
                {showId && "Lokasi Gedung"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese">地點</span>}
              </span>
              <strong className="text-base text-[#211c19] font-serif block">
                {cms.event.venueNameId}
              </strong>
              {showZh && <span className="font-chinese text-xs text-stone-500 mt-0.5">{cms.event.venueNameZh}</span>}
              <p className="text-xs text-stone-500 mt-2 font-serif">
                {address}
              </p>
            </div>

            {/* Dress code */}
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-11 h-11 rounded-full bg-[#fbf5e8] border border-[#dfba6d]/60 flex items-center justify-center text-[#7c1818] mb-3">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-serif block mb-0.5">
                {showId && "Tata Busana"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese">服裝儀容</span>}
              </span>
              <strong className="text-base text-[#211c19] font-serif block">
                {cms.event.dresscodeId}
              </strong>
              {showZh && <span className="font-chinese text-xs text-stone-500 mt-0.5">{cms.event.dresscodeZh}</span>}
              <p className="text-xs text-stone-500 mt-2 font-serif">
                {cms.event.dresscodeNotesId}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-stone-100">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer border border-[#dfba6d]/40"
            >
              <CalendarPlus className="w-4 h-4 text-[#dfba6d]" />
              <span>
                {showId && "Simpan ke Google Calendar"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese font-normal">加入行事曆</span>}
              </span>
            </a>

            <button
              onClick={copyAddress}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs sm:text-sm font-serif transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    {showId && "Alamat Berhasil Disalin!"}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese">地址已複製</span>}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-stone-500" />
                  <span>
                    {showId && "Salin Alamat Lengkap"}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese font-normal">複製地址</span>}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 text-center text-xs text-stone-500 font-serif border-t border-stone-100">
            * Mohon hadir tepat waktu demi kelancaran kekhidmatan upacara. • 為維護典禮莊嚴順暢，敬請準時入席。
          </div>

        </div>

      </div>
    </section>
  );
}
