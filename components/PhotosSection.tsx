"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PHOTOS, CATEGORY_LABELS, getFlag, type PhotoCategory } from "@/lib/photos";

interface PhotoCardProps {
  photo: (typeof PHOTOS)[0];
  size?: "sm" | "md" | "lg";
}

function PhotoCard({ photo, size = "md" }: PhotoCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const heightClass = size === "sm" ? "h-48" : size === "lg" ? "h-80" : "h-64";

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-[#FFD700]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#006233]/20 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/photos/${photo.slug}`} className="block">
        <div className={`relative ${heightClass} overflow-hidden`}>
          {!imgError ? (
            <img
              src={photo.thumbnailUrl}
              alt={photo.titleAr}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <span className="text-5xl">📸</span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-[#006233]/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
              {CATEGORY_LABELS[photo.category]}
            </span>
          </div>
          {/* Featured badge */}
          {photo.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#FFD700] text-black text-xs font-bold px-2 py-1 rounded-full">
                ⭐ مميز
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Teams + Score */}
        {photo.match && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">{getFlag(photo.match.home)}</span>
            <span className="text-white font-black text-sm">{photo.match.homeFlag !== "🏳️" ? "" : getFlag(photo.match.home)}</span>
            <span className="text-[#FFD700] font-black text-sm">{photo.match.score || "vs"}</span>
            <span className="text-lg">{getFlag(photo.match.away)}</span>
          </div>
        )}

        {/* Title */}
        <Link href={`/photos/${photo.slug}`}>
          <h3 className="text-white font-bold text-sm leading-snug mb-2 line-clamp-2 hover:text-[#FFD700] transition-colors">
            {photo.titleAr}
          </h3>
        </Link>

        {/* Competition + Date */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="truncate">{photo.competitionAr}</span>
          <span>{new Date(photo.date).toLocaleDateString("ar", { month: "short", day: "numeric" })}</span>
        </div>

        {/* Stats + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>👁️ {photo.views.toLocaleString()}</span>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 transition-colors ${liked ? "text-red-400" : "hover:text-red-400"}`}
            >
              {liked ? "❤️" : "🤍"} {photo.likes.toLocaleString()}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-lg transition-colors ${bookmarked ? "bg-[#FFD700]/20 text-[#FFD700]" : "hover:bg-slate-700 text-slate-400 hover:text-[#FFD700]"}`}
              aria-label="Bookmark"
            >
              {bookmarked ? "🔖" : "📌"}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/photos/${photo.slug}`)}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-[#FFD700] transition-colors"
              aria-label="Share"
            >
              🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Photos Section for Homepage ───────────────────────────────────────────────
export function PhotosSection() {
  const featured = PHOTOS.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#FFD700]">📸 Photos of the Day</h2>
            <p className="text-slate-400 text-sm mt-1">أفضل لحظات كأس العالم 2026</p>
          </div>
          <Link
            href="/photos"
            className="text-sm font-bold text-[#FFD700] hover:text-[#FFC000] transition-colors flex items-center gap-1"
          >
            عرض الكل
            <span>←</span>
          </Link>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(photo => (
            <PhotoCard key={photo.id} photo={photo} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Photo Gallery Page ─────────────────────────────────────────────────────────
export function PhotosGallery() {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const categories = Object.entries(CATEGORY_LABELS) as [PhotoCategory, string][];

  const filtered = PHOTOS.filter(p =>
    activeCategory === "all" || p.category === activeCategory
  ).sort((a, b) => {
    if (sortBy === "popular") return b.views - a.views;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-slate-800/80 backdrop-blur-sm sticky top-[65px] z-10 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              sortBy === "latest" ? "bg-[#006233] text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            الأحدث
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              sortBy === "popular" ? "bg-[#006233] text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            الأكثر مشاهدة
          </button>
          <div className="w-px h-6 bg-slate-600 mx-1" />
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === "all" ? "bg-[#FFD700] text-black" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            الكل
          </button>
          {categories.map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-[#FFD700] text-black" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(photo => (
            <PhotoCard key={photo.id} photo={photo} size="md" />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">📸</div>
            <p>لا توجد صور في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  );
}
