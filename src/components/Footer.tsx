"use client";

import React from "react";
import Image from "next/image";
import { Heart, Instagram, MailOpen, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";
import { defaultCms } from "@/data/defaultCms";

interface FooterProps {
  onReopenEnvelope: () => void;
}

export default function Footer({ onReopenEnvelope }: FooterProps) {
  const { showId, showZh } = useLanguage();
  const { cms } = useCms();

  const footer = {
    ...defaultCms.footer,
    ...(cms.footer || {}),
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoImg = footer.logoImage || cms.cover?.logoImage || "/images/logo-guang-ji.png";
  const titleZh = footer.titleZh || cms.cover?.titleZh || "廣航佛堂";

  return (
    <footer className="mt-20 bg-[#1c1815] text-[#fbf5e8] border-t border-[#dfba6d]/30 pt-16 pb-20 px-4 sm:px-6 relative text-center">
      <div className="max-w-3xl mx-auto">
        
        {/* Guang Ji Sacred Emblem */}
        <div className="relative w-14 h-14 mx-auto mb-3">
          <Image
            src={logoImg}
            alt="Logo Guang Ji"
            fill
            sizes="56px"
            className="object-contain rounded-full shadow-sm"
            unoptimized={logoImg.startsWith("http")}
          />
        </div>

        <h3 className="text-3xl sm:text-4xl font-chinese font-bold text-[#fbf5e8] tracking-widest mb-1">
          {titleZh}
        </h3>

        {showZh && footer.subtitleZh && (
          <p className="text-xs sm:text-sm font-chinese text-[#dfba6d] tracking-widest mb-2">
            {footer.subtitleZh}
          </p>
        )}
        {showId && footer.subtitleId && (
          <p className="text-xs sm:text-sm font-serif text-[#dfba6d] tracking-wider mb-2">
            {footer.subtitleId}
          </p>
        )}

        <div className="w-16 h-px mx-auto bg-[#dfba6d]/40 my-6" />

        <div className="max-w-lg mx-auto mb-6 space-y-2">
          {showId && footer.quoteId && (
            <p className="font-serif text-sm text-stone-300 italic leading-relaxed">
              &ldquo;{footer.quoteId}&rdquo;
            </p>
          )}
          {showZh && footer.quoteZh && (
            <p className="font-chinese text-xs sm:text-sm text-[#dfba6d]/90 leading-relaxed font-normal">
              {footer.quoteZh}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {footer.instagramUrl && (
            <a
              href={footer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-stone-200 transition cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#dfba6d]" />
              <span>{footer.instagramHandle || "@guanghangfotang"}</span>
            </a>
          )}

          <button
            onClick={onReopenEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-[#dfba6d] transition cursor-pointer"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>{showId ? footer.reopenTextId : footer.reopenTextZh}</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-serif text-stone-200 transition cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#dfba6d]" />
            <span>{showId ? footer.backToTopTextId : footer.backToTopTextZh}</span>
          </button>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 border-t border-white/10 text-xs text-stone-400 font-serif flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>{footer.copyrightText}</span>
          </div>

          {(footer.mottoPart1 || footer.mottoPart2) && (
            <div className="flex items-center gap-1.5 text-stone-400">
              {footer.mottoPart1 && <span>{footer.mottoPart1}</span>}
              <Heart className="w-3.5 h-3.5 text-[#7c1818] fill-[#7c1818]" />
              {footer.mottoPart2 && <span>{footer.mottoPart2}</span>}
            </div>
          )}
        </div>

      </div>
    </footer>
  );
}
