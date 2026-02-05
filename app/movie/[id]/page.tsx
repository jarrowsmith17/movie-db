import Link from 'next/link';
import Search from '@/components/Search';
import Navbar from '@/components/Navbar';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; // "original" = Highest Quality

// 1. Fetch the specific movie details using the ID
const getMovie = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
};

type Props = {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: Props) {
  // 2. Handle Next.js 15 Async Params
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">      
      {/* --- HERO SECTION (Backdrop Image) --- */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        
        {/* Navbar */}
        <div className="w-full z-50">
            <Navbar variant="overlay" />
        </div>
        
        {/* The Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGE_BASE_URL + movie.backdrop_path})` }}
        >
          {/* The "Fade" Gradient - Makes text readable at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        </div>

        {/* The Content sitting on top of the image */}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 max-w-7xl mx-auto">
    
          {/* Title & Date */}
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            {movie.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-gray-300">
            <span className="text-yellow-500 font-bold text-xl">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span>{movie.release_date.split('-')[0]}</span>
            <span>{movie.runtime} min</span>
          </div>
        </div>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
        
        {/* Left Column: The Poster */}
        <div className="hidden md:block">
           <img 
             src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
             alt={movie.title}
             className="rounded-lg shadow-2xl border-4 border-gray-800"
           />
        </div>

        {/* Right Column: The Plot & Genres */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Overview</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            {movie.overview}
          </p>

          <h2 className="text-xl font-bold mb-3">Genres</h2>
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((g: any) => (
              <span key={g.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}