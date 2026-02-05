'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Search from './Search';
import { usePathname } from 'next/navigation';

type NavbarProps = {
  variant?: 'default' | 'overlay';
};

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Closes the menu automatically when the user clicks a link and the path changes.
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubMenu(null);
  }, [pathname]);

  const menuItems = {
    films: [
      { name: 'Top Rated', href: '/search?q=top+rated&type=movie' },
      { name: 'Popular', href: '/search?q=popular&type=movie' },
      { name: 'Categories', href: '/genres/movie' },
      { name: 'New Releases', href: '/search?q=2026&type=movie' },
    ],
    tv: [
      { name: 'Top Rated', href: '/search?q=top+rated&type=tv' },
      { name: 'Popular', href: '/search?q=popular&type=tv' },
      { name: 'Categories', href: '/genres/tv' },
      { name: 'New Releases', href: '/search?q=2026&type=tv' },
    ]
  };

  const navLinks = [
    { name: 'Log', href: '/log' },
    { name: 'Watchlist', href: '/watchlist' },
    { name: 'Requests', href: '/requests' },
    { name: 'Inbox', href: '/inbox' },
  ];

  // Logic to handle transparent vs solid backgrounds depending on the page type.
  const wrapperClasses = variant === 'overlay'
    ? "absolute top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 md:py-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2"
    : "w-full max-w-7xl mx-auto px-4 md:px-10 py-4 md:py-6 flex items-center justify-between gap-2 z-[100] relative";

  return (
    <>
      <nav className={wrapperClasses}>
        
        {/* LEFT COLUMN: Contains the Hamburger */}
        <div className="flex-1 flex items-center justify-start">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-yellow-500 transition-colors p-1"
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* CENTER COLUMN: The Logo */}
        {/* shrink-0 ensures the logo doesn't get squashed on small screens */}
        <Link 
          href="/" 
          className="flex-none text-xl md:text-2xl font-black text-yellow-500 hover:text-yellow-200 transition-colors drop-shadow-md tracking-tighter px-2"
        >
          MOVIE-DB
        </Link>

        {/* RIGHT COLUMN: Search (Desktop) or Spacer (Mobile) */}
        <div className="flex-1 flex items-center justify-end">
          {/* Only shows the search component on screens wider than mobile */}
          <div className="w-full max-w-md hidden md:block">
            <Search />
          </div>
          
          {/* This empty div matches the size of the hamburger button to keep the logo perfectly centered on mobile */}
          <div className="w-8 h-8 md:hidden" />
        </div>
      </nav>

      {/* --- SLIDE-OUT MENU OVERLAY --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex">
          {/* Overlay background that closes the menu when clicked */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="relative w-[300px] h-full bg-gray-950 border-r border-gray-800 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Search: Appears inside the menu for mobile users since we hid it from the navbar */}
            <div className="mt-10 mb-8 md:hidden">
              <Search />
            </div>

            <div className="flex flex-col gap-6 mt-10">
              <Link href="/" className="text-xl font-bold text-white hover:text-yellow-500">Home</Link>

              {/* Films Accordion */}
              <div>
                <button 
                  onClick={() => setActiveSubMenu(activeSubMenu === 'films' ? null : 'films')}
                  className="flex items-center justify-between w-full text-xl font-bold text-white hover:text-yellow-500"
                >
                  Films
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 transition-transform ${activeSubMenu === 'films' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {activeSubMenu === 'films' && (
                  <div className="flex flex-col gap-3 mt-4 ml-4 border-l-2 border-gray-800 pl-4">
                    {menuItems.films.map((item) => (
                      <Link key={item.name} href={item.href} className="text-gray-400 hover:text-yellow-500 text-sm font-medium">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* TV Shows Accordion */}
              <div>
                <button 
                  onClick={() => setActiveSubMenu(activeSubMenu === 'tv' ? null : 'tv')}
                  className="flex items-center justify-between w-full text-xl font-bold text-white hover:text-yellow-500"
                >
                  TV Shows
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 transition-transform ${activeSubMenu === 'tv' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {activeSubMenu === 'tv' && (
                  <div className="flex flex-col gap-3 mt-4 ml-4 border-l-2 border-gray-800 pl-4">
                    {menuItems.tv.map((item) => (
                      <Link key={item.name} href={item.href} className="text-gray-400 hover:text-yellow-500 text-sm font-medium">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-800 my-2" />

              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-xl font-bold text-white hover:text-yellow-500 flex items-center justify-between"
                >
                  {link.name}
                  {/* Notification badge placeholders for Inbox and Requests */}
                  {(link.name === 'Inbox' || link.name === 'Requests') && (
                    <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-black">0</span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Logged in as</p>
              <p className="text-white text-sm font-bold">Admin User</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}