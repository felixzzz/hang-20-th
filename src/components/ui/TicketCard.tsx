"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Sparkles, Check, Bookmark, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  guestName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  chineseTitle?: string;
  logoSrc?: string;
  onSaveCalendar?: () => void;
  className?: string;
  theme?: "gold-silk" | "obsidian-night" | "zen-sand";
}

export function TicketCard({
  guestName,
  eventName,
  eventDate,
  eventTime,
  venueName,
  address,
  chineseTitle = "落成廿週年堂慶大典",
  logoSrc = "/images/logo-guang-ji.png",
  onSaveCalendar,
  className,
  theme = "gold-silk",
}: TicketCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const isDark = theme === "obsidian-night";
  const isZen = theme === "zen-sand";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative rounded-3xl overflow-hidden shadow-2xl transition-shadow select-none",
        isDark
          ? "bg-gradient-to-br from-[#200a0a] via-[#140505] to-[#0c0303] text-stone-100 border border-amber-500/40 shadow-amber-950/40"
          : isZen
          ? "bg-white text-stone-900 border border-stone-300 shadow-stone-200"
          : "bg-gradient-to-br from-[#ffffff] via-[#fbf7ee] to-[#f4ecd8] text-stone-900 border-2 border-[#dfba6d]/60 shadow-[0_20px_50px_rgba(124,24,24,0.12)]",
        className
      )}
    >
      {/* Holographic Sheen Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent opacity-60" />

      {/* Main Grid: Left Stub (2/3) + Right Voucher (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
        
        {/* Left Side: Ceremonial Invitation Body */}
        <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between relative">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-amber-500/50 p-1 bg-white/10 shrink-0">
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-semibold block">
                    VIP CEREMONIAL PASS • 特邀嘉賓
                  </span>
                  <h3 className="font-chinese font-bold text-base text-amber-900 dark:text-amber-200">
                    廣航佛堂 • {chineseTitle}
                  </h3>
                </div>
              </div>

              <div className="chinese-seal-filled text-[10px] px-2 py-0.5 font-chinese">
                天恩師德
              </div>
            </div>

            {/* Guest Name Callout */}
            <div className="my-5 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block mb-0.5">
                NAMA TAMU KEHORMATAN / 貴賓尊鑒
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-[#7c1818] dark:text-amber-300">
                {guestName}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-sans">
                Merupakan berkah mendalam menyambut kehadiran Anda dalam malam syukur 20 tahun Kuang Hang.
              </p>
            </div>
          </div>

          {/* Schedule Footer */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-500/20 text-xs font-mono">
            <div>
              <span className="text-[10px] text-stone-400 uppercase block">Tanggal</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{eventDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase block">Waktu Mulai</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{eventTime}</span>
            </div>
          </div>
        </div>

        {/* Perforated Separator with Top/Bottom Notch */}
        <div className="hidden md:flex relative flex-col items-center justify-between py-2 w-px">
          <div className="w-5 h-5 rounded-full bg-[#faf7f2] dark:bg-[#0d0404] -mt-3.5 border border-amber-500/30 -ml-2.5 z-20" />
          <div className="h-full border-r-2 border-dashed border-amber-500/30" />
          <div className="w-5 h-5 rounded-full bg-[#faf7f2] dark:bg-[#0d0404] -mb-3.5 border border-amber-500/30 -ml-2.5 z-20" />
        </div>

        {/* Right Side: Fast Check-in Stub / Barcode */}
        <div className="md:col-span-4 p-6 bg-amber-500/5 dark:bg-black/30 border-t md:border-t-0 md:border-l border-amber-500/20 flex flex-col justify-between text-center relative">
          
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
              TIKET VERIFIKASI
            </div>
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              #GH20-2026-VIP
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="my-4 px-3 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center">
            <div className="flex items-center gap-[2px] h-10 w-full justify-center">
              {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-stone-900 dark:bg-stone-200 h-full"
                  style={{ width: `${w * 2}px` }}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-stone-500 tracking-widest mt-1">
              12112006-14112026
            </span>
          </div>

          <div className="space-y-2">
            {onSaveCalendar && (
              <button
                onClick={onSaveCalendar}
                className="w-full py-2 px-3 rounded-xl bg-[#7c1818] hover:bg-[#681313] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Simpan Kalender
              </button>
            )}
            <span className="text-[10px] font-mono text-stone-500 block">
              Tunjukkan di meja registrasi
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
