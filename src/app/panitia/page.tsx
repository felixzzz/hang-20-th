"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Download,
  Share2,
  Copy,
  Check,
  Search,
  MessageCircle,
  RefreshCw,
  ArrowLeft,
  Lock,
  Database,
  UserPlus,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";

interface GuestItem {
  id: string;
  name: string;
  category: string;
  phone?: string;
  has_opened: boolean;
  opened_at?: string;
  rsvp_status: string;
  created_at: string;
}

export default function PanitiaDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"rsvp" | "guests" | "generator">("rsvp");

  // RSVP Data state
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hadir" | "ragu" | "tidak_hadir">("all");
  const [loading, setLoading] = useState(false);

  // Guests List state (Supabase)
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [guestCategory, setGuestCategory] = useState("Semua");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("Umat");
  const [bulkGuestText, setBulkGuestText] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Generator State
  const [recipient, setRecipient] = useState("");
  const [bulkNames, setBulkNames] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const DEFAULT_PIN = "guanghang2026";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
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
      // 1. Fetch RSVPs from Supabase backend
      const resRsvp = await fetch("/api/rsvp");
      const jsonRsvp = await resRsvp.json();
      if (jsonRsvp.success && Array.isArray(jsonRsvp.data)) {
        setWishes(jsonRsvp.data);
      } else {
        setWishes(initialWishes);
      }

      // 2. Fetch Guests from Supabase backend
      const resGuests = await fetch("/api/guests");
      const jsonGuests = await resGuests.json();
      if (jsonGuests.success && Array.isArray(jsonGuests.data)) {
        setGuests(jsonGuests.data);
      }
    } catch (e) {
      setWishes(initialWishes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Calculations for RSVPs
  const filteredWishes = wishes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalGuestsHadir = wishes
    .filter((w) => w.status === "hadir")
    .reduce((sum, w) => sum + (w.guests || 1), 0);

  // Calculations for Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase());
    const matchesCat = guestCategory === "Semua" || g.category === guestCategory;
    return matchesSearch && matchesCat;
  });

  const totalGuestsOpened = guests.filter((g) => g.has_opened).length;
  const totalGuestsConfirmed = guests.filter((g) => g.rsvp_status === "hadir").length;

  // Single Generator Message
  const generatedUrl = recipient.trim()
    ? `${currentOrigin}/?to=${encodeURIComponent(recipient.trim())}`
    : `${currentOrigin}/`;

  const getWaMessageFor = (targetName: string, targetUrl: string) => `*Undangan Resmi: Peringatan 20 Tahun Kuang Hang Fo Thang (廣航佛堂)*

Kepada Yth. Bapak / Ibu / Saudara/i:
*${targetName || "Saudara Se-Dharma"}*

Dengan penuh rasa syukur atas Tian En Shi De (天恩師德), kami mengundang Anda untuk hadir bersama merayakan:
*20 Tahun Gedung Kuang Hang Fo Thang*
Mengarungi Samudra Kebajikan Menabur Kasih Semesta (2006 — 2026)

📅 *Waktu:* Sabtu, 14 November 2026 • 19.00 WIB s/d Selesai
📍 *Tempat:* Kuang Hang Fo Thang (Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat)

Mohon berkenan membuka tautan undangan digital & konfirmasi kehadiran (RSVP) melalui:
${targetUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
Terima kasih.`;

  const whatsappMessage = getWaMessageFor(recipient.trim(), generatedUrl);

  const copyUrl = (urlToCopy: string, guestId?: string) => {
    navigator.clipboard.writeText(urlToCopy);
    if (guestId) {
      setCopiedGuestId(guestId);
      setTimeout(() => setCopiedGuestId(null), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const copyMessage = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const shareViaWhatsapp = (textToSend: string) => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`;
    window.open(waUrl, "_blank");
  };

  // Add Single Guest to Supabase
  const handleAddSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setIsAddingGuest(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names: [newGuestName.trim()],
          category: newGuestCategory,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewGuestName("");
        await loadData();
      } else {
        alert(json.error || "Gagal menambahkan tamu.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  // Add Bulk Guests to Supabase
  const handleAddBulkGuests = async () => {
    if (!bulkGuestText.trim()) return;
    setIsAddingGuest(true);
    try {
      const names = bulkGuestText
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names,
          category: newGuestCategory,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBulkGuestText("");
        setShowBulkModal(false);
        await loadData();
      } else {
        alert(json.error || "Gagal menambahkan tamu massal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  // Delete Guest from Supabase
  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus ${name} dari daftar tamu?`)) return;
    try {
      const res = await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      } else {
        alert(json.error || "Gagal menghapus tamu.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Export CSV
  const exportCsv = () => {
    if (activeTab === "guests") {
      const headers = ["Nama Tamu", "Kategori", "Sudah Buka Web", "Status RSVP", "Tautan Undangan"];
      const rows = guests.map((g) => [
        `"${g.name.replace(/"/g, '""')}"`,
        `"${g.category || "Umum"}"`,
        `"${g.has_opened ? "Sudah Buka" : "Belum Buka"}"`,
        `"${g.rsvp_status === "hadir" ? "Hadir" : g.rsvp_status === "tidak_hadir" ? "Tidak Hadir" : "Menunggu Konfirmasi"}"`,
        `"${currentOrigin}/?to=${encodeURIComponent(g.name)}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `Daftar_Tamu_KuangHang_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const headers = ["Waktu Submit", "Nama Tamu / Keluarga", "Status Kehadiran", "Jumlah Tamu", "Untaian Doa"];
    const rows = wishes.map((w) => [
      `"${w.timestamp || "-"}"`,
      `"${w.name.replace(/"/g, '""')}"`,
      `"${w.status === "hadir" ? "Hadir" : w.status === "ragu" ? "Masih Ragu" : "Tidak Hadir"}"`,
      w.guests || 1,
      `"${(w.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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
            Halaman ini khusus pengurus & panitia untuk mengelola undangan dan rekapitulasi data kehadiran umat berbasis Supabase Database.
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
              <p className="text-xs text-stone-300 font-chinese">
                廣航佛堂 • 二十週年堂慶籌委會
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Supabase Live Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Supabase Terhubung</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-stone-200 transition cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-4 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "rsvp"
                ? "border-fothang-gold-400 text-fothang-gold-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekap RSVP ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("guests")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "guests"
                ? "border-fothang-gold-400 text-fothang-gold-300"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Tamu Supabase ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("generator")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
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
                <span className="text-xs text-stone-500">Keluarga / Umat</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-emerald-600 font-medium">Konfirmasi Hadir</span>
                <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                  {wishes.filter((w) => w.status === "hadir").length}
                </div>
                <span className="text-xs text-stone-500">Total rombongan</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-fothang-gold-700 font-medium">Estimasi Jumlah Umat</span>
                <div className="text-3xl font-serif font-bold text-fothang-gold-800 mt-1">
                  {totalGuestsHadir}
                </div>
                <span className="text-xs text-stone-500">Jiwa siap hadir</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-500 font-medium">Tidak Dapat Hadir</span>
                <div className="text-3xl font-serif font-bold text-stone-600 mt-1">
                  {wishes.filter((w) => w.status === "tidak_hadir").length}
                </div>
                <span className="text-xs text-stone-500">Mengirim doa restu</span>
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
                  title="Segarkan Data dari Supabase"
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
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
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
                        <td colSpan={6} className="text-center py-10 text-stone-500">
                          Tidak ditemukan data konfirmasi kehadiran yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredWishes.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition">
                          <td className="py-3 px-4 font-mono text-stone-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-stone-900">{item.name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                item.status === "hadir"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              {item.status === "hadir" ? "Hadir" : "Tidak Hadir"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-800">
                            {item.status === "hadir" ? `${item.guests || 1} orang` : "-"}
                          </td>
                          <td className="py-3 px-4 italic text-stone-600 max-w-xs truncate" title={item.message}>
                            {item.message || "-"}
                          </td>
                          <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">
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

        {/* ================= TAB 2: MANAJEMEN DAFTAR TAMU SUPABASE ================= */}
        {activeTab === "guests" && (
          <div className="space-y-6">
            {/* Quick Guest Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-500 font-medium">Total Tamu Diundang</span>
                <div className="text-3xl font-serif font-bold text-stone-900 mt-1">
                  {guests.length}
                </div>
                <span className="text-xs text-stone-500">Terdaftar di Supabase</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-blue-600 font-medium">Sudah Buka Sampul</span>
                <div className="text-3xl font-serif font-bold text-blue-700 mt-1">
                  {totalGuestsOpened}
                </div>
                <span className="text-xs text-stone-500">Membuka undangan web</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-emerald-600 font-medium">Konfirmasi Hadir</span>
                <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                  {totalGuestsConfirmed}
                </div>
                <span className="text-xs text-stone-500">Sudah mengisi RSVP</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs text-amber-600 font-medium">Belum Konfirmasi</span>
                <div className="text-3xl font-serif font-bold text-amber-700 mt-1">
                  {guests.filter((g) => !g.rsvp_status || g.rsvp_status === "pending").length}
                </div>
                <span className="text-xs text-stone-500">Perlu diingatkan via WA</span>
              </div>
            </div>

            {/* Guest Action & Add Form */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-fothang-red-950">
                    Tambah Tamu ke Database Supabase
                  </h3>
                  <p className="text-xs text-stone-500">
                    Nama tamu yang didaftarkan akan otomatis memiliki tautan personal khusus.
                  </p>
                </div>

                <button
                  onClick={() => setShowBulkModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-fothang-gold-700 hover:bg-fothang-gold-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Import Massal (Banyak Nama Sekaligus)</span>
                </button>
              </div>

              {/* Single Add Guest Form */}
              <form onSubmit={handleAddSingleGuest} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Ketik Nama Tamu (contoh: Shixiong Tanuwidjaja)"
                  className="flex-1 w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-fothang-gold-500 outline-none"
                />

                <select
                  value={newGuestCategory}
                  onChange={(e) => setNewGuestCategory(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-700 outline-none"
                >
                  <option value="Sesepuh / Pandita">Sesepuh / Pandita</option>
                  <option value="Pengurus">Pengurus</option>
                  <option value="Umat">Umat</option>
                  <option value="Muda-Mudi">Muda-Mudi</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Umum">Umum</option>
                </select>

                <button
                  type="submit"
                  disabled={isAddingGuest || !newGuestName.trim()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-fothang-red-800 hover:bg-fothang-red-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
                >
                  {isAddingGuest ? "Menyimpan..." : "Simpan Tamu"}
                </button>
              </form>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Cari nama tamu terdaftar..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:border-fothang-gold-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                {["Semua", "Pengurus", "Umat", "Sesepuh / Pandita", "Muda-Mudi", "Keluarga"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGuestCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      guestCategory === cat
                        ? "bg-fothang-red-800 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                  title="Segarkan Data Tamu"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={exportCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Daftar Tamu</span>
                </button>
              </div>
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama Tamu Undangan</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Status Sampul</th>
                      <th className="py-3 px-4">Konfirmasi RSVP</th>
                      <th className="py-3 px-4 text-center">Tautan & Aksi Cepat</th>
                      <th className="py-3 px-4 text-center">Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredGuests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-stone-500">
                          Belum ada daftar tamu yang cocok. Silakan tambahkan nama di atas.
                        </td>
                      </tr>
                    ) : (
                      filteredGuests.map((g, idx) => {
                        const targetUrl = `${currentOrigin}/?to=${encodeURIComponent(g.name)}`;
                        const targetWaMsg = getWaMessageFor(g.name, targetUrl);

                        return (
                          <tr key={g.id} className="hover:bg-stone-50/80 transition">
                            <td className="py-3 px-4 font-mono text-stone-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-stone-900">{g.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-xs">
                                {g.category || "Umum"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {g.has_opened ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Dibuka</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-stone-500 text-xs">
                                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                                  <span>Belum Dibuka</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {g.rsvp_status === "hadir" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Hadir</span>
                                </span>
                              ) : g.rsvp_status === "tidak_hadir" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-200 text-stone-700">
                                  <XCircle className="w-3 h-3" />
                                  <span>Tidak Hadir</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  <span>Menunggu</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => copyUrl(targetUrl, g.id)}
                                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 flex items-center gap-1 text-xs transition cursor-pointer"
                                  title="Salin Link Undangan"
                                >
                                  {copiedGuestId === g.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                  <span className="hidden sm:inline">
                                    {copiedGuestId === g.id ? "Disalin" : "Link"}
                                  </span>
                                </button>

                                <button
                                  onClick={() => shareViaWhatsapp(targetWaMsg)}
                                  className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 text-xs transition cursor-pointer shadow-xs"
                                  title="Kirim via WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Kirim WA</span>
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteGuest(g.id, g.name)}
                                className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Hapus Tamu"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Add Guest Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-lg text-fothang-red-950">
                  Import Daftar Tamu Massal ke Supabase
                </h3>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-600">
                Tempel (paste) daftar nama tamu dari Excel/Spreadsheet/WhatsApp ke bawah (1 nama per baris):
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Kategori Tamu</label>
                <select
                  value={newGuestCategory}
                  onChange={(e) => setNewGuestCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-700 outline-none"
                >
                  <option value="Umat">Umat</option>
                  <option value="Pengurus">Pengurus</option>
                  <option value="Sesepuh / Pandita">Sesepuh / Pandita</option>
                  <option value="Muda-Mudi">Muda-Mudi</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <textarea
                rows={8}
                value={bulkGuestText}
                onChange={(e) => setBulkGuestText(e.target.value)}
                placeholder={"Lim TC Felix Salim\nKeluarga Cen Kuo Fa\nShixiong Budi Santoso\nShijie Linda Wijaya"}
                className="w-full p-3 text-xs rounded-xl border border-stone-300 font-mono focus:border-fothang-gold-500 outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddBulkGuests}
                  disabled={isAddingGuest || !bulkGuestText.trim()}
                  className="px-5 py-2 rounded-xl bg-fothang-red-800 hover:bg-fothang-red-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  {isAddingGuest ? "Menyimpan ke Supabase..." : "Simpan Semua ke Supabase"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: GENERATOR LINK WHATSAPP ================= */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Generator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-fothang-red-900 font-serif font-bold text-lg">
                <Share2 className="w-5 h-5 text-fothang-gold-600" />
                <span>Buat Undangan 1 Nama Tamu</span>
              </div>
              <p className="text-xs text-stone-500">
                Ketik nama tamu untuk langsung membuat URL khusus dengan sapaan personal.
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-fothang-gold-500 outline-none"
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
                  onClick={() => shareViaWhatsapp(whatsappMessage)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Langsung via WA</span>
                </button>

                <button
                  onClick={() => copyMessage(whatsappMessage)}
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
                <Share2 className="w-5 h-5 text-fothang-gold-600" />
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
                    const waText = getWaMessageFor(name, u);
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
                          <button
                            onClick={() => shareViaWhatsapp(waText)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            title="Kirim via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
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
