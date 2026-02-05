'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { submitRequest } from '@/app/actions/requests'; // Uses your Action

type Props = {
  tmdbId: string;
  title: string;
  posterPath: string;
  type: 'MOVIE' | 'TV';
  status?: string | null;
};

export default function RequestButton({ tmdbId, title, posterPath, type, status: initialStatus }: Props) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<string | null>(initialStatus || null);
  const [loading, setLoading] = useState(false);

  // 1. FIX: Check for 'ADDED' (Matches your DB)
  if (status === 'ADDED' || status === 'APPROVED') {
    return (
      <button disabled className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs cursor-default">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <span>Added to Library</span>
      </button>
    );
  }

  // 2. REQUESTED (Blue)
  if (status === 'PENDING') {
    return (
      <button disabled className="flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs cursor-default">
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Requested</span>
      </button>
    );
  }

  // 3. HANDLE CLICK (Server Action)
  const handleRequest = async () => {
    if (!session) return; 
    setLoading(true);
    
    try {
      // Call the Server Action you provided
      await submitRequest(tmdbId, title, posterPath, type);
      setStatus('PENDING');
    } catch (error) {
      console.error('Request failed', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRequest}
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-transform active:scale-95 flex items-center gap-2 group"
    >
      {loading ? (
        <span>Processing...</span>
      ) : (
        <>
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          <span>Request</span>
        </>
      )}
    </button>
  );
}