'use client';

import { useState } from 'react';
import { toggleWatchlist } from '@/app/actions/watchlist';
import { useRouter } from 'next/navigation';

type Props = {
  tmdbId: number;
  type: 'MOVIE' | 'TV';
  title: string;
  posterPath: string | null;
  initialState: boolean;
};

export default function WatchlistButton({ tmdbId, type, title, posterPath, initialState }: Props) {
  const [isInWatchlist, setIsInWatchlist] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      // Call the server action
      const newState = await toggleWatchlist(tmdbId, type, title, posterPath);
      setIsInWatchlist(newState);
      router.refresh(); 
    } catch (error) {
      console.error('Failed to toggle watchlist', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 border ${
        isInWatchlist
          ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
      }`}
    >
      {loading ? (
        <span className="opacity-50">Processing...</span>
      ) : isInWatchlist ? (
        <>
          {/* Minus Icon for Remove */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          <span>Remove</span>
        </>
      ) : (
        <>
          {/* Plus Icon for Add */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          <span>Watchlist</span>
        </>
      )}
    </button>
  );
}