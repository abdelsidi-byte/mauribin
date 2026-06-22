"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

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
}

interface TickerProps {
  initialMatches?: Match[];
}

const TEAM_AR: Record<string, string> = {
  Argentina: "الأرجنتين", Austria: "النمسا", France: "فرنسا", Iraq: "العراق",
  Norway: "النرويج", Senegal: "السنغال", Algeria: "الجزائر", Ghana: "غانا",
  England: "إنجلترا", Italy: "إيطاليا", Germany: "ألمانيا", Portugal: "البرتغال",
  Sweden: "السويد", Brazil: "البرازيل", Uruguay: "أوروغواي", Colombia: "كولومبيا",
  Ecuador: "الإكوادور", Mexico: "المكسيك", USA: "أمريكا", Chile: "تشيلي",
  Canada: "كندا", Spain: "إسبانيا", Netherlands: "هولندا", Belgium: "بلجيكا",
  Croatia: "كرواتيا", Denmark: "الدنمارك", Serbia: "صربيا", Morocco: "المغرب",
  Egypt: "مصر", Nigeria: "نيجيريا", Japan: "اليابان", Australia: "أستراليا",
  "Saudi Arabia": "السعودية", "South Korea": "كوريا الجنوبية",
  "Costa Rica": "كوستاريكا", Panama: "بنما", Peru: "بيرو", Iran: "إيران",
  Tunisia: "تونس", "Cape Verde": "الرأس الأخضر", Turkey: "تركيا",
  Paraguay: "باراغواي", Haiti: "هايتي", Poland: "بولندا", Ukraine: "أوكرانيا",
  Hungary: "المجر", Switzerland: "سويسرا", Wales: "ويلز",
  "Czech Republic": "التشيك", Cameroon: "الكاميرون", Mali: "مالي",
  Qatar: "قطر", UAE: "الإمارات", Jordan: "الأردن", Uzbekistan: "أوزبكستان",
  "New Zealand": "نيوزيلندا", "Ivory Coast": "ساحل العاج", Curaçao: "كوراساو",
};
function teamAr(name: string): string { return TEAM_AR[name] || name; }

export function LiveScoresTicker({ initialMatches = [] }: TickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<Match[]>(initialMatches);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/live-scores", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches);
      }
    } catch (e) {
      // silently keep current data
    }
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30_000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  // Scroll animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || matches.length === 0) return;

    el.style.transform = "translateX(0)";

    let pos = 0;
    const speed = 50; // pixels per second
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      pos += speed * delta;
      const halfWidth = el.scrollWidth / 2;

      if (pos >= halfWidth) {
        pos = 0;
      }

      el.style.transform = `translateX(-${pos}px)`;
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [matches]);

  if (!matches || matches.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...matches, ...matches];

  return (
    <div className="w-full relative overflow-hidden" style={{ background: "linear-gradient(90deg, #006233 0%, #004225 50%, #006233 100%)" }}>
      {/* LED Strip Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)" }} />
      <div className="absolute inset-0 pitch-stripes opacity-20" />
      
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ffd700, transparent)" }} />
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ffd70044, transparent)" }} />

      {/* Live indicator - left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 pl-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-bold">LIVE</span>
      </div>

      {/* Live indicator - right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 pr-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-bold">LIVE</span>
      </div>

      <div className="relative py-3.5">
        {/* Scoreboard style container */}
        <div className="flex items-center overflow-x-auto hide-scrollbar gap-4 px-6">
          {matches.map((match) => (
            <Link
              key={`match-${match._index}`}
              href={`/match/${match.slug || match._index}`}
              className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all shrink-0 group ${
                match.state === "live"
                  ? "bg-gradient-to-r from-red-900/80 via-red-800/60 to-red-900/80 border-2 border-red-500/60 shadow-lg shadow-red-500/20"
                  : "bg-black/70 hover:bg-black/90 border border-[#ffd700]/30"
              }`}
            >
              {/* Home Team */}
              <div className="flex items-center gap-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">{match.homeFlag}</span>
                <span className="text-white font-bold text-sm" dir="rtl">{teamAr(match.home)}</span>
              </div>

              {/* Scoreboard LED Panel */}
              <div className="scoreboard-led rounded-lg px-3 py-1 flex items-center gap-2">
                <span className={`led-score text-xl font-bold ${match.homeScore !== null ? 'text-green-400' : 'text-slate-500'}`}>
                  {match.homeScore ?? "-"}
                </span>
                <span className="text-slate-600 text-lg font-bold">:</span>
                <span className={`led-score text-xl font-bold ${match.awayScore !== null ? 'text-green-400' : 'text-slate-500'}`}>
                  {match.awayScore ?? "-"}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm" dir="rtl">{teamAr(match.away)}</span>
                <span className="text-2xl group-hover:scale-110 transition-transform">{match.awayFlag}</span>
              </div>

              {/* Status Badge */}
              {match.state === "live" && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/80 border border-red-400/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-[10px] font-bold tracking-wider">مباشر</span>
                </div>
              )}
              {match.state === "halftime" && (
                <div className="px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40">
                  <span className="text-[#ffd700] text-[10px] font-bold">الشوط الثاني</span>
                </div>
              )}
              {(match.state === "ft" || match.state === "finished") && (
                <div className="px-2 py-0.5 rounded-full bg-slate-500/20 border border-slate-500/40">
                  <span className="text-slate-400 text-[10px] font-bold">انتهت</span>
                </div>
              )}
              {match.state === "upcoming" && (
                <div className="px-2 py-0.5 rounded-full bg-[#006233]/40 border border-[#006233]/60">
                  <span className="text-[#ffd700] text-[10px] font-bold">قادم</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
