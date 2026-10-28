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
  Edit,
  Plus,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CreditCard,
  MapPin,
  Calendar,
  Save,
  AlertCircle,
  Layers,
  HelpCircle,
  X,
  ExternalLink,
  Compass,
  Navigation,
  FolderCheck,
  CheckSquare,
  Square,
} from "lucide-react";
import { WishItem, initialWishes } from "@/data/defaultWishes";
import { SiteCmsConfig, MilestoneItem, GalleryPhotoItem } from "@/types/cms";
import { defaultCms } from "@/data/defaultCms";
import { sortMilestonesByYear } from "@/data/history";
import ImageUploadField from "@/components/ImageUploadField";

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "rsvp" | "guests" | "cms_text" | "cms_media" | "share"
  >("rsvp");

  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // 1. RSVP & Wishes state
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hadir" | "ragu" | "tidak_hadir">("all");
  // Wish Modals (CRUD)
  const [showAddWishModal, setShowAddWishModal] = useState(false);
  const [editingWish, setEditingWish] = useState<WishItem | null>(null);
  const [wishForm, setWishForm] = useState({
    name: "",
    status: "hadir" as "hadir" | "tidak_hadir" | "ragu",
    guests: 1,
    message: "",
  });

  // 2. Guests List state
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [guestCategory, setGuestCategory] = useState("Semua");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("Umat");
  const [bulkGuestText, setBulkGuestText] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // 3. CMS Configuration state
  const [cmsConfig, setCmsConfig] = useState<SiteCmsConfig>(defaultCms);
  const [isSavingCms, setIsSavingCms] = useState(false);

  // Gallery & Milestone Modals
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(null);
  const [photoForm, setPhotoForm] = useState<GalleryPhotoItem>({
    id: "",
    src: "",
    title: "",
    chineseTitle: "",
    category: "kebersamaan",
  });

  // Supabase Media Library Bulk Import state
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);
  const [supabaseMediaList, setSupabaseMediaList] = useState<
    { name: string; url: string; size: number; created_at?: string }[]
  >([]);
  const [isLoadingMediaList, setIsLoadingMediaList] = useState(false);
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);
  const [importCategory, setImportCategory] = useState<"kebersamaan" | "kegiatan" | "sejarah">("kebersamaan");

  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<{ item: MilestoneItem; index: number } | null>(null);
  const [milestoneForm, setMilestoneForm] = useState<MilestoneItem>({
    year: "2026",
    title: "",
    chineseTitle: "",
    location: "Palmerah, Jakarta Barat",
    chineseLocation: "雅加達巴美拉",
    description: "",
    chineseDescription: "",
    highlight: "",
    chineseHighlight: "",
    image: "",
  });

  // 4. Share Generator state
  const [recipient, setRecipient] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const DEFAULT_PIN = "guanghang2026";

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setSaveErrorMsg(msg);
      setTimeout(() => setSaveErrorMsg(null), 4000);
    } else {
      setSaveSuccessMsg(msg);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

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
      loadAllData();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("panitia_auth");
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch RSVPs
      const resRsvp = await fetch("/api/rsvp", { cache: "no-store" });
      const jsonRsvp = await resRsvp.json();
      if (jsonRsvp.success && Array.isArray(jsonRsvp.data)) {
        setWishes(jsonRsvp.data);
      } else {
        setWishes(initialWishes);
      }

      // 2. Fetch Guests
      const resGuests = await fetch("/api/guests", { cache: "no-store" });
      const jsonGuests = await resGuests.json();
      if (jsonGuests.success && Array.isArray(jsonGuests.data)) {
        setGuests(jsonGuests.data);
      }

      // 3. Fetch CMS settings from Supabase
      const resCms = await fetch("/api/cms", { cache: "no-store" });
      const jsonCms = await resCms.json();
      if (jsonCms.success && jsonCms.data) {
        const sortedData: SiteCmsConfig = {
          ...jsonCms.data,
          milestones: sortMilestonesByYear(jsonCms.data.milestones || []),
        };
        setCmsConfig(sortedData);
      }
    } catch (e) {
      console.error("loadAllData error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Save CMS changes to Supabase
  const handleSaveCms = async (customConfig?: SiteCmsConfig) => {
    const rawConfig = customConfig || cmsConfig;
    const configToSave: SiteCmsConfig = {
      ...rawConfig,
      milestones: sortMilestonesByYear(rawConfig.milestones || []),
    };
    setIsSavingCms(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const sortedData: SiteCmsConfig = {
          ...json.data,
          milestones: sortMilestonesByYear(json.data.milestones || []),
        };
        setCmsConfig(sortedData);
        showNotification("Pengaturan berhasil disimpan ke Supabase!");
      } else {
        showNotification(json.error || "Gagal menyimpan ke Supabase.", true);
      }
    } catch (err: any) {
      showNotification("Terjadi kesalahan jaringan saat menyimpan.", true);
    } finally {
      setIsSavingCms(false);
    }
  };

  // ==================== CRUD UCAPAN / RSVP ====================
  const handleAddWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name.trim()) {
      alert("Nama pengucap wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wishForm.name.trim(),
          status: wishForm.status,
          guests: wishForm.guests,
          message: wishForm.message.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification("Ucapan berhasil ditambahkan ke Supabase!");
        setShowAddWishModal(false);
        setWishForm({ name: "", status: "hadir", guests: 1, message: "" });
        loadAllData();
      } else {
        alert(json.error || "Gagal menambah ucapan.");
      }
    } catch (e) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const handleEditWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWish) return;
    try {
      const res = await fetch("/api/rsvp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingWish.id,
          name: wishForm.name.trim(),
          status: wishForm.status,
          guests: wishForm.guests,
          message: wishForm.message.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification("Ucapan berhasil diperbarui di Supabase!");
        setEditingWish(null);
        loadAllData();
      } else {
        alert(json.error || "Gagal memperbarui ucapan.");
      }
    } catch (e) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const handleDeleteWish = async (id: string, name: string) => {
    if (!confirm(`Hapus ucapan dan konfirmasi dari "${name}"?`)) return;
    try {
      const res = await fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showNotification("Ucapan berhasil dihapus dari Supabase!");
        setWishes((prev) => prev.filter((w) => w.id !== id));
      } else {
        alert(json.error || "Gagal menghapus ucapan.");
      }
    } catch (e) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // ==================== TAMU UNDANGAN ====================
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
        showNotification("Tamu undangan berhasil ditambahkan!");
        await loadAllData();
      } else {
        alert(json.error || "Gagal menambahkan tamu.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingGuest(false);
    }
  };

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
        showNotification(`Berhasil menambahkan ${names.length} tamu massal!`);
        await loadAllData();
      } else {
        alert(json.error || "Gagal menambahkan tamu massal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus ${name} dari daftar tamu?`)) return;
    try {
      const res = await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showNotification("Tamu berhasil dihapus!");
        setGuests((prev) => prev.filter((g) => g.id !== id));
      } else {
        alert(json.error || "Gagal menghapus tamu.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // ==================== KELOLA GALERI FOTO ====================
  const handleSavePhoto = () => {
    if (!photoForm.src) {
      alert("Foto atau URL gambar wajib diisi.");
      return;
    }
    const updatedGallery = [...cmsConfig.gallery];
    if (editingPhoto) {
      const idx = updatedGallery.findIndex((p) => p.id === editingPhoto.id);
      if (idx !== -1) {
        updatedGallery[idx] = { ...photoForm, id: editingPhoto.id };
      }
    } else {
      updatedGallery.push({
        ...photoForm,
        id: `photo-${Date.now()}`,
      });
    }

    const newConfig = { ...cmsConfig, gallery: updatedGallery };
    setCmsConfig(newConfig);
    handleSaveCms(newConfig);
    setShowAddPhotoModal(false);
    setEditingPhoto(null);
    setPhotoForm({ id: "", src: "", title: "", chineseTitle: "", category: "kebersamaan" });
  };

  const handleDeletePhoto = (id: number | string) => {
    if (!confirm("Hapus foto ini dari Galeri Dokumentasi?")) return;
    const updatedGallery = cmsConfig.gallery.filter((p) => p.id !== id);
    const newConfig = { ...cmsConfig, gallery: updatedGallery };
    setCmsConfig(newConfig);
    handleSaveCms(newConfig);
  };

  // ==================== PUSTAKA MEDIA SUPABASE (BULK GALLERY) ====================
  const fetchSupabaseMedia = async () => {
    setIsLoadingMediaList(true);
    try {
      const res = await fetch("/api/upload", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSupabaseMediaList(json.data);
      }
    } catch (e) {
      console.error("fetchSupabaseMedia error:", e);
    } finally {
      setIsLoadingMediaList(false);
    }
  };

  const handleToggleSelectMedia = (url: string) => {
    setSelectedMediaUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleSelectAllMedia = () => {
    if (selectedMediaUrls.length === supabaseMediaList.length) {
      setSelectedMediaUrls([]);
    } else {
      setSelectedMediaUrls(supabaseMediaList.map((m) => m.url));
    }
  };

  const handleImportMediaToGallery = () => {
    if (selectedMediaUrls.length === 0) return;
    const newItems: GalleryPhotoItem[] = selectedMediaUrls.map((url, i) => {
      const found = supabaseMediaList.find((m) => m.url === url);
      const rawName = found
        ? found.name.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "")
        : `Foto ${i + 1}`;
      const title = rawName.replace(/_/g, " ").trim();
      return {
        id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        src: url,
        title: title || "Dokumentasi Kuang Hang Fo Thang",
        chineseTitle: "廣航佛堂道氣剪影",
        category: importCategory,
      };
    });

    const updatedGallery = [...cmsConfig.gallery, ...newItems];
    const newConfig = { ...cmsConfig, gallery: updatedGallery };
    setCmsConfig(newConfig);
    handleSaveCms(newConfig);
    setShowMediaLibraryModal(false);
    setSelectedMediaUrls([]);
    showNotification(`Berhasil menambahkan ${newItems.length} foto ke Galeri dan disimpan ke Supabase!`);
  };

  // ==================== KELOLA TIMELINE MILESTONE ====================
  const handleSaveMilestone = () => {
    if (!milestoneForm.year || !milestoneForm.title) {
      alert("Tahun dan judul kilas sejarah wajib diisi.");
      return;
    }
    const currentList = sortMilestonesByYear(cmsConfig.milestones || []);
    let updatedMilestones: MilestoneItem[];
    if (editingMilestone && editingMilestone.index >= 0) {
      updatedMilestones = [...currentList];
      updatedMilestones[editingMilestone.index] = milestoneForm;
    } else {
      updatedMilestones = [...currentList, milestoneForm];
    }

    const sortedMilestones = sortMilestonesByYear(updatedMilestones);
    const newConfig = { ...cmsConfig, milestones: sortedMilestones };
    setCmsConfig(newConfig);
    handleSaveCms(newConfig);
    setShowAddMilestoneModal(false);
    setEditingMilestone(null);
    setMilestoneForm({
      year: "2026",
      title: "",
      chineseTitle: "",
      location: "Palmerah, Jakarta Barat",
      chineseLocation: "雅加達巴美拉",
      description: "",
      chineseDescription: "",
      highlight: "",
      chineseHighlight: "",
      image: "",
    });
  };

  const handleDeleteMilestone = (index: number) => {
    if (!confirm("Hapus milestone kilas sejarah ini?")) return;
    const currentList = sortMilestonesByYear(cmsConfig.milestones || []);
    const updatedMilestones = currentList.filter((_, i) => i !== index);
    const sortedMilestones = sortMilestonesByYear(updatedMilestones);
    const newConfig = { ...cmsConfig, milestones: sortedMilestones };
    setCmsConfig(newConfig);
    handleSaveCms(newConfig);
  };

  // ==================== WHATSAPP SHARE GENERATOR ====================
  const renderShareMessage = (targetName: string, targetUrl: string) => {
    const template = cmsConfig.shareMessage.template || defaultCms.shareMessage.template;
    return template
      .replace(/{nama}/g, targetName || "Bapak / Ibu / Saudara/i")
      .replace(/{url}/g, targetUrl)
      .replace(/{tanggal}/g, cmsConfig.event.dateTextId)
      .replace(/{waktu}/g, cmsConfig.event.timeTextId)
      .replace(/{tempat}/g, cmsConfig.event.venueNameId);
  };

  const generatedUrl = recipient.trim()
    ? `${currentOrigin}/?to=${encodeURIComponent(recipient.trim())}`
    : `${currentOrigin}/`;

  const dynamicWhatsappMessage = renderShareMessage(recipient.trim(), generatedUrl);

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
      link.setAttribute("download", `Daftar_Tamu_KuangHang_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // Calculations
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

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase());
    const matchesCat = guestCategory === "Semua" || g.category === guestCategory;
    return matchesSearch && matchesCat;
  });

  // If Not Authenticated -> Show Password Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1c0808] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#2a0e0e] border border-amber-500/40 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 text-amber-300">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-amber-200 mt-2 mb-2">
            CMS Panitia Kuang Hang Fo Thang
          </h1>
          <p className="text-xs text-stone-300 mb-6">
            Portal pengelolaan website resmi, kustomisasi teks & foto, CRUD ucapan, dan manajemen tamu berbasis Supabase.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN Akses Panitia"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/40 focus:border-amber-400 text-center text-white tracking-widest placeholder-stone-400 outline-none transition text-sm"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  PIN salah. Silakan hubungi panitia administrator.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm tracking-wide shadow-lg transition cursor-pointer"
            >
              Masuk ke Backend CMS
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-amber-300/80 hover:text-amber-200 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#1f0909]/95 backdrop-blur border-b border-amber-500/30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/20 transition cursor-pointer"
              title="Lihat Website Utama"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-chinese text-sm font-bold text-amber-300">廣航佛堂</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Supabase CMS
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-serif font-bold text-white">
                Panitia Control Center (CMS & Database)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-stone-200 border border-white/10 transition cursor-pointer"
              title="Segarkan Data dari Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-300 border border-amber-400/30 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Web</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-xs text-red-300 border border-red-500/30 transition cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* CMS Notification Bar */}
        {saveSuccessMsg && (
          <div className="max-w-7xl mx-auto mt-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
        {saveErrorMsg && (
          <div className="max-w-7xl mx-auto mt-2 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{saveErrorMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "rsvp"
                ? "bg-amber-600 text-stone-950 shadow-md"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RSVP & Doa ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("guests")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "guests"
                ? "bg-amber-600 text-stone-950 shadow-md"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Daftar Tamu ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cms_text")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "cms_text"
                ? "bg-amber-600 text-stone-950 shadow-md"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>CMS Teks & Acara</span>
          </button>

          <button
            onClick={() => setActiveTab("cms_media")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "cms_media"
                ? "bg-amber-600 text-stone-950 shadow-md"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>CMS Foto & Galeri ({cmsConfig.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("share")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "share"
                ? "bg-amber-600 text-stone-950 shadow-md"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Kustomisasi Share WA</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* ============================================================== */}
        {/* TAB 1: RSVP & BUKU DOA (CRUD LENGKAP)                          */}
        {/* ============================================================== */}
        {activeTab === "rsvp" && (
          <div className="space-y-6">
            {/* Quick Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">
                  Total Tanggapan
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                  {wishes.length}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Umat / Keluarga</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-emerald-400 uppercase tracking-wider block mb-1">
                  Konfirmasi Hadir
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                  {wishes.filter((w) => w.status === "hadir").length}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Keluarga</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1">
                  Estimasi Tamu Hadir
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-200">
                  {totalGuestsHadir}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Jiwa / Orang</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-rose-400 uppercase tracking-wider block mb-1">
                  Tidak Hadir / Ragu
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-300">
                  {wishes.filter((w) => w.status !== "hadir").length}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Keluarga</span>
              </div>
            </div>

            {/* Action Bar & Filters */}
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau isi untaian doa..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 outline-none shrink-0"
                >
                  <option value="all">Semua Status</option>
                  <option value="hadir">Pasti Hadir</option>
                  <option value="ragu">Masih Ragu</option>
                  <option value="tidak_hadir">Berhalangan</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setWishForm({ name: "", status: "hadir", guests: 1, message: "" });
                    setShowAddWishModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md flex-1 sm:flex-initial"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Ucapan Manual</span>
                </button>

                <button
                  onClick={exportCsv}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition cursor-pointer flex-1 sm:flex-initial"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh CSV</span>
                </button>
              </div>
            </div>

            {/* Wishes List (Cards / Rows) */}
            <div className="space-y-3">
              {filteredWishes.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-stone-900/50 border border-stone-800 text-stone-500 text-xs">
                  Tidak ada data ucapan yang sesuai pencarian.
                </div>
              ) : (
                filteredWishes.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-amber-200">
                          {item.name}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === "hadir"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                              : item.status === "ragu"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                              : "bg-rose-950 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {item.status === "hadir"
                            ? `Hadir (${item.guests} Jiwa)`
                            : item.status === "ragu"
                            ? "Masih Ragu"
                            : "Tidak Hadir"}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {item.timestamp || "-"}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 font-serif italic leading-relaxed">
                        &ldquo;{item.message || "Hadir mendampingi perayaan."}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingWish(item);
                          setWishForm({
                            name: item.name,
                            status: item.status,
                            guests: item.guests || 1,
                            message: item.message || "",
                          });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium border border-stone-700 transition cursor-pointer"
                        title="Edit Ucapan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteWish(item.id, item.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium border border-red-500/30 transition cursor-pointer"
                        title="Hapus Ucapan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TAMU UNDANGAN (GUESTS)                                  */}
        {/* ============================================================== */}
        {activeTab === "guests" && (
          <div className="space-y-6">
            {/* Guest Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-stone-400 block mb-1">Total Tamu Terdata</span>
                <span className="text-2xl font-serif font-bold text-amber-300">{guests.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-emerald-400 block mb-1">Sudah Buka Web</span>
                <span className="text-2xl font-serif font-bold text-emerald-400">
                  {guests.filter((g) => g.has_opened).length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-amber-400 block mb-1">Konfirmasi Hadir</span>
                <span className="text-2xl font-serif font-bold text-amber-300">
                  {guests.filter((g) => g.rsvp_status === "hadir").length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] text-stone-400 block mb-1">Belum Membuka</span>
                <span className="text-2xl font-serif font-bold text-stone-400">
                  {guests.filter((g) => !g.has_opened).length}
                </span>
              </div>
            </div>

            {/* Add Guest Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Single Add */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Tambah Tamu Personal</span>
                </h3>

                <form onSubmit={handleAddSingleGuest} className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                      Nama Tamu / Keluarga
                    </label>
                    <input
                      type="text"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder="Contoh: Lim TC Felix Salim"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                      Kategori Tamu
                    </label>
                    <select
                      value={newGuestCategory}
                      onChange={(e) => setNewGuestCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none"
                    >
                      <option value="Umat">Umat Kuang Hang</option>
                      <option value="Pengurus">Pengurus / Panitia</option>
                      <option value="Tien Chuan She">Tien Chuan She / Pendahulu</option>
                      <option value="Tamu Kehormatan">Tamu Kehormatan</option>
                      <option value="Umum">Umum / Simpatisan</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingGuest || !newGuestName.trim()}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    {isAddingGuest ? "Menyimpan ke Supabase..." : "Simpan Tamu"}
                  </button>
                </form>

                <div className="pt-2 border-t border-stone-800">
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition cursor-pointer"
                  >
                    + Impor Tamu Massal (Bulk Text)
                  </button>
                </div>
              </div>

              {/* Guests Table */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="relative flex-1 min-w-[160px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Cari nama tamu..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV Tamu</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {filteredGuests.length === 0 ? (
                    <p className="text-stone-500 text-xs text-center py-8">Belum ada tamu terdata.</p>
                  ) : (
                    filteredGuests.map((g) => {
                      const guestUrl = `${currentOrigin}/?to=${encodeURIComponent(g.name)}`;
                      const waText = renderShareMessage(g.name, guestUrl);
                      return (
                        <div
                          key={g.id}
                          className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-white font-medium truncate block">{g.name}</strong>
                              <span className="text-[10px] text-stone-500 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                                {g.category || "Umum"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                              <span>{g.has_opened ? "🟢 Sudah Buka Web" : "⚪ Belum Buka"}</span>
                              <span>•</span>
                              <span
                                className={
                                  g.rsvp_status === "hadir"
                                    ? "text-emerald-400 font-medium"
                                    : "text-stone-500"
                                }
                              >
                                {g.rsvp_status === "hadir" ? "Pasti Hadir" : "Menunggu RSVP"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => copyUrl(guestUrl, g.id)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition"
                              title="Salin Tautan Personal"
                            >
                              {copiedGuestId === g.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => shareViaWhatsapp(waText)}
                              className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition"
                              title="Kirim Undangan WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteGuest(g.id, g.name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition"
                              title="Hapus Tamu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CMS TEKS & DETAIL ACARA                                 */}
        {/* ============================================================== */}
        {activeTab === "cms_text" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-amber-300">
                  Pengaturan Teks & Konten Acara
                </h2>
                <p className="text-xs text-stone-400">
                  Ubah teks navigasi, kartu sampul landscape, sambutan peringatan, wejangan suci, jadwal acara, lokasi, dan nomor rekening dana kebajikan.
                </p>
              </div>

              <button
                onClick={() => handleSaveCms()}
                disabled={isSavingCms}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingCms ? "Menyimpan ke Supabase..." : "Simpan Teks ke Supabase"}</span>
              </button>
            </div>

            {/* Section 1: Header & Navigasi (Navbar) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Header & Bilah Navigasi (Navbar)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Teks nama wadah dan subjudul yang tampil di bilah navigasi atas (desktop dan ponsel).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Nama Fo Thang (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.navbar?.brandTitleId || ""}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        navbar: { ...cmsConfig.navbar, brandTitleId: e.target.value },
                      })
                    }
                    placeholder="Kuang Hang Fo Thang"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Nama Fo Thang (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.navbar?.brandTitleZh || ""}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        navbar: { ...cmsConfig.navbar, brandTitleZh: e.target.value },
                      })
                    }
                    placeholder="廣航佛堂"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Subjudul Header (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.navbar?.brandSubtitleId || ""}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        navbar: { ...cmsConfig.navbar, brandSubtitleId: e.target.value },
                      })
                    }
                    placeholder="Peringatan 20 Tahun Gedung"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Subjudul Header (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.navbar?.brandSubtitleZh || ""}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        navbar: { ...cmsConfig.navbar, brandSubtitleZh: e.target.value },
                      })
                    }
                    placeholder="成立廿週年堂慶"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Sampul Amplop Landscape (Hero Cover) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sampul Amplop Landscape (Hero Cover)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Kartu undangan bergaya landscape folio yang tampil saat pertama kali tamu membuka link.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Pita Lencana Atas (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.badgeId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, badgeId: e.target.value },
                      })
                    }
                    placeholder="Peringatan 20 Tahun Gedung"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Pita Lencana Atas (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.badgeZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, badgeZh: e.target.value },
                      })
                    }
                    placeholder="廿週年堂慶紀念"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Monograf Sampul (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.titleZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, titleZh: e.target.value },
                        hero: { ...cmsConfig.hero, mainTitleZh: e.target.value },
                      })
                    }
                    placeholder="廣航佛堂"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-base"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Subjudul / Tahun Monograf (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.titleId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, titleId: e.target.value },
                      })
                    }
                    placeholder="Kuang Hang Fo Thang • 2006 — 2026"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Slogan / Filosofi Sampul (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.subtitleId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, subtitleId: e.target.value },
                      })
                    }
                    placeholder="Mengarungi Samudra Kebajikan, Menyalakan Pelita Kebijaksanaan"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Slogan / Filosofi Sampul (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.subtitleZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, subtitleZh: e.target.value },
                      })
                    }
                    placeholder="同舟共濟度眾生 • 薪火相傳護慧命"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Salam Penghormatan Tamu (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.guestPrefixId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, guestPrefixId: e.target.value },
                      })
                    }
                    placeholder="Yth. Tamu Undangan Terkasih"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Salam Penghormatan Tamu (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.guestPrefixZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, guestPrefixZh: e.target.value },
                      })
                    }
                    placeholder="恭請 貴賓尊鑒"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Teks Ajakan Undangan (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.inviteTextId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, inviteTextId: e.target.value },
                      })
                    }
                    placeholder="Dengan penuh hormat mengundang kehadiran Anda dalam malam syukur bersama."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Teks Ajakan Undangan (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.inviteTextZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, inviteTextZh: e.target.value },
                      })
                    }
                    placeholder="謹代表廣航佛堂全體道親，誠摯敬邀閣下撥冗蒞臨，同沾法喜。"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Teks Tombol Buka Undangan (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.buttonTextId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, buttonTextId: e.target.value },
                      })
                    }
                    placeholder="Buka Undangan Resmi"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Teks Tombol Buka Undangan (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.buttonTextZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, buttonTextZh: e.target.value },
                      })
                    }
                    placeholder="恭啟尊榮邀請函"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Petunjuk Tombol Buka (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.buttonSubtextId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, buttonSubtextId: e.target.value },
                      })
                    }
                    placeholder="Sentuh tombol untuk membuka surat undangan resmi"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Petunjuk Tombol Buka (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.cover.buttonSubtextZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        cover: { ...cmsConfig.cover, buttonSubtextZh: e.target.value },
                      })
                    }
                    placeholder="點擊按鈕開啟正式邀請函"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Hero Section & Sambutan Peringatan (Halaman Utama) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hero Section & Sambutan Peringatan (Halaman Utama)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pengaturan lengkap untuk tajuk editorial, slogan, sambutan, plat foto altar, dan hitung mundur di halaman utama.
                </p>
              </div>

              {/* Sub-block A: Editorial Top Banner */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  1. Pita Editorial Atas (Top Banner)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Stempel Pojok Kiri (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.topBannerSealZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, topBannerSealZh: e.target.value },
                        })
                      }
                      placeholder="天恩師德"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Teks Tajuk (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.topBannerId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, topBannerId: e.target.value },
                        })
                      }
                      placeholder="Peringatan 20 Tahun Gedung (2006 — 2026)"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Teks Tajuk (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.topBannerZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, topBannerZh: e.target.value },
                        })
                      }
                      placeholder="落成廿週年堂慶大典"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Kota Pelaksanaan (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.cityId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, cityId: e.target.value },
                        })
                      }
                      placeholder="Jakarta"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Kota Pelaksanaan (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.cityZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, cityZh: e.target.value },
                        })
                      }
                      placeholder="雅加達"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Badge Tanggal Tajuk
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.eventDateBadge}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, eventDateBadge: e.target.value },
                        })
                      }
                      placeholder="14 November 2026"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-block B: Main Slogan & Title */}
              <div className="space-y-3 pt-2 border-t border-stone-800/60">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  2. Slogan & Judul Peringatan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Slogan Pembuka (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.sloganId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, sloganId: e.target.value },
                        })
                      }
                      placeholder="Dua Dasawarsa Menyalakan Pelita Kebajikan"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Slogan Pembuka (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.sloganZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, sloganZh: e.target.value },
                        })
                      }
                      placeholder="廿載同修 • 慧命永續"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Besar (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.mainTitleId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, mainTitleId: e.target.value },
                        })
                      }
                      placeholder="Peringatan 20 Tahun Peresmian Gedung"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Tema (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.themeZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, themeZh: e.target.value },
                        })
                      }
                      placeholder="成立廿週年堂慶紀念 (2006 — 2026)"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-block C: Quote & Story */}
              <div className="space-y-3 pt-2 border-t border-stone-800/60">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  3. Untaian Puisi & Narasi Pembuka
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Kutipan Puisi Peringatan (Indonesia)
                    </label>
                    <textarea
                      rows={2}
                      value={cmsConfig.hero.quoteId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, quoteId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Kutipan Puisi Peringatan (Mandarin)
                    </label>
                    <textarea
                      rows={2}
                      value={cmsConfig.hero.quoteZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, quoteZh: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Paragraf Sambutan Singkat (Indonesia)
                    </label>
                    <textarea
                      rows={3}
                      value={cmsConfig.hero.storyParagraphId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, storyParagraphId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Paragraf Sambutan Singkat (Mandarin)
                    </label>
                    <textarea
                      rows={2}
                      value={cmsConfig.hero.storyParagraphZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, storyParagraphZh: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-block D: Guest Honor Card */}
              <div className="space-y-3 pt-2 border-t border-stone-800/60">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  4. Kartu Penghormatan Tamu (Honor Card)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Kartu Tamu (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.guestHonorTitleId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorTitleId: e.target.value },
                        })
                      }
                      placeholder="SURAT PENGHORMATAN TAMU UNDANGAN"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Kartu Tamu (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.guestHonorTitleZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorTitleZh: e.target.value },
                        })
                      }
                      placeholder="貴賓敬邀函"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Stempel Kartu Tamu (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.guestHonorSealZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorSealZh: e.target.value },
                        })
                      }
                      placeholder="同沾法喜"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Salam Penghormatan (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.guestHonorGreetingId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorGreetingId: e.target.value },
                        })
                      }
                      placeholder="Kepada Yth. Bapak / Ibu / Saudara/i:"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Pesan Kehormatan Tamu (Indonesia)
                    </label>
                    <textarea
                      rows={2}
                      value={cmsConfig.hero.guestHonorMessageId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorMessageId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Pesan Kehormatan Tamu (Mandarin)
                    </label>
                    <textarea
                      rows={2}
                      value={cmsConfig.hero.guestHonorMessageZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, guestHonorMessageZh: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-block E: Archival Photo Plate */}
              <div className="space-y-3 pt-2 border-t border-stone-800/60">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  5. Keterangan Plat Foto Altar (Archival Plate)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Plat Foto (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.photoCaptionTitleId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, photoCaptionTitleId: e.target.value },
                        })
                      }
                      placeholder="Altar Agung Kuang Hang Fo Thang"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Plat Foto (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.photoCaptionTitleZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, photoCaptionTitleZh: e.target.value },
                        })
                      }
                      placeholder="廣航聖壇大殿"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Tanggal Arsip Foto
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.photoCaptionDate}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, photoCaptionDate: e.target.value },
                        })
                      }
                      placeholder="12 Nov 2006"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Keterangan Deskripsi Plat (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.photoCaptionDescId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, photoCaptionDescId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-block F: Countdown Timer */}
              <div className="space-y-3 pt-2 border-t border-stone-800/60">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  6. Hitung Mundur Acara (Countdown Timer)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Hitung Mundur (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.countdownHeadingId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, countdownHeadingId: e.target.value },
                        })
                      }
                      placeholder="Menghitung Hari Menuju Malam Puncak Syukur"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Judul Hitung Mundur (Mandarin)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.countdownHeadingZh}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, countdownHeadingZh: e.target.value },
                        })
                      }
                      placeholder="倒數計時 • 共迎盛典"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Subteks Hitung Mundur (Indonesia)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.countdownSubtextId}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, countdownSubtextId: e.target.value },
                        })
                      }
                      placeholder="Sabtu, 14 November 2026 • Palmerah, Jakarta Barat"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Target Waktu ISO (Tanggal & Jam Mulai)
                    </label>
                    <input
                      type="text"
                      value={cmsConfig.hero.countdownDate}
                      onChange={(e) =>
                        setCmsConfig({
                          ...cmsConfig,
                          hero: { ...cmsConfig.hero, countdownDate: e.target.value },
                        })
                      }
                      placeholder="2026-11-14T19:00:00+07:00"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Wejangan Suci */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Untaian Wejangan Suci (Wisdom Quote)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Wejangan pembinaan dari Guru Agung Ji Gong Huo Fo yang ditampilkan di bagian awal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Stempel Tokoh Suci (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.sealZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, sealZh: e.target.value },
                      })
                    }
                    placeholder="活佛師尊慈訓"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Bagian Wejangan (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.headingId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, headingId: e.target.value },
                      })
                    }
                    placeholder="Untaian Wejangan Suci Guru Agung"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Bagian Wejangan (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.headingZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, headingZh: e.target.value },
                      })
                    }
                    placeholder="活佛師尊慈語 • 薪火相傳"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Subjudul / Pengantar (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.subheadingId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, subheadingId: e.target.value },
                      })
                    }
                    placeholder="Pelita Kebijaksanaan Menuntun Perjalanan Rohani"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Isi Kutipan Wejangan (Indonesia)
                  </label>
                  <textarea
                    rows={3}
                    value={cmsConfig.wisdom.quoteId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, quoteId: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Isi Kutipan Wejangan (Mandarin)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsConfig.wisdom.quoteZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, quoteZh: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Penutup Wejangan (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.closingId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, closingId: e.target.value },
                      })
                    }
                    placeholder="Semoga senantiasa teguh dalam ikrar suci, bersama mengarungi samudra kebajikan."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Penutup Wejangan (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.wisdom.closingZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        wisdom: { ...cmsConfig.wisdom, closingZh: e.target.value },
                      })
                    }
                    placeholder="願共勉之，同心同德，廣化眾生。"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Waktu & Detail Acara */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Waktu & Detail Acara (Event Details)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Informasi tanggal, jam pelaksanaan, nama gedung, alamat, dan busana yang dianjurkan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Hari & Tanggal (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.dateTextId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, dateTextId: e.target.value },
                      })
                    }
                    placeholder="Sabtu, 14 November 2026"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Hari & Tanggal (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.dateTextZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, dateTextZh: e.target.value },
                      })
                    }
                    placeholder="二零二六年十一月十四日（星期六）"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Waktu Mulai Acara (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.timeTextId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, timeTextId: e.target.value },
                      })
                    }
                    placeholder="18.00 WIB — Selesai"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Waktu Mulai Acara (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.timeTextZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, timeTextZh: e.target.value },
                      })
                    }
                    placeholder="晚上 18:00 準時開始"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Catatan Registrasi Waktu
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.timeNotesId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, timeNotesId: e.target.value },
                      })
                    }
                    placeholder="Registrasi kehadiran dibuka pukul 17.00 WIB"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Nama Tempat / Gedung
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.venueNameId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, venueNameId: e.target.value },
                      })
                    }
                    placeholder="Gedung Kuang Hang Fo Thang"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Ketentuan Dress Code
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.dresscodeId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, dresscodeId: e.target.value },
                      })
                    }
                    placeholder="Batik Resmi / Pakaian Rapi Sopan"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Catatan Dress Code
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.dresscodeNotesId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, dresscodeNotesId: e.target.value },
                      })
                    }
                    placeholder="Disarankan mengenakan busana berwarna cerah atau batik sopan"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Alamat Lengkap Tempat
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.address}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, address: e.target.value },
                        location: { ...cmsConfig.location, fullAddress: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Tautan Google Maps Resmi
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.event.googleMapsUrl}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        event: { ...cmsConfig.event, googleMapsUrl: e.target.value },
                        location: { ...cmsConfig.location, googleMapsUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Tali Kasih / Rekening Dana Kebajikan */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800/80 gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Tali Kasih & Dana Kebajikan (隨喜功德)</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Informasi rekening transfer dana kebajikan atau sukarela bagi umat.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 shrink-0">
                  <input
                    type="checkbox"
                    checked={cmsConfig.donation.isReady}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        donation: { ...cmsConfig.donation, isReady: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-amber-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-stone-300">
                    {cmsConfig.donation.isReady
                      ? "🟢 Rekening Aktif / Tampil"
                      : "⚪ Rekening Dalam Pengumuman"}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Nama Bank / Metode
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.donation.bankName}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        donation: { ...cmsConfig.donation, bankName: e.target.value },
                      })
                    }
                    placeholder="BCA / Mandiri / Transfer"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.donation.accountNumber}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        donation: { ...cmsConfig.donation, accountNumber: e.target.value },
                      })
                    }
                    placeholder="1234567890"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Atas Nama Rekening (戶名)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.donation.accountHolder}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        donation: { ...cmsConfig.donation, accountHolder: e.target.value },
                      })
                    }
                    placeholder="Kuang Hang Fo Thang"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Catatan / Keterangan Transfer
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.donation.notes}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        donation: { ...cmsConfig.donation, notes: e.target.value },
                      })
                    }
                    placeholder="Mohon cantumkan berita: 20th Kuang Hang"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 7: Denah & Petunjuk Lokasi */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="border-b border-stone-800/80 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Denah & Petunjuk Lokasi (Location Map)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Informasi alamat lengkap dan peta Google Maps interaktif yang disematkan (embed).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Bagian Lokasi (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.location.headingId}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        location: { ...cmsConfig.location, headingId: e.target.value },
                      })
                    }
                    placeholder="Petunjuk Lokasi & Arah Menuju Gedung"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Bagian Lokasi (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.location.headingZh}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        location: { ...cmsConfig.location, headingZh: e.target.value },
                      })
                    }
                    placeholder="道場座標 • 交通導引"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Alamat Lengkap Serta Kode Pos
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.location.fullAddress}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        location: { ...cmsConfig.location, fullAddress: e.target.value },
                      })
                    }
                    placeholder="Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Tautan Peta Buka di Google Maps
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.location.googleMapsUrl}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        location: { ...cmsConfig.location, googleMapsUrl: e.target.value },
                      })
                    }
                    placeholder="https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    URL Iframe Google Maps (Embed Map)
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.location.embedMapUrl}
                    onChange={(e) =>
                      setCmsConfig({
                        ...cmsConfig,
                        location: { ...cmsConfig.location, embedMapUrl: e.target.value },
                      })
                    }
                    placeholder="https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleSaveCms()}
                disabled={isSavingCms}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingCms ? "Menyimpan ke Supabase..." : "Simpan Semua Perubahan Teks"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CMS FOTO & MEDIA                                        */}
        {/* ============================================================== */}
        {activeTab === "cms_media" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-amber-300">
                  Manajemen Foto & Galeri Website
                </h2>
                <p className="text-xs text-stone-400">
                  Unggah langsung ke Supabase Storage atau gunakan link eksternal untuk semua aset visual.
                </p>
              </div>

              <button
                onClick={() => handleSaveCms()}
                disabled={isSavingCms}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingCms ? "Menyimpan..." : "Simpan Media ke Supabase"}</span>
              </button>
            </div>

            {/* Primary Images: Cover, Logo, QRIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-stone-900 border border-stone-800">
              <ImageUploadField
                label="Foto Latar Sampul Amplop (Hero Cover)"
                value={cmsConfig.cover.bgImage}
                onChange={(url) =>
                  setCmsConfig({
                    ...cmsConfig,
                    cover: { ...cmsConfig.cover, bgImage: url },
                  })
                }
                description="Latar belakang yang tampak saat tamu pertama kali menerima undangan."
              />

              <ImageUploadField
                label="Logo Guang Ji (Wadah)"
                value={cmsConfig.cover.logoImage}
                onChange={(url) =>
                  setCmsConfig({
                    ...cmsConfig,
                    cover: { ...cmsConfig.cover, logoImage: url },
                  })
                }
                aspectRatio="square"
                description="Logo resmi Guang Ji yang muncul di segel dan header sampul."
              />

              <ImageUploadField
                label="Foto QRIS Tali Kasih (Opsional)"
                value={cmsConfig.donation.qrisImage || ""}
                onChange={(url) =>
                  setCmsConfig({
                    ...cmsConfig,
                    donation: { ...cmsConfig.donation, qrisImage: url },
                  })
                }
                aspectRatio="square"
                description="Scan barcode QRIS untuk memudahkan transfer dana sukarela."
              />
            </div>

            {/* Gallery Section Manager */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Galeri Dokumentasi Umat ({cmsConfig.gallery.length} Foto)</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Foto-foto yang ditampilkan pada bagian Galeri Dokumentasi di halaman depan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      fetchSupabaseMedia();
                      setShowMediaLibraryModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition cursor-pointer shadow-md"
                  >
                    <FolderCheck className="w-4 h-4 text-amber-400" />
                    <span>Pilih dari Media Supabase</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPhoto(null);
                      setPhotoForm({
                        id: "",
                        src: "",
                        title: "",
                        chineseTitle: "",
                        category: "kebersamaan",
                      });
                      setShowAddPhotoModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto Manual</span>
                  </button>
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cmsConfig.gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex flex-col group"
                  >
                    <div className="relative aspect-[4/3] w-full bg-stone-900">
                      {photo.src ? (
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-[10px] text-amber-300 font-semibold uppercase">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-xs text-stone-200 line-clamp-1">
                          {photo.title}
                        </h4>
                        <p className="font-chinese text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                          {photo.chineseTitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                        <button
                          onClick={() => {
                            setEditingPhoto(photo);
                            setPhotoForm(photo);
                            setShowAddPhotoModal(true);
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Ubah</span>
                        </button>

                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones Timeline Manager */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Napak Tilas 20 Tahun ({cmsConfig.milestones.length} Tahapan Sejarah)</span>
                    </h3>
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono">
                      ✓ Diurutkan Berdasarkan Tahun
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Kilas sejarah perjalanan perintisan dari tahun 1997 sampai perayaan 2026 (otomatis diurutkan secara kronologis).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingMilestone(null);
                    setMilestoneForm({
                      year: "2026",
                      title: "",
                      chineseTitle: "",
                      location: "Palmerah, Jakarta Barat",
                      chineseLocation: "雅加達巴美拉",
                      description: "",
                      chineseDescription: "",
                      highlight: "",
                      chineseHighlight: "",
                      image: "",
                    });
                    setShowAddMilestoneModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sejarah Baru</span>
                </button>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                {sortMilestonesByYear(cmsConfig.milestones).map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono font-bold text-sm shrink-0">
                        {m.year}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-stone-100">{m.title}</h4>
                          <span className="font-chinese text-xs text-amber-400/90">{m.chineseTitle}</span>
                        </div>
                        <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{m.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingMilestone({ item: m, index: idx });
                          setMilestoneForm(m);
                          setShowAddMilestoneModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMilestone(idx)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-medium transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: KUSTOMISASI PESAN WHATSAPP & SHARE                     */}
        {/* ============================================================== */}
        {activeTab === "share" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-amber-300">
                  Kustomisasi Kata-Kata / Pesan Share WhatsApp
                </h2>
                <p className="text-xs text-stone-400">
                  Ubah kata-kata resmi yang dikirimkan kepada tamu undangan. Mendukung variabel otomatis.
                </p>
              </div>

              <button
                onClick={() => handleSaveCms()}
                disabled={isSavingCms}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingCms ? "Menyimpan..." : "Simpan Template ke Supabase"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Editor Column */}
              <div className="lg:col-span-7 space-y-4 p-6 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-amber-300 font-bold">
                    Template Pesan WhatsApp
                  </label>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-stone-400">Preset:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCmsConfig({
                          ...cmsConfig,
                          shareMessage: { template: defaultCms.shareMessage.template },
                        })
                      }
                      className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
                    >
                      Resmi
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCmsConfig({
                          ...cmsConfig,
                          shareMessage: {
                            template: `Halo {nama},\n\nSemoga senantiasa sehat dan bahagia. Kami mengundang Anda sekeluarga untuk hadir di perayaan syukur *20 Tahun Gedung Kuang Hang Fo Thang*.\n\n📅 {tanggal} • {waktu}\n📍 {tempat}\n\nSilakan buka undangan digital & konfirmasi kehadiran:\n{url}\n\nTerima kasih dan sampai jumpa!`,
                          },
                        })
                      }
                      className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
                    >
                      Keluarga / Santai
                    </button>
                  </div>
                </div>

                {/* Variable Tags Help */}
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 space-y-1">
                  <p className="font-semibold text-stone-300">Variabel Dinamis yang Bisa Digunakan:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <code className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {"{nama}"}
                    </code>
                    <code className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {"{url}"}
                    </code>
                    <code className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {"{tanggal}"}
                    </code>
                    <code className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {"{waktu}"}
                    </code>
                    <code className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {"{tempat}"}
                    </code>
                  </div>
                </div>

                <textarea
                  rows={14}
                  value={cmsConfig.shareMessage.template}
                  onChange={(e) =>
                    setCmsConfig({
                      ...cmsConfig,
                      shareMessage: { template: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-mono leading-relaxed"
                />
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 space-y-4 p-6 rounded-2xl bg-[#111f18] border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-300">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-serif font-bold text-base">Pratinjau Pesan WhatsApp</h3>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-emerald-400/80 font-semibold mb-1">
                    Coba Ganti Nama Tamu
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Ketik nama untuk menguji..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/30 text-xs text-white placeholder-stone-400 focus:border-emerald-400 outline-none"
                  />
                </div>

                {/* WhatsApp Chat Balloon */}
                <div className="p-4 rounded-2xl bg-[#005c4b] text-white text-xs font-sans whitespace-pre-wrap leading-relaxed shadow-xl border border-emerald-300/20">
                  {dynamicWhatsappMessage}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => shareViaWhatsapp(dynamicWhatsappMessage)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Uji Kirim via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => copyMessage(dynamicWhatsappMessage)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: TAMBAH / EDIT UCAPAN (CRUD)                           */}
      {/* ============================================================== */}
      {(showAddWishModal || editingWish) && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-stone-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-bold text-base text-amber-200">
                {editingWish ? "Edit Doa & Konfirmasi Tamu" : "Tambah Ucapan / Doa Manual"}
              </h3>
              <button
                onClick={() => {
                  setShowAddWishModal(false);
                  setEditingWish(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingWish ? handleEditWishSubmit : handleAddWishSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Nama Tamu / Keluarga
                </label>
                <input
                  type="text"
                  required
                  value={wishForm.name}
                  onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                  placeholder="Contoh: Keluarga Lim"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Status Kehadiran
                  </label>
                  <select
                    value={wishForm.status}
                    onChange={(e: any) => setWishForm({ ...wishForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none"
                  >
                    <option value="hadir">Pasti Hadir</option>
                    <option value="ragu">Masih Ragu</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Jumlah Orang
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={wishForm.guests}
                    onChange={(e) =>
                      setWishForm({ ...wishForm, guests: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Untaian Doa & Pesan
                </label>
                <textarea
                  rows={4}
                  value={wishForm.message}
                  onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                  placeholder="Tuliskan ucapan dan doa restu untuk Kuang Hang Fo Thang..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-serif"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddWishModal(false);
                    setEditingWish(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
                >
                  {editingWish ? "Simpan Perubahan" : "Tambah ke Supabase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: IMPOR TAMU MASSAL                                     */}
      {/* ============================================================== */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-stone-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-bold text-base text-amber-200">
                Impor Daftar Tamu Massal (Bulk)
              </h3>
              <button onClick={() => setShowBulkModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Salin daftar nama tamu (satu baris untuk setiap nama). Sistem akan otomatis menyimpan ke database Supabase.
            </p>

            <textarea
              rows={8}
              value={bulkGuestText}
              onChange={(e) => setBulkGuestText(e.target.value)}
              placeholder="Lim TC Felix Salim&#10;Keluarga Cen&#10;Bapak Tan Wijaya&#10;Ibu Veronica"
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-amber-500 outline-none font-mono"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddBulkGuests}
                disabled={isAddingGuest || !bulkGuestText.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md"
              >
                {isAddingGuest ? "Menyimpan..." : "Impor ke Supabase"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: TAMBAH / EDIT FOTO GALERI                             */}
      {/* ============================================================== */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-stone-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-bold text-base text-amber-200">
                {editingPhoto ? "Ubah Foto Galeri" : "Tambah Foto Galeri Baru"}
              </h3>
              <button onClick={() => setShowAddPhotoModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploadField
                label="Foto Dokumentasi"
                value={photoForm.src}
                onChange={(url) => setPhotoForm({ ...photoForm, src: url })}
                description="Unggah file foto langsung ke Supabase Storage."
              />

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Judul Foto (Indonesia)
                </label>
                <input
                  type="text"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="Contoh: Kebersamaan Umat Kuang Hang"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Judul Foto (Mandarin)
                </label>
                <input
                  type="text"
                  value={photoForm.chineseTitle}
                  onChange={(e) => setPhotoForm({ ...photoForm, chineseTitle: e.target.value })}
                  placeholder="Contoh: 同心同德 • 全體道親大合影"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Kategori
                </label>
                <select
                  value={photoForm.category}
                  onChange={(e: any) => setPhotoForm({ ...photoForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none"
                >
                  <option value="kebersamaan">Kebersamaan Umat</option>
                  <option value="kegiatan">Kegiatan Pembinaan</option>
                  <option value="sejarah">Sejarah & Pembangunan</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
                >
                  Simpan Foto ke Supabase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: TAMBAH / EDIT MILESTONE SEJARAH                       */}
      {/* ============================================================== */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-stone-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-bold text-base text-amber-200">
                {editingMilestone ? "Ubah Kilas Sejarah" : "Tambah Kilas Sejarah Baru"}
              </h3>
              <button onClick={() => setShowAddMilestoneModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.year}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                    placeholder="Contoh: 1997 atau 2006"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.location || ""}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, location: e.target.value })}
                    placeholder="Palmerah, Jakarta Barat"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Tahap (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    placeholder="Awal Perintisan Wadah"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Judul Tahap (Mandarin)
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.chineseTitle}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, chineseTitle: e.target.value })}
                    placeholder="開荒啟航 • 播撒善種"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none font-chinese"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Deskripsi Cerita (Indonesia)
                </label>
                <textarea
                  rows={3}
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Poin Sorotan / Renungan
                </label>
                <input
                  type="text"
                  value={milestoneForm.highlight}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, highlight: e.target.value })}
                  placeholder="Benih kebajikan pertama ditaburkan..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <ImageUploadField
                label="Foto Dokumentasi Sejarah (Opsional)"
                value={milestoneForm.image || ""}
                onChange={(url) => setMilestoneForm({ ...milestoneForm, image: url })}
                description="Foto arsip terkait momen sejarah ini."
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveMilestone}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
                >
                  Simpan Kilas Sejarah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: PILIH BANYAK FOTO DARI MEDIA SUPABASE                */}
      {/* ============================================================== */}
      {showMediaLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-stone-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-amber-200 flex items-center gap-2">
                  <FolderCheck className="w-5 h-5 text-amber-400" />
                  <span>Pustaka Media Supabase</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                    {supabaseMediaList.length} Foto
                  </span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Centang foto-foto yang pernah diunggah untuk langsung ditambahkan ke Galeri Dokumentasi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSupabaseMedia}
                  disabled={isLoadingMediaList}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 transition"
                  title="Segarkan Media"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMediaList ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Segarkan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaLibraryModal(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selection Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-stone-950 border border-stone-800 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllMedia}
                  className="text-xs text-amber-300 hover:text-amber-200 font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {selectedMediaUrls.length === supabaseMediaList.length && supabaseMediaList.length > 0 ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                      <span>Hapus Semua Pilihan</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-stone-400" />
                      <span>Pilih Semua ({supabaseMediaList.length})</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-stone-500">|</span>
                <span className="text-xs text-stone-300 font-semibold">
                  {selectedMediaUrls.length} foto terpilih
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Kategori:
                </label>
                <select
                  value={importCategory}
                  onChange={(e: any) => setImportCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white outline-none"
                >
                  <option value="kebersamaan">Kebersamaan Umat</option>
                  <option value="kegiatan">Kegiatan Pembinaan</option>
                  <option value="sejarah">Sejarah & Pembangunan</option>
                </select>
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {isLoadingMediaList ? (
                <div className="py-16 text-center text-sm text-amber-300 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <span>Mengambil daftar berkas dari Supabase Storage...</span>
                </div>
              ) : supabaseMediaList.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-stone-600" />
                  <p className="text-xs">Belum ada berkas foto yang ditemukan di Supabase Storage.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {supabaseMediaList.map((file) => {
                    const isSelected = selectedMediaUrls.includes(file.url);
                    const alreadyInGallery = cmsConfig.gallery.some((g) => g.src === file.url);
                    const cleanName = file.name.replace(/^\d+-/, "");

                    return (
                      <div
                        key={file.name}
                        onClick={() => handleToggleSelectMedia(file.url)}
                        className={`group relative rounded-xl overflow-hidden bg-stone-950 border transition cursor-pointer flex flex-col select-none ${
                          isSelected
                            ? "border-amber-400 ring-2 ring-amber-400/60 shadow-lg"
                            : "border-stone-800 hover:border-stone-600"
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full bg-stone-900">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <div
                            className={`absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center transition shadow ${
                              isSelected
                                ? "bg-amber-500 text-stone-950"
                                : "bg-black/60 text-stone-400 group-hover:text-white"
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Square className="w-3.5 h-3.5" />}
                          </div>

                          {alreadyInGallery && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-300 font-mono">
                              ✓ Ada di Galeri
                            </span>
                          )}
                        </div>

                        <div className="p-2 text-[10px] space-y-0.5 bg-stone-950">
                          <p className="font-mono text-stone-200 truncate" title={file.name}>
                            {cleanName}
                          </p>
                          <p className="text-stone-500 font-mono">
                            {file.size ? `${Math.round(file.size / 1024)} KB` : "Foto"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-stone-400">
                {selectedMediaUrls.length > 0 ? (
                  <span className="text-amber-300 font-medium">
                    {selectedMediaUrls.length} foto siap ditambahkan ke kategori &ldquo;{importCategory}&rdquo;
                  </span>
                ) : (
                  "Pilih foto di atas untuk ditambahkan"
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaLibraryModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleImportMediaToGallery}
                  disabled={selectedMediaUrls.length === 0}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  + Tambahkan ke Galeri ({selectedMediaUrls.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
