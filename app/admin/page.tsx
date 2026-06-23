"use client";
import { useState, useEffect } from "react";

interface Match {
  _index: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
}

const PRESETS: Record<string, { homeScore: number; awayScore: number; state: string }> = {
  "France vs Iraq": { homeScore: 1, awayScore: 0, state: "live" },
  "Norway vs Senegal": { homeScore: 0, awayScore: 0, state: "live" },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [quickUpdate, setQuickUpdate] = useState<Record<number, { homeScore: string; awayScore: string; state: string }>>({});

  useEffect(() => {
    if (authenticated) fetchMatches();
  }, [authenticated]);

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/live-scores");
      const data = await res.json();
      setMatches(data.matches || []);
      const initial: Record<number, { homeScore: string; awayScore: string; state: string }> = {};
      (data.matches || []).forEach((m: Match) => {
        initial[m._index] = {
          homeScore: m.homeScore?.toString() ?? "",
          awayScore: m.awayScore?.toString() ?? "",
          state: m.state,
        };
      });
      setQuickUpdate(initial);
    } catch (e) {
      setMessage("❌ فشل في جلب المباريات");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "MAURIBIN2026") {
      setAuthenticated(true);
    } else {
      setMessage("❌ كلمة المرور غير صحيحة");
    }
  };

  const updateField = (index: number, field: "homeScore" | "awayScore" | "state", value: string) => {
    setQuickUpdate(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  };

  const getChanges = () => {
    const changes: string[] = [];
    matches.forEach(m => {
      const u = quickUpdate[m._index];
      if (!u) return;
      const newHS = u.homeScore === "" ? null : parseInt(u.homeScore);
      const newAS = u.awayScore === "" ? null : parseInt(u.awayScore);
      if (m.homeScore !== newHS || m.awayScore !== newAS || m.state !== u.state) {
        changes.push(`${m.homeFlag} ${m.home} ${m.homeScore ?? "-"}→${u.homeScore || "-"} | ${m.awayFlag} ${m.away} ${m.awayScore ?? "-"}→${u.awayScore || "-"} | ${m.state}→${u.state}`);
      }
    });
    return changes;
  };

  const changes = getChanges();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {!authenticated ? (
          <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-700 max-w-sm mx-auto mt-20">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔐</div>
              <h1 className="text-xl font-bold">لوحة تحكم Mauribin</h1>
              <p className="text-slate-400 text-sm mt-1">أدخل كلمة المرور</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 mb-4 focus:border-[#FFD700] outline-none"
            />
            <button type="submit" className="w-full bg-[#006233] hover:bg-[#004225] text-white font-bold py-3 rounded-xl">
              دخول 🔓
            </button>
            {message && <p className="mt-4 text-center text-red-400 text-sm">{message}</p>}
          </form>
        ) : loading ? (
          <div className="text-center mt-20 text-slate-400">جاري التحميل...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#FFD700]">⚙️ لوحة تحكم النتائج</h1>
                <p className="text-slate-400 text-sm">عدّل النتائج ثم اضغط "إنشاء تحديث"</p>
              </div>
              <button onClick={() => setAuthenticated(false)} className="text-slate-400 hover:text-white text-sm">خروج</button>
            </div>

            {message && (
              <div className="p-4 rounded-xl mb-6 bg-green-900/50 border border-green-500">
                <p className="text-green-400">{message}</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {matches.map(m => {
                const u = quickUpdate[m._index] || { homeScore: "", awayScore: "", state: m.state };
                const changed = (u.homeScore !== "" ? parseInt(u.homeScore) : null) !== m.homeScore ||
                               (u.awayScore !== "" ? parseInt(u.awayScore) : null) !== m.awayScore ||
                               u.state !== m.state;
                return (
                  <div key={m._index} className={`bg-slate-900 rounded-xl p-4 border ${changed ? "border-[#FFD700]/50" : "border-slate-700"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{m.homeFlag}</span>
                        <span className="font-medium">{m.home}</span>
                      </div>
                      <span className="text-slate-500">vs</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{m.away}</span>
                        <span className="text-xl">{m.awayFlag}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={u.homeScore}
                        onChange={e => updateField(m._index, "homeScore", e.target.value)}
                        placeholder={m.homeScore?.toString() ?? "-"}
                        className="w-16 bg-slate-800 text-center px-3 py-2 rounded-lg border border-slate-600"
                      />
                      <span className="text-slate-500 font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        value={u.awayScore}
                        onChange={e => updateField(m._index, "awayScore", e.target.value)}
                        placeholder={m.awayScore?.toString() ?? "-"}
                        className="w-16 bg-slate-800 text-center px-3 py-2 rounded-lg border border-slate-600"
                      />
                      <select
                        value={u.state}
                        onChange={e => updateField(m._index, "state", e.target.value)}
                        className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-600 text-sm"
                      >
                        <option value="upcoming">📅 قادمة</option>
                        <option value="live">🔴 مباشر</option>
                        <option value="ft">✅ انتهت</option>
                      </select>
                      {changed && <span className="text-[#FFD700] text-xs">✏️ تم التعديل</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => {
                  const updated = matches.map(m => {
                    const u = quickUpdate[m._index];
                    if (!u) return m;
                    return {
                      ...m,
                      homeScore: u.homeScore === "" ? null : parseInt(u.homeScore),
                      awayScore: u.awayScore === "" ? null : parseInt(u.awayScore),
                      state: u.state,
                      label: u.state === "live" ? "مباشر" : u.state === "ft" ? "انتهت" : m.label,
                    };
                  });
                  localStorage.setItem("mauribin_scores", JSON.stringify(updated));
                  setMessage("✅ تم الحفظ محلياً! (في متصفحك فقط)");
                }}
                className="flex-1 min-w-[150px] bg-[#006233] hover:bg-[#004225] text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                💾 حفظ محلياً
              </button>
              <button
                onClick={async () => {
                  const updated = matches.map(m => {
                    const u = quickUpdate[m._index];
                    if (!u) return m;
                    return {
                      ...m,
                      homeScore: u.homeScore === "" ? null : parseInt(u.homeScore),
                      awayScore: u.awayScore === "" ? null : parseInt(u.awayScore),
                      state: u.state,
                      label: u.state === "live" ? "مباشر" : u.state === "ft" ? "انتهت" : m.label,
                    };
                  });
                  const changed = updated.filter((m, i) => {
                    const orig = matches[i];
                    return m.homeScore !== orig.homeScore || m.awayScore !== orig.awayScore || m.state !== orig.state;
                  });
                  if (changed.length === 0) {
                    setMessage("⚠️ لا توجد تغييرات!");
                    return;
                  }
                  // Build Discord-compatible message
                  const msg = changed.map(m => 
                    `⚽ **${m.homeFlag} ${m.home} ${m.homeScore ?? '-'} - ${m.awayScore ?? '-'} ${m.away} ${m.awayFlag}** (${m.state === 'live' ? '🔴 مباشر' : m.state === 'ft' ? '✅ انتهت' : '📅 قادم'})`
                  ).join("\n");
                  const full = `📝 **Mauribin تحديث نتائج**\n${msg}\n\n⏰ ${new Date().toLocaleString('ar-MR')}`;
                  navigator.clipboard.writeText(full);
                  setMessage("📋 تم نسخ رسالة التحديث! أرسلها لي هنا في الدردشة");
                }}
                className="flex-1 min-w-[150px] bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold py-3 px-6 rounded-xl transition-colors"
              >
                📋 نسخ رسالة التحديث
              </button>
              <button
                onClick={async () => {
                  const updated = matches.map(m => {
                    const u = quickUpdate[m._index];
                    if (!u) return m;
                    return {
                      ...m,
                      homeScore: u.homeScore === "" ? null : parseInt(u.homeScore),
                      awayScore: u.awayScore === "" ? null : parseInt(u.awayScore),
                      state: u.state,
                      label: u.state === "live" ? "مباشر" : u.state === "ft" ? "انتهت" : m.label,
                    };
                  });
                  const changed = updated.filter((m, i) => {
                    const orig = matches[i];
                    return m.homeScore !== orig.homeScore || m.awayScore !== orig.awayScore || m.state !== orig.state;
                  });
                  if (changed.length === 0) {
                    setMessage("⚠️ لا توجد تغييرات!");
                    return;
                  }
                  try {
                    const res = await fetch("/api/update-scores", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ matches: changed }),
                    });
                    if (res.ok) {
                      setMessage("🚀 تم إرسال التحديث! سأنشره على الموقع قريباً");
                    } else {
                      setMessage("⚠️ تم الحفظ محلياً - أرسل التغييرات لي يدوياً");
                    }
                  } catch (e) {
                    setMessage("⚠️ فشل - أرسل التغييرات يدوياً");
                  }
                }}
                className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                🚀 إرسال التحديث
              </button>
            </div>

            {/* Changes Summary */}
            {changes.length > 0 && (
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700 mb-6">
                <h3 className="text-yellow-400 font-bold mb-2">📝 التغييرات:</h3>
                <ul className="space-y-1">
                  {changes.map((c, i) => (
                    <li key={i} className="text-slate-300 text-sm font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-[#006233]/20 rounded-xl p-4 border border-[#006233]/50">
              <p className="text-white font-bold mb-2">📋 طريقة التحديث:</p>
              <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                <li>عدّل النتائج أعلاه</li>
                <li>انسخ التغييرات من القائمة</li>
                <li>أرسلها لي هنا في الدردشة</li>
                <li>سأحدث الكود فوراً ونشر الموقع</li>
              </ol>
              {changes.length > 0 && (
                <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                  <p className="text-slate-400 text-xs mb-2">انسخ هذا:</p>
                  <pre className="text-green-400 text-xs whitespace-pre-wrap">{changes.join("\n")}</pre>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
