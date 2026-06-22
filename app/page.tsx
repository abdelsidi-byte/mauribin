import { fetchScores, fetchArticles } from "@/lib/data";
import { ClientHome } from "@/components/ClientHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [scoresData, articlesData] = await Promise.all([
    fetchScores(),
    fetchArticles(),
  ]);

  const matches = scoresData.matches || [];
  const articles = articlesData.articles || [];

  return (
    <ClientHome matches={matches} articles={articles} />
  );
}
