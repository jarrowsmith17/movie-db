import Search from '@/components/Search';
import Link from 'next/link';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 1. Fetch logic accepts the "query"
const getSearchResults = async (query: string) => {
  const apiKey = process.env.TMDB_API_KEY;
  
  // 1. Basic Search (Fetch 2 pages for depth)
  const [res1, res2] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=2`)
  ]);
  
  const data1 = await res1.json();
  const data2 = await res2.json();
  let movies = [...(data1.results || []), ...(data2.results || [])];

  // 2. "Franchise Check" Logic
  // We grab the most relevant movie (usually the first one) to check if it has siblings.
  const firstHit = movies[0];

  if (firstHit) {
    try {
      // We must fetch the movie DETAILS to see the collection info
      // (Search results don't include collection IDs by default)
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${firstHit.id}?api_key=${apiKey}`
      );
      const details = await detailsRes.json();

      // Does this movie belong to a collection? (e.g., Twilight Saga, Harry Potter)
      if (details.belongs_to_collection) {
        const collectionId = details.belongs_to_collection.id;
        
        // Fetch the entire collection
        const collectionRes = await fetch(
          `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${apiKey}`
        );
        const collectionData = await collectionRes.json();
        
        // Add the collection parts to our list
        if (collectionData.parts) {
          // Add them to the FRONT of the array so they don't get lost
          movies = [...collectionData.parts, ...movies];
        }
      }
    } catch (err) {
      console.error("Franchise fetch failed, falling back to standard search", err);
    }
  }

  // 3. Deduplicate (Remove movies that appear twice)
  const uniqueMovies = Array.from(new Map(movies.map((m: any) => [m.id, m])).values());

  // 4. Smart Sort (Exact Match -> Popularity)
  
  // A. Find Exact Match
  const exactMatch = uniqueMovies.find((m: any) => 
    m.title.toLowerCase() === query.toLowerCase()
  );

  // B. Remove Exact Match from list
  if (exactMatch) {
    const others = uniqueMovies.filter((m: any) => m.id !== exactMatch.id);
    
    // Sort the rest by Vote Count (Fame)
    others.sort((a: any, b: any) => b.vote_count - a.vote_count);
    
    // Pin Exact Match to top if it's decently popular (>100 votes)
    if (exactMatch.vote_count > 100) {
      return [exactMatch, ...others];
    }
    // If obscure, treat as normal
    return [exactMatch, ...others].sort((a: any, b: any) => b.vote_count - a.vote_count);
  }

  // C. Default Sort (If no exact match)
  return uniqueMovies.sort((a: any, b: any) => b.vote_count - a.vote_count);
};


// 2. Define the Type for Next.js 15 (Params is now a Promise)
type Props = {
  params: Promise<{ query: string }>
}

export default async function SearchPage({ params }: Props) {
  // 3. AWAIT the params before using them (The Fix)
  const resolvedParams = await params;
  const query = decodeURIComponent(resolvedParams.query);
  
  // 4. Fetch the movies
  const movies = await getSearchResults(query);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-10 bg-gray-100 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:justify-between mb-8 gap-4">
        
        <Link 
          href="/" 
          className="text-2xl font-bold text-gray-900 dark:text-white hover:text-yellow-500 transition-colors"
        >
          MovieLog
        </Link>

        {/* This container holds your Search Bar. 
            We remove the margin-bottom (mb-8) from the search component itself 
            so the gap-4 above handles the spacing. 
        */}
        <div className="w-full max-w-md">
           <Search />
        </div>
        
      </div>
        <div className="w-full max-w-7xl mb-10 text-center">
        
        <h1 className="text-3xl md:text-4xl font-bold">
          Results for <span className="text-yellow-500">"{query}"</span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Found {movies.length} movies
        </p>
      </div>

      {/* Grid Layout (Matches Home Page) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-7xl">
        {movies.map((movie: any) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="min-w-0 group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:border-yellow-500 dark:hover:border-yellow-500 transform transition duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            
            <div className="relative aspect-[2/3] w-full">
              {movie.poster_path ? (
                <img 
                  src={IMAGE_BASE_URL + movie.poster_path} 
                  alt={movie.title}
                  className="w-full h-full object-cover" 
                />
              ) : (
                // Fallback for movies without posters
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>

            <div className="p-4">
              <h2 className="text-sm md:text-lg font-bold truncate text-gray-900 dark:text-gray-100 group-hover:text-yellow-500 transition-colors">
                {movie.title}
              </h2>
              
              <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1 text-yellow-500">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                <span>{movie.release_date?.split('-')[0]}</span>
              </div>
              
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 line-clamp-2">
                {movie.overview}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}