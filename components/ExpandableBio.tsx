'use client';

import { useState } from 'react';

export default function ExpandableBio({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) return <p className="text-gray-500 text-sm">No biography available.</p>;

  return (
    <div className="max-w-3xl">
      <p className={`text-gray-300 leading-relaxed text-sm md:text-base ${!isExpanded ? 'line-clamp-6 md:line-clamp-none' : ''}`}>
        {bio}
      </p>
      
      {/* Toggle button: Only visible on mobile (hidden on md screens) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden mt-2 text-yellow-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}