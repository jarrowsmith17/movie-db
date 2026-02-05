'use client';

import { useState } from 'react';
import { submitRequest } from '@/app/actions/requests';

type RequestButtonProps = {
  tmdbId: string;
  title: string;
  posterPath: string | null;
  type: 'MOVIE' | 'TV';
};

export default function RequestButton({ tmdbId, title, posterPath, type }: RequestButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleRequest = async () => {
    setStatus('loading');
    try {
      await submitRequest(tmdbId, title, posterPath, type);
      setStatus('success');
      // Reset after 3 seconds so they can see the success state
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <button disabled className="bg-green-500/20 text-green-400 px-6 py-3 rounded-xl font-bold border border-green-500/50 flex items-center gap-2 transition-all">
        <span>✅</span> Requested
      </button>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={status === 'loading'}
      className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
    >
      {status === 'loading' ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Requesting...
        </>
      ) : (
        <>
          <span>📩</span> Request {type === 'MOVIE' ? 'Movie' : 'TV Show'}
        </>
      )}
    </button>
  );
}