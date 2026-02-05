'use client'; // We need this because Hamburger menus use state (interactivity)

import Link from 'next/link';
import Search from './Search';
import { useState } from 'react';

type NavbarProps = {
  variant?: 'default' | 'overlay'; // 'default' for Home, 'overlay' for Movie Details
};

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Ready for your hamburger logic later!

  // 1. Define styles based on the variant
  // 'overlay' = Absolute position, sitting on top of an image (Movie Page)
  // 'default' = Standard flow, centered container (Home Page)
  const wrapperClasses = variant === 'overlay'
    ? "absolute top-0 left-0 w-full z-50 px-4 md:px-10 py-6 bg-gradient-to-b from-black/80 to-transparent"
    : "w-full max-w-7xl mx-auto px-4 md:px-10 py-6 flex-col md:flex-row"; // Matches your Home Page layout

  return (
    <nav className={`flex flex-row items-center justify-between gap-4 ${wrapperClasses}`}>
      
      {/* --- LOGO --- */}
      <Link 
        href="/" 
        className="text-2xl font-bold text-yellow-500 hover:text-yellow-200 transition-colors drop-shadow-md shrink-0 leading-none -mt-1"
      >
        Movie-db
      </Link>

      {/* --- SEARCH BAR --- */}
      {/* We keep the logic we fixed: smaller on mobile, full size on desktop */}
      <div className="w-[60%] md:w-full md:max-w-md ml-auto flex justify-end">
         <div className="w-full">
           <Search />
         </div>
      </div>

      {/* --- HAMBURGER PLACEHOLDER (Hidden for now) --- */}
      {/* <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white md:hidden">
         Menu
      </button> 
      */}

    </nav>
  );
}