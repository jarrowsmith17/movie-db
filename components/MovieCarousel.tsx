'use client'; 

import Link from 'next/link';
import { useRef } from 'react';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

type Props = {
  movies: any[]; // Now accepts Movies or TV Shows
  showFullDate?: boolean;
  showRanking?: boolean;
};

export default function MovieCarousel({ 
  movies, 
  showFullDate = false, 
  showRanking = false 
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleClick = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth, scrollLeft } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="group relative md:-ml-2">
      
      {/* LEFT BUTTON */}
      <button 
        onClick={() => handleClick('left')}
        className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125 bg-black/50 rounded-full flex items-center justify-center text-white border border-gray-600 hidden md:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* CAROUSEL CONTAINER */}
      <div 
        ref={rowRef}
        className="flex items-center space-x-2.5 overflow-x-scroll md:space-x-4 md:p-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {movies.map((item, index) => {
          // 1. Determine if it's TV or Movie
          const isTV = item.media_type === 'tv' || item.name;
          const title = item.title || item.name; // TV uses 'name', Movies use 'title'
          const date = item.release_date || item.first_air_date;
          const linkHref = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

          return (
            <Link 
              href={linkHref} 
              key={item.id} 
              className="min-w-[160px] md:min-w-[200px] cursor-pointer transition duration-200 ease-out md:hover:scale-105 group/card relative"
            >
              <div className="relative aspect-[2/3] w-full mb-2 overflow-hidden rounded-sm md:rounded">
                
                {/* RANKING BADGE */}
                {showRanking && (
                   <div className="absolute top-0 left-0 z-10 bg-gradient-to-br from-black/90 via-black/50 to-transparent px-3 py-1 rounded-br-2xl pointer-events-none">
                       <span className="text-white font-extrabold text-3xl md:text-4xl drop-shadow-lg leading-none italic tracking-tighter font-outline-2">
                          #{index + 1}
                       </span>
                   </div>
                )}

                {item.poster_path ? (
                  <img 
                    src={IMAGE_BASE_URL + item.poster_path}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
              
              <h2 className="text-sm font-bold truncate text-gray-200 group-hover/card:text-white">
                {title}
              </h2>
               
              <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★ {item.vote_average?.toFixed(1)}</span>
                    {/* ✅ TYPE INDICATOR (Small text next to rating) */}
                    <span className="text-[10px] uppercase tracking-wider border border-gray-700 px-1 rounded text-gray-500">
                      {isTV ? 'TV' : 'Film'}
                    </span>
                  </div>

                  <span>
                    {showFullDate 
                      ? formatDate(date) 
                      : date?.split('-')[0]}
                  </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* RIGHT BUTTON */}
      <button 
        onClick={() => handleClick('right')}
        className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125 bg-black/50 rounded-full flex items-center justify-center text-white border border-gray-600 hidden md:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

    </div>
  );
}