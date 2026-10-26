"use client";

import React, { useState } from "react";
import { Navigation, ExternalLink, Check, Car, Train, Building } from "lucide-react";

export default function LocationMap() {
  const [copied, setCopied] = useState(false);

  const fullAddress =
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480";
  const googleMapsUrl = "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lokasi" className="py-16 sm:py-24 px-4 sm:px-6 relative bg-[#f5efe4]/60">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header - Bilingual */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              Petunjuk Lokasi & Arah Menuju Gedung • 道場座標與交通指引
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            道場座標 • 交通導引
          </h2>
          <p className="text-sm font-serif text-stone-700 max-w-lg">
            Gedung Kuang Hang Fo Thang berlokasi strategis di Palmerah Utara, mudah dijangkau dari segala penjuru Jakarta.
          </p>
          <p className="text-xs font-chinese text-stone-500 max-w-lg mt-0.5">
            廣航佛堂位處雅加達西區巴美拉核心樞紐，交通四通八達，便捷通暢。
          </p>
        </div>

        {/* Map Framed Folio - Bilingual */}
        <div className="rounded-2xl bg-[#faf7f2] border border-amber-700/25 shadow-xl overflow-hidden mb-8">
          
          {/* Map Preview Embed */}
          <div className="relative w-full h-72 sm:h-96 bg-stone-100">
            <iframe
              src="https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Kuang Hang Fo Thang"
              className="w-full h-full filter saturate-[0.9]"
            />
          </div>

          {/* Address Information & Controls - Bilingual */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-900/15">
              <div>
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase text-amber-800 tracking-wider mb-1">
                  <Building className="w-4 h-4 text-red-800" />
                  <span>Kuang Hang Fo Thang (廣航佛堂)</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Jl. Palmerah Utara III No. 186A
                </h3>
                <p className="text-xs sm:text-sm font-serif text-stone-600 mt-1 max-w-md">
                  RT.002/RW.06, Palmerah, Kec. Palmerah, Kota Jakarta Barat, DKI Jakarta 11480
                </p>
                <p className="text-xs font-chinese text-stone-500 mt-0.5">
                  印度尼西亞 雅加達西區 巴美拉北三路186A號
                </p>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#831f1f] hover:bg-[#6e1818] text-amber-200 font-serif font-semibold text-xs shadow-md transition-all cursor-pointer border border-amber-400/30"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Petunjuk Arah (Google Maps) • 導航</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-serif text-xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Alamat Tersalin! • 已複製</span>
                    </>
                  ) : (
                    <span>Salin Alamat • 複製地址</span>
                  )}
                </button>
              </div>
            </div>

            {/* Transport Hints - Bilingual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/60 border border-amber-900/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-800">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-stone-900 mb-0.5">
                    Transportasi Kereta (KRL) • 火車捷運
                  </h4>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                    Turun di Stasiun Palmerah. Lokasi hanya berjarak sekitar 800 meter (±3 menit dengan ojek online).
                  </p>
                  <p className="text-[10px] font-chinese text-stone-500 mt-0.5">
                    搭乘電車至 Palmerah 站下車，距離佛堂約800米（步行或車行3分鐘即達）。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/60 border border-amber-900/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-800">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-stone-900 mb-0.5">
                    Kendaraan Pribadi & Parkir • 自駕與停車
                  </h4>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                    Petugas panitia dan keamanan setempat siap mengarahkan ke area parkir yang tertib dan nyaman.
                  </p>
                  <p className="text-[10px] font-chinese text-stone-500 mt-0.5">
                    現場備有專責人員與引導人員協助停車指引，安心便捷。
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
