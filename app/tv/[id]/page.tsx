import { prisma } from '@/lib/prisma';
import MediaHero from '@/components/MediaHero';
import CastCarousel from '@/components/CastCarousel';
import MovieCarousel from '@/components/MovieCarousel';
import EpisodeCarousel from '@/components/EpisodeCarousel';
import SeasonSelector from '@/components/SeasonSelector';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getShowDetails = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&append_to_response=videos,credits,recommendations,seasons`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Failed to fetch show');
  return res.json();
};

const getSeasonDetails = async (tvId: string, seasonNumber: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&append_to_response=credits`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string }>;
}

export default async function TVPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const show = await getShowDetails(resolvedParams.id);
  const session = await getServerSession(authOptions);
  
  // SAFE DATABASE CHECK
  let existingRequest = null;
  let isInWatchlist = false;

  try {
    // 1. Check Request (Latest)
    // CHANGED: Added orderBy to get the most recent request
    existingRequest = await prisma.request.findFirst({
      where: { 
        tmdbId: Number(resolvedParams.id), 
        type: 'TV' 
      },
      orderBy: { createdAt: 'desc' }, // GET LATEST
      select: { status: true }
    });

    // 2. Check Watchlist
    if (session?.user?.id) {
       const watchlistEntry = await prisma.watchlist.findUnique({
          where: {
             userId_tmdbId_type: {
                userId: session.user.id,
                tmdbId: Number(resolvedParams.id),
                type: 'TV'
             }
          }
       });
       isInWatchlist = !!watchlistEntry;
    }
  } catch (error) {
    console.error("Database check failed:", error);
  }

  const seasonToFetch = resolvedSearchParams.season 
    ? parseInt(resolvedSearchParams.season) 
    : (show.seasons?.[0]?.season_number || 1);

  const seasonData = await getSeasonDetails(resolvedParams.id, seasonToFetch);
  const castToDisplay = seasonData?.credits?.cast || show.credits?.cast;

  const trailer = show.videos?.results.find(
    (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white pb-20">
      <MediaHero 
        media={show} 
        type="tv" 
        requestStatus={existingRequest?.status} 
        isInWatchlist={isInWatchlist} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            {trailer && (
              <section>
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-4">Official Trailer</h2>
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="YouTube video player"
                    allowFullScreen className="border-0"
                  />
                </div>
              </section>
            )}

            {show.seasons && show.seasons.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Episodes</h2>
                  <SeasonSelector seasons={show.seasons} tvId={show.id} />
                </div>
                {seasonData && <EpisodeCarousel key={seasonToFetch} episodes={seasonData.episodes} />}
              </section>
            )}

            {castToDisplay && castToDisplay.length > 0 && (
              <CastCarousel key={seasonToFetch} cast={castToDisplay} />
            )}
          </div>

          <div className="space-y-8">
             <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-bold text-white">Show Info</h3>
                <div className="space-y-4">
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Status</span>
                      <span className="text-white">{show.status}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Network</span>
                      <span className="text-white">{show.networks?.[0]?.name}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Type</span>
                      <span className="text-white">{show.type}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {show.recommendations?.results.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Shows</h2>
            <MovieCarousel movies={show.recommendations.results} />
          </section>
        )}
      </div>
    </div>
  );
}