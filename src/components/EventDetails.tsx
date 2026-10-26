"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Navigation, CalendarPlus, Check, Shirt, CheckCircle2 } from "lucide-react";

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
    <section id="acara" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Waktu & Tempat Pelaksanaan
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            慶典日程 • 會場導引
          </h2>
          <p className="text-sm font-serif text-stone-600 max-w-lg">
            Rangkaian Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang
          </p>
        </div>

        {/* Ceremonial Agenda Folio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          
          {/* Main Time & Date Plaque (Left 5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#2d0e0e] via-[#200909] to-[#170505] text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-serif font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Malam Puncak Peringatan</span>
              </div>

              <div className="text-xs font-serif text-amber-400 tracking-widest uppercase mb-1">
                Hari & Tanggal
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-4">
                Sabtu, 14 November 2026
              </h3>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-serif block">Waktu Mulai</span>
                    <strong className="text-sm text-stone-100 font-serif">19.00 WIB s/d Selesai</strong>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">Registrasi dibuka pukul 18.30 WIB</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-serif block">Lokasi Ibadah</span>
                    <strong className="text-sm text-stone-100 font-serif">Kuang Hang Fo Thang (廣航)</strong>
                    <p className="text-[11px] text-stone-400 mt-0.5">Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-serif block">Tata Busana (Dress Code)</span>
                    <strong className="text-sm text-stone-100 font-serif">Busana Rapi & Sopan</strong>
                    <p className="text-[11px] text-stone-400 mt-0.5">Batik / Kemeja Putih / Busana Putih Abu wadah</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-serif font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Simpan ke Google Calendar</span>
              </a>

              <button
                onClick={copyAddress}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-serif transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Alamat Lengkap Disalin!</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Salin Alamat Lengkap</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Protocol Flow & Ceremonial Program (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-[#faf7f2] p-8 sm:p-10 rounded-2xl border border-amber-700/20 shadow-xl flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/15">
                <div>
                  <h4 className="text-xl font-serif font-bold text-red-950">
                    Susunan Acara Peringatan
                  </h4>
                  <p className="text-xs text-stone-500 font-serif">
                    Malam Penuh Rasa Syukur & Kebersamaan Umat
                  </p>
                </div>
                <span className="chinese-seal-red text-xs px-2 py-0.5">
                  典禮日程
                </span>
              </div>

              {/* Editorial Timeline Items */}
              <div className="space-y-6">
                {[
                  {
                    time: "18.30 WIB",
                    title: "Registrasi & Penyambutan Tamu",
                    chinese: "迎賓入席",
                    desc: "Penyambutan saudara se-dharma, penyerahan suvenir kenangan 20 tahun, dan ramah tamah hangat.",
                  },
                  {
                    time: "19.00 WIB",
                    title: "Pembukaan & Doa Syukur Bersama",
                    chinese: "祈福大典",
                    desc: "Pelaksanaan upacara kebaktian syukur Tian En Shi De dan permohonan berkah keselamatan bagi seluruh umat semesta.",
                  },
                  {
                    time: "19.45 WIB",
                    title: "Napak Tilas 20 Tahun & Ungkapan Syukur",
                    chinese: "歷史回顧",
                    desc: "Pemutaran kilas balik sejarah perintisan gedung Kuang Hang sejak 1997 serta sepatah kata dari para pembina.",
                  },
                  {
                    time: "20.30 WIB",
                    title: "Ramah Tamah & Jamuan Kasih Se-Dharma",
                    chinese: "素齋聯誼",
                    desc: "Santap malam bersama penuh sukacita dan persaudaraan keluarga besar Kuang Hang Fo Thang.",
                  },
                ].map((item, idx) => (
                  <div key={item.time} className="flex items-start gap-4 group">
                    <div className="w-20 shrink-0 font-serif font-bold text-xs text-amber-800 pt-0.5">
                      {item.time}
                    </div>
                    <div className="w-px h-14 bg-amber-600/30 shrink-0 relative">
                      <div className="w-2 h-2 rounded-full bg-red-900 -ml-[3.5px] mt-1 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-serif font-bold text-stone-900 text-sm">
                          {item.title}
                        </h5>
                        <span className="text-[11px] font-chinese text-amber-700">
                          {item.chinese}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed mt-0.5 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note at bottom */}
            <div className="mt-8 pt-4 border-t border-amber-900/10 flex items-center justify-between text-[11px] text-stone-500 font-serif">
              <span>* Mohon hadir tepat waktu demi kelancaran kekhidmatan upacara.</span>
              <span className="text-amber-800 font-chinese">廣航佛堂 籌委會 敬啟</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
