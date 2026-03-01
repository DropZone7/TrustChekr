"use client";

import { createContext, useContext } from "react";

export type Locale = "en" | "fr";

export const translations: Record<string, Record<Locale, string>> = {
  // Nav
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.academy": { en: "Academy", fr: "Acad\u00e9mie" },
  "nav.tools": { en: "Tools", fr: "Outils" },
  "nav.about": { en: "About", fr: "\u00c0 propos" },
  "nav.help": { en: "Help", fr: "Aide" },
  "nav.report": { en: "Report a Scam", fr: "Signaler une fraude" },

  // Scan form
  "scan.prompt": { en: "What would you like to check?", fr: "Que souhaitez-vous v\u00e9rifier?" },
  "scan.button": { en: "Check Now", fr: "V\u00e9rifier maintenant" },
  "scan.website": { en: "Website", fr: "Site web" },
  "scan.message": { en: "Message", fr: "Message" },
  "scan.other": { en: "Phone/Email/Crypto", fr: "T\u00e9l\u00e9phone/Courriel/Crypto" },

  // Results
  "result.lowRisk": { en: "Low Risk", fr: "Faible risque" },
  "result.suspicious": { en: "Suspicious", fr: "Suspect" },
  "result.highRisk": { en: "High-Risk", fr: "Risque \u00e9lev\u00e9" },
  "result.veryLikelyScam": { en: "Very Likely Scam", fr: "Tr\u00e8s probablement une fraude" },
  "result.whatWeFound": { en: "What we found", fr: "Ce que nous avons trouv\u00e9" },
  "result.whatToDo": { en: "What you should do", fr: "Ce que vous devriez faire" },
  "result.trustScore": { en: "Trust Score", fr: "Score de confiance" },

  // Footer
  "footer.builtInCanada": { en: "Built in Canada", fr: "Con\u00e7u au Canada" },
  "footer.privacy": { en: "Privacy Policy", fr: "Politique de confidentialit\u00e9" },
  "footer.terms": { en: "Terms of Service", fr: "Conditions d\u2019utilisation" },

  // General
  "general.checkAnother": { en: "Check another", fr: "V\u00e9rifier autre chose" },
  "general.reportThis": { en: "Report this", fr: "Signaler" },
  "general.share": { en: "Share", fr: "Partager" },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT() {
  const { locale } = useLocale();
  return (key: string): string => {
    return translations[key]?.[locale] ?? translations[key]?.en ?? key;
  };
}
