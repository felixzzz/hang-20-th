"use client";

import React, { useState } from "react";
import { Navigation, ExternalLink, Check, Building, Train, Car } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function LocationMap() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const [copied, setCopied] = useState(false);

  const loc = cms.location;
  const fullAddress = loc.fullAddress || "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480";
  const googleMapsUrl = loc.googleMapsUrl || "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA";
  const embedMapUrl = loc.embedMapUrl || "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lokasi" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            {loc.headingId || "Petunjuk Lokasi & Arah Menuju Gedung"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            {loc.headingZh || "道場座標 • 交通導引"}
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-lg">
            {showId && (
              <p>{loc.descriptionId}</p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 mt-1">
                {loc.descriptionZh}
              </p>
            )}
          </div>
        </div>

        {/* Map Framed Card */}
        <div className="rounded-2xl bg-white border border-[#dfba6d]/30 shadow-sm overflow-hidden mb-8">
          
          {/* Map Preview Embed */}
          <div className="relative w-full h-72 sm:h-96 bg-stone-100">
            <iframe
              src={embedMapUrl}
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

          {/* Address Information & Controls */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase text-[#9e7631] tracking-wider mb-1">
                  <Building className="w-4 h-4 text-[#7c1818]" />
                  <span>{cms.event.venueNameId} {showZh && `(${cms.event.venueNameZh})`}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {cms.event.address}
                </h3>
                {showId && (
                  <p className="text-xs sm:text-sm font-serif text-stone-600 mt-1 max-w-md">
                    {fullAddress}
                  </p>
                )}
                {showZh && (
                  <p className="text-xs font-chinese text-stone-500 mt-0.5">
                    印度尼西亞 雅加達西區 巴美拉北三路186A號
                  </p>
                )}
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer border border-[#dfba6d]/40"
                >
                  <Navigation className="w-4 h-4 text-[#dfba6d]" />
                  <span>
                    {showId && "Petunjuk Arah (Google Maps)"}
                    {showId && showZh && " • "}
                    {showZh && <span className="font-chinese font-normal">導航</span>}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-serif text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">
                        {showId && "Alamat Tersalin!"}
                        {showId && showZh && " • "}
                        {showZh && <span className="font-chinese">已複製</span>}
                      </span>
                    </>
                  ) : (
                    <span>
                      {showId && "Salin Alamat"}
                      {showId && showZh && " • "}
                      {showZh && <span className="font-chinese font-normal">複製地址</span>}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Transit tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs font-serif text-stone-600">
              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-[#9e7631] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-800 block mb-0.5">Kereta Commuter Line (KRL)</strong>
                  <span>Turun di Stasiun Palmerah (~5 menit perjalanan dengan ojek/kendaraan daring).</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-[#9e7631] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-800 block mb-0.5">Kendaraan Pribadi</strong>
                  <span>Dapat diakses melalui Jalan Palmerah Barat atau Jalan Gelora Senayan. Tersedia area parkir.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
