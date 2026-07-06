"use client";

import { useState } from "react";

export function AdsterraBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full flex justify-center my-4">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-black/70 hover:bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-10 transition-colors"
          aria-label="إغلاق الإعلان"
        >
          ✕
        </button>
        <div
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `<div id="container-8041d0d6ee2762e3600495de769055a2"></div>
<script async="async" data-cfasync="false" src="https://pl29888018.effectivecpmnetwork.com/8041d0d6ee2762e3600495de769055a2/invoke.js"></script>`,
          }}
        />
      </div>
    </div>
  );
}
