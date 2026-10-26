"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageMode = "all" | "id" | "zh";

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  showId: boolean;
  showZh: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "all",
  setLang: () => {},
  showId: true,
  showZh: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>("all");

  useEffect(() => {
    const saved = localStorage.getItem("guanghang_lang_mode") as LanguageMode;
    if (saved && (saved === "all" || saved === "id" || saved === "zh")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: LanguageMode) => {
    setLangState(newLang);
    localStorage.setItem("guanghang_lang_mode", newLang);
  };

  const showId = lang === "all" || lang === "id";
  const showZh = lang === "all" || lang === "zh";

  return (
    <LanguageContext.Provider value={{ lang, setLang, showId, showZh }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
