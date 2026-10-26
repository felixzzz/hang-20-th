"use client";

import React, { useState, useEffect } from "react";
import { Share2, Copy, Check, MessageCircle, Link as LinkIcon } from "lucide-react";

export default function ShareGenerator() {
  const [recipient, setRecipient] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const generatedUrl = recipient.trim()
    ? `${currentOrigin}/?to=${encodeURIComponent(recipient.trim())}`
    : `${currentOrigin}/`;

  const whatsappMessage = `*Undangan Resmi: Peringatan 20 Tahun Kuang Hang Fo Thang (廣航佛堂)*

Kepada Yth. Bapak / Ibu / Saudara/i:
*${recipient.trim() || "Saudara Se-Dharma"}*

Dengan penuh rasa syukur atas Tian En Shi De (天恩師德), kami mengundang Anda untuk hadir bersama merayakan:
*20 Tahun Gedung Kuang Hang Fo Thang*
Mengarungi Samudra Kebajikan Menabur Kasih Semesta (1997 - 2026)

📅 *Waktu:* Sabtu, 14 November 2026 • 19.00 WIB
📍 *Tempat:* Kuang Hang Fo Thang (Jl. Palmerah Utara III No. 186A, Jakarta Barat)

Mohon berkenan membuka tautan undangan digital & konfirmasi kehadiran (RSVP) melalui:
${generatedUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
Terima kasih.`;

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const shareViaWhatsapp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#2a0e0e] to-[#1c0808] border border-fothang-gold-400/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-fothang-gold-400">
          <Share2 className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            Alat Bantu Panitia • Bagikan Undangan
          </h3>
        </div>

        <h4 className="text-xl font-serif font-bold text-fothang-gold-200 mb-1">
          Buat Tautan Undangan Personal (WhatsApp)
        </h4>
        <p className="text-xs text-stone-300 mb-6">
          Ketikkan nama tamu / keluarga untuk menghasilkan tautan undangan khusus dengan ucapan personal.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-1.5">
              Nama Tamu / Umat
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Contoh: Lim TC Felix Salim"
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-fothang-gold-400/30 focus:border-fothang-gold-400 text-sm text-white placeholder-stone-400 outline-none transition"
            />
          </div>

          {/* Generated URL Box */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-xs text-stone-300 font-mono truncate">
              {generatedUrl}
            </span>
            <button
              onClick={copyUrl}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-fothang-gold-300 font-medium transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Disalin!" : "Salin Link"}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={shareViaWhatsapp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka WhatsApp</span>
            </button>

            <button
              onClick={copyMessage}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 font-medium text-xs border border-white/15 transition cursor-pointer"
            >
              {copiedMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
              <span>{copiedMsg ? "Teks WA Disalin!" : "Salin Teks Lengkap WA"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
