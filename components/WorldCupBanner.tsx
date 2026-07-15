"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SCHEDULE, GROUP_STANDINGS, TEAMS, TEAM_FLAGS } from "@/lib/worldcup-data";

// Mauritanian flag palette
const MAURI = {
  green: "#006233",
  greenDark: "#004225",
  greenLight: "#007a40",
  gold: "#FFD700",
  goldDark: "#e6c200",
  red: "#D01C1F",
};

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function computeCountdown(target: Date): CountdownState {
  const totalMs = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs };
}

function parseMatchDateTime(date: string, time: string): Date {
  // SCHEDULE times are stored as "HH:MM" in the host local frame — treat as UTC
  // so the countdown stays stable across the Arabic-speaking audience's timezones.
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  return new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00Z`);
}

export function WorldCupBanner() {
  // Pick the next upcoming match from the schedule
  const nextMatch = useMemo(() => {
    const now = Date.now();
    const upcoming = SCHEDULE.filter((m) => m.status !== "ft").sort(
      (a, b) =>
        parseMatchDateTime(a.date, a.time).getTime() -
        parseMatchDateTime(b.date, b.time).getTime()
    );
    const match = upcoming.find((m) => parseMatchDateTime(m.date, m.time).getTime() > now) ??
      upcoming[0] ??
      SCHEDULE[SCHEDULE.length - 1];
    // Use real TEAM_FLAGS for all rounds (fixes blank flags in quarter/semi/final)
    return {
      ...match,
      homeFlag: TEAM_FLAGS[match.home] ?? match.homeFlag ?? "🏳️",
      awayFlag: TEAM_FLAGS[match.away] ?? match.awayFlag ?? "🏳️",
    };
  }, []);

  const targetDate = useMemo(
    () => parseMatchDateTime(nextMatch.date, nextMatch.time),
    [nextMatch]
  );

  const [countdown, setCountdown] = useState<CountdownState>(() =>
    computeCountdown(targetDate)
  );

  useEffect(() => {
    setCountdown(computeCountdown(targetDate));
    const id = setInterval(() => setCountdown(computeCountdown(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Aggregate quick stats from group standings
  const stats = useMemo(() => {
    let matchesPlayed = 0;
    let totalGoals = 0;
    let topTeamName = "";
    let topTeamFlag = "🏳️";
    let topTeamGoals = -1;

    for (const standings of Object.values(GROUP_STANDINGS)) {
      for (const row of standings) {
        matchesPlayed = Math.max(matchesPlayed, row.played);
        totalGoals += row.gf;
        if (row.gf > topTeamGoals) {
          topTeamGoals = row.gf;
          topTeamName = row.team;
          topTeamFlag = row.flag;
        }
      }
    }
    // Each matchday counts once per group, so multiply by group count
    const groupsPlayedCount = Object.keys(GROUP_STANDINGS).length;
    const totalMatchesPlayed = standingsMatchesPlayed();

    return {
      matchesPlayed: totalMatchesPlayed,
      totalGoals,
      topTeamName,
      topTeamFlag,
      topTeamGoals,
      teamsQualified: TEAMS.length,
      groupCount: groupsPlayedCount,
    };
  }, []);

  // Count distinct completed matches from the schedule itself (most reliable)
  function standingsMatchesPlayed() {
    let count = 0;
    const seenPairs = new Set<string>();
    for (const m of SCHEDULE) {
      if (m.status !== "ft") continue;
      const key = [m.home, m.away].sort().join("|");
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      count++;
    }
    return count;
  }

  // Achievement milestones — historic WC facts (Arabic)
  const milestones = [
    {
      icon: "🏆",
      title: "البطل الحالي",
      value: "الأرجنتين 🇦🇷",
      subtitle: "توجت بلقب كأس العالم 2022 في قطر",
      accent: MAURI.gold,
    },
    {
      icon: "⚽",
      title: "الهداف التاريخي",
      value: "ميروسلاف كلوزه",
      subtitle: "16 هدفاً في 4 نسخ من المونديال 🇩🇪",
      accent: MAURI.gold,
    },
    {
      icon: "🌍",
      title: "أكبر عدد منتخبات",
      value: "48 منتخباً",
      subtitle: "رقم قياسي في مونديال 2026 🇺🇸🇲🇽🇨🇦",
      accent: MAURI.greenLight,
    },
    {
      icon: "🏟️",
      title: "الملاعب المستضيفة",
      value: "16 ملعباً",
      subtitle: "في 11 مدينة أمريكية وكندية ومكسيكية",
      accent: MAURI.greenLight,
    },
    {
      icon: "📅",
      title: "مدة البطولة",
      value: "39 يوماً",
      subtitle: "من 11 يونيو حتى 19 يوليو 2026",
      accent: MAURI.red,
    },
    {
      icon: "🎯",
      title: "إجمالي المباريات",
      value: "104 مباراة",
      subtitle: "بزيادة 40 مباراة عن النسخ السابقة",
      accent: MAURI.red,
    },
  ];

  const stageLabel: Record<string, string> = {
    group: "دور المجموعات",
    round32: "دور الـ 32 🆕",
    round16: "دور الـ16",
    quarter: "ربع النهائي",
    semi: "نصف النهائي",
    third: "مباراة المركز الثالث",
    final: "النهائي الكبير 🏆",
  };

  // Format matchDay — always use English numerals 123 for time
  const matchDay = nextMatch.label
    ? nextMatch.label.replace(/[\u0660-\u0669]/g, (d: string) => String(d.charCodeAt(0) - 0x0660))
    : stageLabel[nextMatch.stage] ?? "مباراة قادمة";

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden"
      aria-label="بانر كأس العالم 2026"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at top right, ${MAURI.gold}22 0%, transparent 55%),
            radial-gradient(ellipse at bottom left, ${MAURI.red}22 0%, transparent 55%),
            linear-gradient(135deg, ${MAURI.greenDark} 0%, ${MAURI.green} 60%, ${MAURI.greenDark} 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,215,0,0.04) 0 2px, transparent 2px 14px)",
        }}
      />

      <div className="relative container mx-auto px-4 pt-10 pb-12">
        {/* Header with Logo Banner Image */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4"
            style={{
              background: `${MAURI.red}26`,
              border: `1px solid ${MAURI.red}66`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full live-dot"
              style={{ backgroundColor: MAURI.red }}
            />
            <span
              className="text-sm font-bold tracking-wider"
              style={{ color: MAURI.red }}
            >
              مباشر • كأس العالم 2026
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">المباراة القادمة</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            تابع كل لحظة من أقوى نسخة في تاريخ كأس العالم — 48 منتخباً، 104 مباريات،
            وعرس كروي يجمع العالم في أمريكا وكندا والمكسيك
          </p>
        </div>

        {/* Countdown + Next match */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
          {/* Next match card */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-7 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${MAURI.gold}, transparent)`,
              }}
            />
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${MAURI.gold}22`,
                  color: MAURI.gold,
                  border: `1px solid ${MAURI.gold}55`,
                }}
              >
                {matchDay}
              </span>
              <span className="text-xs text-slate-400">
                {nextMatch.date.replace(/[\u0660-\u0669]/g, (d: string) => String(d.charCodeAt(0) - 0x0660))} • {nextMatch.time.replace(/[\u0660-\u0669]/g, (d: string) => String(d.charCodeAt(0) - 0x0660))} UTC
              </span>
            </div>

            <div className="text-center my-6">
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                المباراة القادمة
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <div className="flex-1 text-center">
                  <div className="text-5xl md:text-6xl mb-2 float">{nextMatch.homeFlag}</div>
                  <div className="text-white font-bold text-sm md:text-base">
                    {nextMatch.home}
                  </div>
                </div>
                <div className="px-3 text-center">
                  <div
                    className="text-3xl md:text-4xl font-black mb-1"
                    style={{ color: MAURI.gold }}
                  >
                    ⚡
                  </div>
                  <div className="text-xs text-slate-400">ضد</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-5xl md:text-6xl mb-2 float">{nextMatch.awayFlag}</div>
                  <div className="text-white font-bold text-sm md:text-base">
                    {nextMatch.away}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-center">
              <div
                className="rounded-xl py-2 px-3"
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.15)",
                }}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">الملعب</div>
                <div className="text-white text-xs font-bold truncate">
                  {nextMatch.venue}
                </div>
              </div>
              <div
                className="rounded-xl py-2 px-3"
                style={{
                  background: "rgba(0,98,51,0.3)",
                  border: "1px solid rgba(255,215,0,0.15)",
                }}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">المدينة</div>
                <div className="text-white text-xs font-bold truncate">
                  {nextMatch.city}
                </div>
              </div>
            </div>
          </div>

          {/* Next Match Poster - replaces countdown */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-6 md:p-7 relative overflow-hidden">
            {/* Poster Background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/40 to-transparent" />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${MAURI.gold}22 0%, transparent 70%)` }} />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${MAURI.red}22 0%, transparent 70%)` }} />
              {/* Stadium pattern */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, white 0, white 1px, transparent 1px, transparent 20px)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="text-2xl">� posters </span>
                <span className="text-white font-bold text-lg">المباراة القادمة</span>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: `${MAURI.greenLight}33`,
                  color: MAURI.gold,
                  border: `1px solid ${MAURI.gold}44`,
                }}
              >
                {nextMatch.date} • {nextMatch.time} UTC
              </span>
            </div>

            {/* Teams Poster */}
            <div className="relative flex items-center justify-center gap-6 md:gap-10 mb-6">
              {/* Home */}
              <div className="flex-1 text-center">
                <div className="text-6xl md:text-7xl mb-3 hover:scale-110 transition-transform">{nextMatch.homeFlag}</div>
                <div className="text-white font-bold text-base md:text-lg">{nextMatch.home}</div>
              </div>

              {/* VS */}
              <div className="text-center flex-shrink-0">
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: MAURI.gold }}>VS</div>
                <div className="text-xs text-slate-400">ضد</div>
              </div>

              {/* Away */}
              <div className="flex-1 text-center">
                <div className="text-6xl md:text-7xl mb-3 hover:scale-110 transition-transform">{nextMatch.awayFlag}</div>
                <div className="text-white font-bold text-base md:text-lg">{nextMatch.away}</div>
              </div>
            </div>

            {/* Match Info */}
            <div className="grid grid-cols-3 gap-3 text-center relative">
              <div className="bg-white/5 rounded-xl py-3 px-2">
                <div className="text-[10px] text-slate-400 mb-1">🏟️ الملعب</div>
                <div className="text-white text-xs font-bold truncate">{nextMatch.venue}</div>
              </div>
              <div className="bg-white/5 rounded-xl py-3 px-2">
                <div className="text-[10px] text-slate-400 mb-1">🌍 المدينة</div>
                <div className="text-white text-xs font-bold truncate">{nextMatch.city}</div>
              </div>
              <div className="bg-white/5 rounded-xl py-3 px-2">
                <div className="text-[10px] text-slate-400 mb-1">📅 المجموعة</div>
                <div className="text-white text-xs font-bold">{nextMatch.group}</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 relative">
              <p className="text-xs text-slate-400">
                ⚽ لا تفوت أي لحظة من كأس العالم 2026
              </p>
              <Link
                href="/schedule"
                className="text-xs font-bold px-4 py-2 rounded-full transition-transform hover:scale-105"
                style={{
                  background: MAURI.gold,
                  color: MAURI.greenDark,
                }}
              >
                📅 كل الجدول
              </Link>
            </div>
          </div>
        </div>

        {/* Quick stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon="⚽"
            value={stats.matchesPlayed}
            label="مباراة لعبت"
            color={MAURI.gold}
            sublabel="حتى الآن"
          />
          <StatCard
            icon="🥅"
            value={stats.totalGoals}
            label="هدف سُجّل"
            color={MAURI.greenLight}
            sublabel="في البطولة"
          />
          <StatCard
            icon="🔥"
            value={`${stats.topTeamName}`}
            flag={stats.topTeamFlag}
            label="أكثر منتخب تهديفاً"
            color={MAURI.red}
            sublabel={`${stats.topTeamGoals} هدفاً`}
          />
          <StatCard
            icon="🏳️"
            value={stats.teamsQualified}
            label="منتخب متأهل"
            color={MAURI.gold}
            sublabel={`${stats.groupCount} مجموعات`}
          />
        </div>

        {/* Achievement milestones */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🏆</span>
            <h3 className="text-xl md:text-2xl font-black text-white">
              محطات وأرقام تاريخية
            </h3>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(to left, transparent, ${MAURI.gold}88, transparent)`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((m, i) => (
              <article
                key={i}
                className="glass-card rounded-2xl p-5 card-hover relative overflow-hidden group"
                style={{
                  border: `1px solid ${m.accent}44`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"
                  style={{ background: m.accent }}
                />
                <div className="relative flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${m.accent}22`,
                      border: `1px solid ${m.accent}55`,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: m.accent }}
                    >
                      {m.title}
                    </div>
                    <div className="text-white font-black text-lg mb-1 truncate">
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {m.subtitle}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CountdownUnitProps {
  value: number;
  label: string;
  color: string;
  glow: string;
}

function CountdownUnit({ value, label, color, glow }: CountdownUnitProps) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <div
        className="relative rounded-2xl py-4 md:py-6 px-2 scoreboard-led"
        style={{
          border: `1px solid ${color}55`,
          boxShadow: `inset 0 2px 10px rgba(0,0,0,0.8), 0 0 20px ${glow}`,
        }}
      >
        <div
          className="led-score font-black text-3xl md:text-5xl"
          style={{ color }}
          aria-live="polite"
        >
          {padded}
        </div>
      </div>
      <div className="text-[11px] md:text-xs mt-2 font-bold text-slate-300 tracking-wider">
        {label}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  sublabel?: string;
  color: string;
  flag?: string;
}

function StatCard({ icon, value, label, sublabel, color, flag }: StatCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-4 md:p-5 card-hover relative overflow-hidden"
      style={{ border: `1px solid ${color}44` }}
    >
      <div
        className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-20"
        style={{ background: color }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          {flag && <span className="text-2xl">{flag}</span>}
        </div>
        <div
          className="text-3xl md:text-4xl font-black mb-1 truncate"
          style={{ color }}
        >
          {value}
        </div>
        <div className="text-xs text-slate-300 font-medium">{label}</div>
        {sublabel && (
          <div className="text-[10px] text-slate-500 mt-1">{sublabel}</div>
        )}
      </div>
    </div>
  );
}

export default WorldCupBanner;
