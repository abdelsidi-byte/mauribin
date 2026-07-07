"use client";

export function VideoSection() {
  return (
    <div className="w-full mb-6">
      {/* Streamable Video */}
      <div className="w-full rounded-xl overflow-hidden border border-[#ffd700]/20 bg-slate-800">
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src="https://streamable.com/e/9ig05r?autoplay=1&muted=1"
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Mauribin VIP Video"
          />
        </div>
      </div>
    </div>
  );
}
