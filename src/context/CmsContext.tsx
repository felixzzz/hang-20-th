"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteCmsConfig } from "@/types/cms";
import { defaultCms } from "@/data/defaultCms";
import { sortMilestonesByYear } from "@/data/history";

interface CmsContextType {
  cms: SiteCmsConfig;
  isLoading: boolean;
  refreshCms: () => Promise<void>;
  updateCms: (partial: Partial<SiteCmsConfig>) => Promise<boolean>;
}

const CmsContext = createContext<CmsContextType>({
  cms: defaultCms,
  isLoading: true,
  refreshCms: async () => {},
  updateCms: async () => false,
});

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<SiteCmsConfig>(defaultCms);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCmsData = async () => {
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        const sortedData: SiteCmsConfig = {
          ...defaultCms,
          ...json.data,
          navbar: { ...defaultCms.navbar, ...(json.data.navbar || {}) },
          cover: { ...defaultCms.cover, ...(json.data.cover || {}) },
          hero: { ...defaultCms.hero, ...(json.data.hero || {}) },
          wisdom: { ...defaultCms.wisdom, ...(json.data.wisdom || {}) },
          event: { ...defaultCms.event, ...(json.data.event || {}) },
          donation: { ...defaultCms.donation, ...(json.data.donation || {}) },
          location: { ...defaultCms.location, ...(json.data.location || {}) },
          footer: { ...defaultCms.footer, ...(json.data.footer || {}) },
          audio: { ...defaultCms.audio, ...(json.data.audio || {}) },
          historySection: { ...defaultCms.historySection, ...(json.data.historySection || {}) },
          gallerySection: { ...defaultCms.gallerySection, ...(json.data.gallerySection || {}) },
          rsvpSection: { ...defaultCms.rsvpSection, ...(json.data.rsvpSection || {}) },
          shareMessage: { ...defaultCms.shareMessage, ...(json.data.shareMessage || {}) },
          milestones: sortMilestonesByYear(json.data.milestones || []),
          gallery: Array.isArray(json.data.gallery) ? json.data.gallery : defaultCms.gallery,
        };
        setCms(sortedData);
        // Cache to sessionStorage for instantaneous navigation
        sessionStorage.setItem("guanghang_cms_cache", JSON.stringify(sortedData));
      }
    } catch (err) {
      console.warn("Using default CMS due to fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check cached version first for instant display
    try {
      const cached = sessionStorage.getItem("guanghang_cms_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const normalizedCached: SiteCmsConfig = {
          ...defaultCms,
          ...parsed,
          navbar: { ...defaultCms.navbar, ...(parsed.navbar || {}) },
          cover: { ...defaultCms.cover, ...(parsed.cover || {}) },
          hero: { ...defaultCms.hero, ...(parsed.hero || {}) },
          wisdom: { ...defaultCms.wisdom, ...(parsed.wisdom || {}) },
          event: { ...defaultCms.event, ...(parsed.event || {}) },
          donation: { ...defaultCms.donation, ...(parsed.donation || {}) },
          location: { ...defaultCms.location, ...(parsed.location || {}) },
          footer: { ...defaultCms.footer, ...(parsed.footer || {}) },
          audio: { ...defaultCms.audio, ...(parsed.audio || {}) },
          historySection: { ...defaultCms.historySection, ...(parsed.historySection || {}) },
          gallerySection: { ...defaultCms.gallerySection, ...(parsed.gallerySection || {}) },
          rsvpSection: { ...defaultCms.rsvpSection, ...(parsed.rsvpSection || {}) },
          shareMessage: { ...defaultCms.shareMessage, ...(parsed.shareMessage || {}) },
          milestones: sortMilestonesByYear(
            Array.isArray(parsed.milestones) ? parsed.milestones : defaultCms.milestones
          ),
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaultCms.gallery,
        };
        setCms((prev) => ({ ...prev, ...normalizedCached }));
      }
    } catch (e) {
      // ignore
    }

    fetchCmsData();
  }, []);

  const updateCms = async (partial: Partial<SiteCmsConfig>): Promise<boolean> => {
    try {
      const newConfig = {
        ...cms,
        ...partial,
        milestones: sortMilestonesByYear(partial.milestones || cms.milestones || []),
      };
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const sortedData: SiteCmsConfig = {
          ...defaultCms,
          ...json.data,
          navbar: { ...defaultCms.navbar, ...(json.data.navbar || {}) },
          cover: { ...defaultCms.cover, ...(json.data.cover || {}) },
          hero: { ...defaultCms.hero, ...(json.data.hero || {}) },
          wisdom: { ...defaultCms.wisdom, ...(json.data.wisdom || {}) },
          event: { ...defaultCms.event, ...(json.data.event || {}) },
          donation: { ...defaultCms.donation, ...(json.data.donation || {}) },
          location: { ...defaultCms.location, ...(json.data.location || {}) },
          footer: { ...defaultCms.footer, ...(json.data.footer || {}) },
          audio: { ...defaultCms.audio, ...(json.data.audio || {}) },
          historySection: { ...defaultCms.historySection, ...(json.data.historySection || {}) },
          gallerySection: { ...defaultCms.gallerySection, ...(json.data.gallerySection || {}) },
          rsvpSection: { ...defaultCms.rsvpSection, ...(json.data.rsvpSection || {}) },
          shareMessage: { ...defaultCms.shareMessage, ...(json.data.shareMessage || {}) },
          milestones: sortMilestonesByYear(json.data.milestones || []),
          gallery: Array.isArray(json.data.gallery) ? json.data.gallery : defaultCms.gallery,
        };
        setCms(sortedData);
        sessionStorage.setItem("guanghang_cms_cache", JSON.stringify(sortedData));
        return true;
      }
      return false;
    } catch (err) {
      console.error("updateCms failed:", err);
      return false;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        cms,
        isLoading,
        refreshCms: fetchCmsData,
        updateCms,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
