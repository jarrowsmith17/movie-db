'use client';

import { useState, useRef, useEffect } from 'react';

export default function ExpandableBio({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current) return;
      
      // We only measure truncation when the text is collapsed.
      // (When expanded, scrollHeight equals clientHeight, so we can't detect overflow).
      if (!isExpanded) {
        // If scrollHeight > clientHeight, it means lines are being hidden
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };

    // Run initial check
    checkTruncation();

    // Re-check on resize (handles phone rotation etc.)
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [bio, isExpanded]);

  return (
    <div className="relative">
      <p 
        ref={textRef}
        className={`text-gray-300 leading-relaxed text-lg transition-all ${
          isExpanded ? '' : 'line-clamp-3 md:line-clamp-none'
        }`}
      >
        {bio}
      </p>
      
      {/* Only render button if truncation was detected */}
      {isTruncated && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-yellow-500 text-sm font-bold uppercase tracking-widest hover:underline md:hidden"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}