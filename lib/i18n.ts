// Mauribin i18n — Arabic (default), French, English
// Each key has the same set of translations; missing keys fall back to Arabic.

export type Locale = "ar" | "fr" | "en";

export const LOCALE_LABELS: Record<Locale, { native: string; flag: string; dir: "rtl" | "ltr" }> = {
  ar: { native: "العربية", flag: "🇲🇷", dir: "rtl" },
  fr: { native: "Français", flag: "🇫🇷", dir: "ltr" },
  en: { native: "English", flag: "🇬🇧", dir: "ltr" },
};

type Dict = Record<string, string>;

const ar: Dict = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.schedule": "الجدول",
  "nav.groups": "المجموعات",
  "nav.teams": "المنتخبات",
  "nav.news": "الأخبار",
  "nav.quiz": "اختبار",
  "nav.stats": "إحصائيات",
  "nav.predict": "توقعات",
  "nav.search": "البحث",
  "nav.vip": "VIP",
  "nav.payment": "الدفع",

  // Hero / home
  "hero.worldCup": "كأس العالم 2026",
  "hero.liveNow": "مباشر الآن",
  "hero.upcoming": "المباريات القادمة",
  "hero.results": "النتائج",
  "hero.nextMatch": "المباراة القادمة",
  "hero.liveMatch": "مباراة مباشرة",
  "hero.refreshIn": "تحديث بعد",
  "hero.seconds": "ث",
  "hero.lastUpdate": "آخر تحديث",
  "hero.noMatches": "لا توجد مباريات حالياً",
  "hero.emptyState": "لا توجد بيانات حالياً",

  // Match states
  "match.live": "مباشر",
  "match.finished": "انتهت",
  "match.upcoming": "قادم",
  "match.minute": "الدقيقة",
  "match.today": "اليوم",
  "match.yesterday": "أمس",
  "match.tomorrow": "غداً",

  // Match details
  "details.title": "تفاصيل",
  "details.stats": "إحصائيات",
  "details.events": "أحداث",
  "details.possession": "استحواذ",
  "details.shots": "تسديدات",
  "details.shotsOnTarget": "تسديدات على المرمى",
  "details.corners": "كورنر",
  "details.fouls": "أخطاء",
  "details.yellowCards": "بطاقات صفراء",
  "details.redCards": "بطاقات حمراء",
  "details.offsides": "تسللات",
  "details.passes": "تمريرات",
  "details.passAccuracy": "دقة التمرير",
  "details.matchEvents": "أحداث المباراة",
  "details.noEvents": "لا توجد أحداث حتى الآن",
  "details.highlights": "ملخص المباراة",
  "details.watchHighlights": "شاهد ملخص المباراة على YouTube",
  "details.notFound": "المباراة غير موجودة",
  "details.notFoundHint": "تعذر العثور على تفاصيل هذه المباراة",
  "details.backHome": "العودة للرئيسية",

  // Goal celebrations
  "goal.scored": "هدف!",
  "goal.home": "لصالح",
  "goal.away": "لصالح",

  // Standings
  "standings.title": "ترتيب المجموعات",
  "standings.rank": "الترتيب",
  "standings.team": "الفريق",
  "standings.played": "لعب",
  "standings.won": "فاز",
  "standings.drawn": "تعادل",
  "standings.lost": "خسر",
  "standings.points": "نقاط",
  "standings.gf": "له",
  "standings.ga": "عليه",
  "standings.gd": "الفارق",

  // News
  "news.title": "آخر أخبار كأس العالم 2026",
  "news.subtitle": "تحديث تلقائي من BBC Sport + Google News",
  "news.loading": "جاري التحميل...",
  "news.empty": "لا توجد أخبار حالياً",
  "news.readMore": "اقرأ المزيد",

  // Search
  "search.placeholder": "ابحث عن منتخب، مباراة، أو مجموعة...",
  "search.noResults": "لا توجد نتائج",

  // Common
  "common.competition": "FIFA World Cup",
  "common.copyright": "جميع الحقوق محفوظة",
  "common.share": "مشاركة",
  "common.close": "إغلاق",

  // Footer
  "footer.about": "موقعك لأخبار كرة القدم بالعربية. نتائج مباشرة، جداول المباريات، أخبار الانتقالات ومباريات كأس العالم 2026.",
  "footer.quickLinks": "روابط سريعة",
  "footer.sources": "المصادر",

  // Goal toasts
  "goalToast.title": "هدف!",
  "goalToast.for": "لصالح",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.schedule": "Calendrier",
  "nav.groups": "Groupes",
  "nav.teams": "Équipes",
  "nav.news": "Actualités",
  "nav.quiz": "Quiz",
  "nav.stats": "Stats",
  "nav.predict": "Pronostics",
  "nav.search": "Recherche",
  "nav.vip": "VIP",
  "nav.payment": "Paiement",

  "hero.worldCup": "Coupe du Monde 2026",
  "hero.liveNow": "En direct",
  "hero.upcoming": "Matchs à venir",
  "hero.results": "Résultats",
  "hero.nextMatch": "Prochain match",
  "hero.liveMatch": "Match en direct",
  "hero.refreshIn": "Actualisation dans",
  "hero.seconds": "s",
  "hero.lastUpdate": "Dernière mise à jour",
  "hero.noMatches": "Aucun match pour le moment",
  "hero.emptyState": "Aucune donnée disponible",

  "match.live": "Direct",
  "match.finished": "Terminé",
  "match.upcoming": "À venir",
  "match.minute": "Minute",
  "match.today": "Aujourd'hui",
  "match.yesterday": "Hier",
  "match.tomorrow": "Demain",

  "details.title": "Détails",
  "details.stats": "Statistiques",
  "details.events": "Événements",
  "details.possession": "Possession",
  "details.shots": "Tirs",
  "details.shotsOnTarget": "Tirs cadrés",
  "details.corners": "Corners",
  "details.fouls": "Fautes",
  "details.yellowCards": "Cartons jaunes",
  "details.redCards": "Cartons rouges",
  "details.offsides": "Hors-jeu",
  "details.passes": "Passes",
  "details.passAccuracy": "Précision des passes",
  "details.matchEvents": "Événements du match",
  "details.noEvents": "Aucun événement pour le moment",
  "details.highlights": "Résumé du match",
  "details.watchHighlights": "Voir le résumé sur YouTube",
  "details.notFound": "Match introuvable",
  "details.notFoundHint": "Impossible de trouver les détails de ce match",
  "details.backHome": "Retour à l'accueil",

  "goal.scored": "But !",
  "goal.home": "pour",
  "goal.away": "pour",

  "standings.title": "Classement des groupes",
  "standings.rank": "#",
  "standings.team": "Équipe",
  "standings.played": "J",
  "standings.won": "G",
  "standings.drawn": "N",
  "standings.lost": "P",
  "standings.points": "Pts",
  "standings.gf": "BP",
  "standings.ga": "BC",
  "standings.gd": "Diff",

  "news.title": "Actualités de la Coupe du Monde 2026",
  "news.subtitle": "Mise à jour automatique depuis BBC Sport + Google News",
  "news.loading": "Chargement...",
  "news.empty": "Aucune actualité pour le moment",
  "news.readMore": "Lire plus",

  "search.placeholder": "Rechercher une équipe, un match, un groupe...",
  "search.noResults": "Aucun résultat",

  "common.competition": "Coupe du Monde FIFA",
  "common.copyright": "Tous droits réservés",
  "common.share": "Partager",
  "common.close": "Fermer",

  "footer.about": "Votre site d'actualités footballistiques en arabe. Résultats en direct, calendriers, transferts et matchs de la Coupe du Monde 2026.",
  "footer.quickLinks": "Liens rapides",
  "footer.sources": "Sources",

  "goalToast.title": "But !",
  "goalToast.for": "pour",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.schedule": "Schedule",
  "nav.groups": "Groups",
  "nav.teams": "Teams",
  "nav.news": "News",
  "nav.quiz": "Quiz",
  "nav.stats": "Stats",
  "nav.predict": "Predict",
  "nav.search": "Search",
  "nav.vip": "VIP",
  "nav.payment": "Payment",

  "hero.worldCup": "World Cup 2026",
  "hero.liveNow": "Live now",
  "hero.upcoming": "Upcoming matches",
  "hero.results": "Results",
  "hero.nextMatch": "Next match",
  "hero.liveMatch": "Live match",
  "hero.refreshIn": "Refresh in",
  "hero.seconds": "s",
  "hero.lastUpdate": "Last update",
  "hero.noMatches": "No matches at the moment",
  "hero.emptyState": "No data available",

  "match.live": "Live",
  "match.finished": "Finished",
  "match.upcoming": "Upcoming",
  "match.minute": "Minute",
  "match.today": "Today",
  "match.yesterday": "Yesterday",
  "match.tomorrow": "Tomorrow",

  "details.title": "Details",
  "details.stats": "Stats",
  "details.events": "Events",
  "details.possession": "Possession",
  "details.shots": "Shots",
  "details.shotsOnTarget": "Shots on target",
  "details.corners": "Corners",
  "details.fouls": "Fouls",
  "details.yellowCards": "Yellow cards",
  "details.redCards": "Red cards",
  "details.offsides": "Offsides",
  "details.passes": "Passes",
  "details.passAccuracy": "Pass accuracy",
  "details.matchEvents": "Match events",
  "details.noEvents": "No events yet",
  "details.highlights": "Match highlights",
  "details.watchHighlights": "Watch highlights on YouTube",
  "details.notFound": "Match not found",
  "details.notFoundHint": "Could not find details for this match",
  "details.backHome": "Back to home",

  "goal.scored": "Goal!",
  "goal.home": "for",
  "goal.away": "for",

  "standings.title": "Group standings",
  "standings.rank": "#",
  "standings.team": "Team",
  "standings.played": "P",
  "standings.won": "W",
  "standings.drawn": "D",
  "standings.lost": "L",
  "standings.points": "Pts",
  "standings.gf": "GF",
  "standings.ga": "GA",
  "standings.gd": "GD",

  "news.title": "World Cup 2026 Latest News",
  "news.subtitle": "Auto-updated from BBC Sport + Google News",
  "news.loading": "Loading...",
  "news.empty": "No news right now",
  "news.readMore": "Read more",

  "search.placeholder": "Search for a team, match, or group...",
  "search.noResults": "No results",

  "common.competition": "FIFA World Cup",
  "common.copyright": "All rights reserved",
  "common.share": "Share",
  "common.close": "Close",

  "footer.about": "Your Arabic-language football news hub. Live scores, schedules, transfers and 2026 World Cup matches.",
  "footer.quickLinks": "Quick links",
  "footer.sources": "Sources",

  "goalToast.title": "Goal!",
  "goalToast.for": "for",
};

const dictionaries: Record<Locale, Dict> = { ar, fr, en };

export function translate(locale: Locale, key: string): string {
  return dictionaries[locale]?.[key] ?? dictionaries.ar[key] ?? key;
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return LOCALE_LABELS[locale].dir;
}

// Locale-aware date formatting helpers
export function formatMatchLabel(locale: Locale, utcDate: string, state: string): string {
  try {
    const d = new Date(utcDate);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const h = d.getUTCHours().toString().padStart(2, "0");
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    const time = `${h}:${m}`;

    if (state === "live") return translate(locale, "match.live");
    if (state === "ft") return translate(locale, "match.finished");

    if (sameDay) {
      return `${translate(locale, "match.today")} ${time}`;
    }

    // Day name
    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayKey = dayKeys[d.getUTCDay()];
    const dayNames: Record<Locale, string[]> = {
      ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
      fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
    const idx = d.getUTCDay();
    return `${dayNames[locale][idx]} ${time}`;
  } catch {
    return utcDate;
  }
}

// Localized team name translation (some teams have alternate names)
export const TEAM_LABELS: Record<string, Partial<Record<Locale, string>>> = {
  "USA": { en: "USA", fr: "États-Unis", ar: "أمريكا" },
  "United States": { en: "United States", fr: "États-Unis", ar: "أمريكا" },
  "South Korea": { en: "South Korea", fr: "Corée du Sud", ar: "كوريا الجنوبية" },
  "Korea Republic": { en: "South Korea", fr: "Corée du Sud", ar: "كوريا الجنوبية" },
  "Czechia": { en: "Czechia", fr: "Tchéquie", ar: "التشيك" },
  "Czech Republic": { en: "Czech Republic", fr: "Tchéquie", ar: "التشيك" },
  "South Africa": { en: "South Africa", fr: "Afrique du Sud", ar: "جنوب أفريقيا" },
  "Bosnia-Herzegovina": { en: "Bosnia & Herzegovina", fr: "Bosnie-Herzégovine", ar: "البوسنة" },
  "Saudi Arabia": { en: "Saudi Arabia", fr: "Arabie Saoudite", ar: "السعودية" },
  "New Zealand": { en: "New Zealand", fr: "Nouvelle-Zélande", ar: "نيوزيلندا" },
  "Ivory Coast": { en: "Ivory Coast", fr: "Côte d'Ivoire", ar: "ساحل العاج" },
  "Côte d'Ivoire": { en: "Ivory Coast", fr: "Côte d'Ivoire", ar: "ساحل العاج" },
  "DR Congo": { en: "DR Congo", fr: "RD Congo", ar: "الكونغو" },
  "Cape Verde": { en: "Cape Verde", fr: "Cap-Vert", ar: "الرأس الأخضر" },
};

export function localizeTeamName(name: string | undefined, locale: Locale): string {
  if (!name) return "";
  const entry = TEAM_LABELS[name];
  if (entry?.[locale]) return entry[locale]!;
  return name;
}