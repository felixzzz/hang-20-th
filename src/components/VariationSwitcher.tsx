"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Layers, Sparkles, Moon, Compass, BookOpen, Check } from "lucide-react";

export default function VariationSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const toQuery = searchParams.get("to");
  const queryStr = toQuery ? `?to=${encodeURIComponent(toQuery)}` : "";

  const variations = [
    {
      path: "/",
      label: "Original",
      zh: "原版經典",
      badge: "Klasik Fo Thang",
      desc: "Tata letak kartu simetris dengan sampul amplop interaktif.",
      icon: BookOpen,
      accent: "text-[#7c1818] bg-[#7c1818]/10 border-[#7c1818]/30",
    },
    {
      path: "/home1",
      label: "Home 1",
      zh: "卷軸典藏",
      badge: "Editorial Monograph",
      desc: "Split-screen asimetris majalah museum & gulungan kaligrafi klasik.",
      icon: BookOpen,
      accent: "text-amber-700 bg-amber-500/10 border-amber-600/30",
    },
    {
      path: "/home2",
      label: "Home 2",
      zh: "華燈盛典",
      badge: "Night Temple Gala",
      desc: "Suasana malam temaram dupa & lentera emas berbalut pernis merah marun.",
      icon: Moon,
      accent: "text-amber-400 bg-red-950/80 border-amber-500/30",
    },
    {
      path: "/home3",
      label: "Home 3",
      zh: "禪境寂雅",
      badge: "Zen Architecture",
      desc: "Grid Bento geometris minimalis modern berkarakter arsitektur suaka.",
      icon: Compass,
      accent: "text-stone-800 bg-stone-200 border-stone-400/30",
    },
  ];

  const currentVar = variations.find((v) => v.path === pathname) || variations[0];

  return (
    <aside
      aria-label="Panel Pemilih Variasi Desain"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end print:hidden select-none font-sans"
    >
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mb-2 w-80 bg-stone-900/95 backdrop-blur-md text-stone-100 rounded-2xl border border-amber-500/30 shadow-2xl p-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilih Variasi Layout Web</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">3 Konsep Ekstrem</span>
          </div>

          <div className="space-y-1.5">
            {variations.map((v) => {
              const isActive = pathname === v.path;
              const Icon = v.icon;
              return (
                <Link
                  key={v.path}
                  href={`${v.path}${queryStr}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-100"
                      : "hover:bg-stone-800/80 text-stone-300 border border-transparent"
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg border ${v.accent} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold font-serif text-white flex items-center gap-1">
                        {v.label}
                        <span className="text-[11px] font-chinese font-normal text-amber-400">
                          {v.zh}
                        </span>
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-300/80 font-mono">
                      {v.badge}
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{v.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-stone-800 text-[10px] text-stone-400 text-center">
            Mempertahankan database & data CMS yang sama.
          </div>
        </div>
      )}

      {/* Floating Toggle Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 text-stone-100 border border-amber-500/40 shadow-xl backdrop-blur-md transition-all active:scale-95 group"
        title="Ganti Layout Template Halaman"
      >
        <Layers className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-medium flex items-center gap-1.5">
          <span className="font-serif font-bold text-amber-200">{currentVar.label}:</span>
          <span className="text-stone-300 hidden sm:inline">{currentVar.badge}</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      </button>
    </aside>
  );
}
