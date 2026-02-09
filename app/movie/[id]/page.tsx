import { prisma } from '@/lib/prisma';
import MediaHero from '@/components/MediaHero';
import CastCarousel from '@/components/CastCarousel';
import MovieCarousel from '@/components/MovieCarousel';
import ReviewList from '@/components/ReviewList'; 
import ExpandableBio from '@/components/ExpandableBio'; // <--- 1. Import this
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getMovie = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&append_to_response=videos,credits,recommendations,release_dates,watch/providers`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
};

type Props = {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: Props) {
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);
  const session = await getServerSession(authOptions);

  // SAFE DATABASE CHECK
  let existingRequest = null;
  let isInWatchlist = false;
  let userReview = null;

  try {
    existingRequest = await prisma.request.findFirst({
      where: { 
        tmdbId: Number(resolvedParams.id), 
        type: 'MOVIE' 
      },
      orderBy: { createdAt: 'desc' },
      select: { status: true }
    });

    if (session?.user?.id) {
       // Check Watchlist
       const watchlistEntry = await prisma.watchlist.findUnique({
          where: {
             userId_tmdbId_type: {
                userId: session.user.id,
                tmdbId: Number(resolvedParams.id),
                type: 'MOVIE'
             }
          }
       });
       isInWatchlist = !!watchlistEntry;

       // Check User Review
       userReview = await prisma.review.findUnique({
          where: {
             userId_tmdbId_type: {
                userId: session.user.id,
                tmdbId: Number(resolvedParams.id),
                type: 'MOVIE'
             }
          },
          select: { rating: true, content: true }
       });
    }

  } catch (error) {
    console.error("Database connection failed:", error);
  }

  // Fetch ALL reviews for this movie
  const allReviews = await prisma.review.findMany({
     where: {
        tmdbId: Number(resolvedParams.id),
        type: 'MOVIE'
     },
     include: {
        user: { select: { username: true, name: true } }
     },
     orderBy: { createdAt: 'desc' }
  });

  // --- UK DATES LOGIC ---
  const ukReleases = movie.release_dates?.results.find((r: any) => r.iso_3166_1 === 'GB');
  
  const digitalRelease = ukReleases?.release_dates.find((d: any) => d.type === 4);
  const digitalDate = digitalRelease?.release_date 
    ? new Date(digitalRelease.release_date).toLocaleDateString('en-GB') 
    : 'TBA';

  const theatricalRelease = ukReleases?.release_dates.find((d: any) => d.type === 3);
  const theatricalDate = theatricalRelease?.release_date
    ? new Date(theatricalRelease.release_date).toLocaleDateString('en-GB')
    : 'TBA';

  // --- STREAMING (UK) LOGIC ---
  const ukProviders = movie['watch/providers']?.results?.GB;
  const streamingList = ukProviders?.flatrate?.map((p: any) => p.provider_name).join(', ')
                     || ukProviders?.free?.map((p: any) => p.provider_name).join(', ')
                     || "Not available";
  // -----------------------------

  const trailer = movie.videos?.results.find(
    (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white pb-20">
      <MediaHero 
        media={movie} 
        type="movie" 
        requestStatus={existingRequest?.status} 
        isInWatchlist={isInWatchlist} 
        userReview={userReview}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
             
             {/* --- NEW PLOT SECTION --- */}
             <section>
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">Overview</h2>
                <ExpandableBio bio={movie.overview || "No plot overview available."} />
             </section>
             {/* ------------------------ */}

             {trailer && (
                <section>
                   <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-4">Official Trailer</h2>
                   <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailer.key}`} title="Trailer" allowFullScreen className="border-0" />
                   </div>
                </section>
             )}
             <CastCarousel cast={movie.credits?.cast} />
          </div>

          <div className="space-y-8">
             <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-bold text-white">Details</h3>
                <div className="space-y-4">
                   <div><span className="block text-gray-500 text-xs uppercase">Status</span><span className="text-white">{movie.status}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Budget</span><span className="text-white">{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : '-'}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Revenue</span><span className="text-white">{movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : '-'}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Theatrical Release (UK)</span><span className="text-white">{theatricalDate}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Digital Release (UK)</span><span className="text-white">{digitalDate}</span></div>
                   <div><span className="block text-gray-500 text-xs uppercase">Streaming (UK)</span><span className="text-white text-sm leading-relaxed">{streamingList}</span></div>
                </div>
             </div>
          </div>
        </div>

        <ReviewList reviews={allReviews} />

        {movie.recommendations?.results.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related Movies</h2>
            <MovieCarousel movies={movie.recommendations.results} />
          </section>
        )}
      </div>
    </div>
  );
}