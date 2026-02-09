import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MovieCarousel from "./MovieCarousel";

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function RecommendedForYou() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  // 1. Fetch ALL watched movie IDs
  const allWatched = await prisma.watchLog.findMany({
    where: {
      userId: session.user.id,
      type: "MOVIE",
    },
    select: {
      tmdbId: true,
      watchedAt: true,
    },
    orderBy: {
      watchedAt: "desc",
    },
  });

  if (allWatched.length === 0) return null;

  // 2. Fetch "High Rated" movies (4 or 5 stars)
  const highRatedReviews = await prisma.review.findMany({
    where: {
      userId: session.user.id,
      type: "MOVIE",
      rating: { gte: 4 },
    },
    select: {
      tmdbId: true,
    },
  });

  // --- SMART SOURCE SELECTION ---
  const recentSource = allWatched.slice(0, 2).map(log => log.tmdbId);
  const ratedSource = shuffleArray(highRatedReviews.map(r => r.tmdbId)).slice(0, 3);
  let sourceIds = [...recentSource, ...ratedSource];

  if (sourceIds.length < 5) {
    const needed = 5 - sourceIds.length;
    const historyPool = allWatched.slice(2).map(log => log.tmdbId);
    const randomHistory = shuffleArray(historyPool).slice(0, needed);
    sourceIds = [...sourceIds, ...randomHistory];
  }

  sourceIds = Array.from(new Set(sourceIds));

  // 3. Fetch Recommendations
  const promises = sourceIds.map(async (tmdbId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-GB&page=1`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      return data.results || [];
    } catch (e) {
      return [];
    }
  });

  const rawResults = await Promise.all(promises);
  const allRecs = rawResults.flat();

  // 4. Rank
  const movieScores = new Map<number, { count: number; movie: any }>();

  allRecs.forEach((movie: any) => {
    if (!movie || !movie.id) return;
    if (!movieScores.has(movie.id)) {
      movieScores.set(movie.id, { count: 1, movie });
    } else {
      const entry = movieScores.get(movie.id)!;
      entry.count += 1;
    }
  });

  // 5. Filter & Sort
  const watchedIds = new Set(allWatched.map((h) => h.tmdbId));

  const finalSelection = Array.from(movieScores.values())
    .filter((item) => !watchedIds.has(item.movie.id))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count; 
      return b.movie.vote_average - a.movie.vote_average;
    })
    .map((item) => item.movie)
    .slice(0, 20);

  if (finalSelection.length === 0) return null;

  return (
    // REMOVED 'mb-12' -> Now relies on parent gap-10
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 px-4 md:px-10 flex items-center gap-3">
        Recommended For You
        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded">
          Based on your favorites
        </span>
      </h2>
      <MovieCarousel movies={finalSelection} />
    </section>
  );
}