import { parseMatches, calculateStandings } from "@/lib/worldcup-api";
import Link from "next/link";

async function getGroupsData() {
  const matches = await parseMatches();
  const standings = calculateStandings(matches);
  return { matches, standings };
}

export default async function GroupsPage() {
  const { matches, standings } = await getGroupsData();
  
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  
  // Team flag map
  const teamFlags: Record<string, string> = {};
  const teamMap = new Map<string, any>();
  
  // Build team flags from matches
  matches.forEach((m: any) => {
    if (!teamFlags[m.team1] && m.team1Flag) teamFlags[m.team1] = m.team1Flag;
    if (!teamFlags[m.team2] && m.team2Flag) teamFlags[m.team2] = m.team2Flag;
  });
  
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#FFD700] mb-2">🏆 ترتيب المجموعات</h1>
        <p className="text-slate-400">كأس العالم 2026</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/worldcup" className="bg-slate-700 px-4 py-2 rounded-lg font-bold">الرئيسية</Link>
          <Link href="/worldcup/groups" className="bg-[#006233] px-4 py-2 rounded-lg font-bold">المجموعات</Link>
        </div>
      </div>
      
      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {groups.map(groupLetter => {
          const groupMatches = matches.filter((m: any) => m.group === `Group ${groupLetter}`);
          const groupStandings = standings.get(groupLetter) || [];
          
          return (
            <div key={groupLetter} className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="bg-[#006233] p-3 text-center">
                <h2 className="text-xl font-black">المجموعة {groupLetter}</h2>
              </div>
              
              <div className="p-4">
                {/* Standings Table */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-right py-2">#</th>
                      <th className="text-right">الفريق</th>
                      <th className="text-center">ل</th>
                      <th className="text-center">ن</th>
                      <th className="text-center">ت</th>
                      <th className="text-center">خ</th>
                      <th className="text-center">+/-</th>
                      <th className="text-center">النقاط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupStandings.length > 0 ? (
                      groupStandings.map((team: any, idx: number) => (
                        <tr key={team.team} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-2 text-center">{idx + 1}</td>
                          <td className="py-2 flex items-center gap-2">
                            <span>{team.flag || teamFlags[team.team] || "🏳️"}</span>
                            <span className="font-semibold">{team.team}</span>
                          </td>
                          <td className="py-2 text-center">{team.played}</td>
                          <td className="py-2 text-center text-green-400">{team.won}</td>
                          <td className="py-2 text-center text-yellow-400">{team.drawn}</td>
                          <td className="py-2 text-center text-red-400">{team.lost}</td>
                          <td className="py-2 text-center">{team.gd > 0 ? "+" : ""}{team.gd}</td>
                          <td className="py-2 text-center font-bold text-[#FFD700]">{team.points}</td>
                        </tr>
                      ))
                    ) : (
                      groupMatches.slice(0, 4).map((m: any, idx: number) => (
                        <tr key={m.team1 || idx} className="border-b border-slate-700/50">
                          <td className="py-2 text-center">{idx + 1}</td>
                          <td className="py-2">{teamFlags[m.team1] || "🏳️"} {m.team1}</td>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">-</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {/* Group Matches Preview */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h3 className="text-xs text-slate-400 mb-2">المباريات:</h3>
                  {groupMatches.slice(0, 3).map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center text-xs py-1">
                      <span>{teamFlags[m.team1] || "🏳️"} {m.team1?.slice(0, 8)}</span>
                      <span className="text-slate-500">
                        {m.homeScore !== null ? `${m.homeScore}-${m.awayScore}` : "vs"}
                      </span>
                      <span>{m.team2?.slice(0, 8)} {teamFlags[m.team2] || "🏳️"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
