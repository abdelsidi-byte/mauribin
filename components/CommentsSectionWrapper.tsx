"use client";

import { CommentsSection } from "@/components/CommentsSection";

interface Props {
  matchId: string;
  matchTitle?: string;
}

export function CommentsSectionWrapper({ matchId, matchTitle }: Props) {
  return <CommentsSection matchId={matchId} matchTitle={matchTitle} />;
}
