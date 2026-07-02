"use client";
import { useState, useEffect, useRef } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) view[i] = rawData.charCodeAt(i);
  return view;
}

type NotifState = "default" | "loading" | "subscribed" | "denied" | "unsupported";

interface NotificationButtonProps {
  forceOpen?: boolean;
}

export function NotificationButton({ forceOpen = false }: NotificationButtonProps) {
  const [state, setState] = useState<NotifState>("default");
  const [activeTab, setActiveTab] = useState<"subscribe" | "settings" | null>(null);
  const [prefs, setPrefs] = useState({
    matchStarting: true, goalScored: true, redCard: true, matchEnded: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── 1. Check existing subscription & permission on mount ───
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") { setState("denied"); return; }

    const stored = localStorage.getItem("mauribin_notif_sub");
    if (stored) {
      try { const sub = JSON.parse(stored); if (sub.id) setState("subscribed"); }
      catch {}
    }
  }, []);

  // ─── 2. Auto-open panel when forceOpen ───
  useEffect(() => {
    if (forceOpen) setActiveTab(state === "subscribed" ? "settings" : "subscribe");
  }, [forceOpen, state]);

  // ─── 3. Click outside to close ───
  useEffect(() => {
    if (!activeTab) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setActiveTab(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeTab]);

  // ─── 4. Register + activate SW with retry ───
  async function registerSW(): Promise<ServiceWorkerRegistration> {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker غير مدعوم في هذا المتصفح.");
    }

    // 4a. Unregister any existing SWs first (prevents conflicts)
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) {
      console.log("[SW] Found existing registration, unregistering first...");
      await existing.unregister();
      await new Promise(r => setTimeout(r, 500)); // small delay for cleanup
    }

    // 4b. Register fresh SW (cache-bust to force update after redeploy)
    console.log("[SW] Registering /sw.js?v=4...");
    const reg = await navigator.serviceWorker.register("/sw.js?v=4", { scope: "/" });
    console.log("[SW] Registered, waiting for install/activate...");

    // 4c. Wait for install
    if (reg.installing) {
      await new Promise<void>((resolve) => {
        reg.installing!.addEventListener("statechange", () => {
          if (reg.installing?.state === "installed" || reg.installing?.state === "activated") resolve();
        });
      });
    }

    // 4d. Wait for activate (max 10s timeout)
    const start = Date.now();
    while (!reg.active && Date.now() - start < 10000) {
      await new Promise(r => setTimeout(r, 100));
    }

    if (!reg.active) {
      // Last chance — try ready
      try {
        const ready = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
        ]);
        return ready as ServiceWorkerRegistration;
      } catch {
        throw new Error("انتهت مهلة تفعيل Service Worker.\n\n💡 الحل: اسحب الصفحة للأسفل لتحديثها.");
      }
    }

    console.log("[SW] Active! State:", reg.active.state);
    return reg;
  }

  // ─── 5. Full subscribe flow ───
  async function subscribe() {
    setState("loading");
    setActiveTab(null); // close panel while loading

    try {
      // Step A: Permission
      console.log("[Notif] Step A: Requesting Notification permission...");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState("denied");
        return;
      }
      console.log("[Notif] Permission granted");

      // Step B: Register SW (with retry logic)
      let swReg: ServiceWorkerRegistration;
      try {
        swReg = await registerSW();
      } catch (swErr: unknown) {
        const msg = swErr instanceof Error ? swErr.message : String(swErr);
        alert("⚠️ " + msg);
        setState("default");
        return;
      }

      // Step C: Subscribe to push
      console.log("[Notif] Step C: Subscribing to push manager...");
      let subscription: PushSubscription;
      try {
        subscription = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        });
      } catch (pushErr: unknown) {
        const msg = pushErr instanceof Error ? pushErr.message : String(pushErr);
        console.error("[Notif] pushManager.subscribe failed:", msg);
        if (msg.includes("applicationServerKey") || msg.includes("Invalid")) {
          alert("⚠️ خطأ في مفتاح الإشعارات.\n\nيرجى التواصل مع مدير الموقع.");
        } else if (msg.includes("no active Service Worker") || msg.includes("not active")) {
          alert("⚠️ Service Worker غير جاهز.\n\n💡 الحل: أغلق المتصفح وأعد فتحه، ثم حاول مرة أخرى.");
        } else {
          alert("⚠️ فشل في الاشتراك Push:\n\n" + msg);
        }
        setState("default");
        return;
      }

      // Step D: Save to backend
      console.log("[Notif] Step D: Saving to backend...");
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))),
              auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))),
            },
          },
          preferences: prefs,
        }),
      });

      const data = await res.json();
      console.log("[Notif] Server response:", data);

      if (!res.ok || !data.id) {
        alert("⚠️ تم تفعيل الإشعارات محلياً، لكن فشل الحفظ على السرفر:\n\n" + (data.error || res.statusText));
        setState("default");
        return;
      }

      // Success!
      localStorage.setItem("mauribin_notif_sub", JSON.stringify(data));
      setState("subscribed");
      setActiveTab("settings"); // open settings panel

      // Show confirmation notification via SW (not bare Notification API)
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("⚽ Mauribin - تم التفعيل!", {
        body: "ستصلك إشعارات المباريات الآن 🔔",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "mauribin-confirm",
        requireInteraction: false,
      });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Notif] Unexpected error:", msg);
      alert("⚠️ خطأ غير متوقع:\n\n" + msg);
      setState("default");
    }
  }

  // ─── 6. Unsubscribe ───
  async function unsubscribe() {
    try {
      const stored = localStorage.getItem("mauribin_notif_sub");
      if (stored) {
        const sub = JSON.parse(stored);
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sub.id }),
        });
        localStorage.removeItem("mauribin_notif_sub");
      }
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();
      setState("default");
      setActiveTab(null);
    } catch (err) {
      console.error("[Notif] Unsubscribe failed:", err);
    }
  }

  // ─── 7. Test notification ───
  async function sendTest() {
    const log = (msg: string, type: "ok" | "err" | "info" = "info") => {
      console.log(`[sendTest] ${msg}`);
      // Also show on screen for mobile users
      const div = document.getElementById("debug-log");
      if (div) {
        const ts = new Date().toLocaleTimeString();
        const color = type === "ok" ? "#4ade80" : type === "err" ? "#f87171" : "#60a5fa";
        div.innerHTML += `<div style="color:${color};font-size:11px;margin:2px 0">[${ts}] ${msg}</div>`;
        div.scrollTop = div.scrollHeight;
      }
    };

    log("Button clicked ✅");
    log("state: " + state);

    if (!("serviceWorker" in navigator)) {
      log("❌ Service Worker not supported", "err");
      alert("هذا المتصفح لا يدعم Service Worker.");
      return;
    }
    log("✅ Service Worker supported");

    try {
      log("Getting serviceWorker.ready...");
      const reg = await navigator.serviceWorker.ready;
      log("✅ ready resolved | active.state: " + (reg.active?.state ?? "null"), "ok");

      if (!reg.active || reg.active.state !== "activated") {
        log("⚠️ SW not activated. State: " + (reg.active?.state ?? "null"), "err");
        alert("Service Worker غير جاهز بعد.\n\n💡 الحل: أغلق هذه النافذة وأعد فتحها، ثم جرب مرة أخرى.");
        return;
      }

      log("Calling registration.showNotification()...");
      await reg.showNotification("⚽ Mauribin - إشعار اختباري", {
        body: "هذا إشعار اختباري ✅ نظام الإشعارات يعمل!",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "mauribin-test",
        requireInteraction: true,
      });
      log("✅ Notification shown! 🎉", "ok");

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log("❌ Error: " + msg, "err");
      alert("فشل:\n\n" + msg);
    }
  }

  // ─── RENDER ───
  const isOpen = activeTab !== null;

  if (state === "unsupported") {
    return (
      <button disabled className="p-2 rounded-lg bg-slate-800 text-slate-500 cursor-not-allowed text-base" title="الإشعارات غير مدعومة">
        🔕
      </button>
    );
  }

  if (state === "denied") {
    return (
      <button
        onClick={() => alert("الإشعارات محظورة.\n\n💡 الحل: اضغط على 🔒 في شريط العنوان → الإشعارات → السماح، أو احذف موقع Mauribin من إعدادات الموقع وأعد المحاولة.")}
        className="p-2 rounded-lg bg-slate-800 text-red-400 text-base"
        title="الإشعارات محظورة"
      >
        🔕
      </button>
    );
  }

  const isLoading = state === "loading";
  const isSubscribed = state === "subscribed";

  return (
    <div ref={containerRef} className="relative">

      {/* ── Main bell button ── */}
      <button
        onClick={() => {
          if (isSubscribed) {
            setActiveTab(activeTab === "settings" ? null : "settings");
          } else {
            setActiveTab(activeTab === "subscribe" ? null : "subscribe");
          }
        }}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-all text-base disabled:opacity-50 ${
          isSubscribed
            ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
        }`}
        title={isSubscribed ? "إعدادات الإشعارات" : "تفعيل الإشعارات"}
        aria-label={isSubscribed ? "إعدادات الإشعارات" : "تفعيل الإشعارات"}
      >
        {isLoading ? "⏳" : isSubscribed ? "🔔" : "🔕"}
      </button>

      {/* ── Settings panel (subscribed users) ── */}
      {isOpen && activeTab === "settings" && isSubscribed && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl min-w-[300px] max-w-[340px]">

          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔔</span> إعدادات الإشعارات
            </div>
            <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white text-lg leading-none" aria-label="إغلاق">✕</button>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-green-400 mb-2 font-bold">✅ مفعّلة</div>

          <div className="space-y-1 mb-3">
            {[
              { key: "matchStarting", label: "⏰ قبل بدء المباراة (15 دقيقة)" },
              { key: "goalScored", label: "⚽ عند تسجيل هدف" },
              { key: "redCard", label: "🟥 البطاقات الحمراء و VAR" },
              { key: "matchEnded", label: "🏁 نتيجة نهاية المباراة" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between gap-3 text-xs text-slate-300 cursor-pointer hover:bg-slate-800 p-2 rounded-lg">
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={prefs[key as keyof typeof prefs]}
                  onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                  className="w-4 h-4 accent-green-600 shrink-0"
                />
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={sendTest} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors">
              🧪 تجربة
            </button>
            <button onClick={unsubscribe} className="flex-1 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold py-2 px-3 rounded-lg hover:bg-red-600/30 transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ── Subscribe panel (new users) ── */}
      {isOpen && activeTab === "subscribe" && !isSubscribed && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl min-w-[300px] max-w-[340px]">

          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔕</span> تفعيل الإشعارات
            </div>
            <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white text-lg leading-none" aria-label="إغلاق">✕</button>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            احصل على إشعارات فورية عند بدء المباريات، الأهداف، والنتائيات النهائية.
          </p>

          <div className="space-y-1.5 mb-3 text-[10px]">
            {["⏰ قبل 15 دقيقة من بدء المباراة", "⚽ فوراً عند تسجيل الأهداف", "🏁 عند نهاية المباراة"].map(t => (
              <div key={t} className="flex items-center gap-2 text-slate-400"><span className="text-green-400">✓</span> {t}</div>
            ))}
          </div>

          <button
            onClick={subscribe}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري التفعيل...</>
            ) : (
              <>🔔 فعّل الإشعارات الآن</>
            )}
          </button>

          <div className="mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500 leading-relaxed">
            💡 الإشعارات تعمل حتى لو أُغلق المتصفح. يُرجع رفضها من إعدادات المتصفح.
          </div>
        </div>
      )}
    </div>
  );
}
