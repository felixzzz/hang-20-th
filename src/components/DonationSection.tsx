"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Heart, Sparkles, CreditCard, QrCode } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function DonationSection() {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();
  const [copied, setCopied] = useState(false);

  const donation = cms.donation;

  const handleCopy = () => {
    if (!donation.isReady || !donation.accountNumber) return;
    navigator.clipboard.writeText(donation.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="tali-kasih" className="py-16 sm:py-24 px-4 sm:px-6 relative bg-[#f5efe6]/40">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-serif tracking-[0.25em] text-[#9e7631] uppercase mb-1 font-semibold">
            {donation.headingId || "Tali Kasih & Dana Kebajikan"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-[#7c1818] mb-2">
            {donation.headingZh || "隨喜功德 • 廣種福田"}
          </h2>
          <div className="text-sm font-serif text-stone-600 max-w-lg mx-auto">
            {showId && (
              <p>{donation.descriptionId}</p>
            )}
            {showZh && (
              <p className="font-chinese text-xs sm:text-sm text-stone-500 mt-1">
                {donation.descriptionZh}
              </p>
            )}
          </div>
        </div>

        {/* Ceremonial Plate */}
        <div className="max-w-lg mx-auto rounded-2xl bg-white border border-[#dfba6d]/35 shadow-sm p-6 sm:p-8 relative">
          
          {/* Top Plate Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-6">
            <div className="flex items-center gap-2 text-stone-700 text-xs font-serif tracking-wider uppercase font-semibold">
              <CreditCard className="w-4 h-4 text-[#9e7631]" />
              <span>{donation.bankName}</span>
            </div>
            <span className="chinese-seal-filled text-[11px] px-2 py-0.5">
              隨喜功德
            </span>
          </div>

          {donation.isReady ? (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 font-serif">
                {showId && "Nomor Rekening Resmi Panitia"}
                {showId && showZh && " • "}
                {showZh && <span className="font-chinese">官方功德帳號</span>}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#7c1818] tracking-wider">
                {donation.accountNumber}
              </div>
              <div className="text-xs text-stone-600 font-serif">
                Atas Nama (戶名): <strong className="text-stone-900 font-medium">{donation.accountHolder}</strong>
              </div>

              {donation.notes && (
                <p className="text-[11px] text-stone-500 font-serif italic">
                  {donation.notes}
                </p>
              )}

              {/* QRIS Display (if uploaded) */}
              {donation.qrisImage && (
                <div className="pt-2 flex flex-col items-center">
                  <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 p-2 shadow-inner">
                    <Image
                      src={donation.qrisImage}
                      alt="QRIS Donasi Kuang Hang"
                      fill
                      className="object-contain p-2"
                      unoptimized={donation.qrisImage.startsWith("http")}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-serif mt-1 flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    <span>Scan QRIS untuk transfer mudah</span>
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs shadow-xs transition-all cursor-pointer border border-[#dfba6d]/40"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#dfba6d]" />
                      <span>
                        {showId && "Nomor Rekening Berhasil Disalin!"}
                        {showId && showZh && " • "}
                        {showZh && <span className="font-chinese font-normal">帳號已複製</span>}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#dfba6d]" />
                      <span>
                        {showId && "Salin Nomor Rekening"}
                        {showId && showZh && " • "}
                        {showZh && <span className="font-chinese font-normal">複製帳號</span>}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#fbf5e8] border border-[#dfba6d]/50 flex items-center justify-center mx-auto mb-3 text-[#9e7631]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#7c1818] mb-0.5">
                Nomor Rekening Resmi
              </h3>
              <p className="text-xs font-chinese text-stone-500 mb-2">
                官方帳號資訊即將公佈
              </p>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto leading-relaxed font-serif">
                {donation.notes || "Informasi rekening panitia akan segera diperbarui sebelum hari pelaksanaan acara."}
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-serif flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#7c1818] fill-[#7c1818]" />
            <span>
              {showId && "Terima kasih atas ketulusan hati dan kebajikan Anda"}
              {showId && showZh && " • "}
              {showZh && <span className="font-chinese">感恩慈悲發心</span>}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
