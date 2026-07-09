"use client";

import { VideoAdButton } from "./VideoAdButton";

export function VideoSection() {
  return (
    <div className="w-full mb-6 space-y-4">
      {/* Streamable VIP Video */}
      <VideoAdButton
        videoUrl="https://streamable.com/e/9ig05r"
        title="🏆 فيديو Mauribin VIP"
      />

      {/* YouTube Shorts */}
      <VideoAdButton
        videoUrl="https://www.youtube.com/embed/PbvAwR6EBP0"
        youtubeId="PbvAwR6EBP0"
        title="🎬 YouTube Shorts"
      />
    </div>
  );
}
