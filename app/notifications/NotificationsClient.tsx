"use client";
import { NotificationButton } from "@/components/NotificationButton";
import Link from "next/link";

export function NotificationsClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            الرئيسية
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-bold">إشعارات المباريات</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#006233]/30 via-slate-900 to-slate-950 rounded-3xl p-8 border border-[#006233]/30 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className="flex-1">
              <div className="text-5xl mb-4">🔔</div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                إشعارات المباريات
              </h1>
              <p className="text-slate-300 text-lg">
                اعرف فوراً عند بدء أي مباراة لكأس العالم 2026
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-2 items-end">
              <NotificationButton forceOpen />
              <p className="text-[10px] text-slate-400 max-w-[200px] text-right">
                اضغط الزر بالأعلى لعرض الإعدادات أو تفعيل الإشعارات
              </p>
            </div>
          </div>

          {/* Direct tab switcher — works even without subscription */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => {
                // Trigger the subscribe panel by clicking the button
                const btn = document.querySelector<HTMLButtonElement>('[aria-label="إعدادات الإشعارات"]');
                btn?.click();
              }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors"
            >
              🔕 تفعيل الإشعارات
            </button>
            <a
              href="/schedule"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors text-center"
            >
              📅 عرض جدول المباريات
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> كيف يعمل النظام
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="shrink-0 w-8 h-8 bg-[#006233] text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <strong className="text-white">فعّل الإشعارات</strong>
                <p className="text-sm text-slate-400">اضغط على زر الجرس 🔕 بالأعلى، ثم اسمح للمتصفح</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-8 h-8 bg-[#006233] text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <strong className="text-white">اختر المنتخبات المفضلة</strong>
                <p className="text-sm text-slate-400">خصص الإشعارات حسب اهتماماتك من قائمة الإعدادات</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-8 h-8 bg-[#006233] text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <strong className="text-white">استقبل الإشعارات</strong>
                <p className="text-sm text-slate-400">سيتم تنبيهك على هاتفك قبل بدء المباريات، عند الأهداف، ونهايتها</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="text-lg font-bold text-white mb-1">تنبيه قبل البدء</h3>
            <p className="text-sm text-slate-400">إشعار قبل 15 دقيقة من بدء المباراة</p>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">
            <div className="text-3xl mb-3">⚽</div>
            <h3 className="text-lg font-bold text-white mb-1">الأهداف</h3>
            <p className="text-sm text-slate-400">إشعار فوري عند تسجيل أي هدف</p>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">
            <div className="text-3xl mb-3">🟥</div>
            <h3 className="text-lg font-bold text-white mb-1">البطاقات الحمراء</h3>
            <p className="text-sm text-slate-400">إشعار عند الطرد وقرارات VAR</p>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">
            <div className="text-3xl mb-3">🏁</div>
            <h3 className="text-lg font-bold text-white mb-1">نهاية المباراة</h3>
            <p className="text-sm text-slate-400">إشعار بالنتيجة النهائية</p>
          </div>
        </div>

        {/* Customization preview */}
        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎛️</span> إعدادات قابلة للتخصيص
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            بعد تفعيل الإشعارات، يمكنك اختيار ما يصلك منها:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg">
              <span className="text-green-400">✓</span> قبل بدء المباراة (15 دقيقة)
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg">
              <span className="text-green-400">✓</span> عند تسجيل هدف
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg">
              <span className="text-green-400">✓</span> البطاقات الحمراء و VAR
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 p-3 rounded-lg">
              <span className="text-slate-500">○</span> نتيجة نهاية المباراة (اختياري)
            </div>
          </div>
        </div>

        {/* Browser support */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
            <span>💡</span> متطلبات التشغيل
          </h3>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>✅ متصفح حديث يدعم Web Push (Chrome, Firefox, Edge, Safari 16.4+)</li>
            <li>✅ HTTPS (mauribin.vercel.app آمن)</li>
            <li>✅ نظام تشغيل حديث (iOS 16.4+ / Android 7+ / Windows / macOS)</li>
            <li>✅ إضافة التطبيق للشاشة الرئيسية (اختياري لكن موصى به)</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/schedule"
            className="inline-block bg-[#006233] hover:bg-[#007a40] text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
          >
            📅 عرض جدول المباريات
          </Link>
          <Link
            href="/worldcup"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center border border-slate-700"
          >
            🏆 كأس العالم 2026
          </Link>
        </div>
      </div>
    </div>
  );
}