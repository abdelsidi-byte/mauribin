import Link from "next/link";

async function getMatches() {
  try {
    const res = await fetch("https://mauribin.vercel.app/api/football-data", {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.matches || [];
  } catch {
    return [];
  }
}

function getTimeUntil(dateStr: string) {
  const matchDate = new Date(dateStr);
  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();
  
  if (diffMs < 0) return "انتهت";
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `بعد ${days} يوم`;
  }
  if (hours > 0) return `بعد ${hours}س ${mins}د`;
  return `بعد ${mins} دقيقة`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function WorldCupPage() {
  const matches = await getMatches();
  
  const liveMatches = matches.filter((m: any) => m.state === "live");
  const finishedMatches = matches.filter((m: any) => m.state === "ft");
  const upcomingMatches = matches.filter((m: any) => m.state === "upcoming");
  
  // Next upcoming match (first one)
  const nextMatch = upcomingMatches[0] as any;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a2a4a] text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#FFD700] mb-2">🏆 كأس العالم 2026</h1>
        <p className="text-slate-400">المصدر: football-data.org</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/worldcup" className="bg-[#006233] px-4 py-2 rounded-lg font-bold">الرئيسية</Link>
          <Link href="/worldcup/groups" className="bg-slate-700 px-4 py-2 rounded-lg font-bold">المجموعات</Link>
        </div>
      </div>
      
      {/* Next Match - Hero Section */}
      {nextMatch && (
        <div className="max-w-4xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">⚽ المباراة القادمة</h2>
          <div className="bg-gradient-to-br from-[#006233] to-[#004225] rounded-3xl p-8 shadow-2xl border border-[#FFD700]/30">
            {/* Date & Time */}
            <div className="text-center mb-6">
              <p className="text-[#FFD700] text-lg font-bold mb-2">{formatDate(nextMatch.date)}</p>
              <div className="inline-block bg-black/30 rounded-full px-6 py-2">
                <span className="text-2xl font-black">{getTimeUntil(nextMatch.date)}</span>
              </div>
            </div>
            
            {/* Teams */}
            <div className="flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-3">{nextMatch.homeCrest?.startsWith("http") ? <img src={nextMatch.homeCrest} alt="" className="w-20 h-20 mx-auto object-contain" /> : "🏳️"}</div>
                <h3 className="text-2xl font-black">{nextMatch.team1Full || nextMatch.team1}</h3>
                <p className="text-slate-300">{nextMatch.team1}</p>
              </div>
              
              {/* VS */}
              <div className="text-center px-6">
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
                <p className="text-slate-300 mt-2">{nextMatch.competition}</p>
              </div>
              
              {/* Away Team */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-3">{nextMatch.awayCrest?.startsWith("http") ? <img src={nextMatch.awayCrest} alt="" className="w-20 h-20 mx-auto object-contain" /> : "🏳️"}</div>
                <h3 className="text-2xl font-black">{nextMatch.team2Full || nextMatch.team2}</h3>
                <p className="text-slate-300">{nextMatch.team2}</p>
              </div>
            </div>
            
            {/* Details */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <Link href={`/worldcup/match/${nextMatch.id}`} className="block w-full bg-[#FFD700] hover:bg-[#FFC000] text-[#0a1628] font-black py-4 rounded-xl text-center text-xl transition-colors">
                شاهد التفاصيل
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">🔴 مباشر الآن ({liveMatches.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match: any) => (
              <Link href={`/worldcup/match/${match.id}`} key={match.id}>
                <div className="bg-slate-800 rounded-xl p-4 border-2 border-red-500 hover:border-[#FFD700] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">{match.competition}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">مباشر</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>{match.team1}</span>
                    <span className="text-[#FFD700]">{match.homeScore} - {match.awayScore}</span>
                    <span>{match.team2}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Finished Matches */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-green-500 mb-4">✅ انتهت ({finishedMatches.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {finishedMatches.map((match: any) => (
            <Link href={`/worldcup/match/${match.id}`} key={match.id}>
              <div className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">{match.competition}</span>
                  <span className="text-green-500 text-xs">انتهت</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{match.team1}</span>
                  <span className="text-slate-400">{match.homeScore} - {match.awayScore}</span>
                  <span>{match.team2}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Upcoming Matches */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">📅 القادمة ({upcomingMatches.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingMatches.slice(1, 13).map((match: any) => (
            <Link href={`/worldcup/match/${match.id}`} key={match.id}>
              <div className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">{match.competition}</span>
                  <span className="text-blue-400 text-xs">{getTimeUntil(match.date)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-semibold">
                  <span>{match.team1}</span>
                  <span className="text-slate-500">vs</span>
                  <span>{match.team2}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-slate-800/50 rounded-2xl">
        <h3 className="text-xl font-bold text-[#FFD700] mb-4 text-center">📊 إحصائيات البطولة</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-black text-[#FFD700]">{finishedMatches.length}</div>
            <div className="text-slate-400">مباراة انتهت</div>
          </div>
          <div>
            <div className="text-4xl font-black text-red-500">{liveMatches.length}</div>
            <div className="text-slate-400">مباراة مباشرة</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500">{upcomingMatches.length}</div>
            <div className="text-slate-400">مباراة قادمة</div>
          </div>
        </div>
      </div>
    </div>
  );
}
