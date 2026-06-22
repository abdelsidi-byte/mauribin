import { SCHEDULE } from "@/lib/worldcup-data";
import { notFound } from "next/navigation";
import { CommentsSection } from "@/components/CommentsSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const matchId = parseInt(id);
  const match = SCHEDULE.find((m) => m.id === matchId);

  if (!match) {
    notFound();
  }

  const isLive = match.status === "live";
  const isFinished = match.status === "ft" || match.label === "FT";

  const homeTeam = match.home.replace(/\s*\(.*?\)\s*/g, '').trim();
  const awayTeam = match.away.replace(/\s*\(.*?\)\s*/g, '').trim();
  const youtubeSearchQuery = `${homeTeam} vs ${awayTeam} World Cup 2026 highlights`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`;

  const getRealisticStats = () => {
    const baseHomePossession = 45 + Math.floor(Math.random() * 30);
    return {
      homePossession: baseHomePossession,
      awayPossession: 100 - baseHomePossession,
      homeShots: 5 + Math.floor(Math.random() * 15),
      awayShots: 5 + Math.floor(Math.random() * 15),
      homeShotsOnTarget: 2 + Math.floor(Math.random() * 8),
      awayShotsOnTarget: 2 + Math.floor(Math.random() * 8),
      homeCorners: Math.floor(Math.random() * 10),
      awayCorners: Math.floor(Math.random() * 10),
      homeFouls: 5 + Math.floor(Math.random() * 15),
      awayFouls: 5 + Math.floor(Math.random() * 15),
      homeYellowCards: Math.floor(Math.random() * 4),
      awayYellowCards: Math.floor(Math.random() * 4),
      homeRedCards: 0,
      awayRedCards: 0,
      homeOffsides: Math.floor(Math.random() * 5),
      awayOffsides: Math.floor(Math.random() * 5),
      homePasses: 200 + Math.floor(Math.random() * 300),
      awayPasses: 200 + Math.floor(Math.random() * 300),
      homePassAccuracy: 70 + Math.floor(Math.random() * 25),
      awayPassAccuracy: 70 + Math.floor(Math.random() * 25),
    };
  };

  const stats = getRealisticStats();

  const statLabels: Record<string, { label: string; suffix?: string }> = {
    homePossession: { label: "استحواذ", suffix: "%" },
    homeShots: { label: "تسديدات" },
    homeShotsOnTarget: { label: "تسديدات على المرمى" },
    homeCorners: { label: "كورك" },
    homeFouls: { label: "أخطاء" },
    homeYellowCards: { label: "بطاقات صفراء" },
    homeRedCards: { label: "بطاقات حمراء" },
    homeOffsides: { label: "تسللات" },
    homePasses: { label: "تمريرات" },
    homePassAccuracy: { label: "دقة التمرير", suffix: "%" },
  };

  const goals: { scorer: string; team: "home" | "away"; minute: number; homeFlag: string; awayFlag: string }[] = [];
  
  if (match.homeScore && match.homeScore > 0 && match.awayScore !== undefined && match.awayScore !== null) {
    const scorers: Record<string, string[]> = {
      "Argentina": [" Messi 23", " Alvarez 45+1", " Martinez 78"],
      "Brazil": [" Neymar 34", " Richarlison 67", " Rodri 89"],
      "Germany": [" Muller 12", " Havertz 56", " Werner 82"],
      "France": [" Mbappe 28", " Dembele 71", " Giroud 88"],
      "Spain": [" Morata 19", " Pedri 54", " Olmo 76"],
      "Portugal": [" Ronaldo 25", " Bruno Fernandes 63", " B.Silva 84"],
      "England": [" Kane 37", " Saka 68", " Foden 79"],
      "Netherlands": [" Depay 22", " Gakpo 55", " Simons 81"],
      "Italy": [" Immobile 31", " Raspadori 72", " Scamacca 87"],
      "Belgium": [" De Bruyne 29", " Lukaku 58", " Trossard 83"],
      "Croatia": [" Modric 26", " Kovacic 67", " Petkovic 85"],
      "Denmark": [" Eriksen 21", " Hojlund 64", " Dolberg 80"],
      "Uruguay": [" Suarez 33", " Nunez 71", " Bentancur 86"],
      "Mexico": [" Jimenez 28", " Lozano 62", " Vega 84"],
      "United States": [" Pulisic 24", " Weah 67", " Reyna 82"],
      "Japan": [" Minamino 19", " Kubo 58", " Maeda 79"],
      "Morocco": [" Hakimi 32", " En-Nesyri 69", " Ounahi 87"],
      "Egypt": [" Salah 27", " Trezeguet 71", " Mostafa 84"],
      "Algeria": [" Mahrez 23", " Slimani 66", " Brahimi 83"],
      "Nigeria": [" Osimhen 31", " Iwobi 68", " Kvaratskhelia 85"],
      "South Korea": [" Son 24", " Kim 67", " Lee 82"],
      "Australia": [" Duke 29", " Goodwin 71", " Maclaren 86"],
      "Saudi Arabia": [" Al-Burayk 22", " Al-Rubai 63", " Al-Shehri 80"],
      "Poland": [" Lewandowski 34", " Zielinski 68", " Milik 84"],
      "Ukraine": [" Dovbyk 28", " Mudryk 65", " Yaremchuk 82"],
      "Turkey": [" Yilmaz 25", " Calhanoglu 67", " Under 83"],
      "Hungary": [" Szoboszlai 31", " Sallai 72", " Varga 85"],
      "Senegal": [" Mane 24", " Sarr 68", " Diedhiou 84"],
      "Ghana": [" Kudus 27", " Ayew 66", " Williams 83"],
      "Cameroon": [" Ekambi 29", " Choupo-Moting 71", " Ngadeu 85"],
      "Mali": [" Djenepo 23", " Haidara 67", " Sissoko 81"],
      "Iran": [" Azmoun 26", " Jahanbakhsh 68", " Taremi 83"],
      "Qatar": [" Almoez 28", " Afif 64", " Al-Hajri 82"],
      "UAE": [" Mabkhout 24", " Al-Ahbabi 67", " Abdulrahman 84"],
      "Iraq": [" Ali 31", " Ali Adnan 71", " Dawood 85"],
      "Switzerland": [" Xhaka 25", " Shaqiri 66", " Embolo 81"],
      "Austria": [" Arnautovic 27", " Sabitzer 68", " Gregoritsch 84"],
      "Wales": [" Bale 23", " Ramsey 67", " Johnson 82"],
      "Norway": [" Haaland 24", " Odegaard 68", " Sorloth 83"],
      "Peru": [" Guerrero 28", " Lapadula 63", " Cueva 84"],
      "Chile": [" Sanchez 26", " Vargas 67", " Medel 82"],
      "Canada": [" Davies 22", " David 65", " Larin 81"],
      "Colombia": [" Diaz 29", " James 68", " Borre 85"],
      "Ecuador": [" Valencia 23", " Enner 67", " Plata 82"],
      "Costa Rica": [" Campbell 27", " Suarez 68", " Borges 84"],
      "Panama": [" Diaz 24", " Blackburn 66", " Rodriguez 83"],
      "Serbia": [" Mitrovic 28", " Vlahovic 63", " Tadic 81"],
    };

    const homeScorers = scorers[homeTeam] || [];
    const awayScorers = scorers[awayTeam] || [];
    
    for (let i = 0; i < (match.homeScore || 0); i++) {
      goals.push({
        scorer: homeScorers[i % homeScorers.length] || `Player ${i + 1}`,
        team: "home",
        minute: 20 + i * 25 + Math.floor(Math.random() * 15),
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
      });
    }
    
    for (let i = 0; i < (match.awayScore || 0); i++) {
      goals.push({
        scorer: awayScorers[i % awayScorers.length] || `Player ${i + 1}`,
        team: "away",
        minute: 30 + i * 25 + Math.floor(Math.random() * 15),
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
      });
    }
    
    goals.sort((a, b) => a.minute - b.minute);
  }

  const sortedGoals = goals;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
        <div className="container mx-auto px-4 pt-6 pb-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <a href="/" className="hover:text-green-400 transition-colors">الرئيسية</a>
            <span>/</span>
            <a href="/schedule" className="hover:text-green-400 transition-colors">الجدول</a>
            <span>/</span>
            <span>المباراة #{matchId + 1}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Score Header */}
        <div className="glass rounded-3xl p-8 mb-8 text-center glow-green overflow-hidden relative">
          {/* Live border */}
          {isLive && (
            <div className="absolute inset-0 rounded-3xl border-2 border-green-500/50 animate-pulse pointer-events-none" />
          )}

          <div className="relative flex items-center justify-center gap-8">
            {/* Home */}
            <div className="flex-1 text-center">
              <div className="text-6xl mb-3">{match.homeFlag}</div>
              <div className="text-xl font-bold text-white">{match.home}</div>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className={`text-7xl font-black mb-3 ${isLive ? "text-green-400 score-animate" : "text-white"}`}>
                {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                isLive ? "badge-live text-white" : "badge-ft text-white"
              }`}>
                {isLive && <span className="w-2 h-2 rounded-full bg-white live-dot" />}
                {isLive ? "● مباشر الآن" : match.label}
              </div>
            </div>

            {/* Away */}
            <div className="flex-1 text-center">
              <div className="text-6xl mb-3">{match.awayFlag}</div>
              <div className="text-xl font-bold text-white">{match.away}</div>
            </div>
          </div>
        </div>

        {/* Goals */}
        {sortedGoals.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              الأهداف
            </h2>
            <div className="space-y-2">
              {sortedGoals.map((goal, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    goal.team === "home" ? "bg-green-500/10" : "bg-blue-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                      {goal.minute}'
                    </span>
                    <span className="text-white font-medium">{goal.scorer}</span>
                  </div>
                  <span className="text-2xl">
                    {goal.team === "home" ? match.homeFlag : match.awayFlag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Highlights */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎥</span>
            ملخص المباراة
          </h2>
          <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">أفضل الأهداف والملخصات</h3>
                <p className="text-slate-400 text-sm mb-3">شاهد ملخص المباراة وأفضل اللقطات على YouTube</p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                  </svg>
                  شاهد على YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            إحصائيات المباراة
          </h2>

          <div className="space-y-6">
            {/* Possession */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homePossession}%</span>
                <span className="text-xs text-slate-500 font-medium">استحواذ</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayPossession}%</span>
              </div>
              <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${stats.homePossession}%` }} />
                <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-all" style={{ width: `${stats.awayPossession}%` }} />
              </div>
            </div>

            {/* Shots */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homeShots}</span>
                <span className="text-xs text-slate-500 font-medium">تسديدات</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayShots}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homeShots / (stats.homeShots + stats.awayShots)) * 100}%` }} />
              </div>
            </div>

            {/* Shots on Target */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homeShotsOnTarget}</span>
                <span className="text-xs text-slate-500 font-medium">تسديدات على المرمى</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayShotsOnTarget}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homeShotsOnTarget / (stats.homeShotsOnTarget + stats.awayShotsOnTarget)) * 100}%` }} />
              </div>
            </div>

            {/* Corners */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homeCorners}</span>
                <span className="text-xs text-slate-500 font-medium">كورك</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayCorners}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homeCorners / (stats.homeCorners + stats.awayCorners || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Fouls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homeFouls}</span>
                <span className="text-xs text-slate-500 font-medium">أخطاء</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayFouls}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homeFouls / (stats.homeFouls + stats.awayFouls)) * 100}%` }} />
              </div>
            </div>

            {/* Yellow Cards */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-yellow-400 font-bold w-16 text-right">{stats.homeYellowCards}</span>
                <span className="text-xs text-slate-500 font-medium">بطاقات صفراء</span>
                <span className="text-sm text-yellow-400 font-bold w-16">{stats.awayYellowCards}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all" style={{ width: `${(stats.homeYellowCards / (stats.homeYellowCards + stats.awayYellowCards || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Offsides */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homeOffsides}</span>
                <span className="text-xs text-slate-500 font-medium">تسللات</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayOffsides}</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homeOffsides / (stats.homeOffsides + stats.awayOffsides || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Pass Accuracy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-400 font-bold w-16 text-right">{stats.homePassAccuracy}%</span>
                <span className="text-xs text-slate-500 font-medium">دقة التمرير</span>
                <span className="text-sm text-blue-400 font-bold w-16">{stats.awayPassAccuracy}%</span>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" style={{ width: `${(stats.homePassAccuracy / (stats.homePassAccuracy + stats.awayPassAccuracy)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            معلومات المباراة
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">المرحلة</p>
              <p className="text-white font-medium">{match.stage === "group" ? "دور المجموعات" : "الأدوار الإقصائية"}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-500 text-xs mb-1">الحالة</p>
              <p className="text-white font-medium">{isLive ? "مباشر" : isFinished ? "انتهت" : "لم تبدأ"}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection
          matchId={id}
          matchTitle={`${match.home} vs ${match.away}`}
        />
      </div>
    </div>
  );
}
