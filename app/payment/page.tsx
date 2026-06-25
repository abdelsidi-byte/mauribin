"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "vip_monthly", name: "اشتراك شهري VIP", price: 50, period: "شهر", features: ["تحديث لحظي", "بدون إعلانات", "إحصائيات متقدمة"] },
  { id: "vip_quarterly", name: "اشتراك 3 أشهر VIP", price: 130, period: "3 أشهر", features: ["كل مميزات VIP", "خصم 13%", "دعم م优先"] },
  { id: "vip_yearly", name: "اشتراك سنوي VIP", price: 400, period: "سنة", features: ["كل مميزات VIP", "خصم 33%", "VIP مخصص"] },
];

const BANKILY_NUMBER = "36332374";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard.writeText(BANKILY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm mb-4">
            💎 VIP Membership
          </div>
          <h1 className="text-3xl font-black text-white mb-2">اشترك في Mauribin VIP</h1>
          <p className="text-slate-400">ادفع بسهولة عبر Bankily — الدفع يدوي</p>
        </div>

        {/* Bankily Payment Box */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 mb-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">💚</div>
          <h2 className="text-2xl font-black text-white mb-2">ادفع عبر Bankily</h2>
          <p className="text-green-100 mb-6">ارسل المبلغ لرقم Bankily التالي:</p>
          
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6">
            <div className="text-4xl font-black text-white tracking-wider">{BANKILY_NUMBER}</div>
          </div>

          <button
            onClick={copyNumber}
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-all text-lg"
          >
            {copied ? "✅ تم النسخ!" : "📋 نسخ الرقم"}
          </button>

          <p className="text-green-100 text-sm mt-6">
            ⏱️ بعد الدفع، سيتم تفعيل اشتراكك خلال 24 ساعة
          </p>
        </div>

        {/* Plan Selection */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">اختر الباقة</h3>
          <div className="grid gap-3">
            {PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                  selectedPlan.id === plan.id
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlan.id === plan.id}
                  onChange={() => setSelectedPlan(plan)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{plan.name}</span>
                    <div className="text-xs text-slate-400 mt-1">
                      {plan.features.map((f) => `✓ ${f}`).join(" • ")}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-black text-yellow-400">{plan.price}</span>
                    <span className="text-green-400 text-sm block">MRU / {plan.period}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Amount to Pay */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">المبلغ المطلوب دفعه:</span>
            <span className="text-3xl font-black text-yellow-400">{selectedPlan.price} MRU</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">📝 خطوات الدفع:</h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <span>انسخ رقم Bankily: <strong className="text-white">{BANKILY_NUMBER}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <span>افتح تطبيق Bankily على هاتفك</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <span>اختر "تحويل" أو "إرسال أموال"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
              <span>أدخل الرقم والمبلغ: <strong className="text-yellow-400">{selectedPlan.price} MRU</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
              <span>أرسل الدفع ثم تواصل معنا لتفعيل اشتراكك</span>
            </li>
          </ol>
        </div>

        {/* Contact */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-2">
            💬 Need help? Contact us to activate your VIP
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
          >
            العودة للرئيسية
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-slate-600 text-xs mt-6">
          🔒 الدفع يتم يدوياً عبر تطبيق Bankily. لا نجمع بيانات الدفع.
        </p>
      </div>
    </div>
  );
}
