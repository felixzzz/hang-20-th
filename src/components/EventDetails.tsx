"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Navigation, CalendarPlus, Check, Shirt } from "lucide-react";

export default function EventDetails() {
  const [copied, setCopied] = useState(false);

  const address =
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480";

  // Google Calendar URL generator
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "20 Tahun Anniversary Kuang Hang Fo Thang (廣航佛堂)"
  )}&dates=20261114T120000Z/20261114T150000Z&details=${encodeURIComponent(
    "Peringatan Peresmian Gedung 20 Tahun Kuang Hang Fo Thang (Sabtu, 14 November 2026). Mengarungi Samudra Kebajikan Menabur Kasih Semesta."
  )}&location=${encodeURIComponent(
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat"
  )}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="acara" className="py-16 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-gold-100 border border-fothang-gold-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <Calendar className="w-3.5 h-3.5 text-fothang-gold-700" />
            <span>Waktu & Lokasi Acara</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-2">
            Rangkaian Acara Peringatan
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Kehadiran Bapak/Ibu/Saudara/i merupakan berkah dan kehormatan yang tak terhingga bagi wadah keTuhanan Kuang Hang.
          </p>
        </div>

        {/* Main Event Card */}
        <div className="rounded-3xl bg-white border border-fothang-gold-200 shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-fothang-red-900 via-fothang-red-800 to-fothang-red-900 text-white p-6 sm:p-8 text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-fothang-gold-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Malam Puncak Peringatan</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-fothang-gold-200">
              Sabtu, 14 November 2026
            </h3>
            <p className="text-sm text-stone-200 mt-1 font-light">
              Pukul 19.00 WIB s/d Selesai
            </p>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Waktu & Jam */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-fothang-ivory/60 border border-fothang-gold-100">
              <div className="w-12 h-12 rounded-full bg-fothang-gold-500/10 text-fothang-gold-700 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
                Waktu Pelaksanaan
              </h4>
              <p className="text-sm font-semibold text-fothang-red-800">
                19.00 WIB
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Registrasi dibuka mulai pukul 18.30 WIB
              </p>
            </div>

            {/* Tempat */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-fothang-ivory/60 border border-fothang-gold-100">
              <div className="w-12 h-12 rounded-full bg-fothang-gold-500/10 text-fothang-gold-700 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
                Tempat Acara
              </h4>
              <p className="text-sm font-semibold text-fothang-red-800">
                Kuang Hang Fo Thang (廣航)
              </p>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat
              </p>
            </div>

            {/* Dress code */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-fothang-ivory/60 border border-fothang-gold-100">
              <div className="w-12 h-12 rounded-full bg-fothang-gold-500/10 text-fothang-gold-700 flex items-center justify-center mb-3">
                <Shirt className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
                Pakaian / Busana
              </h4>
              <p className="text-sm font-semibold text-fothang-red-800">
                Sopan & Rapi
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Kemeja / Batik / Pakaian bernuansa putih atau rapi
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-wrap items-center justify-center gap-3 border-t border-stone-100 pt-6">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fothang-gold-50 hover:bg-fothang-gold-100 text-fothang-gold-800 font-medium text-xs border border-fothang-gold-300 transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-fothang-gold-700" />
              <span>Simpan ke Google Calendar</span>
            </a>

            <button
              onClick={copyAddress}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium text-xs border border-stone-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Alamat Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-stone-600" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
