"use client";

import { VideoAdOverlay } from "@/components/VideoAdOverlay";
import { VIPPopup } from "@/components/VIPPopup";
import { useState } from "react";

export function VIPPopupWrapper() {
  const [showVIP, setShowVIP] = useState(false);

  return (
    <>
      <VideoAdOverlay onComplete={() => setShowVIP(true)} />
      {showVIP && <VIPPopup onClose={() => setShowVIP(false)} />}
    </>
  );
}
