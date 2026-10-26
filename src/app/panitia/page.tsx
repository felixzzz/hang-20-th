"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  KeyRound,
  Users,
  Search,
  Download,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";

export default function PanitiaDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"rsvp" | "generator">("rsvp");

  // RSVP Data state
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hadir" | "ragu" | "tidak_hadir">("all");
  const [loading, setLoading] = useState(false);

  // Generator State
  const [recipient, setRecipient] = useState("");
  const [bulkNames, setBulkNames] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const DEFAULT_PIN = "guanghang2026";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
      // Check session auth
      const auth = sessionStorage.getItem("panitia_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem("panitia_auth", "true");
      loadData();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("panitia_auth");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWishes(json.data);
      } else {
        setWishes(initialWishes);
      }
    } catch (e) {
      const local = localStorage.getItem("guanghang_wishes");
      if (local) {
        try {
          setWishes(JSON.parse(local));
        } catch (err) {
          setWishes(initialWishes);
        }
      } else {
        setWishes(initialWishes);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Calculations
  const filteredWishes = wishes.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalGuestsHadir = wishes
    .filter((w) => w.status === "hadir")
    .reduce((sum, w) => sum + (w.guests || 1), 0);

  // Single Generator Message
  const generatedUrl = recipient.trim()
    ? `${currentOrigin}/?to=${encodeURIComponent(recipient.trim())}`
    : `${currentOrigin}/`;

  const whatsappMessage = `*Undangan Resmi: Peringatan 20 Tahun Kuang Hang Fo Thang (廣航佛堂)*

Kepada Yth. Bapak / Ibu / Saudara/i:
*${recipient.trim() || "Saudara Se-Dharma"}*

Dengan penuh rasa syukur atas Tian En Shi De (天恩師德), kami mengundang Anda untuk hadir bersama merayakan:
*20 Tahun Gedung Kuang Hang Fo Thang*
Mengarungi Samudra Kebajikan Menabur Kasih Semesta (1997 - 2026)

📅 *Waktu:* Sabtu, 14 November 2026 • 19.00 WIB s/d Selesai
📍 *Tempat:* Kuang Hang Fo Thang (Jl. Palmerah Utara III No. 186A, Jakarta Barat)

Mohon berkenan membuka tautan undangan digital & konfirmasi kehadiran (RSVP) melalui:
${generatedUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
Terima kasih.`;

  const copyUrl = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const shareViaWhatsapp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, "_blank");
  };

  // Export CSV
  const exportCsv = () => {
    const headers = ["Waktu Submit", "Nama Tamu / Keluarga", "Status Kehadiran", "Jumlah Tamu", "Untaian Doa"];
    const rows = wishes.map((w) => [
      `"${w.timestamp || "-"}"`,
      `"${w.name.replace(/"/g, '""')}"`,
      `"${w.status === "hadir" ? "Hadir" : w.status === "ragu" ? "Masih Ragu" : "Tidak Hadir"}"`,
      w.guests || 1,
      `"${(w.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_RSVP_KuangHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Links parsed
  const parsedBulkNames = bulkNames
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  // If Not Authenticated -> Show Password Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1c0808] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#2a0e0e] border border-fothang-gold-400/40 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-fothang-gold-500/15 border border-fothang-gold-400/40 flex items-center justify-center mx-auto mb-4 text-fothang-gold-300">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-fothang-gold-200 mt-2 mb-2">
            Portal Panitia Kuang Hang Fo Thang
          </h1>
          <p className="text-xs text-stone-300 mb-6">
            Halaman ini khusus pengurus & panitia untuk mengelola undangan dan rekapitulasi data kehadiran umat.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Masukkan PIN Akses Panitia"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-fothang-gold-400/30 text-center text-white placeholder-stone-400 text-sm focus:border-fothang-gold-400 outline-none transition"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  PIN salah. (Default: guanghang2026)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-fothang-gold-600 via-fothang-gold-500 to-fothang-gold-600 text-fothang-red-950 font-bold text-xs tracking-wider uppercase transition shadow-lg hover:brightness-110 cursor-pointer"
            >
              Buka Akses Panitia
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-stone-200 transition"
            >
              ← Kembali ke Undangan Umum
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Dashboard Interface
  return (
    <main className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      {/* Top Navbar */}
      <header className="bg-[#240b0b] text-white border-b-2 border-fothang-gold-400/40 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition"
              title="Lihat Web Undangan"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-fothang-gold-300">
                  Panel Panitia 20 Tahun Kuang Hang
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-fothang-gold-500/20 text-fothang-gold-300 border border-fothang-gold-400/30">
                  Khusus Pengurus
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-chinese">
                廣航佛堂 • 二十週年堂慶籌委會
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://docs.google.com/spreadsheets/d/1RMauJya937WQZfyrSRCifhOw8AZj4Zr20elRSAW409k/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-white transition cursor-pointer shadow-sm"
              title="Buka Google Sheets Daftar Tamu"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Google Sheet Tamu</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-stone-200 transition cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-4 pt-2">
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "rsvp"
                ? "border-fothang-gold-400 text-fothang-gold-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekap RSVP ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("generator")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "generator"
                ? "border-fothang-gold-400 text-fothang-gold-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Generator Link WhatsApp</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ================= TAB 1: REKAP RSVP ================= */}
        {activeTab === "rsvp" && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-500 font-medium">Total Respon Masuk</span>
                <div className="text-3xl font-serif font-bold text-fothang-red-900 mt-1">
                  {wishes.length}
                </div>
                <span className="text-[11px] text-stone-400">Keluarga / Umat</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-emerald-600 font-medium">Konfirmasi Hadir</span>
                <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                  {wishes.filter((w) => w.status === "hadir").length}
                </div>
                <span className="text-[11px] text-stone-400">Total rombongan</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-fothang-gold-700 font-medium">Estimasi Jumlah Umat</span>
                <div className="text-3xl font-serif font-bold text-fothang-gold-800 mt-1">
                  {totalGuestsHadir}
                </div>
                <span className="text-[11px] text-stone-400">Jiwa siap hadir</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-500 font-medium">Belum Pasti / Ragu</span>
                <div className="text-3xl font-serif font-bold text-amber-600 mt-1">
                  {wishes.filter((w) => w.status === "ragu").length}
                </div>
                <span className="text-[11px] text-stone-400">Perlu dihubungi</span>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu atau kata doa..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:border-fothang-gold-500 outline-none"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                {[
                  { key: "all", label: "Semua" },
                  { key: "hadir", label: "Hadir" },
                  { key: "ragu", label: "Masih Ragu" },
                  { key: "tidak_hadir", label: "Tidak Hadir" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setFilterStatus(s.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      filterStatus === s.key
                        ? "bg-fothang-red-800 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                  title="Segarkan Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={exportCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* RSVP Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama Tamu / Umat</th>
                      <th className="py-3 px-4">Status Kehadiran</th>
                      <th className="py-3 px-4">Jumlah Hadir</th>
                      <th className="py-3 px-4">Untaian Doa & Harapan</th>
                      <th className="py-3 px-4">Waktu Submit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredWishes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-stone-400">
                          Tidak ditemukan data konfirmasi kehadiran yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredWishes.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition">
                          <td className="py-3 px-4 font-mono text-stone-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-stone-900">{item.name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === "hadir"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "ragu"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              {item.status === "hadir" ? "Hadir" : item.status === "ragu" ? "Masih Ragu" : "Tidak Hadir"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-800">
                            {item.status === "hadir" ? `${item.guests || 1} orang` : "-"}
                          </td>
                          <td className="py-3 px-4 italic text-stone-600 max-w-xs truncate" title={item.message}>
                            {item.message || "-"}
                          </td>
                          <td className="py-3 px-4 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                            {item.timestamp}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: GENERATOR LINK WHATSAPP ================= */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Generator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-fothang-red-900 font-serif font-bold text-lg">
                <Share2 className="w-5 h-5 text-fothang-gold-600" />
                <span>Buat Undangan 1 Nama Tamu</span>
              </div>
              <p className="text-xs text-stone-500">
                Ketik nama tamu untuk otomatis membuat URL khusus dengan sapaan personal.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1.5">
                  Nama Lengkap Tamu
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Contoh: Lim TC Felix Salim"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-fothang-gold-500 outline-none"
                />
              </div>

              {/* URL Box */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1.5">
                  Tautan Khusus Tamu
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-mono text-stone-700 truncate flex-1">
                    {generatedUrl}
                  </span>
                  <button
                    onClick={() => copyUrl(generatedUrl)}
                    className="p-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={shareViaWhatsapp}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Langsung via WA</span>
                </button>

                <button
                  onClick={copyMessage}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-300 transition cursor-pointer"
                >
                  {copiedMsg ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMsg ? "Teks Disalin!" : "Salin Pesan WA Lengkap"}</span>
                </button>
              </div>

              {/* Preview Message */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {whatsappMessage}
              </div>
            </div>

            {/* Bulk Generator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-fothang-red-900 font-serif font-bold text-lg">
                <FileSpreadsheet className="w-5 h-5 text-fothang-gold-600" />
                <span>Pembuat Tautan Massal (Bulk)</span>
              </div>
              <p className="text-xs text-stone-500">
                Tempel (paste) daftar nama tamu (1 nama per baris) untuk langsung menghasilkan seluruh link sekaligus:
              </p>

              <textarea
                rows={6}
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder={"Lim TC Felix Salim\nKeluarga Cen Kuo Fa\nShixiong Budi\nShijie Linda"}
                className="w-full p-3 text-xs rounded-xl border border-stone-300 font-mono focus:border-fothang-gold-500 outline-none"
              />

              {parsedBulkNames.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <div className="text-xs font-semibold text-stone-700">
                    Hasil Tautan ({parsedBulkNames.length} nama):
                  </div>
                  {parsedBulkNames.map((name, i) => {
                    const u = `${currentOrigin}/?to=${encodeURIComponent(name)}`;
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                        <span className="font-semibold text-stone-900 truncate max-w-[120px]">{name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyUrl(u)}
                            className="p-1 rounded bg-white border border-stone-300 hover:bg-stone-100"
                            title="Salin Tautan"
                          >
                            <Copy className="w-3.5 h-3.5 text-stone-600" />
                          </button>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Kepada Yth. ${name},\nBerikut undangan resmi 20 Tahun Kuang Hang Fo Thang:\n${u}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="Kirim via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
