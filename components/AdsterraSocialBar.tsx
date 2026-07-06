"use client";

import { useEffect } from "react";

export function AdsterraSocialBar() {
  useEffect(() => {
    const publisherId = "5874939";
    const campaignId = "29787519";

    const w = window as typeof window & { gb?: { q: unknown[] } };

    const init = () => {
      if ((w as typeof w & { gb?: unknown }).gb) return;
      (w as typeof w & { gb: { q: unknown[] } }).gb = { q: [] };

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://ads.adsterra.com/socialbar/widgets/socialbar.js?u=${publisherId}&b=${campaignId}`;
      script.onerror = () => console.log("[Adsterra] Socialbar script blocked");
      document.head.appendChild(script);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      init();
    } else {
      document.addEventListener("readystatechange", function tick() {
        if (document.readyState === "complete" || document.readyState === "interactive") {
          document.removeEventListener("readystatechange", tick);
          init();
        }
      });
    }
  }, []);

  return null;
}
