"use client";
import { useEffect } from "react";

export default function AdsBanner() {
  useEffect(() => {
    // Load CPM network ad script
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = "https://pl29888018.effectivecpmnetwork.com/8041d0d6ee2762e3600495de769055a2/invoke.js";
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existing = document.querySelector('script[src*="effectivecpmnetwork"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div id="container-8041d0d6ee2762e3600495de769055a2" className="w-full max-w-[728px]" />
    </div>
  );
}
