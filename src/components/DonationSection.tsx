"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, Heart, Sparkles, Building2, CreditCard } from "lucide-react";
import { donationConfig } from "@/data/donation";

export default function DonationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!donationConfig.isReady) return;
    navigator.clipboard.writeText(donationConfig.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="tali-kasih" className="py-16 sm:py-20 px-4 sm:px-6 relative bg-fothang-ivory">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fothang-gold-100 border border-fothang-gold-300 text-fothang-red-900 text-xs font-semibold tracking-wider uppercase mb-3">
          <Gift className="w-3.5 h-3.5 text-fothang-gold-700" />
          <span>Tali Kasih & Dana Kebajikan (隨喜功德)</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-fothang-red-950 mb-3">
          Tali Kasih & Dana Paramita
        </h2>

        <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed mb-8">
          Doa restu serta kehadiran Bapak/Ibu/Saudara/i sekalian adalah karunia dan kehormatan terbesar bagi kami. Bagi umat yang hendak menyalurkan tali kasih sukarela guna mendukung kelancaran kegiatan wadah keTuhanan Kuang Hang, dapat disalurkan melalui rekening berikut:
        </p>

        {/* Account Card */}
        <div className="max-w-md mx-auto rounded-3xl bg-gradient-to-br from-[#2a0e0e] via-[#3d1212] to-[#240b0b] text-white p-6 sm:p-8 border-2 border-fothang-gold-400/40 shadow-2xl relative overflow-hidden">
          {/* Subtle Corner Accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-fothang-gold-400/60 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-fothang-gold-400/60 pointer-events-none" />

          <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-fothang-gold-300 text-xs font-semibold tracking-wider uppercase">
              <CreditCard className="w-4 h-4" />
              <span>{donationConfig.bankName}</span>
            </div>
            <span className="text-xs font-chinese text-fothang-gold-400">
              功德無量
            </span>
          </div>

          {donationConfig.isReady ? (
            <div>
              <p className="text-xs text-stone-300 mb-1">Nomor Rekening Resmi</p>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-fothang-gold-200 tracking-wider mb-2">
                {donationConfig.accountNumber}
              </div>
              <p className="text-xs text-stone-300 mb-5">
                Atas Nama: <strong className="text-white font-medium">{donationConfig.accountHolder}</strong>
              </p>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fothang-gold-500 to-fothang-gold-600 text-fothang-red-950 font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950" />
                    <span>Nomor Rekening Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-fothang-gold-500/10 border border-fothang-gold-400/30 flex items-center justify-center mx-auto mb-3 text-fothang-gold-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-serif font-bold text-fothang-gold-200 mb-1">
                Nomor Rekening Resmi (Menyusul)
              </h3>
              <p className="text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
                Informasi rekening panitia akan segera diumumkan dan diperbarui sebelum hari pelaksanaan acara.
              </p>
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-fothang-gold-300/80">
                Atas Nama: {donationConfig.accountHolder}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-fothang-red-400 fill-fothang-red-400" />
            <span>Terima kasih atas ketulusan hati dan kebajikan Anda</span>
          </div>
        </div>
      </div>
    </section>
  );
}
