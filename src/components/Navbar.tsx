"use client";

import React, { useState, useEffect } from "react";
import { Calendar, HeartHandshake, History, Image as ImageIcon, MapPin, Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Wejangan", href: "#wejangan", icon: Sparkles },
    { name: "Acara", href: "#acara", icon: Calendar },
    { name: "Sejarah", href: "#sejarah", icon: History },
    { name: "Galeri", href: "#galeri", icon: ImageIcon },
    { name: "Lokasi", href: "#lokasi", icon: MapPin },
    { name: "RSVP & Doa", href: "#rsvp", icon: HeartHandshake, primary: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 px-4 pt-3 pb-2">
      <div
        className={`max-w-5xl mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md shadow-stone-200/50 border border-fothang-gold-200/60 backdrop-blur-md"
            : "bg-white/80 border border-stone-200/60 backdrop-blur-sm"
        }`}
      >
        {/* Brand */}
        <a href="#top" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fothang-red-700 to-fothang-red-900 text-fothang-gold-300 font-chinese font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            廣
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-bold text-sm tracking-wide text-fothang-red-900 leading-tight">
              Kuang Hang Fo Thang
            </span>
            <span className="text-[10px] text-fothang-gold-700 tracking-wider font-chinese">
              廣航佛堂 • 20 週年堂慶
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            if (link.primary) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-fothang-red-800 to-fothang-red-700 text-fothang-gold-200 font-medium text-xs shadow-sm hover:shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </a>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-fothang-red-800 hover:bg-stone-100/80 transition-colors cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-fothang-gold-600" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#rsvp"
            className="px-3 py-1 rounded-full bg-fothang-red-800 text-fothang-gold-200 text-xs font-medium"
          >
            RSVP
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl bg-white border border-fothang-gold-200/80 shadow-xl p-3 flex flex-col gap-1 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                  link.primary
                    ? "bg-fothang-red-800 text-fothang-gold-200"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4 text-fothang-gold-600" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
