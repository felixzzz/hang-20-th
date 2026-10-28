"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Loader2, Link as LinkIcon, X, FolderCheck, RefreshCw } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  aspectRatio?: "square" | "landscape" | "banner";
}

interface SupabaseMediaItem {
  name: string;
  url: string;
  size: number;
  created_at?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  description,
  aspectRatio = "landscape",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<"upload" | "library" | "url">("upload");
  const [libraryFiles, setLibraryFiles] = useState<SupabaseMediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/upload", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLibraryFiles(json.data);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (mode === "library" && libraryFiles.length === 0) {
      fetchLibrary();
    }
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        onChange(json.url);
        // refresh library cache
        fetchLibrary();
      } else {
        setErrorMsg(json.error || "Gagal mengunggah gambar ke Supabase.");
      }
    } catch (err: any) {
      setErrorMsg("Terjadi gangguan jaringan saat mengunggah.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square w-24 h-24 mx-auto";
      case "banner":
        return "aspect-[21/9] w-full max-h-36";
      default:
        return "aspect-video w-full max-h-36";
    }
  };

  const uniqueId = `upload-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-stone-950 border border-stone-800">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider truncate">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px] bg-stone-900 p-0.5 rounded-lg border border-stone-800 shrink-0">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded transition ${
              mode === "upload"
                ? "bg-amber-600 text-stone-950 font-bold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("library")}
            className={`px-2 py-0.5 rounded transition ${
              mode === "library"
                ? "bg-amber-600 text-stone-950 font-bold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Media ({libraryFiles.length || "..."})
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition ${
              mode === "url"
                ? "bg-amber-600 text-stone-950 font-bold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-stone-400 leading-relaxed">{description}</p>
      )}

      {/* Preview Box */}
      <div
        className={`relative rounded-lg overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center ${getAspectClass()}`}
      >
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            sizes="300px"
            unoptimized={value.startsWith("data:") || value.startsWith("http")}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-600 p-3 text-center">
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px]">Belum ada foto</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-amber-300">
            <Loader2 className="w-5 h-5 animate-spin mb-1" />
            <span className="text-[10px] font-medium">Mengunggah ke Supabase...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2 pt-1">
        {mode === "upload" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={uniqueId}
            />
            <label
              htmlFor={uniqueId}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer w-full shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Pilih Berkas Foto Baru</span>
            </label>
          </div>
        )}

        {mode === "library" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Pilih dari foto di Supabase Storage:</span>
              <button
                type="button"
                onClick={fetchLibrary}
                className="hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingLibrary ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </button>
            </div>

            {isLoadingLibrary ? (
              <div className="py-4 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memuat media Supabase...</span>
              </div>
            ) : libraryFiles.length === 0 ? (
              <div className="py-3 text-center text-[11px] text-stone-500 bg-stone-900 rounded-lg">
                Belum ada berkas tersimpan di Supabase Storage.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1 bg-stone-900 rounded-lg border border-stone-800">
                {libraryFiles.map((file) => {
                  const isSelected = value === file.url;
                  return (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => onChange(file.url)}
                      title={file.name}
                      className={`relative aspect-square rounded overflow-hidden border transition cursor-pointer ${
                        isSelected
                          ? "border-amber-400 ring-2 ring-amber-400/50"
                          : "border-stone-700 hover:border-stone-500"
                      }`}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center text-white">
                          <FolderCheck className="w-4 h-4 text-amber-300 drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {mode === "url" && (
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... atau /images/..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:border-amber-500 outline-none"
            />
          </div>
        )}

        {value && (
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-800">
            <span className="text-stone-400 truncate max-w-[180px]" title={value}>
              {value}
            </span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition shrink-0 ml-2"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
