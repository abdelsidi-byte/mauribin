import { GROUPS, GROUP_STANDINGS } from "@/lib/worldcup-data";

export default function GroupsPage() {
  return (
    <div className="min-h-screen pb-16 relative">
      {/* Pitch stripe background */}
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />
      
      {/* Header - Mauritanian Green Style */}
      <div className="relative overflow-hidden">
        {/* Pitch texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px)",
          }} />
        </div>
        
        {/* Stadium light effects - gold */}
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl" />
        
        {/* White pitch lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">🏆</span>
              <span className="text-[#ffd700] font-bold">كأس العالم 2026</span>
              <span className="text-2xl">🏆</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-white/30" />
              <span>ترتيب المجموعات</span>
              <span className="w-12 h-px bg-white/30" />
            </h1>
            <p className="text-[#f1f5f9]/80 text-center">المرحلة الأولى - بعد نهاية الجولة الثانية</p>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GROUPS.map((group) => {
            const standings = GROUP_STANDINGS[group];
            return (
              <div key={group} className="glass-card rounded-2xl overflow-hidden card-hover">
                {/* Group Header - Mauritanian Green */}
                <div className="relative bg-gradient-to-r from-[#006233] via-[#007a40] to-[#006233] px-4 py-4 border-b border-[#ffd700]/30">
                  <div className="absolute inset-0 pitch-bg opacity-20" />
                  <div className="absolute top-0 left-0 w-8 h-8 border border-[#ffd700]/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-0 right-0 w-8 h-8 border border-[#ffd700]/20 rounded-full translate-x-1/2 -translate-y-1/2" />
                  <h2 className="text-xl font-bold text-white flex items-center justify-center gap-3 relative">
                    <span className="text-[#f1f5f9]/70">المجموعة</span>
                    <span className="text-3xl font-black trophy-gold">{group}</span>
                    <span className="text-2xl">⚽</span>
                  </h2>
                </div>

                {/* Table Header - League Style */}
                <div className="grid grid-cols-12 gap-1 px-3 py-2.5 bg-black/30 text-xs text-[#f1f5f9]/60 font-medium border-b border-white/5">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">المنتخب</div>
                  <div className="col-span-1 text-center">ل</div>
                  <div className="col-span-1 text-center">ف</div>
                  <div className="col-span-1 text-center">ت</div>
                  <div className="col-span-1 text-center">خ</div>
                  <div className="col-span-1 text-center">+/-</div>
                  <div className="col-span-1 text-center">ن</div>
                </div>

                {/* Teams - Match Card Style */}
                {standings.map((team, idx) => (
                  <div
                    key={team.team}
                    className={`grid grid-cols-12 gap-1 px-3 py-3 items-center border-t border-white/5 transition-colors ${
                      idx === 0 ? "bg-gradient-to-r from-[#ffd700]/10 to-transparent" : idx === 1 ? "bg-gradient-to-r from-[#006233]/5 to-transparent" : ""
                    } hover:bg-[#006233]/10`}
                  >
                    {/* Position */}
                    <div className="col-span-1 text-center">
                      {idx === 0 && <span className="text-lg">🥇</span>}
                      {idx === 1 && <span className="text-lg">🥈</span>}
                      {idx > 1 && (
                        <span className={`text-sm font-bold ${
                          idx === 0 ? "text-[#ffd700]" : idx === 1 ? "text-slate-300" : "text-[#f1f5f9]/50"
                        }`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* Team */}
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-2xl transform hover:scale-110 transition-transform">{team.flag}</span>
                      <span className="text-sm text-white font-medium truncate">{team.team}</span>
                    </div>
                    
                    {/* Stats */}
                    <div className="col-span-1 text-center text-xs text-[#f1f5f9]/60">{team.played}</div>
                    <div className="col-span-1 text-center text-xs text-[#ffd700] font-semibold">{team.won}</div>
                    <div className="col-span-1 text-center text-xs text-[#f1f5f9]/60 font-semibold">{team.drawn}</div>
                    <div className="col-span-1 text-center text-xs text-[#d01c1f] font-semibold">{team.lost}</div>
                    <div className="col-span-1 text-center text-xs text-[#f1f5f9]/80">{team.gd > 0 ? `+${team.gd}` : team.gd}</div>
                    
                    {/* Points - Trophy Style */}
                    <div className="col-span-1 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        team.points >= 6 ? "bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40" : 
                        team.points >= 3 ? "bg-[#006233]/20 text-[#ffd700] border border-[#006233]/40" : 
                        "bg-slate-400/20 text-slate-400 border border-slate-400/40"
                      }`}>
                        {team.points}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Team vs Team Mini Cards */}
                <div className="px-3 py-2 bg-black/20 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span>{standings[0]?.flag}</span>
                      <span className="text-[#f1f5f9]/60">vs</span>
                      <span>{standings[1]?.flag}</span>
                    </div>
                    <span className="text-[#ffd700]/60 font-medium">
                      {standings[0]?.played > 0 ? `${standings[0]?.won + standings[1]?.won}/${standings[0]?.played}` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend - Stadium Board Style */}
        <div className="mt-10 glass-card rounded-2xl p-6 border border-[#ffd700]/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h3 className="text-white font-bold text-lg">دليل الترتيب</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ffd700]/50 to-transparent" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#006233]/20 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700] font-bold">ل</span>
              <span className="text-slate-300">مباريات played</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#006233]/20 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700] font-bold">ف</span>
              <span className="text-slate-300">انتصارات</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#006233]/20 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700] font-bold">ت</span>
              <span className="text-slate-300">تعادلات</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#d01c1f]/20 border border-[#d01c1f]/40 flex items-center justify-center text-[#d01c1f] font-bold">خ</span>
              <span className="text-slate-300">خسائر</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-500/20 border border-slate-500/40 flex items-center justify-center text-slate-300 font-bold">+/-</span>
              <span className="text-slate-300">فارق الأهداف</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700] font-bold">ن</span>
              <span className="text-slate-300">النقاط (3-1-0)</span>
            </div>
          </div>
        </div>

        {/* Trophy Section */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/20 to-[#ffd700]/10 border border-[#ffd700]/30">
            <span className="text-3xl float">🏆</span>
            <span className="text-[#ffd700] font-bold">أول فريقين من كل مجموعة يتأهلان للدور التالي</span>
            <span className="text-3xl float" style={{ animationDelay: '0.5s' }}>🏆</span>
          </div>
        </div>
      </div>
    </div>
  );
}
