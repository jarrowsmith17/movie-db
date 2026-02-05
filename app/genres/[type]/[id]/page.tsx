import Navbar from '@/components/Navbar';
import Link from 'next/link';
import GenreSwapper from '../../../../components/GenreSwapper';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Server-side data fetching for better performance
async function getGenreData(type: string, id: string) {
  const pageRequests = [1, 2, 3, 4, 5].map(page =>
    fetch(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&region=GB&sort_by=popularity.desc&with_genres=${id}&with_original_language=en&page=${page}`,
      { next: { revalidate: 3600 } }
    ).then(res => res.json())
  );
  
  const pages = await Promise.all(pageRequests);
  const content = pages.flatMap(p => p.results).filter(i => i.poster_path).slice(0, 100);
  
  const gRes = await fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.TMDB_API_KEY}&language=en-GB`);
  const gData = await gRes.json();

  return { content, genres: gData.genres };
}

type Props = {
  params: Promise<{ type: string, id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function GenreResultsPage({ params, searchParams }: Props) {
  // Properly unwrap the async params
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { content, genres } = await getGenreData(resolvedParams.type, resolvedParams.id);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />

      {/* The Scrollable Genre Bar (Client Component) */}
      <GenreSwapper 
        genres={genres} 
        type={resolvedParams.type} 
        currentId={resolvedParams.id} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <header className="mb-12 border-l-4 border-yellow-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
             {resolvedSearchParams.name} {resolvedParams.type === 'movie' ? 'Films' : 'Shows'}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">The UK's top 100 trending in this category.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {content.map((item: any, index: number) => {
            const title = item.title || item.name;
            const year = (item.release_date || item.first_air_date)?.split('-')[0] || 'TBA';
            const href = resolvedParams.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

            return (
              <Link key={item.id} href={href} className="group relative flex flex-col gap-3 transition-transform hover:scale-105">
                <div className="absolute -top-2 -left-2 z-20 bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-black shadow-xl border-2 border-gray-950 text-xs">
                  #{index + 1}
                </div>
                <div className="relative aspect-[2/3] w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-yellow-500 transition-colors">{title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{year}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}