'use client';

import Link from 'next/link';
import { toggleWatchlist } from '@/app/actions/watchlist';
import { useRouter } from 'next/navigation';

type Props = {
  item: {
    tmdbId: number;
    title: string;
    poster: string | null;
    type: string;
  }
}

export default function WatchlistCard({ item }: Props) {
  const router = useRouter();
  const link = item.type === 'MOVIE' ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the movie page
    if (confirm('Remove from watchlist?')) {
      await toggleWatchlist(item.tmdbId, item.type as 'MOVIE'|'TV', item.title, item.poster);
      router.refresh();
    }
  };

  return (
    <div className="group relative">
      <Link href={link} className="block aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-yellow-500/50">
        {item.poster ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${item.poster}`} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 font-bold uppercase tracking-widest text-xs p-4 text-center">
            No Image
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold truncate drop-shadow-md text-sm">{item.title}</p>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">{item.type}</p>
        </div>
      </Link>

      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500"
        title="Remove from Watchlist"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}