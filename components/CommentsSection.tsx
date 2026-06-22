"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Comment {
  id: string;
  match_id: string;
  user_name: string;
  comment_text: string;
  parent_id: string | null;
  created_at: string;
}

interface CommentsSectionProps {
  matchId: string;
  matchTitle?: string;
}

const STORAGE_PREFIX = "mauribin_comments_local_";

function timeAgo(ts: string): string {
  const diff = Math.max(0, Date.now() - new Date(ts).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `قبل ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `قبل ${days} يوم`;
  return `قبل ${Math.floor(days / 30)} شهر`;
}

function avatarColor(name: string): string {
  const palette = [
    "linear-gradient(135deg, #006233 0%, #007a40 100%)",
    "linear-gradient(135deg, #FFD700 0%, #e6c200 100%)",
    "linear-gradient(135deg, #D01C1F 0%, #b01619 100%)",
    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

function loadLocalFallback(matchId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + matchId);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = new Date().toISOString();
  const seeded: Comment[] = [
    {
      id: `seed-${matchId}-1`,
      match_id: matchId,
      user_name: "أحمد ولد محمد",
      comment_text: "مباراة رائعة! أداء المنتخب كان ممتازاً اليوم.",
      parent_id: null,
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: `seed-${matchId}-2`,
      match_id: matchId,
      user_name: "فاطمة منت سيدي",
      comment_text: "الهدف الثاني كان تحفة 👏 نتمنى نواصلوا على هذا المستوى.",
      parent_id: null,
      created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
  ];
  return seeded;
}

export function CommentsSection({ matchId, matchTitle }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    setHydrated(true);
    if (useSupabase) {
      loadFromSupabase();
      const channel = supabase
        .channel(`comments-${matchId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "comments", filter: `match_id=eq.${matchId}` },
          (payload) => {
            setComments((prev) => {
              if (prev.some((c) => c.id === String(payload.new.id))) return prev;
              return [...prev, payload.new as Comment];
            });
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "comments" },
          (payload) => {
            setComments((prev) => prev.filter((c) => c.id !== String(payload.old.id)));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setComments(loadLocalFallback(matchId));
    }
  }, [matchId]);

  async function loadFromSupabase() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase load error:", error);
      setComments(loadLocalFallback(matchId));
    } else {
      setComments(data || []);
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    const t = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(t);
  }, [hydrated]);

  const sorted = useMemo(
    () => [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [comments, nowTick]
  );

  // Top-level comments
  const topLevel = sorted.filter((c) => !c.parent_id);
  // Replies grouped by parent
  const repliesByParent = sorted.filter((c) => c.parent_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName) {
      setError("الرجاء إدخال اسمك");
      return;
    }
    if (trimmedText.length < 2) {
      setError("الرجاء كتابة تعليق (حرفين على الأقل)");
      return;
    }
    if (trimmedText.length > 500) {
      setError("التعليق طويل جداً (الحد الأقصى 500 حرف)");
      return;
    }

    setSubmitting(true);
    setError(null);

    if (useSupabase) {
      const { error: sbError } = await supabase.from("comments").insert({
        match_id: matchId,
        user_name: trimmedName,
        comment_text: trimmedText,
        parent_id: replyingTo,
      });
      if (sbError) {
        setError("حدث خطأ: " + sbError.message);
        setSubmitting(false);
        return;
      }
    } else {
      // localStorage fallback
      const newComment: Comment = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        match_id: matchId,
        user_name: trimmedName,
        comment_text: trimmedText,
        parent_id: replyingTo,
        created_at: new Date().toISOString(),
      };
      const next = [...comments, newComment];
      setComments(next);
      try {
        window.localStorage.setItem(STORAGE_PREFIX + matchId, JSON.stringify(next));
      } catch {}
    }

    setText("");
    setReplyingTo(null);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (useSupabase) {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) {
        console.error("Delete error:", error);
        return;
      }
    }
    setComments((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (!useSupabase) {
        try {
          window.localStorage.setItem(STORAGE_PREFIX + matchId, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const renderComment = (c: Comment, isReply = false) => {
    const initial = c.user_name.trim().charAt(0).toUpperCase() || "?";
    return (
      <li
        key={c.id}
        className={`glass-card rounded-xl p-4 animate-[slideIn_0.4s_ease-out] ${isReply ? "mr-8 border-r-2 border-[#FFD700]/30" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md"
            style={{ background: avatarColor(c.user_name) }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-white truncate">{c.user_name}</span>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {timeAgo(c.created_at)}
                </span>
              </div>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words text-right">
              {c.comment_text}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                  className="text-xs text-[#FFD700] hover:text-white hover:bg-[#FFD700] border border-[#FFD700]/30 hover:border-[#FFD700] px-2.5 py-1 rounded-lg transition-all duration-200"
                >
                  {replyingTo === c.id ? "إلغاء" : "↩ رد"}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-xs text-[#D01C1F] hover:text-white hover:bg-[#D01C1F] border border-[#D01C1F]/30 hover:border-[#D01C1F] px-2.5 py-1 rounded-lg transition-all duration-200"
              >
                حذف
              </button>
            </div>

            {/* Replies */}
            {!isReply && repliesByParent.filter((r) => r.parent_id === c.id).length > 0 && (
              <ul className="mt-3 space-y-2">
                {repliesByParent
                  .filter((r) => r.parent_id === c.id)
                  .map((r) => renderComment(r, true))}
              </ul>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <section
      dir="rtl"
      aria-label="قسم التعليقات"
      className="glass rounded-2xl p-6 mb-6 animate-[fadeInUp_0.5s_ease-out]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">💬</span>
          التعليقات
          {useSupabase && (
            <span className="text-xs font-normal text-[#006233] bg-[#FFD700] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#006233] rounded-full animate-pulse"></span>
              مباشر
            </span>
          )}
        </h2>
        <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1 rounded-full">
          {sorted.length} {sorted.length === 1 ? "تعليق" : "تعليقات"}
        </span>
      </div>

      {matchTitle && (
        <p className="text-xs text-slate-400 mb-4">
          شاركنا رأيك في مباراة <span className="text-white font-bold">{matchTitle}</span>
        </p>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        {replyingTo && (
          <div className="text-xs text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg px-3 py-2 flex items-center justify-between">
            <span>↩ رد على تعليق</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-[#D01C1F] hover:underline"
            >
              إلغاء
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك"
            maxLength={40}
            className="md:col-span-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-colors text-right"
            aria-label="الاسم"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyingTo ? "اكتب ردك..." : "اكتب تعليقك هنا... (يدعم العربية)"}
            maxLength={500}
            rows={2}
            dir="rtl"
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-colors resize-none text-right"
            aria-label="نص التعليق"
          />
        </div>

        {error && (
          <div className="text-sm text-[#D01C1F] bg-[#D01C1F]/10 border border-[#D01C1F]/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {text.length}/500
          </span>
          <button
            type="submit"
            disabled={!hydrated || submitting}
            className="bg-[#FFD700] hover:bg-[#e6c200] disabled:opacity-50 disabled:cursor-not-allowed text-[#0f2d1a] font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#FFD700]/20"
          >
            {submitting ? "جاري النشر..." : replyingTo ? "نشر الرد" : "نشر التعليق"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {!hydrated ? (
        <div className="text-slate-500 text-sm text-center py-6">جاري التحميل...</div>
      ) : topLevel.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <div className="text-4xl mb-2">🗨️</div>
          <p className="text-sm">لا توجد تعليقات بعد. كن أول من يعلق!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {topLevel.map((c) => renderComment(c))}
        </ul>
      )}
    </section>
  );
}