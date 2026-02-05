import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MovieCarousel from '@/components/MovieCarousel';

// 1. Fetch Trending
const getTrendingMovies = async (filter: string) => {
  const timeWindow = filter === 'week' ? 'week' : 'day';
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results;
};

// 2. Fetch New Releases (Sorted by Newest Date)
const getNewReleases = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  );
  
  if (!res.ok) throw new Error('Failed to fetch new releases');
  
  const data = await res.json();
  
  // Sort Logic: Compare Date A vs Date B
  const sortedMovies = data.results.sort((a: any, b: any) => {
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  });

  return sortedMovies;
};

type Props = {
  searchParams: Promise<{ filter?: string }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentFilter = params.filter || 'day';

  const [trendingMovies, newReleases] = await Promise.all([
    getTrendingMovies(currentFilter),
    getNewReleases()
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
      
      {/* Navbar Container */}
      <div className="w-full mb-4">
        <Navbar variant="default" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col gap-12">
        
        {/* SECTION 1: TRENDING (Standard Year + RANKING) */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl text-white font-bold">Trending</h2>
            <div className="flex items-center gap-2">
              <FilterLink filter="day" label="Today" />
              <FilterLink filter="week" label="This Week" />
            </div>
          </div>
          
          {/* ✅ ADDED: showRanking={true} */}
          <MovieCarousel movies={trendingMovies} showRanking={true} />
        </section>

        {/* SECTION 2: NEW RELEASES (Full Date) */}
        <section>
          <h2 className="text-2xl text-white font-bold mb-4">New Releases</h2>
          {/* We enable the full date here */}
          <MovieCarousel movies={newReleases} showFullDate={true} />
        </section>

      </div>
    </main>
  );
}