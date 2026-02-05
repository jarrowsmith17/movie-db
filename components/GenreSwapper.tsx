'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export default function GenreSwapper({ genres, type, currentId }: { genres: any[], type: string, currentId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Checks if the user has scrolled away from the start to show/hide the left arrow
  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gray-950/90 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative group">
        
        {/* Left Arrow: Hidden on mobile, appears on scroll for desktop */}
        {canScrollLeft && (
          <div className="absolute left-4 top-0 bottom-0 flex items-center z-20 pointer-events-none md:block hidden">
            <button 
              onClick={() => scroll('left')}
              className="pointer-events-auto bg-gray-900/80 border border-gray-700 p-2 rounded-full text-white hover:text-yellow-500 hover:scale-110 transition-all shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
        )}

        {/* The Carousel: no-scrollbar class removes the visual bar */}
        <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 py-4 overflow-x-auto no-scrollbar scroll-smooth items-center"
            style={{ 
                scrollbarWidth: 'none',          /* Firefox */
                msOverflowStyle: 'none',        /* IE/Edge */
                WebkitOverflowScrolling: 'touch' /* Smooth mobile scroll */
            }}
            >
            {/* Add this hidden style block inside the div to target Chrome/Safari specifically */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                display: none !important;
                }
            `}</style>
          {genres.map((g: any) => (
            <Link
              key={g.id}
              href={`/genres/${type}/${g.id}?name=${encodeURIComponent(g.name)}`}
              className={`px-5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border transition-all duration-300 ${
                g.id.toString() === currentId 
                  ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                  : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white hover:border-gray-500'
              }`}
            >
              {g.name}
            </Link>
          ))}
        </div>

        {/* Right Arrow: Fades in on hover of the section */}
        <div className="absolute right-4 top-0 bottom-0 flex items-center z-20 pointer-events-none md:block hidden">
          <button 
            onClick={() => scroll('right')}
            className="pointer-events-auto bg-gray-900/80 border border-gray-700 p-2 rounded-full text-white hover:text-yellow-500 hover:scale-110 transition-all shadow-xl opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}