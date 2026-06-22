export function Footer() {
  return (
    <footer className="glass-dark mt-auto relative overflow-hidden">
      {/* Pitch stripe background */}
      <div className="absolute inset-0 pitch-stripes opacity-10 pointer-events-none" />
      
      {/* Top border with glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
      
      {/* Stadium light effect */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-yellow-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/icons/icon-192.png"
                alt="Mauribin"
                className="w-12 h-12 rounded-xl object-cover border border-[#ffd700]/30"
                style={{ background: "#000" }}
              />
              <div>
                <span className="text-2xl font-bold gradient-text">Mauribin</span>
                <div className="text-xs text-[#ffd700]/60 flex items-center gap-1">
                  <span>🏆</span>
                  <span>كأس العالم 2026</span>
                </div>
              </div>
            </div>
            <p className="text-[#f1f5f9]/60 text-sm leading-relaxed">
              موقعك لأخبار كرة القدم بالعربية. نتائج مباشرة، جداول المباريات، أخبار الانتقالات ومباريات كأس العالم 2026.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔗</span>
              <h4 className="text-white font-bold text-lg">روابط سريعة</h4>
            </div>
            <div className="space-y-3">
              {[
                { href: "/schedule", label: "🗓️ جدول المباريات", icon: "↗" },
                { href: "/groups", label: "🏆 ترتيب المجموعات", icon: "↗" },
                { href: "/teams", label: "👥 المنتخبات", icon: "↗" },
                { href: "/news", label: "📰 الأخبار", icon: "↗" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-[#f1f5f9]/60 text-sm hover:text-[#ffd700] transition-colors group"
                >
                  <span>{link.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ffd700]">←</span>
                </a>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📡</span>
              <h4 className="text-white font-bold text-lg">المصادر</h4>
            </div>
            <div className="space-y-2 text-[#f1f5f9]/60 text-sm">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                BBC العربية - أخبار رياضية
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                KickXoff.com - نتائج المباريات
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                Wikipedia - بيانات كأس العالم
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-sm">
                © 2026 Mauribin. جميع الحقوق محفوظة.
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-full bg-[#006233]/30 border border-[#ffd700]/20">
                <span className="text-xs text-[#ffd700]/60 flex items-center gap-2">
                  <span>🏆</span>
                  <span>كأس العالم 2026 - الولايات المتحدة والمكسيك وكندا</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl float">⚽</span>
              <span className="text-lg font-bold trophy-gold">Mauribin</span>
              <span className="text-2xl float" style={{ animationDelay: '0.3s' }}>⚽</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
