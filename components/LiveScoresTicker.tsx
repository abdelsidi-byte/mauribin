"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface Match {
  _index: number;
  slug?: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
  utcDate?: string;
}

const TEAM_AR: Record<string, string> = {
  Argentina: "الأرجنتين", Austria: "النمسا", France: "فرنسا", Iraq: "العراق",
  Norway: "النرويج", Senegal: "السنغال", Algeria: "الجزائر", Ghana: "غانا",
  Brazil: "البرازيل", Uruguay: "أوروغواي", Spain: "إسبانيا", Netherlands: "هولندا",
  Germany: "ألمانيا", Japan: "اليابان", Mexico: "المكسيك", USA: "أمريكا",
  "South Korea": "كوريا الجنوبية", "Saudi Arabia": "السعودية", Morocco: "المغرب",
  Egypt: "مصر", Tunisia: "تونس", Iran: "إيران", Belgium: "بلجيكا",
  England: "إنجلترا", Portugal: "البرتغال", Croatia: "كرواتيا", Ecuador: "الإكوادور",
  Australia: "أستراليا", Canada: "كندا", Switzerland: "سويسرا", Poland: "بولندا",
  "New Zealand": "نيوزيلندا", Paraguay: "باراغواي", Turkey: "تركيا", "Ivory Coast": "ساحل العاج",
  Curaçao: "كوراساو", Scotland: "أسكتلندا", Haiti: "هايتي", "Cape Verde": "الرأس الأخضر",
  Uzbekistan: "أوزبكستان", "DR Congo": "الكونغو", Panama: "بنما", Colombia: "كولومبيا",
  Jordan: "الأردن", Serbia: "صربيا", Denmark: "الدنمارك", Ukraine: "أوكرانيا",
  Hungary: "المجر", Wales: "ويلز", Cameroon: "الكاميرون", Mali: "مالي",
  Qatar: "قطر", UAE: "الإمارات", Peru: "بيرو", "South Africa": "جنوب أفريقيا",
  "Bosnia": "البوسنة", "Czech Republic": "التشيك", Nigeria: "نيجيريا", "Costa Rica": "كوستاريكا",
};

function teamAr(name: string): string {
  return TEAM_AR[name] || name;
}

function labelAr(state: string, label: string): string {
  if (state === "live") return "مباشر";
  if (state === "ft" || state === "finished") return "انتهت";
  return label
    .replace(/Today/g, "اليوم")
    .replace(/Tue/g, "الثلاثاء")
    .replace(/Wed/g, "الأربعاء")
    .replace(/Thu/g, "الخميس")
    .replace(/Fri/g, "الجمعة")
    .replace(/Sat/g, "السبت")
    .replace(/Sun/g, "الأحد")
    .replace(/Mon/g, "الإثنين")
    .replace(/UTC/g, "ت ع");
}

// Goal celebration animation for ticker
function TickerGoalFlash({ side }: { side: "home" | "away" }) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-r ${
        side === "home" ? "from-[#FFD700]/40" : "from-[#FFD700]/40"
      } to-transparent animate-flash-goal pointer-events-none rounded-2xl`}
    />
  );
}

interface LiveScoresTickerProps {
  initialMatches: Match[];
}

export function LiveScoresTicker({ initialMatches }: LiveScoresTickerProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [goalFlash, setGoalFlash] = useState<Record<number, "home" | "away" | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevScores = useRef<Record<number, { home: number | null; away: number | null }>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches) {
          // Detect goals
          const newFlashes: Record<number, "home" | "away" | null> = {};
          data.matches.forEach((m: Match) => {
            const old = prevScores.current[m._index];
            if (old && m.state === "live") {
              if (m.homeScore !== null && (old.home ?? 0) < m.homeScore) {
                newFlashes[m._index] = "home";
                setTimeout(() => setGoalFlash((f) => ({ ...f, [m._index]: null })), 2000);
              } else if (m.awayScore !== null && (old.away ?? 0) < m.awayScore) {
                newFlashes[m._index] = "away";
                setTimeout(() => setGoalFlash((f) => ({ ...f, [m._index]: null })), 2000);
              }
            }
            prevScores.current[m._index] = { home: m.homeScore, away: m.awayScore };
          });
          if (Object.keys(newFlashes).length > 0) {
            setGoalFlash((f) => ({ ...f, ...newFlashes }));
          }
          setMatches(data.matches);
        }
      } catch (e) {
        console.error("Ticker refresh failed:", e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to next match every 8 seconds
  useEffect(() => {
    if (matches.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % Math.max(1, matches.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [matches.length]);

  // Scroll container to current match
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll("[data-ticker-card]");
      if (cards[currentIndex]) {
        cards[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [currentIndex]);

  if (matches.length === 0) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#006233] to-[#004225] border border-[#FFD700]/30">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="text-[#FFD700] text-xs font-bold">النتائج</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/20 to-transparent" />
        {/* Progress dots */}
        <div className="flex gap-1">
          {matches.slice(0, Math.min(8, matches.length)).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex % 8 ? "bg-[#FFD700]" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 240}px)` }}
        >
          {matches.map((match) => (
            <div key={match._index} data-ticker-card className="shrink-0 w-[230px] relative">
              {goalFlash[match._index] && (
                <TickerGoalFlash side={goalFlash[match._index]!} />
              )}
              <Link
                href={`/match/${match.slug || match._index}`}
                className={`block rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                  match.state === "live"
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 border-red-500/60 shadow-lg shadow-red-900/20"
                    : "bg-slate-900/80 border-slate-700/50"
                }`}
              >
                {/* Status */}
                <div className="flex items-center gap-2 mb-3">
                  {match.state === "live" && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-400 text-xs font-bold">مباشر</span>
                    </>
                  )}
                  {match.state !== "live" && (
                    <span className="text-slate-500 text-xs">{labelAr(match.state, match.label)}</span>
                  )}
                </div>

                {/* Match */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.homeFlag}</span>
                    <span className="text-white text-sm flex-1 truncate">{teamAr(match.home)}</span>
                    <span className={`text-xl font-black ${
                      goalFlash[match._index] === "home" ? "text-[#FFD700] animate-pulse" : "text-white"
                    }`}>
                      {match.homeScore !== null ? match.homeScore : (match.state === "live" ? "0" : "-")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.awayFlag}</span>
                    <span className="text-white text-sm flex-1 truncate">{teamAr(match.away)}</span>
                    <span className={`text-xl font-black ${
                      goalFlash[match._index] === "away" ? "text-[#FFD700] animate-pulse" : "text-white"
                    }`}>
                      {match.awayScore !== null ? match.awayScore : (match.state === "live" ? "0" : "-")}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash-goal {
          0%, 100% { opacity: 0; }
          10%, 30%, 50% { opacity: 1; }
          20%, 40% { opacity: 0; }
        }
        .animate-flash-goal { animation: flash-goal 2s ease-out forwards; }
      `}} />
    </div>
  );
}
