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
        const sortedData = {
          ...json.data,
          milestones: sortMilestonesByYear(json.data.milestones || []),
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
        if (Array.isArray(parsed.milestones)) {
          parsed.milestones = sortMilestonesByYear(parsed.milestones);
        }
        setCms((prev) => ({ ...prev, ...parsed }));
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
        const sortedData = {
          ...json.data,
          milestones: sortMilestonesByYear(json.data.milestones || []),
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
