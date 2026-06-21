export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">⚽</span>
          <span className="text-xl font-bold text-green-500">Mauribin</span>
        </div>
        <p className="text-slate-500 text-sm mb-4">
          © 2026 Mauribin - أخبار كرة القدم بالعربية
        </p>
        <p className="text-slate-600 text-xs">
          المصدر: KickXoff.com | World Cup 2026
        </p>
      </div>
    </footer>
  );
}
