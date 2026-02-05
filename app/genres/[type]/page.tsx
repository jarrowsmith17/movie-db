import Navbar from '@/components/Navbar';
import Link from 'next/link';

async function getGenres(type: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.TMDB_API_KEY}&language=en-GB`
  );
  return res.json();
}

export default async function GenreIndexPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const { genres } = await getGenres(resolvedParams.type);
  const isMovie = resolvedParams.type === 'movie';

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar variant="default" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <header className="mb-12 border-l-4 border-yellow-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Browse by {isMovie ? 'Film' : 'TV'} Genre
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Select a category to find your next watch.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre: any) => (
            <Link
              key={genre.id}
              href={`/genres/${resolvedParams.type}/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="group relative h-32 flex items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all hover:border-yellow-500 hover:scale-[1.02]"
            >
              {/* Decorative background element */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="relative z-10 text-xl font-bold group-hover:text-yellow-500 transition-colors uppercase tracking-wider">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}