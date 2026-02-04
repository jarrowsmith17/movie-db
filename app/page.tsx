import Link from 'next/link';
import Search from '@/components/Search';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// 1. Simplified Fetch Logic (Just Day vs Week)
const getTrendingMovies = async (filter: string) => {
  // Default to 'day' if the URL param is weird or empty
  const timeWindow = filter === 'week' ? 'week' : 'day';
  
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data.results;
};

// 2. Define Props for Next.js 15
type Props = {
  searchParams: Promise<{ filter?: string }>
}

export default async function Home({ searchParams }: Props) {
  // Await params to get the current filter (defaults to 'day')
  const params = await searchParams;
  const currentFilter = params.filter || 'day';

  const movies = await getTrendingMovies(currentFilter);

  // Helper for the Toggle Buttons
  const FilterLink = ({ filter, label }: { filter: string, label: string }) => {
    const isActive = currentFilter === filter;
    return (
      <Link 
        href={`/?filter=${filter}`}
        scroll={false} // Keeps you at the same scroll position
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
          isActive 
            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-950 p-4 md:p-10">
      
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:justify-between mb-8 gap-4">
        <Link 
          href="/" 
          className="text-2xl font-bold text-yellow-500 hover:text-yellow-200 transition-colors"
        >
          Movie-db
        </Link>

        <div className="w-full max-w-md">
           <Search />
        </div>
      </div>

      <div className="flex flex-col items-center mb-10 gap-6">
        <h1 className="text-3xl md:text-4xl text-white font-bold text-center">
          Trending Movies
        </h1>
        
        {/* --- THE 2-OPTION TOGGLE --- */}
        <div className="flex items-center gap-2 p-1 bg-gray-900 rounded-full border border-gray-800">
          <FilterLink filter="day" label="Today" />
          <FilterLink filter="week" label="This Week" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-7xl">
        {movies.map((movie: any) => (
          <Link 
            href={`/movie/${movie.id}`} 
            key={movie.id} 
            className="min-w-0 group border border-gray-700 p-4 rounded-lg hover:bg-gray-900 transition"
          >
            <div className="relative aspect-[2/3] w-full mb-3">
              {movie.poster_path ? (
                <img 
                  src={IMAGE_BASE_URL + movie.poster_path}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            <h2 className="text-lg font-bold truncate text-white group-hover:text-yellow-400 transition-colors">
              {movie.title}
            </h2>
            
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span className="text-yellow-500">⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date?.split('-')[0]}</span>
            </div>
            
            <p className="text-sm mt-3 text-gray-500 line-clamp-3 group-hover:text-yellow-200 transition-colors">
              {movie.overview}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}