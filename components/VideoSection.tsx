"use client";

import { useState } from "react";

export function VideoSection() {
  const [adDismissed, setAdDismissed] = useState(false);

  return (
    <div className="w-full mb-6">
      {/* Video Ad Banner before video */}
      {!adDismissed && (
        <div className="relative w-full mb-4 rounded-xl overflow-hidden border border-[#ffd700]/20">
          <div
            data-cfasync="false"
            dangerouslySetInnerHTML={{
              __html: `<div id="container-8041d0d6ee2762e3600495de769055a2"></div>
<script async="async" data-cfasync="false" src="https://pl29888018.effectivecpmnetwork.com/8041d0d6ee2762e3600495de769055a2/invoke.js"></script>`,
            }}
          />
          <button
            onClick={() => setAdDismissed(true)}
            className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-10 transition-colors"
            aria-label="إغلاق الإعلان"
          >
            ✕
          </button>
        </div>
      )}

      {/* Streamable Video */}
      <div className="w-full rounded-xl overflow-hidden border border-[#ffd700]/20 bg-slate-800">
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src="https://streamable.com/9kuoqf?autoplay=1&muted=1"
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Mauribin Video"
            muted
          />
        </div>
      </div>
    </div>
  );
}
