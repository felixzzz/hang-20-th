"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Users,
  User,
  RotateCcw,
  BookOpen,
  Send,
  FileText,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  ListPlus,
} from "lucide-react";
import { CmsProvider, useCms } from "@/context/CmsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { defaultCms } from "@/data/defaultCms";

interface SavedTemplate {
  id: string;
  title: string;
  category: "resmi" | "santai" | "ringkas" | "mandarin" | "bilingual" | "muda";
  tag: string;
  description: string;
  body: string;
}

function InviteGeneratorContent() {
  const { cms } = useCms();
  const [recipient, setRecipient] = useState("");
  const [currentOrigin, setCurrentOrigin] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("resmi");
  const [customTemplateText, setCustomTemplateText] = useState<string>("");
  const [isEditingTemplate, setIsEditingTemplate] = useState<boolean>(false);

  // Copy feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);
  const [copiedBatchAll, setCopiedBatchAll] = useState(false);

  // Batch states
  const [batchRawNames, setBatchRawNames] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  // Built-in saved templates
  const savedTemplates: SavedTemplate[] = useMemo(() => {
    const defaultOfficial =
      cms.shareMessage?.template || defaultCms.shareMessage.template;

    return [
      {
        id: "resmi",
        title: "Resmi & Khidmat",
        category: "resmi",
        tag: "Rekomendasi Panitia",
        description: "Format surat resmi dengan Tian En Shi De, cocok untuk sesepuh, umat, dan tamu terhormat.",
        body: defaultOfficial,
      },
      {
        id: "santai",
        title: "Hangat & Kekeluargaan",
        category: "santai",
        tag: "Keluarga & Sahabat",
        description: "Bahasa lebih hangat dan santai, cocok untuk kerabat dekat, sahabat, dan rekan seangkatan.",
        body: `Halo {nama},

Semoga senantiasa sehat, bahagia, dan selalu dalam lindungan Tian En Shi De (天恩師德).

Kami mengundang Bapak / Ibu / Saudara sekeluarga untuk hadir bersama dalam malam penuh syukur:
*Peringatan 20 Tahun Gedung Kuang Hang Fo Thang (廣航佛堂)*
"Mengarungi Samudra Kebajikan Selama Dua Dasawarsa (2006 — 2026)"

📅 *Hari/Tanggal:* {tanggal}
⏰ *Waktu:* {waktu}
📍 *Tempat:* {tempat}

Detail acara lengkap & konfirmasi kehadiran (RSVP) dapat dibuka melalui tautan undangan digital kami:
{url}

Kehadiran serta doa restu Bapak / Ibu / Saudara/i sangat berarti bagi kita semua. Terima kasih dan sampai jumpa! 🙏`,
      },
      {
        id: "ringkas",
        title: "Ringkas & Praktis",
        category: "ringkas",
        tag: "Grup WhatsApp",
        description: "Pesan to-the-point dan padat, cocok disebarkan ke grup percakapan atau kontak aktif.",
        body: `*Undangan Resmi 20 Tahun Kuang Hang Fo Thang (廣航佛堂)*

Yth. {nama},

Mari hadir bersama dalam Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang:
📅 {tanggal} • ⏰ {waktu}
📍 {tempat}

Buka undangan digital personal & konfirmasi kehadiran (RSVP) di:
{url}

Terima kasih atas perhatian dan doa restunya. Sampai jumpa! 🙏`,
      },
      {
        id: "mandarin",
        title: "華語正式版 (Mandarin)",
        category: "mandarin",
        tag: "Bahasa Mandarin",
        description: "Undangan resmi berbahasa Mandarin penuh untuk sesepuh, qianxian, atau kerabat Tionghoa.",
        body: `*廣航佛堂 成立廿週年堂慶大典 • 尊榮邀請函*

恭請 貴賓尊鑒：
*{nama}*

叩謝天恩師德，廣航佛堂全體同修誠摯敬邀閣下撥冗蒞臨：
*廣航佛堂落成廿週年感恩大典*
同舟共濟度眾生 • 薪火相傳護慧命 (2006 — 2026)

📅 *日期：* {tanggal} • {waktu}
📍 *地點：* {tempat}

敬請點擊下方專屬數位邀請函連結確認出席（回函）：
{url}

誠摯期待您的光臨與祝願，共沐法喜天恩。
感恩合十。`,
      },
      {
        id: "bilingual",
        title: "Dwibahasa (ID + 中文)",
        category: "bilingual",
        tag: "Bilingual",
        description: "Kombinasi bahasa Indonesia dan Mandarin yang seimbang dan elegan.",
        body: `*廣航佛堂 成立廿週年堂慶 • Undangan Resmi 20 Tahun Kuang Hang Fo Thang*

Kepada Yth. / 恭請 尊鑒：
*{nama}*

叩謝天恩師德，誠摯敬邀您撥冗蒞臨感恩大典：
Dengan penuh rasa syukur atas Tian En Shi De, kami mengundang kehadiran Bapak/Ibu/Saudara/i dalam Malam Syukur 20 Tahun Kuang Hang Fo Thang.

📅 *Tanggal / 日期:* {tanggal}
⏰ *Waktu / 時間:* {waktu}
📍 *Tempat / 地點:* {tempat}

Silakan buka undangan digital & konfirmasi kehadiran:
敬請點擊專屬連結確認出席（回函）：
{url}

Terima kasih atas doa restu dan kehadirannya.
期待共沐法喜，感恩合十。🙏`,
      },
      {
        id: "muda",
        title: "Muda-Mudi & Alumni",
        category: "muda",
        tag: "Generasi Muda",
        description: "Sentuhan ceria untuk mengundang muda-mudi, alumni kebaktian, dan relawan vihara.",
        body: `Halo {nama}! ✨

Yuk kumpul bareng dan nostalgia di momen bersejarah:
*Malam Syukur 20 Tahun Gedung Kuang Hang Fo Thang (廣航佛堂)*
"Mengarungi Samudra Kebajikan • Menyalakan Pelita Jiwa"

📅 *Hari/Tanggal:* {tanggal}
⏰ *Waktu:* {waktu}
📍 *Tempat:* {tempat}

Buka undangan digital keren kamu dan isi RSVP di link ini ya:
{url}

Ditunggu banget kehadirannya, yuk ramaikan dan temu kangen bersama! 🌟🎉`,
      },
    ];
  }, [cms]);

  // Current active template body (either edited or original saved)
  const currentTemplate = useMemo(() => {
    const found = savedTemplates.find((t) => t.id === selectedTemplateId);
    return found || savedTemplates[0];
  }, [savedTemplates, selectedTemplateId]);

  // Synchronize custom text when template selection changes
  useEffect(() => {
    setCustomTemplateText(currentTemplate.body);
    setIsEditingTemplate(false);
  }, [selectedTemplateId, currentTemplate.body]);

  // Generate target URL for a given name
  const generateUrlForName = (name: string) => {
    const origin = currentOrigin || "";
    const clean = name.trim();
    if (!clean) return `${origin}/`;
    return `${origin}/?to=${encodeURIComponent(clean)}`;
  };

  // Replace placeholders in template
  const compileTemplate = (templateBody: string, targetName: string) => {
    const nameToUse = targetName.trim() || "Saudara Se-Dharma";
    const targetUrl = generateUrlForName(targetName);

    const isMandarin = selectedTemplateId === "mandarin";
    const dateText = isMandarin
      ? (cms.event?.dateTextZh || "2026年11月14日（星期六）")
      : (cms.event?.dateTextId || "Sabtu, 14 November 2026");
    const timeText = isMandarin
      ? (cms.event?.timeTextZh || "晚間19:00 WIB")
      : (cms.event?.timeTextId || "19.00 WIB s/d Selesai");
    const placeText = isMandarin
      ? (cms.event?.venueNameZh || "雅加達巴美拉 廣航佛堂")
      : (cms.event?.venueNameId || "Kuang Hang Fo Thang (Palmerah, Jakarta Barat)");

    return templateBody
      .replace(/{nama}/g, nameToUse)
      .replace(/{url}/g, targetUrl)
      .replace(/{tanggal}/g, dateText)
      .replace(/{waktu}/g, timeText)
      .replace(/{tempat}/g, placeText);
  };

  const compiledSingleMessage = useMemo(() => {
    const textToCompile = isEditingTemplate ? customTemplateText : currentTemplate.body;
    return compileTemplate(textToCompile, recipient);
  }, [isEditingTemplate, customTemplateText, currentTemplate.body, recipient, selectedTemplateId, cms]);

  const singlePersonalUrl = generateUrlForName(recipient);

  // Single Action Handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(singlePersonalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(compiledSingleMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2200);
  };

  const handleShareWhatsapp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(compiledSingleMessage)}`;
    window.open(waUrl, "_blank");
  };

  // Quick prefix injector
  const applyPrefix = (prefix: string) => {
    const current = recipient.trim();
    if (!current) {
      setRecipient(`${prefix} `);
    } else if (current.startsWith(prefix)) {
      // already has prefix
      return;
    } else {
      setRecipient(`${prefix} ${current}`);
    }
  };

  // Batch Names parsed
  const parsedBatchNames = useMemo(() => {
    return batchRawNames
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  }, [batchRawNames]);

  const handleBatchCopyLink = (name: string, index: number) => {
    const url = generateUrlForName(name);
    navigator.clipboard.writeText(url);
    setCopiedBatchIndex(index);
    setTimeout(() => setCopiedBatchIndex(null), 2000);
  };

  const handleBatchShareWa = (name: string) => {
    const textToCompile = isEditingTemplate ? customTemplateText : currentTemplate.body;
    const msg = compileTemplate(textToCompile, name);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const handleBatchCopyMsg = (name: string, index: number) => {
    const textToCompile = isEditingTemplate ? customTemplateText : currentTemplate.body;
    const msg = compileTemplate(textToCompile, name);
    navigator.clipboard.writeText(msg);
    setCopiedBatchIndex(index);
    setTimeout(() => setCopiedBatchIndex(null), 2000);
  };

  const handleCopyAllBatchLinks = () => {
    if (parsedBatchNames.length === 0) return;
    const lines = parsedBatchNames.map((name) => `${name}: ${generateUrlForName(name)}`);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedBatchAll(true);
    setTimeout(() => setCopiedBatchAll(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#140b0b] text-[#fbf5e8] selection:bg-[#c5983a] selection:text-black font-sans pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#c5983a_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#7c1818]/25 blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#180e0e]/90 border-b border-[#c5983a]/25 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-300 hover:text-[#e8c87b] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#c5983a]" />
            <span>Kembali ke Undangan Utama</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-[#c5983a] px-2.5 py-1 rounded-full bg-[#c5983a]/10 border border-[#c5983a]/20">
              Alat Publik • 20th Anniversary
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-stone-200 border border-white/15 transition cursor-pointer"
            >
              <span>Buka Web</span>
              <ExternalLink className="w-3 h-3 text-[#c5983a]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative px-4 sm:px-6 pt-10 pb-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7c1818]/50 border border-[#c5983a]/40 text-[#fbf5e8] text-xs font-serif tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#e8c87b]" />
          <span>Generator Tautan Undangan Personal</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-wide mb-3">
          Bagikan Undangan Resmi dengan Nama Kustom
        </h1>
        <p className="text-xs sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Pilih salah satu template ucapan yang telah tersimpan, ketikkan nama tamu atau keluarga, lalu salin tautan personal atau kirim langsung ke WhatsApp.
        </p>

        {/* Tab Switcher: Single vs Batch */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-black/50 border border-[#c5983a]/30 shadow-inner">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "single"
                ? "bg-gradient-to-r from-[#7c1818] to-[#9e2222] text-[#fbf5e8] shadow-md border border-[#c5983a]/40"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 text-[#e8c87b]" />
            <span>Satu Undangan (Personal)</span>
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "batch"
                ? "bg-gradient-to-r from-[#7c1818] to-[#9e2222] text-[#fbf5e8] shadow-md border border-[#c5983a]/40"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-[#e8c87b]" />
            <span>Buat Banyak Sekaligus (Batch)</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ============================================================== */}
        {/* TAB 1: SINGLE INVITATION GENERATOR                            */}
        {/* ============================================================== */}
        {activeTab === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Inputs & Template Chooser */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: Input Name */}
              <div className="p-6 rounded-3xl bg-[#1c1111] border border-[#c5983a]/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c5983a] text-black font-bold text-xs">
                      1
                    </span>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-[#fbf5e8]">
                      Ketik Nama Penerima Undangan
                    </h2>
                  </div>
                  {recipient && (
                    <button
                      onClick={() => setRecipient("")}
                      className="text-[11px] text-stone-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Contoh: Bpk. Budi Santoso & Keluarga"
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-[#c5983a]/30 focus:border-[#e8c87b] text-sm sm:text-base text-white placeholder-stone-500 outline-none transition shadow-inner"
                  />
                  <p className="mt-2 text-[11px] text-stone-400">
                    Nama ini akan tercantum di surat undangan digital dan membuka halaman dengan sambutan nama tersebut.
                  </p>
                </div>

                {/* Quick Prefix Buttons */}
                <div className="pt-1">
                  <span className="text-[11px] text-stone-400 block mb-2 font-medium">
                    Pintasan Awalan Cepat:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Bpk. / Ibu",
                      "Keluarga Besar",
                      "Saudara/i",
                      "Shixiong",
                      "Shijie",
                      "Teman-Teman",
                    ].map((prefix) => (
                      <button
                        key={prefix}
                        type="button"
                        onClick={() => applyPrefix(prefix)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-stone-300 transition cursor-pointer active:scale-95"
                      >
                        +{prefix}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 2: Choose Saved Template */}
              <div className="p-6 rounded-3xl bg-[#1c1111] border border-[#c5983a]/30 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c5983a] text-black font-bold text-xs">
                      2
                    </span>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-[#fbf5e8]">
                      Pilih Template Ucapan Tersimpan
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-[#e8c87b] border border-[#c5983a]/30 transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{isEditingTemplate ? "Tutup Editor" : "Kustomisasi Teks"}</span>
                  </button>
                </div>

                {/* Template Selector Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedTemplates.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                          isSelected
                            ? "bg-[#2d1212] border-[#c5983a] shadow-[0_0_15px_rgba(197,152,58,0.2)] ring-1 ring-[#c5983a]"
                            : "bg-black/40 border-stone-800 hover:border-stone-700 hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#c5983a]/15 text-[#e8c87b] border border-[#c5983a]/25">
                              {tpl.tag}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#e8c87b]" />
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#fbf5e8] mb-1">
                            {tpl.title}
                          </h3>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional In-Place Template Editor */}
                {isEditingTemplate && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Edit Kata-Kata Template (Khusus Sesi Ini)
                      </span>
                      <button
                        onClick={() => setCustomTemplateText(currentTemplate.body)}
                        className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset ke Asli</span>
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      value={customTemplateText}
                      onChange={(e) => setCustomTemplateText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-[#c5983a] outline-none font-mono leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-400">
                      <span>Tag Otomatis:</span>
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#e8c87b]">{"{nama}"}</code>
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#e8c87b]">{"{url}"}</code>
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#e8c87b]">{"{tanggal}"}</code>
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#e8c87b]">{"{waktu}"}</code>
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#e8c87b]">{"{tempat}"}</code>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: Generated Personal Link Preview Box */}
              <div className="p-5 rounded-3xl bg-[#1c1111] border border-[#c5983a]/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c5983a] text-black font-bold text-xs">
                      3
                    </span>
                    <h3 className="text-sm font-serif font-bold text-[#fbf5e8]">
                      Tautan Undangan Khusus (URL)
                    </h3>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c5983a]/20 hover:bg-[#c5983a]/30 border border-[#c5983a]/40 text-xs text-[#e8c87b] font-medium transition cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Link Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link Saja</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 overflow-hidden font-mono text-xs text-stone-300">
                  <span className="truncate">{singlePersonalUrl}</span>
                  <Link
                    href={singlePersonalUrl || "/"}
                    target="_blank"
                    className="shrink-0 text-stone-400 hover:text-white transition"
                    title="Uji buka link di tab baru"
                  >
                    <ExternalLink className="w-4 h-4 text-[#c5983a]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Live WhatsApp Preview & Action Buttons */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl bg-[#0f1f17] border border-emerald-500/30 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-serif font-bold text-sm text-emerald-200">
                      Pratinjau Pesan WhatsApp
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Preview
                  </span>
                </div>

                {/* WhatsApp Chat Balloon Mockup */}
                <div className="relative p-4 rounded-2xl bg-[#005c4b] text-white text-xs font-sans leading-relaxed shadow-xl border border-emerald-300/20 max-h-[420px] overflow-y-auto whitespace-pre-wrap select-text">
                  <div className="text-[10px] text-emerald-200/70 mb-2 font-mono">
                    Kepada: {recipient.trim() || "Saudara Se-Dharma"}
                  </div>
                  {compiledSingleMessage}
                  <div className="mt-2 text-right text-[10px] text-emerald-200/60 flex items-center justify-end gap-1 font-mono">
                    <span>Sekarang</span>
                    <Check className="w-3 h-3 text-sky-300" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  {/* WhatsApp Direct Share Button */}
                  <button
                    onClick={handleShareWhatsapp}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Bagikan Langsung via WhatsApp</span>
                  </button>

                  {/* Copy Full WhatsApp Text */}
                  <button
                    onClick={handleCopyMessage}
                    className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {copiedMsg ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Pesan WhatsApp Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-300" />
                        <span>Salin Teks Lengkap WhatsApp</span>
                      </>
                    )}
                  </button>

                  {/* Test Open Link */}
                  <Link
                    href={singlePersonalUrl || "/"}
                    target="_blank"
                    className="w-full py-2.5 px-4 rounded-2xl bg-transparent hover:bg-white/5 border border-white/10 text-stone-400 hover:text-stone-200 text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#c5983a]" />
                    <span>Lihat Halaman Tamu (Uji Buka Amplop)</span>
                  </Link>
                </div>
              </div>

              {/* Helpful Tips Card */}
              <div className="p-4 rounded-2xl bg-[#1c1111]/70 border border-white/10 text-[11px] text-stone-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#e8c87b] font-medium">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Petunjuk Pembagian:</span>
                </div>
                <p className="leading-relaxed">
                  Setelah menyalin pesan, Anda dapat langsung menempelkannya (paste) di kolom percakapan WhatsApp kerabat atau grup. Nama tamu akan langsung muncul di segel amplop resmi saat tautan dibuka.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: BATCH INVITATION GENERATOR (MASSAL)                    */}
        {/* ============================================================== */}
        {activeTab === "batch" && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1111] border border-[#c5983a]/30 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ListPlus className="w-5 h-5 text-[#c5983a]" />
                    <h2 className="text-lg font-serif font-bold text-white">
                      Buat Banyak Undangan Sekaligus (Batch List)
                    </h2>
                  </div>
                  <p className="text-xs text-stone-400">
                    Masukkan daftar nama tamu (satu nama per baris) untuk membuat tautan personal secara instan.
                  </p>
                </div>

                {parsedBatchNames.length > 0 && (
                  <button
                    onClick={handleCopyAllBatchLinks}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5983a] hover:bg-[#d8ab48] text-black font-bold text-xs transition cursor-pointer shrink-0"
                  >
                    {copiedBatchAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedBatchAll ? "Semua Disalin!" : `Salin Semua (${parsedBatchNames.length} Link)`}</span>
                  </button>
                )}
              </div>

              {/* Template Selector for Batch */}
              <div>
                <label className="block text-xs uppercase font-medium tracking-wider text-stone-300 mb-2">
                  Template yang Digunakan untuk Batch:
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif transition cursor-pointer ${
                        selectedTemplateId === tpl.id
                          ? "bg-[#7c1818] border border-[#c5983a] text-white font-bold"
                          : "bg-white/5 border border-white/10 text-stone-400 hover:text-white"
                      }`}
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea for Bulk Names */}
              <div>
                <label className="block text-xs uppercase font-medium tracking-wider text-stone-300 mb-1.5">
                  Daftar Nama Tamu (Satu Nama Per Baris)
                </label>
                <textarea
                  rows={6}
                  value={batchRawNames}
                  onChange={(e) => setBatchRawNames(e.target.value)}
                  placeholder={"Contoh:\nBpk. Felix Salim\nIbu Linda & Keluarga\nSdr. Hendra Tan\nKeluarga Besar Vihara Maitreya"}
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-stone-800 focus:border-[#c5983a] text-xs sm:text-sm text-white placeholder-stone-600 outline-none font-sans leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                  <span>Terdeteksi: <b className="text-[#e8c87b]">{parsedBatchNames.length}</b> nama</span>
                  {batchRawNames && (
                    <button
                      onClick={() => setBatchRawNames("")}
                      className="text-stone-400 hover:text-rose-400"
                    >
                      Kosongkan Daftar
                    </button>
                  )}
                </div>
              </div>

              {/* Rendered Batch Table / List */}
              {parsedBatchNames.length > 0 ? (
                <div className="space-y-3 pt-4 border-t border-stone-800">
                  <h3 className="text-xs uppercase tracking-wider text-[#e8c87b] font-semibold">
                    Daftar Tautan Personal Siap Kirim:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {parsedBatchNames.map((name, index) => {
                      const url = generateUrlForName(name);
                      const isCopied = copiedBatchIndex === index;

                      return (
                        <div
                          key={index}
                          className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#c5983a]/40 transition flex flex-col justify-between gap-3 text-left"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-serif font-bold text-white truncate">
                                {name}
                              </span>
                              <span className="text-[10px] font-mono text-stone-500">
                                #{index + 1}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-stone-400 truncate">
                              {url}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                            <button
                              onClick={() => handleBatchShareWa(name)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-[11px] font-semibold transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Kirim WA</span>
                            </button>

                            <button
                              onClick={() => handleBatchCopyMsg(name, index)}
                              className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                              title="Salin Teks WhatsApp"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? "Disalin" : "Teks"}</span>
                            </button>

                            <button
                              onClick={() => handleBatchCopyLink(name, index)}
                              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                              title="Salin Link Saja"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Link</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-black/30 border border-dashed border-stone-800 text-stone-500 text-xs">
                  Tempelkan nama-nama tamu di atas untuk melihat daftar tautan otomatis.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-stone-500">
        <p className="font-serif">
          廣航佛堂 Kuang Hang Fo Thang • Peringatan 20 Tahun Peresmian Gedung (2006 — 2026)
        </p>
        <p className="text-[11px] text-stone-600 mt-1">
          Palmerah, Jakarta Barat • Tian En Shi De (天恩師德)
        </p>
      </footer>
    </div>
  );
}

export default function InviteClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#140b0b] flex items-center justify-center text-[#c5983a]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#c5983a] border-t-transparent animate-spin" />
            <span className="text-xs font-serif tracking-widest text-stone-400">
              Memuat Generator Undangan...
            </span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <CmsProvider>
          <InviteGeneratorContent />
        </CmsProvider>
      </LanguageProvider>
    </Suspense>
  );
}
