import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ExpandableBio from '../../../components/ExpandableBio';
import MovieCarousel from '@/components/MovieCarousel';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function getPersonData(id: string) {
  const [detailsRes, creditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB`),
    fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}&language=en-GB`)
  ]);

  const details = await detailsRes.json();
  const credits = await creditsRes.json();

  // 1. FILTER & SORT: Remove "Self", Talk Shows, and unreleased noise
  const cast = credits.cast
    .filter((item: any) => 
      item.character && 
      !item.character.toLowerCase().includes("self") && 
      !item.character.toLowerCase().includes("guest") &&
      item.vote_count > 5
    )
    .sort((a: any, b: any) => b.popularity - a.popularity);

  const crew = credits.crew
    .filter((item: any) => item.job === 'Director')
    .sort((a: any, b: any) => b.popularity - a.popularity);

  return { details, cast, crew };
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { details, cast, crew } = await getPersonData(id);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        {/* HEADER SECTION */}
        <div className="flex flex-row gap-6 md:gap-10 items-start mb-12 md:mb-20">
          <div className="w-28 sm:w-32 md:w-64 flex-none">
            <div className="aspect-[2/3] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <img 
                src={`${IMAGE_BASE_URL}${details.profile_path}`} 
                alt={details.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic">
              {details.name}
            </h1>
            
            <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
              <span className="bg-yellow-500 text-black px-2 py-0.5 md:px-3 md:py-1 rounded font-black text-[10px] md:text-xs uppercase italic">
                {details.known_for_department}
              </span>
              <span className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest pt-1 truncate italic">
                {details.place_of_birth || 'Unknown'}
              </span>
            </div>

            <ExpandableBio bio={details.biography} />
          </div>
        </div>

        {/* 2. DIRECTED SECTION: Handles 1 vs Many films */}
        {crew.length > 0 && (
          <section className="mb-20">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-6 border-l-4 border-yellow-500 pl-4 italic">
              Directed by {details.name.split(' ')[0]}
            </h2>
            {crew.length === 1 ? (
              <div className="w-[160px] md:w-[200px]">
                <CreditCard item={crew[0]} />
              </div>
            ) : (
              <MovieCarousel movies={crew} />
            )}
          </section>
        )}

        {/* 3. STARRING SECTION */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-6 border-l-4 border-yellow-500 pl-4 italic">
              Starring {details.name.split(' ')[0]}
            </h2>
            <MovieCarousel movies={cast} />
          </section>
        )}
      </div>
    </main>
  );
}

// 4. CLEANER CREDIT CARD
function CreditCard({ item }: { item: any }) {
  const title = item.title || item.name;
  const type = item.media_type === 'tv' ? 'tv' : 'movie';
  const year = (item.release_date || item.first_air_date)?.split('-')[0] || 'TBA';

  return (
    <Link href={`/${type}/${item.id}`} className="group flex flex-col gap-2 transition-transform hover:scale-105">
      <div className="relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        {item.poster_path ? (
          <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px] italic uppercase">No Poster</div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-xs truncate group-hover:text-yellow-500 transition-colors uppercase italic">{title}</h3>
        <p className="text-gray-500 text-[9px] font-bold uppercase">{year} • {type === 'tv' ? 'Series' : 'Film'}</p>
      </div>
    </Link>
  );
}