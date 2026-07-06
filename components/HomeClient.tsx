"use client";

import { VideoSection } from "@/components/VideoSection";
import { ClientHome } from "@/components/ClientHome";

export function HomeClient({ matches, articles, worldCupMatches }: {
  matches: any[];
  articles: any[];
  worldCupMatches: any[];
}) {
  return (
    <>
      <VideoSection />
      <ClientHome matches={matches} articles={articles} worldCupMatches={worldCupMatches} />
    </>
  );
}
