'use client';

import { useRef } from 'react';
import Link from 'next/link';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

type Props = {
  cast: any[];
};

export default function CastCarousel({ cast }: Props) {
  if (!cast || cast.length === 0) return null;

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

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-white">Top Cast</h3>
      
      <div className="group relative md:-ml-2">
        
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
          {cast.slice(0, 15).map((actor) => (
            /* WRAPPED IN LINK COMPONENT */
            <Link 
              key={actor.id} 
              href={`/person/${actor.id}`}
              className="min-w-[120px] w-[120px] snap-start flex flex-col text-center transition duration-200 ease-out md:hover:scale-105 group/actor"
            >
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden mb-2 border-2 border-gray-800 mx-auto bg-gray-800 group-hover/actor:border-yellow-500 transition-colors">
                {actor.profile_path ? (
                  <img 
                    src={IMAGE_BASE_URL + actor.profile_path} 
                    alt={actor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-white text-sm font-bold truncate group-hover/actor:text-yellow-500 transition-colors">
                {actor.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {actor.character}
              </p>
            </Link>
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
    </div>
  );
}