import { parseMatches } from "@/lib/worldcup-api";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMatch(id: string) {
  const matches = await parseMatches();
  return matches.find(m => m.id === id);
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatch(id);
  
  if (!match) {
    notFound();
  }
  
  const stateLabel = match.state === "ft" ? "انتهت" : match.state === "live" ? "🔴 مباشر" : "قادم";
  const stateColor = match.state === "ft" ? "bg-green-500" : match.state === "live" ? "bg-red-500" : "bg-blue-500";
  
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex gap-4 justify-center mb-4">
          <Link href="/worldcup" className="bg-slate-700 px-4 py-2 rounded-lg font-bold">الرئيسية</Link>
          <Link href="/worldcup/groups" className="bg-slate-700 px-4 py-2 rounded-lg font-bold">المجموعات</Link>
        </div>
      </div>
      
      {/* Match Card */}
      <div className="max-w-2xl mx-auto">
        <div className={`${stateColor} text-white text-center py-2 rounded-t-xl font-bold`}>
          {stateLabel}
        </div>
        
        <div className="bg-slate-800 rounded-b-xl p-8 border-2 border-slate-700">
          {/* Teams */}
          <div className="flex justify-between items-center text-3xl md:text-4xl font-black mb-8">
            <div className="text-center flex-1">
              <div className="text-6xl mb-2">{match.team1Flag || "🏳️"}</div>
              <div className="text-lg font-bold">{match.team1}</div>
            </div>
            
            <div className="text-center px-6">
              {match.homeScore !== null ? (
                <div className="text-5xl md:text-6xl text-[#FFD700]">
                  {match.homeScore} - {match.awayScore}
                </div>
              ) : (
                <div className="text-3xl text-slate-500">VS</div>
              )}
            </div>
            
            <div className="text-center flex-1">
              <div className="text-6xl mb-2">{match.team2Flag || "🏳️"}</div>
              <div className="text-lg font-bold">{match.team2}</div>
            </div>
          </div>
          
          {/* Match Info */}
          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">الجولة</div>
              <div className="font-bold">{match.round}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">المجموعة</div>
              <div className="font-bold">{match.group}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">التاريخ</div>
              <div className="font-bold">{match.date}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-sm">الوقت</div>
              <div className="font-bold">{match.time}</div>
            </div>
          </div>
          
          {/* Stadium */}
          <div className="text-center text-slate-400 mb-6">
            🏟️ {match.ground}
          </div>
          
          {/* Goals */}
          {((match.goals1 && match.goals1.length > 0) || (match.goals2 && match.goals2.length > 0)) && (
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 text-center">⚽ الأهداف</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Team 1 Goals */}
                <div>
                  <h4 className="text-sm text-slate-400 mb-2">{match.team1}</h4>
                  {(match.goals1 && match.goals1.length > 0) ? (
                    <ul className="space-y-2">
                      {(match.goals1 || []).map((goal: any, idx: number) => (
                        <li key={idx} className="flex justify-between text-sm bg-slate-700/30 rounded px-3 py-2">
                          <span>{goal.name}</span>
                          <span className="text-[#FFD700]">{goal.minute}'</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">لا توجد أهداف</p>
                  )}
                </div>
                
                {/* Team 2 Goals */}
                <div>
                  <h4 className="text-sm text-slate-400 mb-2">{match.team2}</h4>
                  {(match.goals2 && match.goals2.length > 0) ? (
                    <ul className="space-y-2">
                      {(match.goals2 || []).map((goal: any, idx: number) => (
                        <li key={idx} className="flex justify-between text-sm bg-slate-700/30 rounded px-3 py-2">
                          <span>{goal.name}</span>
                          <span className="text-[#FFD700]">{goal.minute}'</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">لا توجد أهداف</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/worldcup" className="bg-[#006233] hover:bg-[#004225] text-white font-bold py-3 px-8 rounded-xl transition-colors">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
