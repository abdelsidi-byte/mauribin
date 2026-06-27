"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPhotoById, getRelatedPhotos, CATEGORY_LABELS, getFlag, type Photo } from "@/lib/photos";

function PhotoCard({ photo, compact = false }: { photo: Photo; compact?: boolean }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      href={`/photos/${photo.slug}`}
      className={`group block rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-[#FFD700]/40 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#006233]/20 ${
        compact ? "h-40" : "h-48"
      }`}
    >
      <div className={`relative ${compact ? "h-28" : "h-36"} overflow-hidden`}>
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
            <span className="text-3xl">📸</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2">
          <span className="text-white text-xs font-bold bg-[#006233]/80 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[photo.category]}
          </span>
        </div>
      </div>
      {!compact && (
        <div className="p-3">
          <h4 className="text-white text-xs font-bold line-clamp-2 leading-snug">{photo.titleAr}</h4>
          <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs">
            <span>👁️ {photo.views.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-96 bg-slate-800 rounded-2xl" />
      <div className="h-20 bg-slate-800 rounded-xl" />
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-800 rounded-xl" />)}
      </div>
    </div>
  );
}

export default function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const photo = getPhotoById(id);

  if (!photo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-white mb-2">الصورة غير موجودة</h2>
          <Link href="/photos" className="text-[#FFD700] hover:underline">← العودة للمعرض</Link>
        </div>
      </div>
    );
  }

  const related = getRelatedPhotos(photo, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Back nav */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-[65px] z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-[#FFD700] transition-colors text-sm font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            رجوع
          </button>
          <Link href="/photos" className="text-slate-400 hover:text-white text-sm transition-colors">
            / المعرض
          </Link>
          <span className="text-slate-500 text-sm">/</span>
          <span className="text-white text-sm truncate flex-1">{photo.titleAr}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Main image */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-800">
          {!imgError ? (
            <img
              src={photo.imageUrl}
              alt={photo.titleAr}
              onError={() => setImgError(true)}
              className="w-full max-h-[500px] object-contain bg-slate-900"
            />
          ) : (
            <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
              <span className="text-6xl">📸</span>
            </div>
          )}
          {/* Category + Fullscreen */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-[#006233]/90 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              {CATEGORY_LABELS[photo.category]}
            </span>
            {photo.featured && (
              <span className="bg-[#FFD700] text-black text-sm font-bold px-3 py-1.5 rounded-full">
                ⭐ مميز
              </span>
            )}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 space-y-4">
          {/* Title */}
          <h1 className="text-2xl font-black text-white leading-snug">{photo.titleAr}</h1>
          <p className="text-slate-300 leading-relaxed">{photo.descriptionAr}</p>

          {/* Match info */}
          {photo.match && (
            <div className="flex items-center justify-center gap-4 bg-[#006233]/20 rounded-xl p-4">
              <div className="text-center">
                <span className="text-3xl block mb-1">{getFlag(photo.match.home)}</span>
                <span className="text-white text-sm font-bold">{photo.match.home}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#FFD700]">{photo.match.score}</div>
                <span className="text-slate-400 text-xs">{photo.match.date}</span>
              </div>
              <div className="text-center">
                <span className="text-3xl block mb-1">{getFlag(photo.match.away)}</span>
                <span className="text-white text-sm font-bold">{photo.match.away}</span>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-slate-400 text-xs mb-1">👁️ المشاهدات</div>
              <div className="text-white font-black">{photo.views.toLocaleString()}</div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-slate-400 text-xs mb-1">❤️ الإعجابات</div>
              <div className="text-white font-black">{photo.likes.toLocaleString()}</div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-slate-400 text-xs mb-1">📷 المصور</div>
              <div className="text-white text-xs font-bold truncate">{photo.photographer}</div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-slate-400 text-xs mb-1">🏆 المسابقة</div>
              <div className="text-white text-xs font-bold truncate">{photo.competitionAr}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                liked ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              {liked ? "❤️" : "🤍"} {liked ? "إعجاب" : "إعجاب"}
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                bookmarked ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50" : "bg-slate-700/50 text-slate-300 hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
              }`}
            >
              {bookmarked ? "🔖" : "📌"} {bookmarked ? "محفوظ" : "حفظ"}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.href}`)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all"
            >
              🔗 مشاركة
            </button>
          </div>

          {/* Tags */}
          {photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {photo.tags.map(tag => (
                <span key={tag} className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related photos */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-[#FFD700] mb-4">📸 صور ذات صلة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <PhotoCard key={p.id} photo={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="pb-8">
          <Link
            href="/photos"
            className="block w-full bg-[#006233] hover:bg-[#004225] text-white font-black py-4 rounded-xl text-center transition-colors"
          >
            ← العودة للمعرض
          </Link>
        </div>
      </div>
    </div>
  );
}
