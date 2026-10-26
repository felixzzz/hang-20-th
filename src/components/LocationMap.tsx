"use client";

import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink, Check, Car, Train, Building } from "lucide-react";

export default function LocationMap() {
  const [copied, setCopied] = useState(false);

  const fullAddress =
    "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480";
  const googleMapsUrl = "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA";
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(fullAddress)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lokasi" className="py-16 sm:py-24 px-4 sm:px-6 relative bg-fothang-cream/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-gold-100 border border-fothang-gold-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <MapPin className="w-3.5 h-3.5 text-fothang-gold-700" />
            <span>Petunjuk Lokasi & Arah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-2">
            Denah Menuju Kuang Hang
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Gedung Kuang Hang Fo Thang berlokasi strategis di Palmerah, mudah dijangkau dengan kendaraan pribadi maupun transportasi umum.
          </p>
        </div>

        {/* Map Card */}
        <div className="rounded-3xl bg-white border border-stone-200/80 shadow-xl overflow-hidden mb-8">
          {/* Map Preview / Embed */}
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
              className="w-full h-full filter saturate-[0.95]"
            />
          </div>

          {/* Address Details & Action Buttons */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-fothang-gold-700 tracking-wider mb-1">
                  <Building className="w-4 h-4 text-fothang-red-800" />
                  <span>Kuang Hang Fo Thang (廣航佛堂)</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Jl. Palmerah Utara III No. 186A
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md">
                  RT.002/RW.06, Palmerah, Kec. Palmerah, Kota Jakarta Barat, DKI Jakarta 11480
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fothang-red-800 hover:bg-fothang-red-900 text-fothang-gold-200 font-medium text-xs shadow-md transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-fothang-gold-300" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <span>Salin Alamat</span>
                  )}
                </button>
              </div>
            </div>

            {/* Transport Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-fothang-ivory/70 border border-fothang-gold-100">
                <Train className="w-5 h-5 text-fothang-red-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Kereta Commuter Line (KRL)
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Turun di <strong>Stasiun Palmerah</strong>, dilanjutkan ojek daring atau kendaraan roda empat sekitar 5-8 menit ke lokasi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-fothang-ivory/70 border border-fothang-gold-100">
                <Car className="w-5 h-5 text-fothang-red-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Kendaraan Pribadi
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Akses dapat melalui Jl. Palmerah Utara atau Jl. Kemanggisan Utama. Area parkir dibantu dan dikoordinasikan oleh panitia.
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
