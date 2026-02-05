import Navbar from '@/components/Navbar';
import Link from 'next/link';
import SearchToggle from '@/components/SearchToggle';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const getSearchResults = async (query: string, type: string) => {
  const endpoint = type === 'tv' ? 'search/tv' : 'search/movie';
  
  const res = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&query=${encodeURIComponent(query)}&include_adult=false&region=GB`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error('Failed to fetch search results');
  const data = await res.json();
  let results = data.results || [];

  if (results.length === 0) return [];

  // ✅ SAGA PRIORITY LOGIC (Movies)
  if (type === 'movie') {
    const topResult = results[0];
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${topResult.id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB`,
      { next: { revalidate: 3600 } }
    );
    const details = await detailsRes.json();
    const collectionId = details.belongs_to_collection?.id;

    if (collectionId) {
      const collectionRes = await fetch(
        `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${process.env.TMDB_API_KEY}&language=en-GB`,
        { next: { revalidate: 3600 } }
      );
      const collectionData = await collectionRes.json();
      const sagaMovies = collectionData.parts || [];
      const sagaIds = new Set(sagaMovies.map((m: any) => m.id));
      const otherResults = results.filter((m: any) => !sagaIds.has(m.id)).sort((a: any, b: any) => b.popularity - a.popularity);
      return [...sagaMovies, ...otherResults];
    }
  }

  return results.sort((a: any, b: any) => b.popularity - a.popularity);
};

type Props = {
  searchParams: Promise<{ q?: string; type?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || '';
  const searchType = params.type === 'tv' ? 'tv' : 'movie';
  const results = await getSearchResults(query, searchType);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
              Results for: <span className="text-white">"{query}"</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{results.length} titles found</p>
          </div>
          
          {/* THE NEW TOGGLE COMPONENT */}
          <SearchToggle />
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item: any) => {
              const title = item.title || item.name;
              const date = item.release_date || item.first_air_date;
              const year = date ? date.split('-')[0] : 'TBA';
              const href = searchType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

              return (
                <Link key={item.id} href={href} className="group flex flex-col gap-2 transition-transform hover:scale-105">
                  <div className="relative aspect-[2/3] w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                    {item.poster_path ? (
                      <img src={IMAGE_BASE_URL + item.poster_path} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Poster</div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 uppercase">
                      {searchType === 'tv' ? 'TV' : 'Film'}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">{title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                      <span>{year}</span>
                      <span className="text-yellow-500">★ {item.vote_average?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500 text-lg">No {searchType === 'tv' ? 'shows' : 'films'} found for "{query}".</p>
            <Link href="/" className="text-yellow-500 mt-4 inline-block hover:underline">Back to Home</Link>
          </div>
        )}
      </div>
    </main>
  );
}