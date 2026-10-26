"use client";

import React, { useState } from "react";
import { Copy, Check, Heart, Sparkles, CreditCard } from "lucide-react";
import { donationConfig } from "@/data/donation";
import { useLanguage } from "@/context/LanguageContext";

export default function DonationSection() {
  const { showId, showZh } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!donationConfig.isReady) return;
    navigator.clipboard.writeText(donationConfig.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="tali-kasih" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Section Header - Bilingual */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-amber-600/60" />
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-serif">
              {showId && "Tali Kasih & Dana Kebajikan"}
              {showId && showZh && " • "}
              {showZh && "隨喜功德 · 廣種福田"}
            </span>
            <span className="w-8 h-px bg-amber-600/60" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-chinese font-bold text-red-950 mb-2">
            隨喜功德 • 廣種福田
          </h2>
          {showId && (
            <p className="text-sm font-serif text-stone-700 max-w-lg mx-auto">
              Doa restu serta kehadiran Bapak/Ibu/Saudara/i adalah karunia terindah bagi kami. Bagi yang hendak menyalurkan tali kasih sukarela demi kelancaran kegiatan wadah keTuhanan Kuang Hang:
            </p>
          )}
          {showZh && (
            <p className="text-xs font-chinese text-stone-500 max-w-lg mx-auto mt-0.5 leading-relaxed">
              十方大德之道情法喜與蒞臨祈福，乃廣航最大恩典。若欲隨喜發心護持廣航道務聖業者，可隨喜行功：
            </p>
          )}
        </div>

        {/* Ceremonial Engraved Plaque - Bilingual */}
        <div className="max-w-lg mx-auto rounded-2xl bg-gradient-to-b from-[#2a0e0e] via-[#1f0909] to-[#140505] text-stone-100 p-7 sm:p-9 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          {/* Traditional Corner Ornaments */}
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />
          <div className="corner-ornament-bl" />
          <div className="corner-ornament-br" />
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl pointer-events-none" />

          {/* Top Plate Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-serif tracking-wider uppercase font-semibold">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{donationConfig.bankName}</span>
            </div>
            <span className="chinese-seal-red text-xs px-2 py-0.5">
              隨喜功德
            </span>
          </div>

          {donationConfig.isReady ? (
            <div className="space-y-4">
              <div className="text-xs text-stone-400 font-serif">
                {showId && "Nomor Rekening Resmi Panitia"}
                {showId && showZh && " • "}
                {showZh && "官方功德帳號"}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-200 tracking-wider">
                {donationConfig.accountNumber}
              </div>
              <div className="text-xs text-stone-300 font-serif">
                Atas Nama (戶名): <strong className="text-white font-medium">{donationConfig.accountHolder}</strong>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-serif font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950" />
                      <span>
                        {showId && "Nomor Rekening Berhasil Disalin!"}
                        {showId && showZh && " • "}
                        {showZh && "帳號已複製"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {showId && "Salin Nomor Rekening"}
                        {showId && showZh && " • "}
                        {showZh && "複製帳號"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 text-amber-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-serif font-bold text-amber-100 mb-0.5">
                Nomor Rekening Resmi (Menyusul)
              </h3>
              <p className="text-xs font-chinese text-amber-300 mb-2">
                官方帳號資訊即將公佈
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed font-serif">
                Informasi rekening panitia akan segera diperbarui sebelum hari pelaksanaan acara.
              </p>
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-amber-300/80 font-serif">
                Panitia 20 Tahun Kuang Hang Fo Thang • 廣航佛堂籌委會
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-stone-400 font-serif flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>
              {showId && "Terima kasih atas ketulusan hati dan kebajikan Anda"}
              {showId && showZh && " • "}
              {showZh && "感恩慈悲發心"}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
