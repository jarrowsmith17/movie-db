'use client';

import { useRef } from 'react';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

type Props = {
  episodes: any[];
};

export default function EpisodeCarousel({ episodes }: Props) {
  if (!episodes || episodes.length === 0) return null;

  // 1. Add the scroll reference
  const rowRef = useRef<HTMLDivElement>(null);

  // 2. Add the scroll logic
  const handleClick = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth, scrollLeft } = rowRef.current;
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative mb-10 md:-ml-2">
      
      {/* --- LEFT BUTTON --- */}
      <button 
        onClick={() => handleClick('left')}
        className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125 bg-black/50 rounded-full flex items-center justify-center text-white border border-gray-600 hidden md:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* --- CAROUSEL CONTAINER --- */}
      <div 
        ref={rowRef}
        className="flex overflow-x-scroll gap-4 pb-4 md:p-2 scroll-smooth snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {episodes.map((ep) => (
          <div key={ep.id} className="min-w-[280px] md:min-w-[320px] snap-start bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex flex-col group/card transition duration-200 ease-out md:hover:scale-[1.02]">
            
            {/* Episode Image */}
            <div className="relative aspect-video w-full bg-gray-800">
              {ep.still_path ? (
                <img 
                  src={IMAGE_BASE_URL + ep.still_path} 
                  alt={ep.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white backdrop-blur-sm">
                Ep {ep.episode_number}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h4 className="text-white font-bold text-sm mb-1 truncate group-hover/card:text-yellow-500 transition-colors">
                {ep.name}
              </h4>
              <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                {ep.overview || "No description available."}
              </p>
              
              <div className="mt-auto pt-3 text-xs text-gray-500 border-t border-gray-800 flex justify-between">
                <span>{ep.air_date?.split('-').reverse().join('/')}</span>
                <span>{ep.runtime ? `${ep.runtime} min` : ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- RIGHT BUTTON --- */}
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