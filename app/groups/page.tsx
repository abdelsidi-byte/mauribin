import { calculateStandings, getBestThirds } from "@/lib/standings";
import type { TeamStanding } from "@/lib/standings";
import { fetchScores } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TEAM_AR: Record<string, string> = {
  Mexico: "المكسيك", "South Korea": "كوريا الجنوبية", "South Africa": "جنوب أفريقيا", Czechia: "التشيك",
  Canada: "كندا", Switzerland: "سويسرا", Qatar: "قطر", Bosnia: "البوسنة",
  Brazil: "البرازيل", Morocco: "المغرب", Scotland: "أسكتلندا", Haiti: "هايتي",
  USA: "الولايات المتحدة", Australia: "أستراليا", Paraguay: "باراغواي", Turkey: "تركيا",
  Germany: "ألمانيا", "Ivory Coast": "ساحل العاج", Ecuador: "الإكوادور", Curaçao: "كوراساو",
  Netherlands: "هولندا", Sweden: "السويد", Japan: "اليابان", Tunisia: "تونس",
  Belgium: "بلجيكا", Iran: "إيران", Egypt: "مصر", "New Zealand": "نيوزيلندا",
  Spain: "إسبانيا", Uruguay: "أوروغواي", "Saudi Arabia": "السعودية", "Cape Verde": "الرأس الأخضر",
  France: "فرنسا", Norway: "النرويج", Senegal: "السنغال", Iraq: "العراق",
  Argentina: "الأرجنتين", Austria: "النمسا", Algeria: "الجزائر", Jordan: "الأردن",
  Portugal: "البرتغال", Colombia: "كولومبيا", "DR Congo": "الكونغو", Uzbekistan: "أوزبكستان",
  England: "إنجلترا", Croatia: "كرواتيا", Ghana: "غانا", Panama: "بنما",
};

function TeamRow({ team, rank }: { team: TeamStanding; rank: number }) {
  const isTop2 = rank <= 2;
  return (
    <tr className={`border-b border-slate-800/50 ${isTop2 ? "bg-green-900/20" : ""}`}>
      <td className="py-3 px-3 text-center">
        <span className={`font-bold text-sm ${rank === 1 ? "text-yellow-400" : rank === 2 ? "text-slate-300" : "text-slate-500"}`}>
          {rank}
        </span>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{team.flag}</span>
          <span className="font-medium text-white text-sm">{TEAM_AR[team.team] || team.team}</span>
        </div>
      </td>
      <td className="py-3 px-2 text-center text-slate-400 text-xs">{team.played}</td>
      <td className="py-3 px-2 text-center text-slate-400 text-xs">{team.won}</td>
      <td className="py-3 px-2 text-center text-slate-400 text-xs">{team.drawn}</td>
      <td className="py-3 px-2 text-center text-slate-400 text-xs">{team.lost}</td>
      <td className="py-3 px-2 text-center text-green-400 text-xs font-medium">{team.gf}</td>
      <td className="py-3 px-2 text-center text-red-400 text-xs">{team.ga}</td>
      <td className="py-3 px-2 text-center text-slate-300 text-xs ${team.gd > 0 ? 'text-green-400' : team.gd < 0 ? 'text-red-400' : ''}">
        {team.gd > 0 ? "+" : ""}{team.gd}
      </td>
      <td className="py-3 px-2 text-center">
        <span className={`font-bold text-sm ${isTop2 ? "text-yellow-400" : "text-white"}`}>
          {team.points}
        </span>
      </td>
    </tr>
  );
}

function GroupCard({ group, teams }: { group: string; teams: TeamStanding[] }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-800/50 to-green-900/30 px-5 py-3 border-b border-green-700/30">
        <h2 className="text-lg font-bold text-white">{group}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-800/50">
              <th className="py-2 px-3 text-center">#</th>
              <th className="py-2 px-3 text-right">الفريق</th>
              <th className="py-2 px-2 text-center">لعب</th>
              <th className="py-2 px-2 text-center">فاز</th>
              <th className="py-2 px-2 text-center">تعادل</th>
              <th className="py-2 px-2 text-center">خسر</th>
              <th className="py-2 px-2 text-center">له</th>
              <th className="py-2 px-2 text-center">عليه</th>
              <th className="py-2 px-2 text-center">+/-</th>
              <th className="py-2 px-2 text-center">النقاط</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <TeamRow key={team.team} team={team} rank={i + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function GroupsPage() {
  // Calculate standings from real match results
  const scoresData = await fetchScores();
  const groupStandings = calculateStandings(scoresData.matches);
  const bestThirds = getBestThirds(groupStandings);
  
  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent" />
        <div className="container mx-auto px-4 pt-6 pb-4 relative">
          <div className="flex items-center gap-3 mb-4">
            <a href="/" className="text-slate-500 hover:text-white transition-colors">الرئيسية</a>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">ترتيب المجموعات</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">🏆 ترتيب المجموعات</h1>
          <p className="text-slate-400">كأس العالم 2026 — المرحلة الأولى</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-slate-400">يتأهل للثمن النهائي</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-slate-400">خارج المنافسة</span>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupStandings.map((g: { group: string; teams: TeamStanding[] }) => (
            <GroupCard key={g.group} group={g.group} teams={g.teams} />
          ))}
        </div>

        {/* Best 8 Thirds - Round of 32 Qualifiers */}
        <div className="mt-10 glass rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-700/40 to-yellow-900/20 px-6 py-4 border-b border-yellow-700/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                <span>أفضل 8 ثوالث — المتأهلون لدور الـ 32</span>
              </h2>
              <span className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1 font-bold">
                {bestThirds.length} / 8
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              من أصل 12 فريق يحتل المركز الثالث — أفضل 8 منهم يتأهلون لدور الـ 32 مع أول + ثاني كل مجموعة (32 فريقاً)
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bestThirds.map((t, idx) => (
                <div
                  key={t.team}
                  className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-yellow-700/20 hover:border-yellow-500/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem]">
                    <span className="text-yellow-400 font-black text-lg leading-none">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {t.group}
                    </span>
                  </div>
                  <span className="text-2xl">{t.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">
                      {TEAM_AR[t.team] || t.team}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">
                        {t.points}
                      </span>
                      <span>•</span>
                      <span className={t.gd > 0 ? "text-green-400" : t.gd < 0 ? "text-red-400" : ""}>
                        {t.gd > 0 ? "+" : ""}{t.gd}
                      </span>
                      <span>•</span>
                      <span>{t.gf}:{t.ga}</span>
                    </div>
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 8 - bestThirds.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center justify-center bg-slate-900/40 rounded-xl p-3 border border-dashed border-slate-700 min-h-[4rem]"
                >
                  <span className="text-slate-600 text-xs">—</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-white font-bold mb-3">ℹ️ معلومات الترتيب</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• أفضل فريقين من كل مجموعة يتأهلان لثمن النهائي (24 فريق)</li>
            <li>• <span className="text-yellow-400 font-bold">+ أفضل 8 ثوالث</span> من المجموعات الـ 12 → <span className="text-yellow-400 font-bold">32 فريقاً</span> في دور الـ 32</li>
            <li>• النقاط: فوز = 3، تعادل = 1، خسارة = 0</li>
            <li>• +/- = فارق الأهداف (له - عليه)</li>
            <li>• ترتيب الثوالث: نقاط ← فارق أهداف ← أهداف مسجلة ← أهداف مُستقبَلة (أقل)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
