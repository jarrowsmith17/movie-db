import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MovieCarousel from "./MovieCarousel";

// Helper to shuffle an array
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

  // 1. Fetch ALL watched movie IDs for filtering (so we don't recommend seen films)
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

  // 2. Pick Source Movies from recent history 
  // (We use a pool of the last 50 to mix recent favorites with random rediscovery)
  const recentPool = allWatched.slice(0, 50);
  
  const recent = recentPool.slice(0, 2); // Top 2 most recent
  const others = recentPool.slice(2);
  const shuffledOthers = shuffleArray([...others]).slice(0, 3); // 3 random others
  
  const sourceMovies = [...recent, ...shuffledOthers];

  // 3. Fetch Recommendations from TMDB in Parallel
  const promises = sourceMovies.map(async (log) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${log.tmdbId}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-GB&page=1`,
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

  // 4. Ranking Algorithm (Count occurrences)
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

  // 5. FILTERING
  // Create a Set of IDs the user has ALREADY watched to block them
  const watchedIds = new Set(allWatched.map((h) => h.tmdbId));

  const finalSelection = Array.from(movieScores.values())
    .filter((item) => !watchedIds.has(item.movie.id)) // <--- CRITICAL: Filter out seen films
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count; // Prioritize overlap
      return b.movie.vote_average - a.movie.vote_average; // Then rating
    })
    .map((item) => item.movie)
    .slice(0, 20);

  if (finalSelection.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        Recommended For You
        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded">
          For You
        </span>
      </h2>
      <MovieCarousel movies={finalSelection} />
    </section>
  );
}