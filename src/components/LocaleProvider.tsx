"use client";

import { useState, useEffect } from "react";
import { LocaleContext, type Locale } from "@/lib/i18n";

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tc-locale");
      if (saved === "fr") setLocale("fr");
    } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
