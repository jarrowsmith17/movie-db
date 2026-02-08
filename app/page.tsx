import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MovieCarousel from '@/components/MovieCarousel';

export const dynamic = 'force-dynamic';

// 1. Fetch Trending (Mixed: Movies + TV)
const getTrending = async (filter: string) => {
  const timeWindow = filter === 'week' ? 'week' : 'day';
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-GB`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results;
};

// 2. Fetch New Releases (Mixed: Movies + TV)
const getNewReleases = async () => {
  const [movieRes, tvRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-GB&region=GB&page=1`),
    fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&language=en-GB&page=1`)
  ]);

  const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);

  const movies = movieData.results.map((m: any) => ({ ...m, media_type: 'movie' }));
  const shows = tvData.results.map((t: any) => ({ ...t, media_type: 'tv' }));

  return [...movies, ...shows].sort((a: any, b: any) => {
    const dateA = new Date(a.release_date || a.first_air_date).getTime();
    const dateB = new Date(b.release_date || b.first_air_date).getTime();
    return dateB - dateA;
  });
};

// 3. SEPARATED STREAMING FETCHERS
const getStreamingMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-GB&watch_region=GB&with_watch_monetization_types=flatrate&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
};

const getStreamingTV = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-GB&watch_region=GB&with_watch_monetization_types=flatrate&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.results.map((t: any) => ({ ...t, media_type: 'tv' }));
};

type Props = {
  searchParams: Promise<{ filter?: string }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentFilter = params.filter || 'day';

  // Fetch all 4 lists in parallel
  const [trendingData, newReleasesData, streamingMovies, streamingTV] = await Promise.all([
    getTrending(currentFilter),
    getNewReleases(),
    getStreamingMovies(),
    getStreamingTV()
  ]);

  const FilterLink = ({ filter, label }: { filter: string, label: string }) => {
    const isActive = currentFilter === filter;
    return (
      <Link 
        href={`/?filter=${filter}`}
        scroll={false} 
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all border border-gray-700 ${
          isActive 
            ? 'bg-yellow-500 text-black border-yellow-500' 
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-950 pb-20">
      
      <div className="w-full mb-4">
        <Navbar variant="default" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col gap-12">
        
        {/* SECTION 1: TRENDING */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl text-white font-bold">Trending</h2>
            <div className="flex items-center gap-2">
              <FilterLink filter="day" label="Today" />
              <FilterLink filter="week" label="This Week" />
            </div>
          </div>
          <MovieCarousel 
            key={currentFilter} 
            movies={trendingData} 
            showRanking={true} 
          />
        </section>

        {/* SECTION 2: NEW RELEASES */}
        <section>
          <h2 className="text-2xl text-white font-bold mb-4">New Releases</h2>
          <MovieCarousel movies={newReleasesData} showFullDate={true} />
        </section>

        {/* SECTION 3: STREAMING MOVIES */}
        <section>
          <h2 className="text-2xl text-white font-bold mb-4">Popular Streaming Movies (UK)</h2>
          <MovieCarousel movies={streamingMovies} />
        </section>

        {/* SECTION 4: STREAMING TV */}
        <section>
          <h2 className="text-2xl text-white font-bold mb-4">Popular Streaming TV Shows (UK)</h2>
          <MovieCarousel movies={streamingTV} />
        </section>

      </div>
    </main>
  );
}