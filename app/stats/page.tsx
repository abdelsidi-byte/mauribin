import { GROUPS, type GroupStanding } from "@/lib/worldcup-data";
import { fetchScores } from "@/lib/data";

export const metadata = {
  title: "إحصائيات كأس العالم 2026 | Mauribin",
};

// Force dynamic to recalculate standings from latest match data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Calculate standings dynamically from actual match results
async function calculateStandings(): Promise<Record<string, GroupStanding[]>> {
  const data = await fetchScores();
  const matches = data.matches.filter((m) => m.state === "ft");
  
  // Initialize all teams with 0 stats
  const teamStats: Record<string, {
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
  }> = {};
  
  const TEAM_FLAGS: Record<string, string> = {
    Mexico: "🇲🇽", "South Korea": "🇰🇷", "South Africa": "🇿🇦", Czechia: "🇨🇿",
    Canada: "🇨🇦", Switzerland: "🇨🇭", Qatar: "🇶🇦", "Bosnia-Herzegovina": "🇧🇦",
    Bosnia: "🇧🇦", Brazil: "🇧🇷", Morocco: "🇲🇦", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Haiti: "🇭🇹",
    "United States": "🇺🇸", USA: "🇺🇸", Australia: "🇦🇺", Paraguay: "🇵🇾", Türkiye: "🇹🇷", Turkey: "🇹🇷",
    Germany: "🇩🇪", "Côte d'Ivoire": "🇨🇮", "Ivory Coast": "🇨🇮", Ecuador: "🇪🇨", Curaçao: "🇨🇼",
    Netherlands: "🇳🇱", Sweden: "🇸🇪", Japan: "🇯🇵", Tunisia: "🇹🇳",
    Belgium: "🇧🇪", Iran: "🇮🇷", Egypt: "🇪🇬", "New Zealand": "🇳🇿",
    Spain: "🇪🇸", Uruguay: "🇺🇾", "Saudi Arabia": "🇸🇦", "Cape Verde": "🇨🇻",
    France: "🇫🇷", Norway: "🇳🇴", Senegal: "🇸🇳", Iraq: "🇮🇶",
    Argentina: "🇦🇷", Austria: "🇦🇹", Algeria: "🇩🇿", Jordan: "🇯🇴",
    Portugal: "🇵🇹", Colombia: "🇨🇴", "DR Congo": "🇨🇩", Uzbekistan: "🇺🇿",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croatia: "🇭🇷", Ghana: "🇬🇭", Panama: "🇵🇦",
  };
  
  // Group definitions for standings assignment
  const GROUP_TEAMS: Record<string, string[]> = {
    A: ["Mexico", "South Korea", "South Africa", "Czechia"],
    B: ["Canada", "Switzerland", "Qatar", "Bosnia-Herzegovina"],
    C: ["Brazil", "Morocco", "Scotland", "Haiti"],
    D: ["United States", "Australia", "Paraguay", "Türkiye"],
    E: ["Germany", "Côte d'Ivoire", "Ecuador", "Curaçao"],
    F: ["Netherlands", "Sweden", "Japan", "Tunisia"],
    G: ["Belgium", "Iran", "Egypt", "New Zealand"],
    H: ["Spain", "Uruguay", "Saudi Arabia", "Cape Verde"],
    I: ["France", "Norway", "Senegal", "Iraq"],
    J: ["Argentina", "Austria", "Algeria", "Jordan"],
    K: ["Portugal", "Colombia", "DR Congo", "Uzbekistan"],
    L: ["England", "Croatia", "Ghana", "Panama"],
  };
  
  // Initialize all teams
  Object.entries(GROUP_TEAMS).forEach(([_, teams]) => {
    teams.forEach((team) => {
      if (!teamStats[team]) {
        teamStats[team] = {
          team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
        };
      }
    });
  });
  
  // Process each finished match
  matches.forEach((m) => {
    if (m.homeScore === null || m.awayScore === null || m.homeScore === undefined || m.awayScore === undefined) return;
    
    // Normalize team names
    const normalizeTeam = (name: string): string => {
      if (name === "Bosnia") return "Bosnia-Herzegovina";
      if (name === "USA") return "United States";
      if (name === "Turkey") return "Türkiye";
      if (name === "Ivory Coast") return "Côte d'Ivoire";
      return name;
    };
    
    const home = normalizeTeam(m.home);
    const away = normalizeTeam(m.away);
    
    if (!teamStats[home]) teamStats[home] = { team: home, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 };
    if (!teamStats[away]) teamStats[away] = { team: away, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 };
    
    teamStats[home].played++;
    teamStats[away].played++;
    teamStats[home].gf += m.homeScore;
    teamStats[away].gf += m.awayScore;
    teamStats[home].ga += m.awayScore;
    teamStats[away].ga += m.homeScore;
    
    if (m.homeScore > m.awayScore) {
      teamStats[home].won++;
      teamStats[away].lost++;
    } else if (m.homeScore < m.awayScore) {
      teamStats[away].won++;
      teamStats[home].lost++;
    } else {
      teamStats[home].drawn++;
      teamStats[away].drawn++;
    }
  });
  
  // Group teams and calculate points + sort
  const standings: Record<string, GroupStanding[]> = {};
  Object.entries(GROUP_TEAMS).forEach(([group, teams]) => {
    const groupStats: GroupStanding[] = teams.map((team) => {
      const stats = teamStats[team];
      return {
        team,
        flag: TEAM_FLAGS[team] || "🏳️",
        played: stats.played,
        won: stats.won,
        drawn: stats.drawn,
        lost: stats.lost,
        gf: stats.gf,
        ga: stats.ga,
        gd: stats.gf - stats.ga,
        points: stats.won * 3 + stats.drawn,
      };
    });
    
    // Sort: points desc, then goal diff desc, then goals for desc, then name asc
    groupStats.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });
    
    standings[group] = groupStats;
  });
  
  return standings;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function getMedal(idx: number) {
  return MEDALS[idx] ?? null;
}

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
      <div className="relative bg-gradient-to-r from-[#006233] via-[#007a40] to-[#006233] px-4 py-4 border-b border-[#ffd700]/30">
        <div className="absolute inset-0 pitch-bg opacity-20 pointer-events-none" />
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
      <div className="w-9 flex items-center justify-center text-xl">
        {medal ?? (
          <span className="text-sm font-bold text-[#f1f5f9]/50">{rank + 1}</span>
        )}
      </div>
      <span className="text-2xl shrink-0">{flag}</span>
      <span className="flex-1 text-white font-medium truncate">{team}</span>
      {secondary !== undefined && (
        <div className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black/30 border border-white/5">
          <span className="text-[#f1f5f9]/50">خسائر</span>
          <span className={`font-bold ${secondaryColor ?? "text-[#f1f5f9]"}`}>
            {secondary}
          </span>
        </div>
      )}
      <div
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${primaryColor} font-black text-lg min-w-[3rem] justify-center`}
      >
        <span>{primary}</span>
        <span className="text-xs opacity-70">⚽</span>
      </div>
    </div>
  );
}

export default async function StatsPage() {
  // Calculate dynamic standings from real match results
  const GROUP_STANDINGS = await calculateStandings();
  
  // Flatten all teams
  const ALL_TEAMS: (GroupStanding & { group: string })[] = GROUPS.flatMap((g) =>
    GROUP_STANDINGS[g].map((t) => ({ ...t, group: g }))
  );
  
  // Only show teams that have played
  const teamsWithMatches = ALL_TEAMS.filter((t) => t.played > 0);
  
  // Top 5 scorers
  const topScorers = [...teamsWithMatches]
    .sort((a, b) => b.gf - a.gf || b.gd - a.gd)
    .slice(0, 5);
  
  // Top 3 best attack
  const bestAttack = topScorers.slice(0, 3);
  
  // Top 3 best defense
  const bestDefense = [...teamsWithMatches]
    .sort((a, b) => a.ga - b.ga || b.gd - a.gd)
    .slice(0, 3);
  
  // Group leaders
  const groupLeaders = GROUPS.map((g) => ({
    group: g,
    leader: GROUP_STANDINGS[g][0],
  })).filter((gl) => gl.leader.played > 0);
  
  // Top 3 most wins
  const mostWins = [...teamsWithMatches]
    .sort((a, b) => b.won - a.won || b.gd - a.gd)
    .slice(0, 3);
  
  // Top 3 most losses
  const mostLosses = [...teamsWithMatches]
    .sort((a, b) => b.lost - a.lost || a.gd - b.gd)
    .slice(0, 3);
  
  // Most goals scored in a single match
  const allMatches = (await fetchScores()).matches.filter((m) => m.state === "ft" && m.homeScore !== null && m.awayScore !== null);
  const highestScoring = [...allMatches]
    .sort((a, b) => (b.homeScore! + b.awayScore!) - (a.homeScore! + a.awayScore!))
    .slice(0, 3);

  const totalGoals = teamsWithMatches.reduce((sum, t) => sum + t.gf, 0);
  const totalMatches = allMatches.length;

  return (
    <div className="min-h-screen pb-16 relative">
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">📊</span>
              <span className="text-[#ffd700] text-sm font-medium">كأس العالم 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="gradient-text">إحصائيات البطولة</span>
            </h1>
            <p className="text-slate-300 mb-2">
              أرقام حقيقية محسوبة من نتائج المباريات الفعلية
            </p>
            <div className="inline-flex items-center gap-4 flex-wrap justify-center">
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[#ffd700] font-bold">{totalMatches}</span>
                <span className="text-slate-400 text-sm mr-1">مباراة منتهية</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[#ffd700] font-bold">{totalGoals}</span>
                <span className="text-slate-400 text-sm mr-1">هدف</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[#ffd700] font-bold">{teamsWithMatches.length}</span>
                <span className="text-slate-400 text-sm mr-1">منتخب لعب</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative">
        {teamsWithMatches.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 glass-card rounded-2xl p-8 text-center">
            <div className="text-6xl mb-3">⚽</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد إحصائيات بعد</h3>
            <p className="text-slate-400">
              ستظهر الإحصائيات هنا بعد انتهاء المباريات الأولى
            </p>
          </div>
        ) : (
          <>
            {/* Top Scorers */}
            <StatsCard title="أفضل الهدافين" emoji="⚽">
              {topScorers.length > 0 ? (
                <div className="space-y-2">
                  {topScorers.map((t, i) => (
                    <RankRow
                      key={t.team}
                      rank={i}
                      flag={t.flag}
                      team={t.team}
                      primary={t.gf}
                      primaryColor="border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700]"
                      secondary={t.lost}
                      secondaryColor="text-red-400"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Best Attack */}
            <StatsCard title="أقوى هجوم" emoji="🔥">
              {bestAttack.length > 0 ? (
                <div className="space-y-2">
                  {bestAttack.map((t, i) => (
                    <RankRow
                      key={t.team}
                      rank={i}
                      flag={t.flag}
                      team={t.team}
                      primary={t.gf}
                      primaryColor="border-orange-500/30 bg-orange-500/10 text-orange-400"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Best Defense */}
            <StatsCard title="أقوى دفاع" emoji="🛡️">
              {bestDefense.length > 0 ? (
                <div className="space-y-2">
                  {bestDefense.map((t, i) => (
                    <RankRow
                      key={t.team}
                      rank={i}
                      flag={t.flag}
                      team={t.team}
                      primary={t.ga}
                      primaryColor="border-blue-500/30 bg-blue-500/10 text-blue-400"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Most Wins */}
            <StatsCard title="أكثر انتصارات" emoji="🏆">
              {mostWins.length > 0 ? (
                <div className="space-y-2">
                  {mostWins.map((t, i) => (
                    <RankRow
                      key={t.team}
                      rank={i}
                      flag={t.flag}
                      team={t.team}
                      primary={t.won}
                      primaryColor="border-[#006233]/30 bg-[#006233]/20 text-[#a3e3b6]"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Most Losses */}
            <StatsCard title="أكثر هزائم" emoji="💔">
              {mostLosses.length > 0 ? (
                <div className="space-y-2">
                  {mostLosses.map((t, i) => (
                    <RankRow
                      key={t.team}
                      rank={i}
                      flag={t.flag}
                      team={t.team}
                      primary={t.lost}
                      primaryColor="border-red-500/30 bg-red-500/10 text-red-400"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Group Leaders */}
            <StatsCard title="متصدرو المجموعات" emoji="👑">
              {groupLeaders.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {groupLeaders.map(({ group, leader }) => (
                    <div
                      key={group}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#ffd700]/20 bg-gradient-to-r from-[#ffd700]/10 to-transparent"
                    >
                      <div className="px-2 py-1 rounded-md bg-[#ffd700]/20 border border-[#ffd700]/30 text-[#ffd700] font-bold text-sm">
                        {group}
                      </div>
                      <span className="text-2xl">{leader.flag}</span>
                      <span className="flex-1 text-white font-medium truncate">
                        {leader.team}
                      </span>
                      <div className="text-xs text-slate-400">
                        <span className="text-[#ffd700] font-bold">{leader.points}</span> نقطة
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>

            {/* Highest Scoring Matches */}
            <StatsCard title="أعلى المباريات تهديفاً" emoji="🎯" span="wide">
              {highestScoring.length > 0 ? (
                <div className="space-y-2">
                  {highestScoring.map((m, i) => {
                    const total = (m.homeScore || 0) + (m.awayScore || 0);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl border border-white/5 bg-black/20"
                      >
                        <div className="w-9 flex items-center justify-center text-xl">
                          {getMedal(i) || (
                            <span className="text-sm font-bold text-slate-500">{i + 1}</span>
                          )}
                        </div>
                        <span className="flex-1 text-white font-medium">
                          {m.home}{" "}
                          <span className="text-[#ffd700] font-bold mx-1">
                            {m.homeScore} - {m.awayScore}
                          </span>{" "}
                          {m.away}
                        </span>
                        <div className="px-3 py-1 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] font-bold text-sm">
                          {total} ⚽
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
              )}
            </StatsCard>
          </>
        )}
      </div>
    </div>
  );
}