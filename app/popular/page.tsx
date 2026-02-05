import Navbar from '@/components/Navbar';
import Link from 'next/link';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const getPopularMovies = async () => {
  // Fetching 5 pages (20 items each) to get the top 100 most popular films
  const pageRequests = [1, 2, 3, 4, 5].map(page =>
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-GB&page=${page}&region=GB`,
      { next: { revalidate: 3600 } } // Popularity changes daily, so we cache for 1 hour
    ).then(res => res.json())
  );

  const pages = await Promise.all(pageRequests);
  return pages.flatMap(page => page.results).slice(0, 100);
};

export default async function PopularMoviesPage() {
  const movies = await getPopularMovies();

  // Consistent rating color logic used across the app
  const getRatingColor = (rating: number) => {
    if (rating >= 7) return 'text-green-400 border-green-400';
    if (rating >= 5) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <header className="mb-12 border-l-4 border-yellow-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Popular Movies
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            The films trending globally and in the UK right now.
          </p>
        </header>

        {/* 100-Card Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {movies.map((movie: any, index: number) => {
            const year = movie.release_date?.split('-')[0] || 'TBA';
            
            return (
              <Link 
                key={movie.id} 
                href={`/movie/${movie.id}`}
                className="group relative flex flex-col gap-3 transition-transform hover:scale-105"
              >
                {/* Ranking Badge */}
                <div className="absolute -top-3 -left-3 z-20 bg-yellow-500 text-black w-9 h-9 rounded-full flex items-center justify-center font-black shadow-2xl border-2 border-gray-950 text-sm">
                  #{index + 1}
                </div>

                {/* Poster Card */}
                <div className="relative aspect-[2/3] w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                  {movie.poster_path ? (
                    <img
                      src={IMAGE_BASE_URL + movie.poster_path}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm italic">No Image</div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 bg-black/90 backdrop-blur-md flex items-center justify-center text-xs font-bold ${getRatingColor(movie.vote_average)}`}>
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>

                {/* Info Text */}
                <div className="px-1">
                  <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-yellow-500 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 font-medium">{year}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}