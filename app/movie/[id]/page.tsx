import MediaHero from '@/components/MediaHero';
import CastCarousel from '@/components/CastCarousel';
import MovieCarousel from '@/components/MovieCarousel';

const getMovie = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-GB&append_to_response=videos,credits,recommendations`,
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

  const trailer = movie.videos?.results.find(
    (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white pb-20">
      {/* SHARED HERO COMPONENT */}
      <MediaHero media={movie} type="movie" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            {/* Trailer Embed */}
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

            {/* Cast List */}
            <CastCarousel cast={movie.credits?.cast} />
          </div>

          {/* Sidebar Details */}
          <div className="space-y-8">
             <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-bold text-white">Details</h3>
                <div className="space-y-4">
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Status</span>
                      <span className="text-white">{movie.status}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Budget</span>
                      <span className="text-white">{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : '-'}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 text-xs uppercase">Revenue</span>
                      <span className="text-white">{movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : '-'}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Related Content */}
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