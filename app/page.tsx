export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-4">
          ⚽ Mauribin | موريبين
        </h1>
        <p className="text-xl text-slate-400">
          أخبار كرة القدم بالعربية | World Cup 2026
        </p>
      </section>

      {/* Live Matches */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-green-500 pr-4">
          🔴 مباريات مباشرة
        </h2>
        <div id="live-matches" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-6 text-center text-slate-400">
            جاري تحميل المباريات...
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-green-500 pr-4">
          📰 آخر الأخبار
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-700 h-48 flex items-center justify-center">
              <span className="text-slate-500">صورة</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white mb-2">جاري تحميل الأخبار...</h3>
              <p className="text-slate-400 text-sm">أخبار كرة القدم</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
