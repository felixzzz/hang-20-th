"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeartHandshake, Menu, X, Globe } from "lucide-react";
import { useLanguage, LanguageMode } from "@/context/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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
    { name: "RSVP & Doa", zh: "回函賜帖", href: "#rsvp", isAction: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 px-3 sm:px-6 pt-3 pb-2">
      <div
        className={`max-w-6xl mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#faf7f2]/95 shadow-[0_10px_30px_rgba(30,26,23,0.08)] border border-amber-600/30 backdrop-blur-md"
            : "bg-[#faf7f2]/80 border border-amber-800/15 backdrop-blur-sm"
        }`}
      >
        {/* Brand with Guang Ji Logo */}
        <a href="#top" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="relative w-9 h-9 shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/images/logo-guang-ji.png"
              alt="Logo Guang Ji"
              fill
              sizes="36px"
              priority
              className="object-contain rounded-full shadow-sm"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-bold text-sm sm:text-base tracking-wider text-red-950 leading-tight">
              Kuang Hang Fo Thang
            </span>
            <span className="text-xs text-amber-900 font-chinese">
              廣航佛堂 • 成立廿週年堂慶
            </span>
          </div>
        </a>

        {/* Desktop Nav - Editorial Typography */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            if (link.isAction) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#831f1f] to-[#6e1818] text-amber-200 font-serif font-semibold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all border border-amber-500/40 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                  <span>{link.name}</span>
                  <span className="font-chinese text-xs opacity-90 border-l border-amber-300/30 pl-1.5 ml-0.5">
                    {link.zh}
                  </span>
                </a>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                className="px-2.5 py-1 rounded-full text-xs sm:text-sm font-serif font-medium text-stone-800 hover:text-red-900 hover:bg-amber-500/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{link.name}</span>
                <span className="font-chinese text-xs text-stone-600 font-normal">
                  {link.zh}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher & Mobile Trigger */}
        <div className="flex items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center rounded-full bg-stone-200/80 p-0.5 text-xs font-serif border border-amber-900/15">
            <button
              onClick={() => setLang("all")}
              aria-label="Tampilan Dwibahasa"
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                lang === "all"
                  ? "bg-[#831f1f] text-amber-200 font-bold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              雙語
            </button>
            <button
              onClick={() => setLang("id")}
              aria-label="Tampilan Bahasa Indonesia"
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-[#831f1f] text-amber-200 font-bold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("zh")}
              aria-label="僅顯示中文"
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                lang === "zh"
                  ? "bg-[#831f1f] text-amber-200 font-bold shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              中文
            </button>
          </div>

          <a
            href="#rsvp"
            className="lg:hidden px-3 py-1 rounded-full bg-[#831f1f] text-amber-200 text-xs font-serif font-semibold border border-amber-400/40"
          >
            RSVP
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
        <div className="lg:hidden mt-2 max-w-6xl mx-auto rounded-2xl bg-[#faf7f2] border border-amber-600/30 shadow-xl p-4 transition-all">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-serif font-medium transition-colors flex items-center justify-between ${
                  link.isAction
                    ? "bg-[#831f1f] text-amber-200 font-bold mt-1 text-center justify-center gap-2"
                    : "text-stone-800 hover:bg-amber-500/10"
                }`}
              >
                <span>{link.name}</span>
                <span className="font-chinese text-xs opacity-80">{link.zh}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
