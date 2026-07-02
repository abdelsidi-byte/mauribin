"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Preserves scroll position across re-renders
// Only resets scroll on actual route changes
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    const key = `scroll-${pathname}`;
    const saved = sessionStorage.getItem(key);

    if (saved) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(key, window.scrollY.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);

  return null;
}

// ─── PWAProvider: registers + activates SW on page load ────────────────────────────────────
export function PWAProvider() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("[PWA] Service Worker not supported in this browser");
      return;
    }

    let swReg: ServiceWorkerRegistration | null = null;

    async function registerSW() {
      try {
        // ── 1. Unregister any old/broken SWs first ──
        const oldReg = await navigator.serviceWorker.getRegistration();
        if (oldReg) {
          console.log("[PWA] Found existing SW, unregistering first to avoid conflicts...");
          await oldReg.unregister();
          await new Promise(r => setTimeout(r, 300)); // let cleanup finish
        }

        // ── 2. Register fresh SW (cache-bust with v=4 to force update) ──
        console.log("[PWA] Registering /sw.js?v=4...");
        swReg = await navigator.serviceWorker.register("/sw.js?v=4", { scope: "/" });
        console.log("[PWA] SW registered, current state:", swReg.active?.state);

        // ── 3. Wait for install (max 10s) ──
        if (swReg.installing) {
          console.log("[PWA] Waiting for SW to install...");
          await new Promise<void>((resolve) => {
            swReg!.installing!.addEventListener("statechange", () => {
              if (swReg!.installing?.state === "installed" || swReg!.installing?.state === "activated") {
                resolve();
              }
            });
            // Timeout safety net
            setTimeout(resolve, 10000);
          });
        }

        // ── 4. Wait for activate (max 10s) ──
        const start = Date.now();
        while (swReg.active?.state !== "activated" && Date.now() - start < 10000) {
          await new Promise(r => setTimeout(r, 100));
        }

        if (swReg.active?.state === "activated") {
          console.log("[PWA] ✅ SW fully activated and controlling pages!");
        } else {
          console.warn("[PWA] SW activation timed out, using current state:", swReg.active?.state);
        }

        // ── 5. Check for updates periodically ──
        setInterval(() => {
          swReg?.update();
        }, 60 * 60 * 1000); // every hour

      } catch (err) {
        console.error("[PWA] ❌ SW registration failed:", err);
      }
    }

    registerSW();

    // Listen for controller changes (new SW took over)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] SW controller changed — page is now controlled by new SW");
      // Optionally force refresh: window.location.reload();
    });

  }, []);

  return null;
}
