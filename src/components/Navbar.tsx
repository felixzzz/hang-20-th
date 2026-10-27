"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeartHandshake, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCms } from "@/context/CmsContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, showId, showZh } = useLanguage();
  const { cms } = useCms();

  const logoImg = cms.cover.logoImage || "/images/logo-guang-ji.png";
  const navConfig = cms.navbar || {
    brandTitleId: "Kuang Hang Fo Thang",
    brandTitleZh: "廣航佛堂",
    brandSubtitleId: "Peringatan 20 Tahun Gedung",
    brandSubtitleZh: "成立廿週年堂慶",
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Wejangan", zh: "聖訓", href: "#wejangan" },
    { name: "Acara", zh: "慶典", href: "#acara" },
    { name: "Napak Tilas", zh: "史話", href: "#sejarah" },
    { name: "Galeri", zh: "影像", href: "#galeri" },
    { name: "Tali Kasih", zh: "隨喜", href: "#tali-kasih" },
    { name: "Lokasi", zh: "座標", href: "#lokasi" },
    { name: "RSVP & Doa", zh: "回函", href: "#rsvp", isAction: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div
        className={`max-w-6xl mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#faf8f5]/95 shadow-[0_8px_24px_rgba(33,29,26,0.08)] border border-[#dfba6d]/40 backdrop-blur-md"
            : "bg-[#faf8f5]/85 border border-[#dfba6d]/25 backdrop-blur-sm shadow-xs"
        }`}
      >
        {/* Brand */}
        <a href="#top" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src={logoImg}
              alt="Logo Guang Ji"
              fill
              sizes="36px"
              priority
              className="object-contain rounded-full shadow-xs"
              unoptimized={logoImg.startsWith("http")}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-[#7c1818] leading-tight">
              {showZh && !showId ? navConfig.brandTitleZh : navConfig.brandTitleId}
            </span>
            <span className="text-[11px] text-stone-600 font-chinese">
              {showZh && !showId
                ? navConfig.brandSubtitleZh
                : showId && !showZh
                ? navConfig.brandSubtitleId
                : `${navConfig.brandTitleZh} • ${navConfig.brandSubtitleZh}`}
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            if (link.isAction) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7c1818] hover:bg-[#681313] text-[#fbf5e8] font-serif font-medium text-xs shadow-xs transition-all border border-[#dfba6d]/40 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#dfba6d]" />
                  {showId && <span>{link.name}</span>}
                  {showId && showZh && (
                    <span className="font-chinese text-xs opacity-90 pl-1 border-l border-white/20">
                      {link.zh}
                    </span>
                  )}
                  {!showId && showZh && (
                    <span className="font-chinese text-xs font-normal">
                      {link.zh}
                    </span>
                  )}
                </a>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                className="px-2.5 py-1 rounded-full text-xs font-serif font-medium text-stone-800 hover:text-[#7c1818] hover:bg-stone-200/50 transition-colors cursor-pointer flex items-center gap-1"
              >
                {showId && <span>{link.name}</span>}
                {showId && showZh && (
                  <span className="font-chinese text-[11px] text-stone-500 font-normal">
                    {link.zh}
                  </span>
                )}
                {!showId && showZh && (
                  <span className="font-chinese text-xs font-normal">
                    {link.zh}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher & Mobile Trigger */}
        <div className="flex items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center rounded-full bg-[#f0eae0] p-0.5 text-xs font-serif border border-[#dfba6d]/30">
            <button
              onClick={() => setLang("all")}
              aria-label="Tampilan Dwibahasa"
              className={`px-2.5 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                lang === "all"
                  ? "bg-[#7c1818] text-[#fbf5e8] font-semibold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              雙語
            </button>
            <button
              onClick={() => setLang("id")}
              aria-label="Tampilan Bahasa Indonesia"
              className={`px-2 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-[#7c1818] text-[#fbf5e8] font-semibold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("zh")}
              aria-label="僅顯示中文"
              className={`px-2 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                lang === "zh"
                  ? "bg-[#7c1818] text-[#fbf5e8] font-semibold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              中文
            </button>
          </div>

          <a
            href="#rsvp"
            className="lg:hidden px-3 py-1 rounded-full bg-[#7c1818] text-[#fbf5e8] text-xs font-serif font-medium border border-[#dfba6d]/40"
          >
            {showZh && !showId ? "回函" : "RSVP"}
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka Menu"
            className="lg:hidden p-1.5 rounded-lg text-stone-800 hover:bg-stone-200/60 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-6xl mx-auto rounded-2xl bg-[#faf8f5] border border-[#dfba6d]/40 shadow-xl p-3.5 transition-all">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-medium transition-colors flex items-center justify-between ${
                  link.isAction
                    ? "bg-[#7c1818] text-[#fbf5e8] font-semibold mt-1 text-center justify-center gap-2"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                {showId && <span>{link.name}</span>}
                {showId && showZh && (
                  <span className="font-chinese text-xs opacity-75">{link.zh}</span>
                )}
                {!showId && showZh && (
                  <span className="font-chinese text-xs font-normal">{link.zh}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
