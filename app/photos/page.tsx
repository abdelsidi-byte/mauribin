import type { Metadata } from "next";
import { PhotosGallery } from "@/components/PhotosSection";

export const metadata: Metadata = {
  title: "📸 Photos of the Day",
  description: "أفضل لحظات وصور كأس العالم 2026 - الأهداف، الاحتفالات، الجماهير",
};

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#006233]/20 via-slate-900 to-slate-950 py-10 px-4 border-b border-[#FFD700]/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#FFD700] via-yellow-200 to-[#FFD700] bg-clip-text text-transparent">
              📸 Photos of the Day
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            أفضل لحظات وصور كأس العالم 2026 — الأهداف، الاحتفالات، الجمهور، والكواليس
          </p>
        </div>
      </div>

      <PhotosGallery />
    </div>
  );
}
