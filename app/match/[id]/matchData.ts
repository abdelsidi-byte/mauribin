// ─── Flag Map ──────────────────────────────────────────────────────────────────
export const FLAG_MAP: Record<string, string> = {
  Belgium:"🇧🇪",Iran:"🇮🇷",Spain:"🇪🇸","Saudi Arabia":"🇸🇦",Tunisia:"🇹🇳",Japan:"🇯🇵",Ecuador:"🇪🇨","Cape Verde":"🇨🇻",
  Germany:"🇩🇪","Ivory Coast":"🇨🇮","Côte d'Ivoire":"🇨🇮",Netherlands:"🇳🇱",Sweden:"🇸🇪",Paraguay:"🇵🇾",
  Brazil:"🇧🇷",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",Morocco:"🇲🇦",
  USA:"🇺🇸","United States":"🇺🇸",Australia:"🇦🇺",Mexico:"🇲🇽","South Korea":"🇰🇷","New Zealand":"🇳🇿",
  Egypt:"🇪🇬",Argentina:"🇦🇷",Austria:"🇦🇹",France:"🇫🇷",Iraq:"🇮🇶",Norway:"🇳🇴",Senegal:"🇸🇳",Uruguay:"🇺🇾",
  England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Italy:"🇮🇹",Portugal:"🇵🇹",Switzerland:"🇨🇭",Croatia:"🇭🇷",
  "Bosnia-Herzegovina":"🇧🇦","Bosnia and Herzegovina":"🇧🇦","Bosnia":"🇧🇦",
  "Curaçao":"🇨🇼","DR Congo":"🇨🇩",Qatar:"🇶🇦",Jordan:"🇯🇴",Uzbekistan:"🇺🇿",
  Ghana:"🇬🇭",Algeria:"🇩🇿",Colombia:"🇨🇴",Panama:"🇵🇦","South Africa":"🇿🇦",Czechia:"🇨🇿",Turkey:"🇹🇷",
};

export function getFlag(name: string): string { return FLAG_MAP[name] || "🏳️"; }

// ─── Team Name Localization ─────────────────────────────────────────────────────
const TEAM_NAME_MAP: Record<string, string> = {
  "Mexico":"المكسيك","South Korea":"كوريا الجنوبية","South Africa":"جنوب أفريقيا",Czechia:"التشيك",
  "Canada":"كندا",Switzerland:"سويسرا",Qatar:"قطر","Bosnia-Herzegovina":"البوسنة والهرسك",
  Brazil:"البرازيل",Morocco:"المغرب",Scotland:"أسكتلندا",Haiti:"هايتي",
  USA:"الولايات المتحدة",Australia:"أستراليا",Paraguay:"باراغواي",Turkey:"تركيا",
  Germany:"ألمانيا","Ivory Coast":"ساحل العاج",Ecuador:"الإكوادور",Curaçao:"كوراساو",
  Netherlands:"هولندا",Sweden:"السويد",Japan:"اليابان",Tunisia:"تونس",
  Belgium:"بلجيكا",Iran:"إيران",Egypt:"مصر","New Zealand":"نيوزيلندا",
  Spain:"إسبانيا",Uruguay:"أوروغواي","Saudi Arabia":"السعودية","Cape Verde":"الرأس الأخضر",
  France:"فرنسا",Norway:"النرويج",Senegal:"السنغال",Iraq:"العراق",
  Argentina:"الأرجنتين",Austria:"النمسا",Algeria:"الجزائر",Jordan:"الأردن",
  Portugal:"البرتغال",Colombia:"كولومبيا","DR Congo":"الكونغو",Uzbekistan:"أوزبكستان",
  England:"إنجلترا",Croatia:"كرواتيا",Ghana:"غانا",Panama:"بنما",
};

export function localizeTeam(name: string): string { return TEAM_NAME_MAP[name] || name; }

// ─── Match Data Type ───────────────────────────────────────────────────────────
export type MatchEvent = {
  minute: string;
  team: "home" | "away";
  player: string;
  assist?: string;
  type: string;
};

export type MatchStats = Record<string, { home: string; away: string }>;

export type MatchEntry = {
  id?: number;
  slug: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  state: "live" | "ft" | "upcoming";
  label: string;
  date?: string;
  league?: string;
  group?: string;
  venue?: string;
  elapsed?: number;
  stats?: MatchStats;
  events?: MatchEvent[];
};

// ─── All World Cup 2026 Match Data ───────────────────────────────────────────
export const MATCH_DATA: MatchEntry[] = [
  // ─── GROUP A ───────────────────────────────────────────────────────────────
  {
    slug: "mexico-vs-south-africa", home: "Mexico", away: "South Africa",
    homeScore: 2, awayScore: 0, state: "ft", label: "انتهت 2-0",
    date: "2026-06-11T19:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب مرصد القاهرة", elapsed: 90,
    stats: {
      "Shots":{home:"12",away:"5"},"Shots on Goal":{home:"6",away:"2"},
      "Ball Possession":{home:"58%",away:"42%"},"Pass Accuracy":{home:"87%",away:"79%"},
      "Fouls":{home:"10",away:"14"},"Yellow Cards":{home:"1",away:"2"},
      "Offsides":{home:"3",away:"1"},"Corner Kicks":{home:"5",away:"3"},
    },
    events: [
      {minute:"23",team:"home",player:"Julián Álvarez",type:"goal"},
      {minute:"67",team:"home",player:"Henry Martín",type:"goal"},
    ],
  },
  {
    slug: "south-korea-vs-czechia", home: "South Korea", away: "Czechia",
    homeScore: 2, awayScore: 1, state: "ft", label: "انتهت 2-1",
    date: "2026-06-12T02:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب الغردقة", elapsed: 90,
    stats: {
      "Shots":{home:"14",away:"8"},"Shots on Goal":{home:"5",away:"3"},
      "Ball Possession":{home:"45%",away:"55%"},"Pass Accuracy":{home:"82%",away:"86%"},
      "Fouls":{home:"12",away:"9"},"Yellow Cards":{home:"0",away:"1"},
    },
    events: [
      {minute:"34",team:"away",player:"Patrik Schick",type:"goal"},
      {minute:"56",team:"home",player:"Son Heung-min",type:"goal"},
      {minute:"89",team:"home",player:"Hwang Hee-chan",type:"goal"},
    ],
  },
  {
    slug: "mexico-vs-south-korea", home: "Mexico", away: "South Korea",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-19T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب القاهرة الدولي", elapsed: 90,
    events: [
      {minute:"45+2",team:"home",player:"Luis Chávez",type:"goal"},
    ],
  },
  {
    slug: "south-africa-vs-czechia", home: "South Africa", away: "Czechia",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-18T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب الاسماعيلية", elapsed: 90,
    events: [
      {minute:"22",team:"away",player:"Tomáš Souček",type:"goal"},
      {minute:"78",team:"home",player:"Percy Tau",type:"goal"},
    ],
  },
  {
    slug: "south-africa-vs-south-korea", home: "South Africa", away: "South Korea",
    homeScore: 0, awayScore: 0, state: "ft", label: "انتهت 0-0",
    date: "2026-06-25T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب مرصد القاهرة", elapsed: 90,
    stats: {
      "Shots":{home:"8",away:"11"},"Ball Possession":{home:"42%",away:"58%"},
      "Pass Accuracy":{home:"76%",away:"84%"},"Fouls":{home:"14",away:"11"},
    },
  },
  {
    slug: "czechia-vs-mexico", home: "Czechia", away: "Mexico",
    homeScore: 0, awayScore: 1, state: "ft", label: "انتهت 0-1",
    date: "2026-06-25T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة أ",
    venue: "ملعب الغردقة", elapsed: 90,
    events: [
      {minute:"55",team:"away",player:"Raúl Jiménez",type:"goal"},
    ],
  },

  // ─── GROUP B ───────────────────────────────────────────────────────────────
  {
    slug: "canada-vs-bosnia-herzegovina", home: "Canada", away: "Bosnia-Herzegovina",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-12T19:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب العلمين", elapsed: 90,
    events: [
      {minute:"30",team:"home",player:"Cyle Larin",type:"goal"},
      {minute:"72",team:"away",player:"Edin Džeko",type:"goal"},
    ],
  },
  {
    slug: "qatar-vs-switzerland", home: "Qatar", away: "Switzerland",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-13T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب الوكرة", elapsed: 90,
    events: [
      {minute:"18",team:"home",player:"Almoez Ali",type:"goal"},
      {minute:"67",team:"away",player:"Xherdan Shaqiri",type:"goal"},
    ],
  },
  {
    slug: "switzerland-vs-bosnia-herzegovina", home: "Switzerland", away: "Bosnia-Herzegovina",
    homeScore: 4, awayScore: 1, state: "ft", label: "انتهت 4-1",
    date: "2026-06-18T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب الدوحة", elapsed: 90,
    events: [
      {minute:"12",team:"home",player:"Granit Xhaka",type:"goal"},
      {minute:"34",team:"home",player:"Remo Freuler",type:"goal"},
      {minute:"58",team:"home",player:"Noah Okafor",type:"goal"},
      {minute:"77",team:"away",player:"Rade Krunić",type:"goal"},
      {minute:"88",team:"home",player:"Zeki Amdouni",type:"goal"},
    ],
  },
  {
    slug: "canada-vs-qatar", home: "Canada", away: "Qatar",
    homeScore: 4, awayScore: 0, state: "ft", label: "انتهت 4-0",
    date: "2026-06-18T19:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب رفاق", elapsed: 90,
    events: [
      {minute:"23",team:"home",player:"Alphonso Davies",type:"goal"},
      {minute:"41",team:"home",player:"Jonathan David",type:"goal"},
      {minute:"55",team:"home",player:"Cyle Larin",type:"goal"},
      {minute:"83",team:"home",player:"Jacob Shaffelburg",type:"goal"},
    ],
  },
  {
    slug: "switzerland-vs-canada", home: "Switzerland", away: "Canada",
    homeScore: 2, awayScore: 1, state: "ft", label: "انتهت 2-1",
    date: "2026-06-24T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب الدوحة", elapsed: 90,
    events: [
      {minute:"15",team:"home",player:"Breel Embolo",type:"goal"},
      {minute:"38",team:"home",player:"Xherdan Shaqiri",type:"goal"},
      {minute:"63",team:"away",player:"Jonathan David",type:"goal"},
    ],
  },
  {
    slug: "bosnia-herzegovina-vs-qatar", home: "Bosnia-Herzegovina", away: "Qatar",
    homeScore: 3, awayScore: 1, state: "ft", label: "انتهت 3-1",
    date: "2026-06-24T19:00:00Z", league: "كأس العالم 2026", group: "المجموعة ب",
    venue: "ملعب الوكرة", elapsed: 90,
    events: [
      {minute:"20",team:"home",player:"Edin Džeko",type:"goal"},
      {minute:"44",team:"away",player:"Akram Afif",type:"goal"},
      {minute:"62",team:"home",player:"Milan Badelj",type:"goal"},
      {minute:"81",team:"home",player:"Rade Krunić",type:"goal"},
    ],
  },

  // ─── GROUP C ───────────────────────────────────────────────────────────────
  {
    slug: "brazil-vs-morocco", home: "Brazil", away: "Morocco",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-13T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب أسوان", elapsed: 90,
    events: [
      {minute:"35",team:"home",player:"Rodri",type:"goal"},
      {minute:"70",team:"away",player:"Hakim Ziyech",type:"goal"},
    ],
  },
  {
    slug: "haiti-vs-scotland", home: "Haiti", away: "Scotland",
    homeScore: 0, awayScore: 1, state: "ft", label: "انتهت 0-1",
    date: "2026-06-14T20:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب الأقصر", elapsed: 90,
    events: [
      {minute:"58",team:"away",player:"John McGinn",type:"goal"},
    ],
  },
  {
    slug: "scotland-vs-brazil", home: "Scotland", away: "Brazil",
    homeScore: 0, awayScore: 3, state: "ft", label: "انتهت 0-3",
    date: "2026-06-24T22:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب أسوان", elapsed: 90,
    events: [
      {minute:"22",team:"away",player:"Vinicius Jr",type:"goal"},
      {minute:"56",team:"away",player:"Rodri",type:"goal"},
      {minute:"79",team:"away",player:"Raphinha",type:"goal"},
    ],
  },
  {
    slug: "morocco-vs-haiti", home: "Morocco", away: "Haiti",
    homeScore: 4, awayScore: 2, state: "ft", label: "انتهت 4-2",
    date: "2026-06-24T22:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب الأقصر", elapsed: 90,
    events: [
      {minute:"15",team:"home",player:"Achraf Hakimi",type:"goal"},
      {minute:"33",team:"away",player:"Frantzdy Pierrot",type:"goal"},
      {minute:"48",team:"home",player:"Hakim Ziyech",type:"goal"},
      {minute:"62",team:"away",player:"Derrick Locana",type:"goal"},
      {minute:"75",team:"home",player:"Youssef En-Nesyri",type:"goal"},
      {minute:"88",team:"home",player:"Sofiane Boufal",type:"goal"},
    ],
  },
  {
    slug: "scotland-vs-morocco", home: "Scotland", away: "Morocco",
    homeScore: 0, awayScore: 1, state: "ft", label: "انتهت 0-1",
    date: "2026-06-19T22:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب أسوان", elapsed: 90,
    events: [
      {minute:"72",team:"away",player:"Youssef En-Nesyri",type:"goal"},
    ],
  },
  {
    slug: "brazil-vs-haiti", home: "Brazil", away: "Haiti",
    homeScore: 3, awayScore: 0, state: "ft", label: "انتهت 3-0",
    date: "2026-06-20T22:00:00Z", league: "كأس العالم 2026", group: "المجموعة ج",
    venue: "ملعب الأقصر", elapsed: 90,
    events: [
      {minute:"30",team:"home",player:"Neymar Jr",type:"goal"},
      {minute:"55",team:"home",player:"Rodri",type:"goal"},
      {minute:"87",team:"home",player:"Raphinha",type:"goal"},
    ],
  },

  // ─── GROUP D ───────────────────────────────────────────────────────────────
  {
    slug: "usa-vs-paraguay", home: "USA", away: "Paraguay",
    homeScore: 4, awayScore: 1, state: "ft", label: "انتهت 4-1",
    date: "2026-06-13T02:00:00Z", league: "كأس العالم 2026", group: "المجموعة د",
    venue: "ملعب لوس أنجلوس", elapsed: 90,
    events: [
      {minute:"12",team:"home",player:"Christian Pulisic",type:"goal"},
      {minute:"28",team:"away",player:"Antonio Sanabria",type:"goal"},
      {minute:"45",team:"home",player:"Brenden Aaronson",type:"goal"},
      {minute:"67",team:"home",player:"Weston McKennie",type:"goal"},
      {minute:"82",team:"home",player:"Timothy Weah",type:"goal"},
    ],
  },
  {
    slug: "australia-vs-turkey", home: "Australia", away: "Turkey",
    homeScore: 2, awayScore: 0, state: "ft", label: "انتهت 2-0",
    date: "2026-06-14T02:00:00Z", league: "كأس العالم 2026", group: "المجموعة د",
    venue: "ملعب سياتل", elapsed: 90,
    events: [
      {minute:"41",team:"home",player:"Mitchell Duke",type:"goal"},
      {minute:"78",team:"home",player:"Awer Mabil",type:"goal"},
    ],
  },
  {
    slug: "usa-vs-australia", home: "USA", away: "Australia",
    homeScore: 2, awayScore: 0, state: "ft", label: "انتهت 2-0",
    date: "2026-06-19T02:00:00Z", league: "كأس العالم 2026", group: "المجموعة د",
    venue: "ملعب هيوستن", elapsed: 90,
    events: [
      {minute:"23",team:"home",player:"Christian Pulisic",type:"goal"},
      {minute:"71",team:"home",player:"Josh Sargent",type:"goal"},
    ],
  },
  {
    slug: "turkey-vs-paraguay", home: "Turkey", away: "Paraguay",
    homeScore: 0, awayScore: 1, state: "ft", label: "انتهت 0-1",
    date: "2026-06-20T02:00:00Z", league: "كأس العالم 2026", group: "المجموعة د",
    venue: "ملعب لوس أنجلوس", elapsed: 90,
    events: [
      {minute:"65",team:"away",player:"Mathías Olivera",type:"goal"},
    ],
  },

  // ─── GROUP E ───────────────────────────────────────────────────────────────
  {
    slug: "germany-vs-curaçao", home: "Germany", away: "Curaçao",
    homeScore: 7, awayScore: 1, state: "ft", label: "انتهت 7-1",
    date: "2026-06-14T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب ميونخ", elapsed: 90,
    events: [
      {minute:"8",team:"home",player:"Kai Havertz",type:"goal"},
      {minute:"19",team:"home",player:"Jamal Musiala",type:"goal"},
      {minute:"29",team:"away",player:"Cuco Martina",type:"goal"},
      {minute:"45",team:"home",player:"Florian Wirtz",type:"goal"},
      {minute:"58",team:"home",player:"Leroy Sané",type:"goal"},
      {minute:"66",team:"home",player:"Thomas Müller",type:"goal"},
      {minute:"74",team:"home",player:"Kai Havertz",type:"goal"},
      {minute:"89",team:"home",player:"Niclas Füllkrug",type:"goal"},
    ],
  },
  {
    slug: "ivory-coast-vs-ecuador", home: "Ivory Coast", away: "Ecuador",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-14T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب دوسلدورف", elapsed: 90,
    events: [
      {minute:"55",team:"home",player:"Nicolas Pépé",type:"goal"},
    ],
  },
  {
    slug: "germany-vs-ivory-coast", home: "Germany", away: "Ivory Coast",
    homeScore: 2, awayScore: 1, state: "ft", label: "انتهت 2-1",
    date: "2026-06-20T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب فرانكفورت", elapsed: 90,
    events: [
      {minute:"15",team:"home",player:"Jamal Musiala",type:"goal"},
      {minute:"38",team:"away",player:"Sébastien Haller",type:"goal"},
      {minute:"82",team:"home",player:"Kai Havertz",type:"goal"},
    ],
  },
  {
    slug: "ecuador-vs-curaçao", home: "Ecuador", away: "Curaçao",
    homeScore: 0, awayScore: 0, state: "ft", label: "انتهت 0-0",
    date: "2026-06-21T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب لايبزيغ", elapsed: 90,
  },
  {
    slug: "germany-vs-ecuador", home: "Germany", away: "Ecuador",
    homeScore: 2, awayScore: 1, state: "ft", label: "انتهت 2-1",
    date: "2026-06-26T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب ميونخ", elapsed: 90,
    events: [
      {minute:"20",team:"home",player:"Jamal Musiala",type:"goal"},
      {minute:"45+2",team:"home",player:"Florian Wirtz",type:"goal"},
      {minute:"67",team:"away",player:"Enner Valencia",type:"goal"},
    ],
  },
  {
    slug: "ivory-coast-vs-curaçao", home: "Ivory Coast", away: "Curaçao",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-26T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة هـ",
    venue: "ملعب دوسلدورف", elapsed: 90,
    events: [
      {minute:"34",team:"home",player:"Nicolas Pépé",type:"goal"},
    ],
  },

  // ─── GROUP F ───────────────────────────────────────────────────────────────
  {
    slug: "netherlands-vs-japan", home: "Netherlands", away: "Japan",
    homeScore: 2, awayScore: 2, state: "ft", label: "انتهت 2-2",
    date: "2026-06-14T11:00:00Z", league: "كأس العالم 2026", group: "المجموعة و",
    venue: "ملعب روتردام", elapsed: 90,
    events: [
      {minute:"22",team:"home",player:"Cody Gakpo",type:"goal"},
      {minute:"41",team:"away",player:"Daizen Maeda",type:"goal"},
      {minute:"58",team:"away",player:"Takefusa Kubo",type:"goal"},
      {minute:"76",team:"home",player:"Xavi Simons",type:"goal"},
    ],
  },
  {
    slug: "sweden-vs-tunisia", home: "Sweden", away: "Tunisia",
    homeScore: 5, awayScore: 1, state: "ft", label: "انتهت 5-1",
    date: "2026-06-15T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة و",
    venue: "ملعب ستوكهولم", elapsed: 90,
    events: [
      {minute:"14",team:"home",player:"Alexander Isak",type:"goal"},
      {minute:"28",team:"away",player:"Walid Ismail",type:"goal"},
      {minute:"45",team:"home",player:"Dejan Kulusevski",type:"goal"},
      {minute:"61",team:"home",player:"Viktor Gyökeres",type:"goal"},
      {minute:"75",team:"home",player:"Anthony Elanga",type:"goal"},
      {minute:"88",team:"home",player:"Alexander Isak",type:"goal"},
    ],
  },
  {
    slug: "japan-vs-tunisia", home: "Japan", away: "Tunisia",
    homeScore: 4, awayScore: 0, state: "ft", label: "انتهت 4-0",
    date: "2026-06-21T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة و",
    venue: "ملعب طوكيو", elapsed: 90,
    events: [
      {minute:"19",team:"home",player:"Daizen Maeda",type:"goal"},
      {minute:"43",team:"home",player:"Takefusa Kubo",type:"goal"},
      {minute:"62",team:"home",player:"Koki Saito",type:"goal"},
      {minute:"84",team:"home",player:"Takumi Minamino",type:"goal"},
    ],
  },
  {
    slug: "netherlands-vs-sweden", home: "Netherlands", away: "Sweden",
    homeScore: 5, awayScore: 1, state: "ft", label: "انتهت 5-1",
    date: "2026-06-20T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة و",
    venue: "ملعب أمستردام", elapsed: 90,
    events: [
      {minute:"12",team:"home",player:"Cody Gakpo",type:"goal"},
      {minute:"33",team:"home",player:"Xavi Simons",type:"goal"},
      {minute:"48",team:"home",player:"Donyell Malen",type:"goal"},
      {minute:"59",team:"away",player:"Viktor Gyökeres",type:"goal"},
      {minute:"71",team:"home",player:"Wout Weghorst",type:"goal"},
      {minute:"85",team:"home",player:"Brian Brobbey",type:"goal"},
    ],
  },

  // ─── GROUP G ───────────────────────────────────────────────────────────────
  {
    slug: "belgium-vs-iran", home: "Belgium", away: "Iran",
    homeScore: 0, awayScore: 0, state: "ft", label: "انتهت 0-0",
    date: "2026-06-15T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ز",
    venue: "ملعب بروكسل", elapsed: 90,
  },
  {
    slug: "new-zealand-vs-egypt", home: "New Zealand", away: "Egypt",
    homeScore: 1, awayScore: 3, state: "ft", label: "انتهت 1-3",
    date: "2026-06-15T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ز",
    venue: "ملعب أوكلاند", elapsed: 90,
    events: [
      {minute:"23",team:"away",player:"Mohamed Salah",type:"goal"},
      {minute:"41",team:"home",player:"Chris Wood",type:"goal"},
      {minute:"67",team:"away",player:"Omar Marmoush",type:"goal"},
      {minute:"88",team:"away",player:"Mostafa Mohamed",type:"goal"},
    ],
  },
  {
    slug: "belgium-vs-new-zealand", home: "Belgium", away: "New Zealand",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-21T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ز",
    venue: "ملعب بروكسل", elapsed: 90,
    events: [
      {minute:"34",team:"home",player:"Romelu Lukaku",type:"goal"},
      {minute:"72",team:"away",player:"Chris Wood",type:"goal"},
    ],
  },
  {
    slug: "egypt-vs-iran", home: "Egypt", away: "Iran",
    homeScore: 1, awayScore: 1, state: "ft", label: "انتهت 1-1",
    date: "2026-06-16T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ز",
    venue: "ملعب القاهرة", elapsed: 90,
    events: [
      {minute:"28",team:"home",player:"Mohamed Salah",type:"goal"},
      {minute:"74",team:"away",player:"Sardar Azmoun",type:"goal"},
    ],
  },

  // ─── GROUP H ───────────────────────────────────────────────────────────────
  {
    slug: "spain-vs-saudi-arabia", home: "Spain", away: "Saudi Arabia",
    homeScore: 4, awayScore: 0, state: "ft", label: "انتهت 4-0",
    date: "2026-06-21T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ح",
    venue: "ملعب إشبيلية", elapsed: 90,
    events: [
      {minute:"18",team:"home",player:"Lamine Yamal",type:"goal"},
      {minute:"37",team:"home",player:"Pedri",type:"goal"},
      {minute:"55",team:"home",player:"Álvaro Morata",type:"goal"},
      {minute:"78",team:"home",player:"Bryan Gil",type:"goal"},
    ],
  },
  {
    slug: "uruguay-vs-cape-verde", home: "Uruguay", away: "Cape Verde",
    homeScore: 2, awayScore: 2, state: "ft", label: "انتهت 2-2",
    date: "2026-06-21T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ح",
    venue: "ملعب مونتيفيديو", elapsed: 90,
    events: [
      {minute:"23",team:"home",player:"Darwin Núñez",type:"goal"},
      {minute:"41",team:"away",player:"Garry Rodrigues",type:"goal"},
      {minute:"67",team:"away",player:"Nuno Lopes",type:"goal"},
      {minute:"83",team:"home",player:"Luis Suárez",type:"goal"},
    ],
  },
  {
    slug: "spain-vs-cape-verde", home: "Spain", away: "Cape Verde",
    homeScore: 0, awayScore: 0, state: "ft", label: "انتهت 0-0",
    date: "2026-06-15T11:00:00Z", league: "كأس العالم 2026", group: "المجموعة ح",
    venue: "ملعب إشبيلية", elapsed: 90,
  },
  {
    slug: "saudi-arabia-vs-uruguay", home: "Saudi Arabia", away: "Uruguay",
    homeScore: 0, awayScore: 1, state: "ft", label: "انتهت 0-1",
    date: "2026-06-15T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ح",
    venue: "ملعب الرياض", elapsed: 90,
    events: [
      {minute:"89",team:"away",player:"Maximiliano Gómez",type:"goal"},
    ],
  },

  // ─── GROUP I ───────────────────────────────────────────────────────────────
  {
    slug: "france-vs-senegal", home: "France", away: "Senegal",
    homeScore: 3, awayScore: 1, state: "ft", label: "انتهت 3-1",
    date: "2026-06-16T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ط",
    venue: "ملعب باريس", elapsed: 90,
    events: [
      {minute:"22",team:"home",player:"Kylian Mbappé",type:"goal"},
      {minute:"44",team:"away",player:"Ismaila Sarr",type:"goal"},
      {minute:"67",team:"home",player:"Antoine Griezmann",type:"goal"},
      {minute:"88",team:"home",player:"Randal Kolo Muani",type:"goal"},
    ],
  },
  {
    slug: "norway-vs-iraq", home: "Norway", away: "Iraq",
    homeScore: 4, awayScore: 1, state: "ft", label: "انتهت 4-1",
    date: "2026-06-16T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ط",
    venue: "ملعب أوسلو", elapsed: 90,
    events: [
      {minute:"19",team:"home",player:"Erling Haaland",type:"goal"},
      {minute:"33",team:"away",player:"Ahmad Jalal",type:"goal"},
      {minute:"52",team:"home",player:"Martin Ødegaard",type:"goal"},
      {minute:"71",team:"home",player:"Jorgen Strand Larsen",type:"goal"},
      {minute:"86",team:"home",player:"Alexander Sørloth",type:"goal"},
    ],
  },
  {
    slug: "france-vs-iraq", home: "France", away: "Iraq",
    homeScore: 3, awayScore: 0, state: "ft", label: "انتهت 3-0",
    date: "2026-06-22T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ط",
    venue: "ملعب مارسيليا", elapsed: 90,
    events: [
      {minute:"28",team:"home",player:"Ousmane Dembélé",type:"goal"},
      {minute:"55",team:"home",player:"Kylian Mbappé",type:"goal"},
      {minute:"79",team:"home",player:"Randal Kolo Muani",type:"goal"},
    ],
  },
  {
    slug: "norway-vs-senegal", home: "Norway", away: "Senegal",
    homeScore: 3, awayScore: 2, state: "ft", label: "انتهت 3-2",
    date: "2026-06-23T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ط",
    venue: "ملعب أوسلو", elapsed: 90,
    events: [
      {minute:"18",team:"home",player:"Erling Haaland",type:"goal"},
      {minute:"34",team:"home",player:"Jorgen Strand Larsen",type:"goal"},
      {minute:"47",team:"away",player:"Boulaye Dia",type:"goal"},
      {minute:"63",team:"away",player:"Ismaila Sarr",type:"goal"},
      {minute:"82",team:"home",player:"Martin Ødegaard",type:"goal"},
    ],
  },

  // ─── GROUP J ───────────────────────────────────────────────────────────────
  {
    slug: "argentina-vs-austria", home: "Argentina", away: "Austria",
    homeScore: 3, awayScore: 0, state: "ft", label: "انتهت 3-0",
    date: "2026-06-17T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ي",
    venue: "ملعب بوينس آيرس", elapsed: 90,
    events: [
      {minute:"15",team:"home",player:"Lionel Messi",type:"goal"},
      {minute:"44",team:"home",player:"Julian Alvarez",type:"goal"},
      {minute:"78",team:"home",player:"Lautaro Martinez",type:"goal"},
    ],
  },
  {
    slug: "jordan-vs-algeria", home: "Jordan", away: "Algeria",
    homeScore: 1, awayScore: 2, state: "ft", label: "انتهت 1-2",
    date: "2026-06-17T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ي",
    venue: "ملعب عمّان", elapsed: 90,
    events: [
      {minute:"31",team:"away",player:"Riyad Mahrez",type:"goal"},
      {minute:"55",team:"home",player:"Yazan Al-Naimat",type:"goal"},
      {minute:"87",team:"away",player:" Baghdad Bounedjah",type:"goal"},
    ],
  },
  {
    slug: "argentina-vs-algeria", home: "Argentina", away: "Algeria",
    homeScore: 3, awayScore: 0, state: "ft", label: "انتهت 3-0",
    date: "2026-06-22T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ي",
    venue: "ملعب قرطبة", elapsed: 90,
    events: [
      {minute:"23",team:"home",player:"Julian Alvarez",type:"goal"},
      {minute:"56",team:"home",player:"Lautaro Martinez",type:"goal"},
      {minute:"82",team:"home",player:"Lionel Messi",type:"goal"},
    ],
  },
  {
    slug: "austria-vs-jordan", home: "Austria", away: "Jordan",
    homeScore: 3, awayScore: 1, state: "ft", label: "انتهت 3-1",
    date: "2026-06-23T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ي",
    venue: "ملعب فيينا", elapsed: 90,
    events: [
      {minute:"19",team:"home",player:"Marko Arnautovic",type:"goal"},
      {minute:"37",team:"home",player:"Marcel Sabitzer",type:"goal"},
      {minute:"58",team:"away",player:"Mousa Al-Tamari",type:"goal"},
      {minute:"79",team:"home",player:"Marko Arnautovic",type:"goal"},
    ],
  },

  // ─── GROUP K ───────────────────────────────────────────────────────────────
  {
    slug: "portugal-vs-uzbekistan", home: "Portugal", away: "Uzbekistan",
    homeScore: 5, awayScore: 0, state: "ft", label: "انتهت 5-0",
    date: "2026-06-23T15:00:00Z", league: "كأس العالم 2026", group: "المجموعة ك",
    venue: "ملعب لشبونة", elapsed: 90,
    events: [
      {minute:"18",team:"home",player:"Cristiano Ronaldo",type:"goal"},
      {minute:"32",team:"home",player:"Bruno Fernandes",type:"goal"},
      {minute:"45",team:"home",player:"Rafael Leão",type:"goal"},
      {minute:"63",team:"home",player:"Pedro Neto",type:"goal"},
      {minute:"81",team:"home",player:"Rúben Neves",type:"goal"},
    ],
  },
  {
    slug: "colombia-vs-dr-congo", home: "Colombia", away: "DR Congo",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-24T15:00:00Z", league: "كأس العالم 2026", group: "المجموعة ك",
    venue: "ملعب بوغوتا", elapsed: 90,
    events: [
      {minute:"66",team:"home",player:"Jhon Córdoba",type:"goal"},
    ],
  },

  // ─── GROUP L ───────────────────────────────────────────────────────────────
  {
    slug: "england-vs-croatia", home: "England", away: "Croatia",
    homeScore: 4, awayScore: 2, state: "ft", label: "انتهت 4-2",
    date: "2026-06-17T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ل",
    venue: "ملعب لندن", elapsed: 90,
    events: [
      {minute:"17",team:"home",player:"Harry Kane",type:"goal"},
      {minute:"28",team:"away",player:"Luka Modrić",type:"goal"},
      {minute:"45",team:"home",player:"Bukayo Saka",type:"goal"},
      {minute:"62",team:"away",player:"Andrej Kramarić",type:"goal"},
      {minute:"74",team:"home",player:"Cole Palmer",type:"goal"},
      {minute:"88",team:"home",player:"Harry Kane",type:"goal"},
    ],
  },
  {
    slug: "ghana-vs-panama", home: "Ghana", away: "Panama",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-17T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ل",
    venue: "ملعب أكرا", elapsed: 90,
    events: [
      {minute:"52",team:"home",player:"Mohammed Kudus",type:"goal"},
    ],
  },
  {
    slug: "england-vs-ghana", home: "England", away: "Ghana",
    homeScore: 0, awayScore: 0, state: "ft", label: "انتهت 0-0",
    date: "2026-06-23T14:00:00Z", league: "كأس العالم 2026", group: "المجموعة ل",
    venue: "ملعب لندن", elapsed: 90,
  },
  {
    slug: "croatia-vs-panama", home: "Croatia", away: "Panama",
    homeScore: 1, awayScore: 0, state: "ft", label: "انتهت 1-0",
    date: "2026-06-25T17:00:00Z", league: "كأس العالم 2026", group: "المجموعة ل",
    venue: "ملعب زغرب", elapsed: 90,
    events: [
      {minute:"71",team:"home",player:"Luka Modrić",type:"goal"},
    ],
  },
];

// Helper to find match by slug or id
export function findMatch(id: string): MatchEntry | undefined {
  return MATCH_DATA.find(m => {
    if (m.slug?.toLowerCase() === id.toLowerCase()) return true;
    if (m.id && String(m.id) === id) return true;
    return false;
  });
}
