"use client";

interface StatItem {
  type: string;
  home: string | number;
  away: string | number;
  isPercentage?: boolean;
}

interface MatchStatsPanelProps {
  homeTeam: { name: string; flag: string; abbr?: string };
  awayTeam: { name: string; flag: string; abbr?: string };
  stats: StatItem[];
  isLive?: boolean;
  elapsed?: number;
}

const STAT_ICONS: Record<string, string> = {
  "Ball Possession": "⚽",
  "Shots": "🎯",
  "Shots on Goal": "🎯",
  "Shots off Goal": "🎯",
  "Corner Kicks": "📐",
  "Fouls": "⚠️",
  "Offsides": "🚩",
  "Goalkeeper Saves": "🧤",
  "Yellow Cards": "🟨",
  "Red Cards": "🟥",
  "Passes": "🔄",
  "Pass Accuracy": "🎯",
  "Blocked Shots": "🛡️",
  "Free Kicks": "🦶",
  "Duels": "💥",
  "Aerials Won": "✈️",
  "Tackles": "🤼",
  "Clearances": "🧹",
};

function getBarColor(type: string): { home: string; away: string } {
  if (type.includes("Card") || type.includes("Foul") || type.includes("Offside"))
    return { home: "#D01C1F", away: "#D01C1F" };
  if (type.includes("Red")) return { home: "#FF1744", away: "#FF1744" };
  return { home: "#006233", away: "#D01C1F" };
}

export function MatchStatsPanel({ homeTeam, awayTeam, stats, isLive, elapsed }: MatchStatsPanelProps) {
  // Find possession stat for big display
  const possessionIdx = stats.findIndex(
    (s) => s.type === "Ball Possession" || s.type.includes("Possession")
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              مباشر
              {elapsed != null && <span>{elapsed}&apos;</span>}
            </div>
          )}
        </div>
        <span className="text-slate-400 text-xs">📊 إحصائيات المباراة</span>
      </div>

      {/* Big Possession display */}
      {possessionIdx !== -1 && (() => {
        const pos = stats[possessionIdx];
        const homeNum = parseInt(String(pos.home).replace("%", "")) || 0;
        const awayNum = 100 - homeNum;
        return (
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-black text-xl">{homeNum}%</span>
              <div className="text-center">
                <span className="text-[#FFD700] text-sm font-bold block">⚽ الاستحواذ</span>
              </div>
              <span className="text-white font-black text-xl">{awayNum}%</span>
            </div>
            {/* Animated possession bar */}
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#006233] h-full transition-all duration-700 rounded-l-full flex items-center justify-center"
                style={{ width: `${homeNum}%` }}
              >
                {homeNum > 15 && <span className="text-white text-[10px] font-bold mr-1">{homeTeam.flag}</span>}
              </div>
              <div
                className="bg-[#D01C1F] h-full transition-all duration-700 rounded-r-full flex items-center justify-end"
                style={{ width: `${awayNum}%` }}
              >
                {awayNum > 15 && <span className="text-white text-[10px] font-bold ml-1">{awayTeam.flag}</span>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stat bars grid */}
      <div className="bg-slate-800 rounded-2xl divide-y divide-slate-700/50">
        {stats
          .filter((s) => s.type !== "Ball Possession" && s.type !== "Possession")
          .map((stat, idx) => {
            const homeNum = parseFloat(String(stat.home).replace("%", "")) || 0;
            const awayNum = parseFloat(String(stat.away).replace("%", "")) || 0;
            const total = homeNum + awayNum || 1;
            const homePct = Math.round((homeNum / total) * 100);
            const colors = getBarColor(stat.type);
            const icon = STAT_ICONS[stat.type] || "📊";

            return (
              <div key={idx} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  {/* Home value */}
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-base">{stat.home}</span>
                    {homeNum > awayNum && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                    )}
                  </div>

                  {/* Label + icon */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#FFD700] text-sm">{icon}</span>
                    <span className="text-slate-400 text-xs font-medium text-center">
                      {stat.type}
                    </span>
                    <span className="text-[#FFD700] text-sm">{icon}</span>
                  </div>

                  {/* Away value */}
                  <div className="flex items-center gap-2">
                    {awayNum > homeNum && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                    )}
                    <span className="text-white font-black text-base">{stat.away}</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-700">
                  <div
                    className="h-full transition-all duration-500 rounded-l-full"
                    style={{
                      width: `${homePct}%`,
                      backgroundColor: colors.home,
                    }}
                  />
                  <div
                    className="h-full transition-all duration-500 rounded-r-full"
                    style={{
                      width: `${100 - homePct}%`,
                      backgroundColor: colors.away,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Summary mini-panel */}
      <div className="grid grid-cols-2 gap-3">
        {/* Home team card */}
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <span className="text-2xl block mb-1">{homeTeam.flag}</span>
          <span className="text-white text-xs font-bold truncate block">{homeTeam.name}</span>
        </div>
        {/* Away team card */}
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <span className="text-2xl block mb-1">{awayTeam.flag}</span>
          <span className="text-white text-xs font-bold truncate block">{awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
}
