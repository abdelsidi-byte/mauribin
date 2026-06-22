"use client";

import Script from "next/script";

const AD_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT || "ca-pub-XXXXXXXXXX";

export function GoogleAdSense() {
  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      />
    </>
  );
}

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adSlot = slot || process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT || "";

  if (!adSlot || AD_CLIENT === "ca-pub-XXXXXXXXXX") {
    // Placeholder when AdSense not configured
    return (
      <div className={`flex items-center justify-center bg-gradient-to-r from-[#006233]/20 to-[#D01C1F]/20 border border-[#ffd700]/20 rounded-xl py-6 ${className}`}>
        <div className="text-center">
          <div className="text-2xl mb-2">📢</div>
          <div className="text-sm text-slate-500">مساحة إعلانية</div>
          <div className="text-xs text-slate-600 mt-1">Google AdSense</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        dir="rtl"
      />
    </div>
  );
}

// Display Ads (simpler, no slot needed)
export function AdSenseDisplay() {
  if (AD_CLIENT === "ca-pub-XXXXXXXXXX") return null;

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_DISPLAY || ""}
        data-ad-format="auto"
        dir="rtl"
      />
    </div>
  );
}

// In-Article Ads
export function AdSenseInArticle() {
  if (AD_CLIENT === "ca-pub-XXXXXXXXXX") return null;

  return (
    <div className="ad-container my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "250px" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_INARTICLE || ""}
        data-ad-format="auto"
        dir="rtl"
      />
    </div>
  );
}
