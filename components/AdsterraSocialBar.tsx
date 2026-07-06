"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gb?: {
      q: unknown[];
      show?: (b: number) => void;
    };
  }
}

export function AdsterraSocialBar() {
  useEffect(() => {
    // Adsterra Social Bar widget
    const publisherId = "5874939";
    const w = window;
    const d = document;
    const s = "socialbar";

    (function tick() {
      if (d.readyState === "complete" || d.readyState === "interactive") {
        init();
      } else {
        d.addEventListener("readystatechange", tick);
      }
    })();

    function init() {
      if (w.gb) return;
      w.gb = { q: [] };
      const u = publisherId;

      const script1 = d.createElement("script");
      script1.async = true;
      const b = 0;
      script1.src = `https://cdn.socialbar.com/widgets/socialbar.js?u=${u}&b=${b}`;
      script1.onerror = () => console.log("[Adsterra] Socialbar blocked");
      d.head.appendChild(script1);
    }
  }, []);

  return null;
}
