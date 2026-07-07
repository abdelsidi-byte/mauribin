"use client";

import { ClientHome } from "@/components/ClientHome";

export function HomeClient({ matches, articles, worldCupMatches }: {
  matches: any[];
  articles: any[];
  worldCupMatches: any[];
}) {
  return (
    <ClientHome matches={matches} articles={articles} worldCupMatches={worldCupMatches} />
  );
}
