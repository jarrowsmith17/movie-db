import { prisma } from '@/lib/prisma';
import MediaHero from '@/components/MediaHero';
import CastCarousel from '@/components/CastCarousel';
import MovieCarousel from '@/components/MovieCarousel';
import EpisodeCarousel from '@/components/EpisodeCarousel';
import SeasonSelector from '@/components/SeasonSelector';
import ReviewList from '@/components/ReviewList';
import ExpandableBio from '@/components/ExpandableBio';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fetchers
const getShowDetails = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&append_to_response=videos,credits,recommendations,seasons,watch/providers`,
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
  const tvId = Number(resolvedParams.id);
  
  // 1. KICK OFF PARALLEL REQUESTS
  const showPromise = getShowDetails(resolvedParams.id);
  const sessionPromise = getServerSession(authOptions);

  const allReviewsPromise = prisma.review.findMany({
     where: { tmdbId: tvId, type: 'TV' },
     include: { user: { select: { username: true, name: true } } },
     orderBy: { createdAt: 'desc' }
  });

  const requestPromise = prisma.request.findFirst({
    where: { tmdbId: tvId, type: 'TV' },
    orderBy: { createdAt: 'desc' }, 
    select: { status: true }
  });

  // 2. Await Session to determine user-specific fetches
  const session = await sessionPromise;

  let watchlistPromise = Promise.resolve(null);
  let userReviewPromise = Promise.resolve(null);

  if (session?.user?.id) {
    watchlistPromise = prisma.watchlist.findUnique({
       where: {
         userId_tmdbId_type: {
            userId: session.user.id,
            tmdbId: tvId,
            type: 'TV'
         }
       }
    }) as any;

    userReviewPromise = prisma.review.findUnique({
       where: {
         userId_tmdbId_type: {
            userId: session.user.id,
            tmdbId: tvId,
            type: 'TV'
         }
       },
       select: { rating: true, content: true }
    }) as any;
  }

  // 3. AWAIT EVERYTHING
  const [show, allReviews, existingRequest, watchlistEntry, userReview] = await Promise.all([
    showPromise,
    allReviewsPromise,
    requestPromise,
    watchlistPromise,
    userReviewPromise
  ]);

  // 4. FETCH SEASON DATA (Dependent on 'show' or 'searchParams')
  // If we have a param, use it. If not, use the show's first season number.
  const seasonToFetch = resolvedSearchParams.season 
    ? parseInt(resolvedSearchParams.season) 
    : (show.seasons?.[0]?.season_number || 1);

  const seasonData = await getSeasonDetails(resolvedParams.id, seasonToFetch);

  // 5. PARSE DATA
  const isInWatchlist = !!watchlistEntry;
  const castToDisplay = seasonData?.credits?.cast || show.credits?.cast;

  // Dates
  const firstAired = show.first_air_date 
    ? new Date(show.first_air_date).toLocaleDateString('en-GB') 
    : 'TBA';

  const lastAired = show.last_air_date
    ? new Date(show.last_air_date).toLocaleDateString('en-GB')
    : 'TBA';

  // Streaming (UK)
  const ukProviders = show['watch/providers']?.results?.GB;
  const streamingList = ukProviders?.flatrate?.map((p: any) => p.provider_name).join(', ')
                      || ukProviders?.free?.map((p: any) => p.provider_name).join(', ')
                      || "Not available";

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
        userReview={userReview}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            
            {/* --- NEW OVERVIEW SECTION --- */}
            <section>
               <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">Overview</h2>
               <ExpandableBio bio={show.overview || "No overview available."} />
            </section>
            {/* --------------------------- */}

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
                   <div><span className="block text-gray-500 text-xs uppercase">Status</span><span className="text-white">{show.status}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">First Aired</span><span className="text-white">{firstAired}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Most Recent Episode</span><span className="text-white">{lastAired}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Network</span><span className="text-white">{show.networks?.[0]?.name}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Streaming (UK)</span><span className="text-white text-sm leading-relaxed">{streamingList}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Type</span><span className="text-white">{show.type}</span></div>
                </div>
             </div>
          </div>
        </div>

        <ReviewList reviews={allReviews} />

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