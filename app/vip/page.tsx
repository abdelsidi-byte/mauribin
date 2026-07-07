import Link from "next/link";
import { VideoSection } from "@/components/VideoSection";

export default function VIPPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir="rtl">
      {/* VIP Video + Ad at top */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <VideoSection />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900 py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-9xl">⚽</div>
          <div className="absolute bottom-10 left-10 text-9xl">🏆</div>
        </div>
        <div className="relative z-10 text-center">
          <div className="inline-block bg-yellow-400 text-black font-bold px-6 py-2 rounded-full text-sm mb-4">
            ⭐ VIP Membership
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            🎖️ Mauribin <span className="text-yellow-300">VIP</span>
          </h1>
          <p className="text-xl text-yellow-100 mb-2">تجربة كرة القدم الحقيقية</p>
          <p className="text-yellow-200">اشترك الآن واحصل على جميع المميزات الحصرية</p>
        </div>
      </div>

      {/* Free vs VIP */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Free */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              <div className="inline-block bg-slate-600 text-white font-bold px-4 py-1 rounded-full text-sm mb-3">
                🆓 مجاني
              </div>
              <h2 className="text-2xl font-bold text-white">المستخدم العادي</h2>
              <p className="text-slate-400 mt-2">متابعة أساسية</p>
            </div>
            <ul className="space-y-3">
              {[
                "✅ عرض نتائج المباريات",
                "✅ جدول المجموعات",
                "✅ إحصائيات عامة",
                "✅ أخبار من BBC Sport",
                "✅ تحديث كل 30 ثانية",
                "❌ لا إشعارات فورية",
                "❌ لا إحصائيات متقدمة",
                "❌ لا أهداف وملخصات",
                "❌ إعلانات موجودة",
              ].map((item, i) => (
                <li key={i} className={`text-sm ${item.startsWith("❌") ? "text-slate-500" : "text-slate-300"}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-b from-yellow-900/40 to-slate-800/50 rounded-2xl p-8 border-2 border-yellow-500/50 relative">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-black font-black px-4 py-1 rounded-full text-xs">
              ⭐ الأكثر طلباً
            </div>
            <div className="text-center mb-6">
              <div className="inline-block bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm mb-3">
                💎 VIP
              </div>
              <h2 className="text-2xl font-black text-yellow-300">اشتراك VIP</h2>
              <p className="text-yellow-200/70 mt-2">جميع المميزات الحصرية</p>
              <div className="mt-4">
                <span className="text-4xl font-black text-yellow-300">$9.99</span>
                <span className="text-slate-400 text-sm mr-2">/ شهرياً</span>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "✅ كل مميزات مجانية",
                "✅ ⚡ تحديث فوري لحظي (WebSocket)",
                "✅ 📊 إحصائيات متقدمة لكل مباراة",
                "✅ 🎯 التنبؤات الذكية (AI)",
                "✅ 📺 ملخصات وأهداف المباريات",
                "✅ 🔔 إشعارات مباشرة لهاتفك",
                "✅ 🎮 متابعة اللive من داخل الموقع",
                "✅ 🚫 بدون إعلانات نهائياً",
                "✅ 🏆 دوريات وبطولات إضافية",
                "✅ 📱 لوحة تحكم مخصصة",
                "✅ 💬 دردشة معجبين مباشرة",
              ].map((item, i) => (
                <li key={i} className="text-sm text-yellow-100">
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/payment">
              <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl transition-all">
                اشترك الآن 💎
              </button>
            </Link>
          </div>
        </div>

        {/* API Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-center text-yellow-300 mb-2">🔮 مميزات API المدفوع</h2>
          <p className="text-slate-400 text-center mb-10">ما الذي يتغير مع Football API المدفوع؟</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "تحديث لحظي",
                desc: "بدلاً من 30 ثانية — تحديث فوري خلال ثانية عبر WebSocket. شاهد الهدف في اللحظة التي يسجلها!",
                badge: "PRO API"
              },
              {
                icon: "📊",
                title: "إحصائيات 360°",
                desc: "استحواذ، تسديدات، تمريرات، خطأ، تحذيرات، تغييرات... كل إحصائية المباراة بالتفصيل.",
                badge: "ADVANCED"
              },
              {
                icon: "🎯",
                title: "AI التنبؤات",
                desc: "نموذج ذكاء اصطناعي يحلل 10 سنوات من البيانات لينصحك بأفضل توقعاتك.",
                badge: "AI POWERED"
              },
              {
                icon: "📺",
                title: "أهداف وملخصات",
                desc: "شاهد ملخص المباريات والفرص الكبرى لحظة بلحظة داخل الموقع.",
                badge: "EXCLUSIVE"
              },
              {
                icon: "🔔",
                title: "إشعارات Push",
                desc: "احصل على إشعار فوراً عندما يسجل فريقك هدفاً أو تبدأ مباراته.",
                badge: "REALTIME"
              },
              {
                icon: "🏆",
                title: "100+ دوري",
                desc: "كل الدوريات الكبرى: أوروبا، آسيا، أمريكا، أفريقيا، الوطن العربي... كل المباريات.",
                badge: "UNLIMITED"
              },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-yellow-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">{f.badge}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-black text-center text-white mb-8">📋 مقارنة تفصيلية</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right py-3 px-4 text-slate-400">الميزة</th>
                  <th className="text-center py-3 px-4 text-slate-400">مجاني</th>
                  <th className="text-center py-3 px-4 text-yellow-300">💎 VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  ["تحديث النتائج", "كل 30 ثانية", "لحظي ⚡"],
                  ["عدد الدوريات", "كأس العالم فقط", "100+ دوري"],
                  ["إحصائيات المباريات", "أساسية", "متفمة + متقدمة"],
                  ["AI التنبؤات", "❌", "✅ ذكاء اصطناعي"],
                  ["ملخصات المباريات", "❌", "✅ فيديو + ملخص"],
                  ["إشعارات فورية", "❌", "✅ Push notifications"],
                  ["بدون إعلانات", "❌", "✅ 100% نظيف"],
                  ["API التحديث", "محدود", "غير محدود"],
                  ["Live Commentary", "❌", "✅ تعليق مباشر"],
                  ["الدعم الفني", "عادي", "دعم VIP مخصص"],
                ].map(([feat, free, vip], i) => (
                  <tr key={i} className="border-slate-800">
                    <td className="py-3 px-4 text-slate-300">{feat}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{free}</td>
                    <td className="py-3 px-4 text-center font-bold text-yellow-300">{vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-yellow-900/30 via-yellow-800/20 to-yellow-900/30 rounded-2xl p-10 border border-yellow-500/20">
          <h2 className="text-3xl font-black text-white mb-3">هل تريد تجربة VIP مجانية؟</h2>
          <p className="text-slate-400 mb-6">سجل الآن واحصل على 7 أيام VIP مجاناً لتجربة جميع المميزات</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/payment">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-8 rounded-xl transition-all text-lg">
                💎 اشترك الآن
              </button>
            </Link>
            <Link href="https://wa.me/22236332374" target="_blank">
              <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all">
                💬 تواصل معنا
              </button>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-500 text-xs mt-10">
          💡 المميزات VIP تعتمد على Football Data API المدفوع — قيمته €25/شهر
          <br />
          عند اشتراكك VIP أنت تدعم تطوير Mauribin واستمراره مجانياً للجميع 🇲🇷
        </p>
      </div>
    </div>
  );
}
