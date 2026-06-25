"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOCALE_LABELS,
  formatMatchLabel,
  getDirection,
  localizeTeamName,
  translate,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "mauribin:locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  formatLabel: (utcDate: string, state: string) => string;
  localizeTeam: (name: string | undefined) => string;
  available: typeof LOCALE_LABELS;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default to Arabic — most of the audience is MENA / Mauritanian
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage AFTER mount to avoid SSR/CSR mismatch
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && LOCALE_LABELS[stored]) {
        setLocaleState(stored);
      } else {
        // Try browser language
        const browser = window.navigator.language.slice(0, 2);
        if (browser === "fr" || browser === "en") {
          setLocaleState(browser as Locale);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist + apply dir attribute + sync cookie for server components
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
      // 1 year cookie so SSR pages know the locale
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `${STORAGE_KEY}=${locale}; max-age=${oneYear}; path=/; SameSite=Lax`;
    } catch {
      /* ignore */
    }
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dir: getDirection(locale),
      t: (k) => translate(locale, k),
      formatLabel: (utcDate, state) => formatMatchLabel(locale, utcDate, state),
      localizeTeam: (name) => localizeTeamName(name, locale),
      available: LOCALE_LABELS,
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so components called from non-provider contexts don't crash.
    return {
      locale: "ar" as Locale,
      setLocale: () => {},
      dir: "rtl" as const,
      t: (k: string) => translate("ar", k),
      formatLabel: (utcDate: string, state: string) =>
        formatMatchLabel("ar", utcDate, state),
      localizeTeam: (name: string | undefined) => localizeTeamName(name, "ar"),
      available: LOCALE_LABELS,
    };
  }
  return ctx;
}