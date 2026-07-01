"use client";

import { useState, useEffect } from "react";
import { SCHEDULE, GROUP_STANDINGS } from "@/lib/worldcup-data";
import Link from "next/link";

export default function SchedulePage() {
  const [scores, setScores] = useState<Record<number, { home: number; away: number }>>({});
  const [liveMatches, setLiveMatches] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  function pad(n: number) {
    return n.toString().padStart(2, "0");
  }

  function toIcsDate(dateStr: string, timeStr: string): string {
    // date: YYYY-MM-DD, time: HH:MM
    const [y, mo, d] = dateStr.split("-").map(Number);
    const [h, mi] = timeStr.split(":").map(Number);
    // Treat the kickoff as a floating local time in the venue — emit as floating
    // (no Z suffix) so calendar apps display it in the user's local timezone.
    return `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(mi)}00`;
  }

  function escapeIcs(value: string): string {
    return value
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function handleExportCalendar() {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const now = new Date();
      const stamp =
        now.getUTCFullYear().toString() +
        pad(now.getUTCMonth() + 1) +
        pad(now.getUTCDate()) +
        "T" +
        pad(now.getUTCHours()) +
        pad(now.getUTCMinutes()) +
        pad(now.getUTCSeconds()) +
        "Z";

      const lines: string[] = [];
      lines.push("BEGIN:VCALENDAR");
      lines.push("VERSION:2.0");
      lines.push("PRODID:-//Mauribin//World Cup 2026 Schedule//AR");
      lines.push("CALSCALE:GREGORIAN");
      lines.push("METHOD:PUBLISH");
      lines.push("X-WR-CALNAME:كأس العالم 2026 - Mauribin");
      lines.push("X-WR-CALDESC:جدول مباريات كأس العالم 2026");

      const stageLabels: Record<string, string> = {
        group: "دور المجموعات",
        round32: "دور الـ 32",
        round16: "دور الـ 16",
        quarter: "ربع النهائي",
        semi: "نصف النهائي",
        third: "المركز الثالث",
        final: "النهائي",
      };

      SCHEDULE.forEach((match) => {
        const start = toIcsDate(match.date, match.time);
        // Assume 2-hour duration for each match
        const startDate = new Date(`${match.date}T${match.time}:00`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        const end =
          endDate.getFullYear().toString() +
          pad(endDate.getMonth() + 1) +
          pad(endDate.getDate()) +
          "T" +
          pad(endDate.getHours()) +
          pad(endDate.getMinutes()) +
          "00";

        const title = `${match.homeFlag} ${match.home} vs ${match.awayFlag} ${match.away}`;
        const description = [
          `${stageLabels[match.stage] || match.stage}`,
          match.label ? `${match.label}` : "",
          match.group ? `المجموعة ${match.group}` : "",
          `الملعب: ${match.venue}`,
          `المدينة: ${match.city}`,
        ]
          .filter(Boolean)
          .join("\\n");

        lines.push("BEGIN:VEVENT");
        lines.push(`UID:mauribin-match-${match.id}@mauribin.app`);
        lines.push(`DTSTAMP:${stamp}`);
        lines.push(`DTSTART:${start}`);
        lines.push(`DTEND:${end}`);
        lines.push(`SUMMARY:${escapeIcs(title)}`);
        lines.push(`DESCRIPTION:${escapeIcs(description)}`);
        lines.push(`LOCATION:${escapeIcs(`${match.venue}, ${match.city}`)}`);
        lines.push("STATUS:CONFIRMED");
        lines.push("END:VEVENT");
      });

      lines.push("END:VCALENDAR");

      const icsContent = lines.join("\r\n");
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mauribin-worldcup-2026.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Give the browser a moment before revoking
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("iCal export failed", err);
    } finally {
      // Brief loading state to give visual feedback
      setTimeout(() => setIsExporting(false), 600);
    }
  }

  useEffect(() => {
    // Simulate fetching real scores - in production this would come from an API
    const fetchScores = () => {
      const newScores: Record<number, { home: number; away: number }> = {};
      const live: number[] = [];

      SCHEDULE.forEach((match, idx) => {
        // Get group standings to determine actual results
        const groupStandings = GROUP_STANDINGS[match.group as keyof typeof GROUP_STANDINGS];
        
        if (groupStandings) {
          // For played matches (group stage week 2), show simulated realistic scores
          // This would be replaced with real API data in production
          const homeTeam = groupStandings.find(t => t.team.includes(match.home.replace(/\s*\(.*?\)\s*/g, '').trim()));
          const awayTeam = groupStandings.find(t => t.team.includes(match.away.replace(/\s*\(.*?\)\s*/g, '').trim()));

          if (homeTeam && awayTeam) {
            // Simulate results based on standings (teams with more points tend to score more)
            const homeStrength = homeTeam.points + 1;
            const awayStrength = awayTeam.points + 1;
            
            // Generate realistic scores
            const homeGoals = Math.floor(Math.random() * Math.min(homeStrength, 4));
            const awayGoals = Math.floor(Math.random() * Math.min(awayStrength, 3));
            
            newScores[idx] = { home: homeGoals, away: awayGoals };
            
            // Mark some matches as live (randomly for simulation)
            if (Math.random() > 0.85) {
              live.push(idx);
            }
          }
        }
      });

      setScores(newScores);
      setLiveMatches(live);
    };

    fetchScores();
    // Refresh every 30 seconds
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  const groupMatches = SCHEDULE.filter((m) => m.stage === "group");
  const knockoutMatches = SCHEDULE.filter((m) => m.stage !== "group");

  const stageLabels: Record<string, { title: string; icon: string }> = {
    round32: { title: "دور الـ 32", icon: "32" },
    round16: { title: "دور الـ 16", icon: "16" },
    quarter: { title: "ربع النهائي", icon: "¼" },
    semi: { title: "نصف النهائي", icon: "½" },
    third: { title: "المركز الثالث", icon: "3" },
    final: { title: "النهائي", icon: "🏆" },
  };

  const stageOrder = ["round32", "round16", "quarter", "semi", "third", "final"];

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
        <div className="container mx-auto px-4 pt-8 pb-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <span className="text-xl">📅</span>
              <span className="text-green-400 text-sm font-medium">كأس العالم 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="gradient-text">جدول المباريات</span>
            </h1>
            <p className="text-slate-400 mb-5">104 مباراة | دور المجموعات والأدوار الإقصائية</p>
            <button
              type="button"
              onClick={handleExportCalendar}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-[#ffd700]/40 text-[#ffd700] font-bold text-sm hover:bg-[#ffd700]/10 hover:border-[#ffd700] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="تحميل التقويم"
            >
              {isExporting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v4m0 8v4m8-8h-4M8 12H4"
                    />
                  </svg>
                  <span>جاري التحميل…</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>تحميل التقويم</span>
                  <span className="text-xs opacity-80">.ics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Group Stage */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 font-bold">G</span>
            </div>
            <h2 className="text-2xl font-bold text-white">دور المجموعات</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
          </div>

          <div className="space-y-6">
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((group) => {
              const matches = groupMatches.filter((m) => m.group === group);
              return (
                <div key={group} className="glass rounded-2xl overflow-hidden card-hover">
                  {/* Group header */}
                  <div className="bg-gradient-to-r from-green-600/15 to-transparent px-6 py-3 border-b border-green-500/10">
                    <h3 className="font-bold text-green-400 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-sm">
                        {group}
                      </span>
                      المجموعة {group}
                    </h3>
                  </div>

                  {/* Matches */}
                  <div className="divide-y divide-white/5">
                    {matches.map((match, matchIdx) => {
                      const globalIdx = SCHEDULE.indexOf(match);
                      const score = scores[globalIdx];
                      const isLive = liveMatches.includes(globalIdx);
                      
                      return (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                          {/* Home Team */}
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{match.homeFlag}</span>
                            <span className="text-white font-medium text-sm">{match.home}</span>
                          </div>

                          {/* Score / Time */}
                          <Link href={`/match/${match.id}`} className="text-center px-4 hover:scale-105 transition-transform">
                            {score ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black ${isLive ? "text-green-400 score-animate" : "text-white"}`}>
                                  {score.home}
                                </span>
                                <span className="text-slate-500 text-xl">:</span>
                                <span className={`text-2xl font-black ${isLive ? "text-green-400 score-animate" : "text-white"}`}>
                                  {score.away}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs text-slate-500 mb-1">
                                  {match.date.slice(5).replace("-", "/")}
                                </div>
                                <div className="text-lg font-bold text-green-400">{match.time}</div>
                              </div>
                            )}
                            {isLive && (
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs text-red-400">مباشر</span>
                              </div>
                            )}
                          </Link>

                          {/* Away Team */}
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <span className="text-white font-medium text-sm">{match.away}</span>
                            <span className="text-2xl">{match.awayFlag}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knockout Stage */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 font-bold">K</span>
            </div>
            <h2 className="text-2xl font-bold text-white">الأدوار الإقصائية</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
          </div>

          <div className="space-y-6">
            {stageOrder.map((stage) => {
              const matches = knockoutMatches.filter((m) => m.stage === stage);
              if (matches.length === 0) return null;
              const info = stageLabels[stage];

              return (
                <div key={stage} className="glass rounded-2xl overflow-hidden card-hover">
                  <div className="bg-gradient-to-r from-red-600/15 to-transparent px-6 py-3 border-b border-red-500/10">
                    <h3 className="font-bold text-red-400 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center text-sm">
                        {info.icon}
                      </span>
                      {info.title}
                    </h3>
                  </div>

                  <div className="divide-y divide-white/5">
                    {matches.map((match) => {
                      const globalIdx = SCHEDULE.indexOf(match);
                      const score = scores[globalIdx];
                      const isLive = liveMatches.includes(globalIdx);
                      
                      return (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                          {/* Home Team */}
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{match.homeFlag}</span>
                            <span className="text-white font-medium text-sm">{match.home}</span>
                          </div>

                          {/* Score / Time */}
                          <Link href={`/match/${match.id}`} className="text-center px-4 hover:scale-105 transition-transform">
                            {score ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black ${isLive ? "text-green-400" : "text-white"}`}>
                                  {score.home}
                                </span>
                                <span className="text-slate-500 text-xl">:</span>
                                <span className={`text-2xl font-black ${isLive ? "text-green-400" : "text-white"}`}>
                                  {score.away}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs text-slate-500 mb-1">
                                  {match.date.slice(5).replace("-", "/")}
                                </div>
                                <div className="text-lg font-bold text-green-400">{match.time}</div>
                                <div className="text-xs text-slate-500">{match.venue}</div>
                              </div>
                            )}
                            {isLive && (
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs text-red-400">مباشر</span>
                              </div>
                            )}
                          </Link>

                          {/* Away Team */}
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <span className="text-white font-medium text-sm">{match.away}</span>
                            <span className="text-2xl">{match.awayFlag}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
