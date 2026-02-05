import Navbar from '@/components/Navbar';
import Link from 'next/link';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const getTopRatedTV = async () => {
  const pageRequests = [1, 2, 3, 4, 5].map(page =>
    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-GB&sort_by=vote_average.desc&vote_count.gte=5000&with_original_language=en&page=${page}`,
      { next: { revalidate: 86400 } }
    ).then(res => res.json())
  );

  const pages = await Promise.all(pageRequests);
  return pages.flatMap(page => page.results).slice(0, 100);
};

export default async function TopRatedTVPage() {
  const shows = await getTopRatedTV();

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400 border-green-400';
    if (rating >= 7) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <header className="mb-12 border-l-4 border-yellow-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Top Rated TV</h1>
          <p className="text-gray-500 mt-2 font-medium">Acclaimed English-language series with 5,000+ ratings.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {shows.map((show: any, index: number) => (
            <Link key={show.id} href={`/tv/${show.id}`} className="group relative flex flex-col gap-3 transition-transform hover:scale-105">
              <div className="absolute -top-3 -left-3 z-20 bg-yellow-500 text-black w-9 h-9 rounded-full flex items-center justify-center font-black shadow-2xl border-2 border-gray-950 text-sm">#{index + 1}</div>
              <div className="relative aspect-[2/3] w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                <img src={IMAGE_BASE_URL + show.poster_path} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 bg-black/90 backdrop-blur-md flex items-center justify-center text-xs font-bold ${getRatingColor(show.vote_average)}`}>{show.vote_average.toFixed(1)}</div>
              </div>
              <div className="px-1">
                <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-yellow-500 transition-colors">{show.name}</h3>
                <p className="text-gray-500 text-xs mt-1 font-medium">{show.first_air_date?.split('-')[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}