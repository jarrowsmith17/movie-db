'use client';

import Link from 'next/link';
import Navbar from './Navbar';
import RequestButton from './RequestButton';
import WatchlistButton from './WatchlistButton';
import ReviewButton from './ReviewButton'; // New Import
import { useSession } from 'next-auth/react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

type MediaHeroProps = {
  media: any;
  type: 'movie' | 'tv';
  requestStatus?: string | null;
  isInWatchlist?: boolean;
  // New Prop
  userReview?: {
     rating: number;
     content: string | null;
  } | null;
};

export default function MediaHero({ 
  media, 
  type, 
  requestStatus, 
  isInWatchlist = false, 
  userReview // Destructure new prop
}: MediaHeroProps) {
  const { data: session } = useSession();

  const getRatingColor = (rating: number) => {
    if (!rating) return 'text-gray-400 border-gray-400';
    if (rating >= 7) return 'text-green-400 border-green-400';
    if (rating >= 5) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const title = type === 'movie' ? media?.title : media?.name;
  const date = type === 'movie' ? media?.release_date : media?.first_air_date;
  const year = date ? date.split('-')[0] : 'TBA';

  const director = media?.credits?.crew?.find((p: any) => p.job === 'Director');
  const creator = media?.created_by?.length > 0 ? media?.created_by[0] : null;

  return (
    <div className="relative w-full min-h-[650px] h-[75vh] md:h-[85vh] overflow-hidden">
      <Navbar variant="overlay" />

      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: media?.backdrop_path ? `url(${IMAGE_BASE_URL + media.backdrop_path})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
      </div>

      <div className="relative z-10 grid grid-rows-[1fr_auto] h-full max-w-7xl mx-auto px-4 md:px-10 pb-12">
        <div className="pointer-events-none" />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter drop-shadow-2xl leading-tight text-white">
            {title} 
            <span className="text-xl md:text-4xl text-gray-400 font-normal ml-3 block md:inline not-italic tracking-normal">
              ({year})
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 font-bold bg-black/60 backdrop-blur-md ${getRatingColor(media?.vote_average)}`}>
              {media?.vote_average?.toFixed(1) || '0.0'}
            </div>
            
            <span className="text-gray-300 text-sm font-black uppercase tracking-widest italic">
              {type === 'movie' ? `${media?.runtime || 0} min` : `${media?.number_of_seasons || 0} Seasons`}
            </span>

            <div className="flex gap-2 flex-wrap">
              {media?.genres?.map((g: any) => (
                <span key={g.id} className="border border-white/20 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] md:text-xs text-gray-200 uppercase font-bold tracking-tight">
                  {g.name}
                </span>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            {session && (
              <div className="ml-0 md:ml-4 flex items-center gap-4">
                 <WatchlistButton 
                    tmdbId={media?.id}
                    title={title}
                    posterPath={media?.poster_path}
                    type={type === 'movie' ? 'MOVIE' : 'TV'}
                    initialState={isInWatchlist}
                 />
                 
                 {/* New Review Button */}
                 <ReviewButton 
                    tmdbId={media?.id}
                    title={title}
                    posterPath={media?.poster_path}  // <--- CRITICAL: Must be media.poster_path (from TMDB)
                    type={type === 'movie' ? 'MOVIE' : 'TV'}
                    initialRating={userReview?.rating}
                    initialReview={userReview?.content}
                  />

                 <RequestButton 
                    tmdbId={media?.id?.toString() || ""}
                    title={title || ""}
                    posterPath={media?.poster_path || ""}
                    type={type === 'movie' ? 'MOVIE' : 'TV'}
                    status={requestStatus} 
                 />
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            {media?.tagline && (
              <p className="text-yellow-500 italic text-sm md:text-lg mb-2 drop-shadow-md border-l-2 border-yellow-500 pl-3">
                "{media.tagline}"
              </p>
            )}
            
            <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight mb-1 text-white mt-4">Overview</h3>
            <p className="text-gray-200 leading-relaxed text-sm md:text-lg line-clamp-3 md:line-clamp-none drop-shadow-md font-medium">
              {media?.overview || "No overview available."}
            </p>

            {(director || creator) && (
              <p className="mt-4 text-sm text-gray-400 uppercase font-bold tracking-widest">
                <span className="text-white">{type === 'movie' ? 'Director' : 'Created By'}:</span>{' '}
                <Link 
                  href={`/person/${type === 'movie' ? director?.id : creator?.id}`}
                  className="hover:text-yellow-500 transition-colors underline decoration-gray-600 underline-offset-4 hover:decoration-yellow-500"
                >
                  {type === 'movie' ? director?.name : creator?.name}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}