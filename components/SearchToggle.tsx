'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const currentType = searchParams.get('type') || 'movie';

  const handleToggle = (type: 'movie' | 'tv') => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  };

  return (
    <div className="flex bg-gray-900 rounded-xl p-1.5 border border-gray-800 w-fit mb-8">
      <button 
        onClick={() => handleToggle('movie')}
        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
          currentType === 'movie' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
        }`}
      >
        Movies
      </button>
      <button 
        onClick={() => handleToggle('tv')}
        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
          currentType === 'tv' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
        }`}
      >
        TV Shows
      </button>
    </div>
  );
}