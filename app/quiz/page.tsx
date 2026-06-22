"use client";

import { useState, useMemo, useEffect } from "react";

// Question type
type Question = {
  id: number;
  question: string;
  options: { label: string; flag: string }[];
  correctIndex: number;
  explanation?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "من فاز بكأس العالم 2022؟",
    options: [
      { label: "فرنسا", flag: "🇫🇷" },
      { label: "الأرجنتين", flag: "🇦🇷" },
      { label: "البرازيل", flag: "🇧🇷" },
      { label: "كرواتيا", flag: "🇭🇷" },
    ],
    correctIndex: 1,
    explanation: "فازت الأرجنتين بكأس العالم 2022 في قطر بعد نهائي مثير ضد فرنسا.",
  },
  {
    id: 2,
    question: "ما هو المنتخب الذي فاز بأكبر عدد من بطولات كأس العالم؟",
    options: [
      { label: "ألمانيا", flag: "🇩🇪" },
      { label: "إيطاليا", flag: "🇮🇹" },
      { label: "البرازيل", flag: "🇧🇷" },
      { label: "الأرجنتين", flag: "🇦🇷" },
    ],
    correctIndex: 2,
    explanation: "البرازيل تحمل الرقم القياسي بـ 5 ألقاب في كأس العالم.",
  },
  {
    id: 3,
    question: "ما هو أكبر ملعب سيستضيف مباريات كأس العالم 2026؟",
    options: [
      { label: "ملعب سوليدر فيلد", flag: "🇺🇸" },
      { label: "ملعب أزتيكا", flag: "🇲🇽" },
      { label: "ملعب ميتلايف", flag: "🇺🇸" },
      { label: "ملعب روز بول", flag: "🇺🇸" },
    ],
    correctIndex: 2,
    explanation: "ملعب ميتلايف في نيوجيرسي سيستضيف المباراة النهائية بسعة تتجاوز 82 ألف متفرج.",
  },
  {
    id: 4,
    question: "كم عدد المنتخبات التي ستشارك في كأس العالم 2026؟",
    options: [
      { label: "32 منتخباً", flag: "🔢" },
      { label: "40 منتخباً", flag: "🔢" },
      { label: "48 منتخباً", flag: "🔢" },
      { label: "24 منتخباً", flag: "🔢" },
    ],
    correctIndex: 2,
    explanation: "سيشارك 48 منتخباً لأول مرة في تاريخ كأس العالم 2026.",
  },
  {
    id: 5,
    question: "من هو الهداف التاريخي لكأس العالم؟",
    options: [
      { label: "رونالدو البرازيلي", flag: "🇧🇷" },
      { label: "ميروسلاف كلوزه", flag: "🇩🇪" },
      { label: "جيوف مولر", flag: "🇩🇪" },
      { label: "بيليه", flag: "🇧🇷" },
    ],
    correctIndex: 1,
    explanation: "كلوزه يتصدر القائمة بـ 16 هدفاً، متجاوزاً الأسطورة البرازيلية رونالدو (15 هدفاً).",
  },
];

type Stage = "intro" | "playing" | "finished";

function getResultMessage(score: number, total: number) {
  const percent = (score / total) * 100;
  if (percent === 100) {
    return {
      title: "مذهل! 🏆",
      text: "أنت خبير حقيقي في كرة القدم! إجاباتك كلها صحيحة.",
      emoji: "🏆",
      color: "from-[#ffd700] via-[#f0c040] to-[#ffd700]",
    };
  }
  if (percent >= 80) {
    return {
      title: "ممتاز! 🌟",
      text: "أداء رائع! معلوماتك عن كأس العالم قوية جداً.",
      emoji: "🌟",
      color: "from-[#ffd700] to-[#e6c200]",
    };
  }
  if (percent >= 60) {
    return {
      title: "جيد جداً! 👏",
      text: "أداء جيد! راجع بعض المعلومات وستصبح خبيراً.",
      emoji: "👏",
      color: "from-[#006233] to-[#007a40]",
    };
  }
  if (percent >= 40) {
    return {
      title: "لا بأس! ⚽",
      text: "تابع المباريات وراجع التاريخ وستتحسن سريعاً.",
      emoji: "⚽",
      color: "from-[#006233] to-[#004225]",
    };
  }
  return {
    title: "حاول مرة أخرى! 💪",
    text: "كرة القدم بحر واسع — ابدأ من هنا وستتعلم الكثير!",
    emoji: "💪",
    color: "from-[#d01c1f] to-[#b81518]",
  };
}

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[currentIdx];
  const progress = useMemo(
    () => Math.round(((currentIdx + (selected !== null ? 1 : 0)) / total) * 100),
    [currentIdx, selected, total],
  );

  // Reset copied state after a short delay
  useEffect(() => {
    if (shareCopied) {
      const t = setTimeout(() => setShareCopied(false), 2200);
      return () => clearTimeout(t);
    }
  }, [shareCopied]);

  const startQuiz = () => {
    setStage("playing");
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setAnswers({});
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return; // Already answered
    setSelected(idx);
    const isCorrect = idx === current.correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => ({ ...a, [current.id]: idx }));
  };

  const goNext = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (currentIdx + 1 >= total) {
        setStage("finished");
      } else {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
      }
      setTransitioning(false);
    }, 280);
  };

  const shareScore = async () => {
    const text = `⚽ نتائج اختبار كأس العالم — موريبين\nنتيجتي: ${score}/${total} ${score === total ? "🏆 مثالية!" : ""}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareCopied(true);
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setShareCopied(true);
      }
    } catch {
      // ignore — fallback just shows the text
      setShareCopied(true);
    }
  };

  const result = getResultMessage(score, total);

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Decorative background */}
      <div className="absolute inset-0 pitch-stripes opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-[#006233]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/80 via-[#006233]/60 to-[#006233]/80" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px)",
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />

        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-2xl">🏆</span>
              <span className="text-[#ffd700] font-bold">اختبار كأس العالم</span>
              <span className="text-2xl">🏆</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-white/30" />
              <span>تحدَّ معلوماتك الكروية</span>
              <span className="w-12 h-px bg-white/30" />
            </h1>
            <p className="text-[#f1f5f9]/80 text-center max-w-2xl mx-auto">
              خمسة أسئلة سريعة عن كأس العالم — اختبر معلوماتك واعرف إن كنت خبيراً حقيقياً!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 relative">
        {/* INTRO STAGE */}
        {stage === "intro" && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8 md:p-10 text-center border border-[#ffd700]/20">
              <div className="text-7xl mb-6 float">🏆</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 gradient-text">
                مرحباً بك في اختبار موريبين
              </h2>
              <p className="text-[#f1f5f9]/80 mb-8 leading-relaxed">
                ستواجه <span className="text-[#ffd700] font-bold">5 أسئلة</span> متعددة الخيارات
                عن كأس العالم. اختر الإجابة الصحيحة من بين الأعلام لتنال نقاطك. هل أنت مستعد؟
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="glass rounded-xl p-3 border border-[#ffd700]/20">
                  <div className="text-2xl mb-1">⚽</div>
                  <div className="text-xs text-[#f1f5f9]/70">5 أسئلة</div>
                </div>
                <div className="glass rounded-xl p-3 border border-[#ffd700]/20">
                  <div className="text-2xl mb-1">🏳️</div>
                  <div className="text-xs text-[#f1f5f9]/70">أعلام المنتخبات</div>
                </div>
                <div className="glass rounded-xl p-3 border border-[#ffd700]/20">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs text-[#f1f5f9]/70">شارك نتيجتك</div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#006233] to-[#007a40] hover:from-[#007a40] hover:to-[#006233] text-white font-bold text-lg border border-[#ffd700]/40 glow-green transition-all hover:scale-105"
              >
                <span className="text-2xl group-hover:rotate-12 transition-transform">⚽</span>
                <span>ابدأ الاختبار</span>
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
              </button>
            </div>
          </div>
        )}

        {/* PLAYING STAGE */}
        {stage === "playing" && current && (
          <div className="max-w-3xl mx-auto">
            {/* Progress + score */}
            <div className="glass-card rounded-2xl p-5 mb-6 border border-[#ffd700]/20">
              <div className="flex items-center justify-between mb-3 text-sm">
                <div className="flex items-center gap-2 text-[#f1f5f9]/80">
                  <span className="text-lg">📊</span>
                  <span>
                    السؤال{" "}
                    <span className="text-[#ffd700] font-bold">{currentIdx + 1}</span> من{" "}
                    <span className="text-[#ffd700] font-bold">{total}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
                  <span className="text-[#ffd700] font-bold">{score}</span>
                  <span className="text-[#f1f5f9]/60">/</span>
                  <span className="text-[#f1f5f9]/60">{total}</span>
                  <span className="text-base">⭐</span>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#006233] via-[#007a40] to-[#ffd700] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div
              className={`glass-card rounded-2xl p-6 md:p-8 border border-[#ffd700]/20 transition-all duration-300 ${
                transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#006233] to-[#004225] flex items-center justify-center text-xl border border-[#ffd700]/30 glow-green">
                  {currentIdx + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed flex-1 pt-1">
                  {current.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === current.correctIndex;
                  const showResult = selected !== null;

                  let stateClass =
                    "bg-black/30 border-white/10 hover:border-[#ffd700]/40 hover:bg-[#006233]/10 cursor-pointer";
                  let iconBadge: React.ReactNode = null;

                  if (showResult) {
                    if (isCorrect) {
                      stateClass =
                        "bg-gradient-to-r from-[#006233] to-[#007a40] border-[#ffd700] glow-green";
                      iconBadge = (
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ffd700] text-[#006233] font-black text-lg border-2 border-white">
                          ✓
                        </span>
                      );
                    } else if (isSelected && !isCorrect) {
                      stateClass =
                        "bg-gradient-to-r from-[#d01c1f] to-[#b81518] border-[#d01c1f] glow-red";
                      iconBadge = (
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#d01c1f] font-black text-lg border-2 border-white">
                          ✕
                        </span>
                      );
                    } else {
                      stateClass = "bg-black/20 border-white/5 opacity-50";
                    }
                  } else if (isSelected) {
                    stateClass =
                      "bg-[#006233]/30 border-[#ffd700]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all duration-300 ${stateClass}`}
                    >
                      <div className="text-4xl md:text-5xl transform group-hover:scale-110 transition-transform">
                        {opt.flag}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-base md:text-lg">
                          {opt.label}
                        </div>
                      </div>
                      {iconBadge}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after answer */}
              {selected !== null && current.explanation && (
                <div className="mt-5 p-4 rounded-xl bg-black/30 border border-[#ffd700]/20">
                  <div className="flex items-start gap-2 text-sm text-[#f1f5f9]/90 leading-relaxed">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <span>{current.explanation}</span>
                  </div>
                </div>
              )}

              {/* Next button */}
              {selected !== null && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={goNext}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#006233] to-[#007a40] hover:from-[#007a40] hover:to-[#006233] text-white font-bold border border-[#ffd700]/40 transition-all hover:scale-105"
                  >
                    <span>
                      {currentIdx + 1 >= total ? "عرض النتيجة" : "السؤال التالي"}
                    </span>
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">
                      ←
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FINISHED STAGE */}
        {stage === "finished" && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8 md:p-10 text-center border border-[#ffd700]/30 relative overflow-hidden">
              {/* Confetti-style glow */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#ffd700]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#006233]/40 rounded-full blur-3xl" />

              <div className="relative">
                <div className="text-8xl mb-4 float">{result.emoji}</div>

                <div
                  className={`inline-block text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}
                >
                  {result.title}
                </div>

                {/* Score circle */}
                <div className="my-8">
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-black/50 to-black/20 border-4 border-[#ffd700]/50 glow-gold relative">
                    <div className="absolute inset-2 rounded-full border-2 border-[#ffd700]/20" />
                    <div>
                      <div className="text-5xl font-black text-[#ffd700] leading-none">
                        {score}
                      </div>
                      <div className="text-[#f1f5f9]/60 text-sm mt-1">من {total}</div>
                    </div>
                  </div>
                </div>

                <p className="text-[#f1f5f9]/90 text-lg mb-8 leading-relaxed">
                  {result.text}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="glass rounded-xl p-3 border border-[#006233]/40">
                    <div className="text-2xl text-[#ffd700] font-black">{score}</div>
                    <div className="text-xs text-[#f1f5f9]/70 mt-1">إجابة صحيحة</div>
                  </div>
                  <div className="glass rounded-xl p-3 border border-[#d01c1f]/40">
                    <div className="text-2xl text-[#d01c1f] font-black">
                      {total - score}
                    </div>
                    <div className="text-xs text-[#f1f5f9]/70 mt-1">إجابة خاطئة</div>
                  </div>
                  <div className="glass rounded-xl p-3 border border-[#ffd700]/40">
                    <div className="text-2xl text-[#ffd700] font-black">
                      {Math.round((score / total) * 100)}%
                    </div>
                    <div className="text-xs text-[#f1f5f9]/70 mt-1">نسبة النجاح</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={startQuiz}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#006233] to-[#007a40] hover:from-[#007a40] hover:to-[#006233] text-white font-bold border border-[#ffd700]/40 transition-all hover:scale-105"
                  >
                    <span className="text-lg group-hover:rotate-180 transition-transform duration-500">
                      ↻
                    </span>
                    <span>إعادة الاختبار</span>
                  </button>
                  <button
                    onClick={shareScore}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#e6c200] hover:from-[#e6c200] hover:to-[#ffd700] text-[#004225] font-bold border border-[#006233]/40 transition-all hover:scale-105"
                  >
                    <span className="text-lg">{shareCopied ? "✓" : "📤"}</span>
                    <span>{shareCopied ? "تم النسخ!" : "مشاركة النتيجة"}</span>
                  </button>
                </div>

                {shareCopied && (
                  <div className="mt-4 text-sm text-[#ffd700] animate-pulse">
                    🎉 تم نسخ النتيجة إلى الحافظة — الصقها وشاركها مع أصدقائك!
                  </div>
                )}
              </div>
            </div>

            {/* Review answers */}
            <div className="glass-card rounded-2xl p-6 mt-6 border border-[#ffd700]/20">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">📋</span>
                <h3 className="text-white font-bold text-lg">مراجعة الإجابات</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#ffd700]/50 to-transparent" />
              </div>
              <div className="space-y-3">
                {QUESTIONS.map((q, i) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "bg-[#006233]/20 border-[#006233]/50"
                          : "bg-[#d01c1f]/10 border-[#d01c1f]/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                            isCorrect
                              ? "bg-[#ffd700] text-[#006233]"
                              : "bg-[#d01c1f] text-white"
                          }`}
                        >
                          {isCorrect ? "✓" : "✕"}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="text-white font-medium mb-1">
                            <span className="text-[#f1f5f9]/60">س{i + 1}.</span>{" "}
                            {q.question}
                          </div>
                          <div className="text-[#f1f5f9]/80">
                            <span className="text-[#f1f5f9]/60">إجابتك: </span>
                            <span className="text-base align-middle ml-1">
                              {q.options[userAnswer]?.flag}
                            </span>{" "}
                            {q.options[userAnswer]?.label}
                            {!isCorrect && (
                              <span className="block mt-1 text-[#ffd700]">
                                ✓ الصحيحة: {q.options[q.correctIndex].flag}{" "}
                                {q.options[q.correctIndex].label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
