"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";

interface HeroSectionProps {
  guestName: string;
}

export default function HeroSection({ guestName }: HeroSectionProps) {
  // Countdown to Saturday, Nov 14, 2026, 19:00:00 WIB (UTC+7)
  const targetDate = new Date("2026-11-14T19:00:00+07:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="top" className="relative pt-8 pb-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      
      {/* Subtle Atmospheric Watermark */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-12 select-none pointer-events-none opacity-[0.03]">
        <span className="text-[18rem] sm:text-[28rem] font-chinese font-black text-red-950 leading-none">
          航
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Editorial Banner Bar */}
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="chinese-seal-filled text-xs px-2 py-0.5">
              天恩師德
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-600 font-serif">
              Memorabilia Dua Dasawarsa (2006 — 2026) • 廿週年誌慶
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-serif text-amber-800">
            <span>Palmerah, Jakarta Barat • 雅加達巴美拉</span>
            <span>•</span>
            <span>14 November 2026</span>
          </div>
        </div>

        {/* Main Hero Grid: Asymmetrical Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Grand Typography & Monograph Thesis */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-3">
              <span className="w-6 h-px bg-amber-600" />
              <span>Peringatan 20 Tahun Gedung Kuang Hang Fo Thang • 堂慶大典</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-chinese font-bold text-red-950 tracking-wide leading-tight mb-3">
              廣航佛堂
              <span className="block text-2xl sm:text-3xl font-serif text-amber-700 font-semibold tracking-wider mt-1">
                成立廿週年堂慶紀念 (2006 — 2026)
              </span>
            </h1>

            <div className="border-l-2 border-amber-600/60 pl-4 my-4">
              <p className="font-serif text-xl sm:text-2xl text-stone-800 italic leading-relaxed">
                &ldquo;Mengarungi samudra kebajikan selama dua dasawarsa, merajut persaudaraan se-dharma, menyalakan pelita suci Shizun dan Shimu.&rdquo;
              </p>
              <p className="font-chinese text-sm sm:text-base text-amber-900 mt-2 tracking-widest leading-relaxed">
                「廿載同舟揚慈航 • 萬里攜手化乾坤 • 照亮世間菩提心」
              </p>
            </div>

            <div className="text-sm text-stone-600 leading-relaxed max-w-xl mb-8 space-y-2 font-serif">
              <p>
                Dua puluh tahun yang lalu, pada tanggal 12 November 2006, berkat karunia tak terhingga dari Tian En Shi De dan cucuran keringat para pendahulu, gedung Kuang Hang Fo Thang resmi berdiri kokoh di Palmerah. Hari ini, kami mengundang Anda untuk bersama menundukkan kepala dalam syukur dan memperbaharui ikrar kebajikan.
              </p>
              <p className="font-chinese text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
                廿年前（2006年11月12日），在天恩師德庇佑與前賢們無私奉獻下，廣航佛堂正式落成安座。廿載韶華，慧光普照。今日誠摯恭請十方善信大德共聚一堂，追思感恩，同沾法喜。
              </p>
            </div>

            {/* Inset Honored Guest Inscription Scroll (貴賓敬邀函) - Fully Bilingual */}
            <div className="xuan-paper-card p-6 sm:p-7 rounded-2xl border border-amber-300/80 shadow-[0_10px_30px_rgba(180,140,70,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-15">
                <div className="w-full h-full border-t-8 border-r-8 border-amber-800" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-900 font-semibold font-serif">
                  SURAT PENGHORMATAN TAMU UNDANGAN • 貴賓敬邀函
                </span>
                <span className="chinese-seal-red text-[10px] px-1.5 py-0.5">
                  同沾法喜
                </span>
              </div>

              <div className="text-xs text-stone-500 font-serif flex items-center gap-2">
                <span>Kepada Yth. Bapak / Ibu / Saudara/i</span>
                <span className="font-chinese text-stone-600 font-medium">恭請 尊鑒：</span>
              </div>

              <div className="text-2xl sm:text-3xl font-serif font-bold text-red-950 tracking-wide my-1">
                {guestName || "Saudara Se-Dharma & Umat Terkasih"}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-serif mt-2">
                Merupakan berkah dan kehormatan yang mendalam bagi segenap pengurus dan panitia untuk menyambut kehadiran Anda dalam Malam Puncak Peringatan 20 Tahun Kuang Hang Fo Thang.
                <span className="block font-chinese text-[11px] text-stone-500 mt-1">
                  廣航佛堂全體同修謹此誠摯奉邀，祈盼撥冗光臨，共沐法雨天恩。
                </span>
              </p>

              <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2 font-serif">
                <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Sabtu, 14 Nov 2026 • 19.00 WIB (2026年11月14日)</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-red-800 shrink-0" />
                  <span>Palmerah Utara III No. 186A • 巴美拉</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Archival Photo in Museum Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full rounded-2xl overflow-hidden bg-stone-900 shadow-2xl border-4 border-[#faf7f2] ring-1 ring-amber-400/40 group">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full">
                <Image
                  src="/images/guang-hang-15.jpg"
                  alt="Altar Agung Kuang Hang Fo Thang"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

                {/* Archival Badge */}
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs font-chinese tracking-widest">
                    廣航聖壇 • 2006安座
                  </div>
                </div>

                {/* Museum Photo Caption Plate - Bilingual */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-[#1c1815]/90 border border-amber-500/30 backdrop-blur-md text-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-amber-400 font-serif uppercase tracking-widest font-semibold">
                      Altar Agung Kuang Hang • 廣航聖壇大殿
                    </span>
                    <span className="text-[10px] text-stone-400">12 Nov 2006</span>
                  </div>
                  <p className="text-xs font-serif font-light text-stone-300 leading-snug">
                    Pusat spiritual pembinaan kebajikan dan persaudaraan se-dharma di Palmerah Utara.
                  </p>
                  <p className="text-[10px] font-chinese text-stone-400 mt-1">
                    立足巴美拉，開拓萬家光明，度化十方有緣善信回歸覺路。
                  </p>
                </div>
              </div>
            </div>

            {/* Traditional Auspicious Scroll Ribbon */}
            <div className="w-full mt-4 flex items-center justify-center gap-3 text-xs text-stone-600 font-serif">
              <span className="text-amber-700">❖</span>
              <span>廣結善緣 • 航向光明 • 二十載同舟共濟</span>
              <span className="text-amber-700">❖</span>
            </div>

          </div>

        </div>

        {/* Antique Celestial Solar Countdown - Fully Bilingual */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#250d0d] via-[#1a0707] to-[#140505] text-stone-100 border border-amber-500/30 shadow-2xl overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 filter blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Menghitung Hari Menuju Malam Peringatan • 倒計時迎接感恩之夜</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                Sabtu, 14 November 2026 • 19.00 WIB
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-serif">
                Waktu bersama untuk bersyukur, mengenang jejak perintis, dan mempererat tali dharma.
                <span className="block font-chinese text-[11px] text-stone-400 mt-0.5">
                  同修相聚感恩回首，共沐法喜，再啟新程。
                </span>
              </p>
            </div>

            {/* Countdown Dials with Bilingual Labels: Hari/天, Jam/時, Menit/分, Detik/秒 */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 shrink-0">
              {[
                { labelId: "Hari", labelZh: "天", val: timeLeft.days },
                { labelId: "Jam", labelZh: "時", val: timeLeft.hours },
                { labelId: "Menit", labelZh: "分", val: timeLeft.minutes },
                { labelId: "Detik", labelZh: "秒", val: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.labelId}
                  className="flex flex-col items-center justify-center w-16 sm:w-20 h-20 sm:h-24 rounded-xl bg-white/5 border border-amber-400/30 backdrop-blur-sm shadow-inner text-center"
                >
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 tracking-tight">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-stone-300 font-medium mt-1">
                    <span>{item.labelId}</span>
                    <span className="font-chinese text-amber-400 font-normal">/{item.labelZh}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
