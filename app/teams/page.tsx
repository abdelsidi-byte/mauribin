import { GROUPS, TEAMS } from "@/lib/worldcup-data";

export default function TeamsPage() {
  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)",
          }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            👥 المنتخبات المشاركة
          </h1>
          <p className="text-emerald-200 text-center">48 منتخب في 12 مجموعة</p>
        </div>
      </div>

      {/* Teams Grid by Group */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GROUPS.map((group) => {
            const groupTeams = TEAMS.filter((t) => t.group === group);
            return (
              <div key={group} className="glass-card rounded-2xl overflow-hidden">
                {/* Group Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-4 py-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>المجموعة</span>
                    <span className="text-xl">{group}</span>
                  </h2>
                </div>

                {/* Teams List */}
                <div className="p-3 space-y-2">
                  {groupTeams.map((team) => (
                    <div key={team.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-2xl">{team.flag}</span>
                      <span className="text-white font-medium">{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
