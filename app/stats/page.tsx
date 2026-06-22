import { GROUPS, GROUP_STANDINGS, GroupStanding } from "@/lib/worldcup-data";

export const metadata = {
  title: "إحصائيات كأس العالم 2026 | Mauribin",
};

// Flatten all teams with their group letters
const ALL_TEAMS: (GroupStanding & { group: string })[] = GROUPS.flatMap((g) =>
  GROUP_STANDINGS[g].map((t) => ({ ...t, group: g }))
);

// Medal emojis for top 3 positions
const MEDALS = ["🥇", "🥈", "🥉"];

function getMedal(idx: number) {
  return MEDALS[idx] ?? null;
}

// Reusable card wrapper for sections
function StatsCard({
  title,
  emoji,
  children,
  span = "default",
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  span?: "default" | "wide" | "tall";
}) {
  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden card-hover ${
        span === "wide" ? "md:col-span-2" : ""
      }`}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#006233] via-[#007a40] to-[#006233] px-4 py-4 border-b border-[#ffd700]/30">
        <div className="absolute inset-0 pitch-bg opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-8 h-8 border border-[#ffd700]/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-8 h-8 border border-[#ffd700]/20 rounded-full translate-x-1/2 -translate-y-1/2" />
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-3 relative">
          <span className="text-2xl">{emoji}</span>
          <span>{title}</span>
          <span className="text-2xl">{emoji}</span>
        </h2>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

// Row for a ranked list - medal for top 3, number afterwards
function RankRow({
  rank,
  flag,
  team,
  primary,
  primaryColor,
  secondary,
  secondaryColor,
}: {
  rank: number;
  flag: string;
  team: string;
  primary: string | number;
  primaryColor: string;
  secondary?: string | number;
  secondaryColor?: string;
}): React.ReactElement {
  const medal = getMedal(rank);
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl border border-white/5 transition-all hover:bg-[#006233]/20 ${
        rank === 0
          ? "bg-gradient-to-r from-[#ffd700]/15 via-[#ffd700]/5 to-transparent"
          : rank === 1
          ? "bg-gradient-to-r from-slate-300/10 to-transparent"
          : rank === 2
          ? "bg-gradient-to-r from-[#cd7f32]/10 to-transparent"
          : "bg-black/20"
      }`}
    >
      {/* Rank / medal */}
      <div className="w-9 flex items-center justify-center text-xl">
        {medal ?? (
          <span className="text-sm font-bold text-[#f1f5f9]/50">{rank + 1}</span>
        )}
      </div>

      {/* Flag */}
      <span className="text-2xl shrink-0">{flag}</span>

      {/* Team name */}
      <span className="flex-1 text-white font-medium truncate">{team}</span>

      {/* Secondary stat (e.g. losses) */}
      {secondary !== undefined && (
        <div className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black/30 border border-white/5">
          <span className="text-[#f1f5f9]/50">خسائر</span>
          <span className={`font-bold ${secondaryColor ?? "text-[#f1f5f9]"}`}>
            {secondary}
          </span>
        </div>
      )}

      {/* Primary stat (e.g. goals) */}
      <div
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${primaryColor} font-black text-lg min-w-[3rem] justify-center`}
      >
        <span>{primary}</span>
        <span className="text-xs opacity-70">⚽</span>
      </div>
    </div>
  );
}

export default function StatsPage() {
  // Top 5 scorers - sorted by goals scored (gf)
  const topScorers = [...ALL_TEAMS]
    .sort((a, b) => b.gf - a.gf || b.gd - a.gd)
    .slice(0, 5);

  // Top 3 best attack - same metric, top 3
  const bestAttack = topScorers.slice(0, 3);

  // Top 3 best defense - fewest goals conceded (ga)
  const bestDefense = [...ALL_TEAMS]
    .filter((t) => t.played > 0)
    .sort((a, b) => a.ga - b.ga || b.gd - a.gd)
    .slice(0, 3);

  // Group leaders - top team of each group
  const groupLeaders = GROUPS.map((g) => ({
    group: g,
    leader: GROUP_STANDINGS[g][0],
  }));

  // Top 3 most wins
  const mostWins = [...ALL_TEAMS]
    .sort((a, b) => b.won - a.won || b.gd - a.gd)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Pitch stripe background */}
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />

      {/* Header - Mauritanian Green Style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px)",
            }}
          />
        </div>

        {/* Stadium light effects - gold */}
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />

        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">📊</span>
              <span className="text-[#ffd700] font-bold">كأس العالم 2026</span>
              <span className="text-2xl">📊</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-white/30" />
              <span className="gradient-text">إحصائيات كأس العالم 2026</span>
              <span className="w-12 h-px bg-white/30" />
            </h1>
            <p className="text-[#f1f5f9]/80 text-center">
              أرقام وأداء المنتخبات - هدافو، أقوى الهجمات، أقوى الدفاعات، متصدرو المجموعات وأكثر
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Scorers - Top 5 */}
          <StatsCard title="الهدافون" emoji="⚽">
            <div className="space-y-2">
              {topScorers.map((team, idx) => (
                <RankRow
                  key={`${team.group}-${team.team}`}
                  rank={idx}
                  flag={team.flag}
                  team={team.team}
                  primary={team.gf}
                  primaryColor="bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40"
                />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#f1f5f9]/50 text-center">
              أعلى 5 منتخبات تسجيلاً للأهداف
            </div>
          </StatsCard>

          {/* Best Attack - Top 3 */}
          <StatsCard title="أقوى الهجمات" emoji="🔥">
            <div className="space-y-2">
              {bestAttack.map((team, idx) => (
                <RankRow
                  key={`atk-${team.group}-${team.team}`}
                  rank={idx}
                  flag={team.flag}
                  team={team.team}
                  primary={team.gf}
                  primaryColor="bg-[#006233]/30 text-[#ffd700] border-[#006233]/50"
                  secondary={`+${team.gd}`}
                  secondaryColor="text-[#ffd700]"
                />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#f1f5f9]/50 text-center">
              المنتخبات الثلاثة الأقوى هجومياً
            </div>
          </StatsCard>

          {/* Best Defense - Top 3 */}
          <StatsCard title="أقوى الدفاعات" emoji="🛡️">
            <div className="space-y-2">
              {bestDefense.map((team, idx) => (
                <RankRow
                  key={`def-${team.group}-${team.team}`}
                  rank={idx}
                  flag={team.flag}
                  team={team.team}
                  primary={team.ga}
                  primaryColor="bg-[#006233]/30 text-[#006233] border-[#006233]/50"
                  secondary={team.lost}
                  secondaryColor="text-[#d01c1f]"
                />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#f1f5f9]/50 text-center">
              أقل المنتخبات استقبالاً للأهداف -{" "}
              <span className="text-[#d01c1f]">خسائر</span> /{" "}
              <span className="text-[#006233]">انتصارات</span>
            </div>
          </StatsCard>

          {/* Most Wins - Top 3 */}
          <StatsCard title="الأكثر فوزاً" emoji="🏆">
            <div className="space-y-2">
              {mostWins.map((team, idx) => (
                <RankRow
                  key={`win-${team.group}-${team.team}`}
                  rank={idx}
                  flag={team.flag}
                  team={team.team}
                  primary={team.won}
                  primaryColor="bg-[#006233]/30 text-[#006233] border-[#006233]/50"
                  secondary={`${team.points} نقطة`}
                  secondaryColor="text-[#ffd700]"
                />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#f1f5f9]/50 text-center">
              المنتخبات الثلاثة الأكثر تحقيقاً للانتصارات
            </div>
          </StatsCard>

          {/* Group Leaders - Full width */}
          <StatsCard title="متصدرو المجموعات" emoji="👑" span="wide">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {groupLeaders.map(({ group, leader }) => (
                <div
                  key={group}
                  className="glass rounded-xl p-3 border border-[#ffd700]/20 hover:border-[#ffd700]/50 transition-all card-hover"
                >
                  {/* Group badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#f1f5f9]/50">المجموعة</span>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#ffd700] to-[#c9a227] text-[#004225] font-black text-sm shadow-lg">
                      {group}
                    </span>
                  </div>

                  {/* Team */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{leader.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm truncate">
                        {leader.team}
                      </div>
                      <div className="text-[10px] text-[#f1f5f9]/50">
                        {leader.played} مباريات
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1 text-center text-xs">
                    <div className="rounded-md bg-[#006233]/20 border border-[#006233]/30 py-1">
                      <div className="text-[#006233] font-bold">{leader.won}</div>
                      <div className="text-[9px] text-[#f1f5f9]/50">فوز</div>
                    </div>
                    <div className="rounded-md bg-black/30 border border-white/5 py-1">
                      <div className="text-slate-300 font-bold">{leader.drawn}</div>
                      <div className="text-[9px] text-[#f1f5f9]/50">تعادل</div>
                    </div>
                    <div className="rounded-md bg-[#d01c1f]/15 border border-[#d01c1f]/30 py-1">
                      <div className="text-[#d01c1f] font-bold">{leader.lost}</div>
                      <div className="text-[9px] text-[#f1f5f9]/50">خسارة</div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="mt-2 flex items-center justify-between rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30 px-2 py-1.5">
                    <span className="text-[10px] text-[#ffd700]/80">النقاط</span>
                    <span className="text-[#ffd700] font-black text-lg leading-none">
                      {leader.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#f1f5f9]/50 text-center">
              متصدر كل مجموعة بعد الجولة الثانية - 12 متصدراً من A إلى L
            </div>
          </StatsCard>
        </div>

        {/* Trophy footer */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/20 to-[#ffd700]/10 border border-[#ffd700]/30">
            <span className="text-3xl float">🏆</span>
            <span className="text-[#ffd700] font-bold">
              كأس العالم 2026 - إحصائيات حية من قلب الملاعب
            </span>
            <span className="text-3xl float" style={{ animationDelay: "0.5s" }}>
              🏆
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
