"use client";

import { useState } from "react";

interface VideoAdButtonProps {
  videoUrl: string;
  youtubeId?: string;
  thumbnail?: string;
  title: string;
}

export function VideoAdButton({ videoUrl, youtubeId, thumbnail, title }: VideoAdButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const thumb = thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : "");

  return (
    <>
      {/* Thumbnail button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-full rounded-xl overflow-hidden border border-[#ffd700]/20 bg-slate-800 cursor-pointer group transition-transform hover:scale-[1.02]"
      >
        {/* Thumbnail image */}
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {thumb ? (
            <img
              src={thumb}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#ffd700] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-black text-3xl mr-1">▶</span>
            </div>
          </div>

          {/* Title badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <p className="text-white text-sm font-bold">{title}</p>
          </div>
        </div>
      </button>

      {/* Video overlay modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ✕
            </button>

            {/* Video */}
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={title}
                />
              ) : (
                <iframe
                  src={videoUrl.includes("?") ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={title}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
