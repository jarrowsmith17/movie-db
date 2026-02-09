'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

// Define the props interface to accept the close callback
interface SearchProps {
  onSearch?: () => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      
      // FIX: Trigger the callback to close the mobile menu
      if (onSearch) onSearch();

      // Default to 'movie' for new searches from the bar
      router.push(`/search?q=${encodeURIComponent(query)}&type=movie`);
      setQuery('');
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      // Quick preview uses Multi-search for variety
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-GB&query=${query}&include_adult=false`
        );
        const data = await res.json();
        const filtered = data.results?.filter((item: any) => item.media_type !== 'person').slice(0, 6);
        setResults(filtered || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search preview failed", error);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies or shows..."
          // FIX: text-[16px] prevents iOS zoom on focus, md:text-sm is for desktop
          className="w-full bg-gray-900/80 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500 text-[16px] md:text-sm"
        />
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 rounded-lg font-bold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl">
          {results.map((item: any) => {
            const isTV = item.media_type === 'tv';
            const title = item.title || item.name;
            const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
            return (
              <Link 
                key={item.id} 
                href={href} 
                onClick={() => {
                  setIsOpen(false);
                  // FIX: Trigger the callback when clicking a result
                  if (onSearch) onSearch();
                }} 
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 border-b border-gray-800/50 last:border-0"
              >
                <div className="w-8 h-12 bg-gray-800 rounded overflow-hidden shrink-0">
                  {item.poster_path && <img src={IMAGE_BASE_URL + item.poster_path} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">{title}</h4>
                  <p className="text-gray-500 text-[10px] uppercase font-bold">{item.media_type === 'tv' ? 'TV Show' : 'Film'}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}