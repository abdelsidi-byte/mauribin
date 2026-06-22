"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import {
  TEAMS,
  GROUPS,
  SCHEDULE,
  GROUP_STANDINGS,
  type Match,
  type Team,
} from "@/lib/worldcup-data";

const STAGE_LABELS: Record<Match["stage"], string> = {
  group: "دور المجموعات",
  round16: "دور الـ 16",
  quarter: "ربع النهائي",
  semi: "نصف النهائي",
  third: "مباراة المركز الثالث",
  final: "النهائي",
};

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const trimmed = query.trim();
  // Case-insensitive substring highlight that works for both English and Arabic.
  const regex = new RegExp(
    `(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-[#ffd700]/30 text-[#ffd700] rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function formatArabicDate(date: string) {
  // Date is already a YYYY-MM-DD string. Render it in a simple way.
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const hasQuery = trimmed.length > 0;

  // ----- Team results -----
  const teamResults: Team[] = useMemo(() => {
    if (!hasQuery) return [];
    return TEAMS.filter((t) => {
      return (
        t.name.toLowerCase().includes(trimmed) ||
        t.group.toLowerCase() === trimmed
      );
    });
  }, [trimmed, hasQuery]);

  // ----- Group results (by group letter A..L or by Arabic keywords) -----
  const groupResults: string[] = useMemo(() => {
    if (!hasQuery) return [];
    const arabic = ["أ", "ب", "ج", "د", "ه", "و", "ز", "ح", "ط", "ي", "ك", "ل"];
    return GROUPS.filter((g) => {
      const groupNameAr = `المجموعة ${arabic[GROUPS.indexOf(g)] ?? g}`;
      return (
        g.toLowerCase().includes(trimmed) ||
        groupNameAr.includes(trimmed) ||
        "المجموعة".includes(trimmed) ||
        trimmed === "group"
      );
    });
  }, [trimmed, hasQuery]);

  // ----- Match results -----
  const matchResults: Match[] = useMemo(() => {
    if (!hasQuery) return [];
    return SCHEDULE.filter((m) => {
      return (
        m.home.toLowerCase().includes(trimmed) ||
        m.away.toLowerCase().includes(trimmed) ||
        (m.group ?? "").toLowerCase().includes(trimmed) ||
        (m.venue ?? "").toLowerCase().includes(trimmed) ||
        (m.city ?? "").toLowerCase().includes(trimmed) ||
        (m.label ?? "").toLowerCase().includes(trimmed) ||
        STAGE_LABELS[m.stage]?.includes(trimmed)
      );
    }).slice(0, 30);
  }, [trimmed, hasQuery]);

  const totalResults =
    teamResults.length + groupResults.length + matchResults.length;

  const suggestions = [
    "البرازيل",
    "المغرب",
    "فرنسا",
    "المجموعة A",
    "النهائي",
    "Germany",
  ];

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Background flourishes */}
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-96 h-64 bg-[#006233]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />

        <div className="container mx-auto px-4 py-10 md:py-14 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">🔎</span>
              <span className="text-[#ffd700] font-bold">البحث في موريبين</span>
              <span className="text-2xl">🔎</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              ابحث عن منتخباتك ومبارياتك
            </h1>
            <p className="text-[#f1f5f9]/80 mb-8">
              ابحث بالاسم العربي أو الإنجليزي، أو بحرف المجموعة، أو باسم
              الملعب، أو بمرحلة البطولة.
            </p>

            {/* Search input */}
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />

            {/* Stats / hint row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              {hasQuery ? (
                <span className="px-3 py-1.5 rounded-full bg-[#006233]/40 border border-[#ffd700]/30 text-[#ffd700] font-semibold">
                  {totalResults} نتيجة عن “{query.trim()}”
                </span>
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                    {TEAMS.length} منتخب
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                    {SCHEDULE.length} مباراة
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f1f5f9]/70">
                    {GROUPS.length} مجموعة
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* EMPTY STATE: no query at all */}
        {!hasQuery && (
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto border border-[#ffd700]/20">
            <div className="text-6xl mb-4 float">⚽</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              ابدأ بكتابة كلمة للبحث
            </h2>
            <p className="text-[#f1f5f9]/70 mb-6 leading-relaxed">
              يمكنك البحث عن أي منتخب، مباراة، ملعب، مدينة، أو مجموعة. جرّب
              أحد الاقتراحات التالية:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006233]/40 to-[#006233]/20 border border-[#ffd700]/20 hover:border-[#ffd700]/60 hover:from-[#ffd700]/20 hover:to-[#d01c1f]/10 text-sm text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="glass rounded-xl p-4 border border-white/5">
                <div className="text-2xl mb-1">👥</div>
                <div className="font-semibold text-white">المنتخبات</div>
                <div className="text-[#f1f5f9]/60 text-xs">48 منتخباً</div>
              </div>
              <div className="glass rounded-xl p-4 border border-white/5">
                <div className="text-2xl mb-1">⚔️</div>
                <div className="font-semibold text-white">المباريات</div>
                <div className="text-[#f1f5f9]/60 text-xs">من المجموعات للنهائي</div>
              </div>
              <div className="glass rounded-xl p-4 border border-white/5">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-semibold text-white">المجموعات</div>
                <div className="text-[#f1f5f9]/60 text-xs">من A إلى L</div>
              </div>
            </div>
          </div>
        )}

        {/* NO RESULTS state */}
        {hasQuery && totalResults === 0 && (
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto border border-[#d01c1f]/30">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d01c1f]/20 border border-[#d01c1f]/40 mb-4">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              لا توجد نتائج لـ “{query.trim()}”
            </h2>
            <p className="text-[#f1f5f9]/70 mb-6 leading-relaxed">
              تأكد من الإملاء، أو جرّب كلمة أخرى. يمكنك أيضاً تصفح المحتوى من
              الروابط أدناه.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/teams"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006233] to-[#007a40] border border-[#ffd700]/30 text-white font-semibold hover:from-[#007a40] hover:to-[#006233] transition-all"
              >
                كل المنتخبات
              </Link>
              <Link
                href="/schedule"
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                جدول المباريات
              </Link>
              <Link
                href="/groups"
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                المجموعات
              </Link>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {hasQuery && totalResults > 0 && (
          <div className="space-y-10">
            {/* TEAMS */}
            {teamResults.length > 0 && (
              <ResultSection
                title="المنتخبات"
                icon="👥"
                count={teamResults.length}
                accent="green"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamResults.map((team) => {
                    const standings =
                      GROUP_STANDINGS[team.group]?.find(
                        (s) => s.team === team.name
                      ) ?? null;
                    return (
                      <Link
                        key={team.name}
                        href={`/groups#group-${team.group}`}
                        className="glass-card rounded-2xl p-4 border border-white/5 hover:border-[#ffd700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all group card-hover block"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-[#006233]/40 border border-[#ffd700]/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            {team.flag}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold truncate">
                              {highlight(team.name, query)}
                            </div>
                            <div className="text-xs text-[#f1f5f9]/60 mt-0.5 flex items-center gap-1">
                              <span>المجموعة</span>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#ffd700]/20 border border-[#ffd700]/40 text-[#ffd700] font-bold text-[10px]">
                                {team.group}
                              </span>
                            </div>
                          </div>
                        </div>
                        {standings && (
                          <div className="flex items-center justify-between text-[11px] text-[#f1f5f9]/70 border-t border-white/5 pt-3">
                            <span>
                              لعب{" "}
                              <span className="text-white font-semibold">
                                {standings.played}
                              </span>
                            </span>
                            <span>
                              ف{" "}
                              <span className="text-[#ffd700] font-semibold">
                                {standings.won}
                              </span>
                            </span>
                            <span>
                              ت{" "}
                              <span className="text-white font-semibold">
                                {standings.drawn}
                              </span>
                            </span>
                            <span>
                              خ{" "}
                              <span className="text-[#d01c1f] font-semibold">
                                {standings.lost}
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] font-bold">
                              {standings.points} ن
                            </span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </ResultSection>
            )}

            {/* GROUPS */}
            {groupResults.length > 0 && (
              <ResultSection
                title="المجموعات"
                icon="🏆"
                count={groupResults.length}
                accent="gold"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {groupResults.map((g) => {
                    const teams = GROUP_STANDINGS[g] ?? [];
                    return (
                      <Link
                        key={g}
                        href={`/groups#group-${g}`}
                        className="glass-card rounded-2xl p-4 border border-white/5 hover:border-[#ffd700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all card-hover block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[#f1f5f9]/60 text-xs">المجموعة</div>
                          <div className="text-3xl font-black trophy-gold">
                            {highlight(g, query)}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-2xl">
                          {teams.slice(0, 4).map((t, i) => (
                            <span
                              key={i}
                              title={t.team}
                              className="hover:scale-125 transition-transform"
                            >
                              {t.flag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 text-center text-[10px] text-[#f1f5f9]/50">
                          {teams.length} منتخبات
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ResultSection>
            )}

            {/* MATCHES */}
            {matchResults.length > 0 && (
              <ResultSection
                title="المباريات"
                icon="⚔️"
                count={matchResults.length}
                accent="red"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchResults.map((m) => {
                    const hasScore =
                      m.homeScore != null && m.awayScore != null;
                    const stageLabel = STAGE_LABELS[m.stage];
                    return (
                      <Link
                        key={m.id}
                        href={`/match/${m.id}`}
                        className="glass-card rounded-2xl p-4 border border-white/5 hover:border-[#ffd700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all card-hover block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-[#006233]/40 border border-[#ffd700]/30 text-[#ffd700] font-bold">
                            {highlight(stageLabel, query)}
                          </span>
                          <span className="text-[10px] text-[#f1f5f9]/60">
                            {formatArabicDate(m.date)} • {m.time}
                          </span>
                        </div>

                        <div className="grid grid-cols-7 items-center gap-2">
                          {/* Home */}
                          <div className="col-span-3 flex items-center justify-end gap-2 min-w-0">
                            <span className="text-white font-bold truncate text-sm md:text-base">
                              {highlight(m.home, query)}
                            </span>
                            <span className="text-3xl shrink-0">
                              {m.homeFlag}
                            </span>
                          </div>

                          {/* Score / vs */}
                          <div className="col-span-1 flex items-center justify-center">
                            {hasScore ? (
                              <div className="px-2 py-1 rounded-lg bg-black/40 border border-[#ffd700]/30 led-score text-[#ffd700] text-base font-bold">
                                {m.homeScore} - {m.awayScore}
                              </div>
                            ) : (
                              <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[#f1f5f9]/70 text-xs font-bold">
                                ضد
                              </div>
                            )}
                          </div>

                          {/* Away */}
                          <div className="col-span-3 flex items-center gap-2 min-w-0">
                            <span className="text-3xl shrink-0">
                              {m.awayFlag}
                            </span>
                            <span className="text-white font-bold truncate text-sm md:text-base">
                              {highlight(m.away, query)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-[#f1f5f9]/60 truncate">
                            📍{" "}
                            <span className="text-[#f1f5f9]/80">
                              {highlight(m.venue, query)}
                            </span>
                            <span className="text-[#f1f5f9]/40">
                              {" "}
                              • {highlight(m.city, query)}
                            </span>
                          </span>
                          <MatchStatusBadge status={m.status} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Sub components                               */
/* -------------------------------------------------------------------------- */

function ResultSection({
  title,
  icon,
  count,
  accent,
  children,
}: {
  title: string;
  icon: string;
  count: number;
  accent: "green" | "gold" | "red";
  children: React.ReactNode;
}) {
  const accentMap = {
    green: "from-[#006233] to-[#007a40] border-[#006233]/40",
    gold: "from-[#ffd700] to-[#e6c200] border-[#ffd700]/40",
    red: "from-[#d01c1f] to-[#b81518] border-[#d01c1f]/40",
  } as const;
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentMap[accent]} border flex items-center justify-center text-2xl shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          <p className="text-xs text-[#f1f5f9]/60">
            {count} {count === 1 ? "نتيجة" : "نتائج"}
          </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ffd700]/30 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function MatchStatusBadge({ status }: { status: Match["status"] }) {
  if (status === "live") {
    return (
      <span className="badge-live px-2 py-0.5 rounded-md text-[10px] font-bold text-white tracking-wider">
        ● مباشر
      </span>
    );
  }
  if (status === "ft") {
    return (
      <span className="badge-ft px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
        انتهت
      </span>
    );
  }
  return (
    <span className="badge-upcoming px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
      قريباً
    </span>
  );
}
