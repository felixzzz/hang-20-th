"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, History, Image as ImageIcon, Gift, MapPin, HeartHandshake, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Wejangan", href: "#wejangan" },
    { name: "Acara & Waktu", href: "#acara" },
    { name: "Napak Tilas", href: "#sejarah" },
    { name: "Galeri Kenangan", href: "#galeri" },
    { name: "Tali Kasih", href: "#tali-kasih" },
    { name: "Lokasi", href: "#lokasi" },
    { name: "RSVP & Doa", href: "#rsvp", isAction: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 px-3 sm:px-6 pt-3 pb-2">
      <div
        className={`max-w-6xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#faf7f2]/95 shadow-[0_10px_30px_rgba(30,26,23,0.08)] border border-amber-600/30 backdrop-blur-md"
            : "bg-[#faf7f2]/80 border border-amber-800/15 backdrop-blur-sm"
        }`}
      >
        {/* Brand with Cinnabar Seal Emblem */}
        <a href="#top" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded bg-[#831f1f] border border-amber-400 text-amber-200 font-chinese font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            廣航
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-bold text-sm tracking-wider text-red-950 leading-tight">
              Kuang Hang Fo Thang
            </span>
            <span className="text-[10px] text-amber-800 tracking-widest font-chinese">
              成立廿週年堂慶 • 2006-2026
            </span>
          </div>
        </a>

        {/* Desktop Nav - Editorial Typography */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            if (link.isAction) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#831f1f] to-[#6e1818] text-amber-200 font-serif font-semibold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all border border-amber-500/40 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                  <span>{link.name}</span>
                </a>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-xs font-serif font-medium text-stone-700 hover:text-red-900 hover:bg-amber-500/10 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#rsvp"
            className="px-3 py-1 rounded-full bg-[#831f1f] text-amber-200 text-xs font-serif font-semibold border border-amber-400/40"
          >
            RSVP
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka Menu"
            className="p-1.5 rounded-lg text-stone-800 hover:bg-stone-200/60 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-2xl bg-[#faf7f2] border border-amber-600/30 shadow-xl p-4 transition-all">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-serif font-medium transition-colors ${
                  link.isAction
                    ? "bg-[#831f1f] text-amber-200 font-bold mt-1 text-center"
                    : "text-stone-800 hover:bg-amber-500/10"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
