'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import Search from './Search';

export default function Navbar({ variant = 'default', unreadCount = 0 }: { variant?: 'default' | 'overlay', unreadCount?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role?.toUpperCase() === 'ADMIN';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubMenu(null);
  }, [pathname]);

  const menuItems = {
    films: [
      { name: 'Popular', href: '/popular' },
      { name: 'Top Rated', href: '/top-rated' },
      { name: 'New Releases', href: '/new-releases' },
      { name: 'Genres', href: '/genres/movie' },
    ],
    tv: [
      { name: 'Popular', href: '/tv-popular' },
      { name: 'Top Rated', href: '/tv-top-rated' },
      { name: 'New', href: '/tv-new' },
      { name: 'Genres', href: '/genres/tv' },
    ]
  };

  const allLinks = [
    { name: 'Log', href: '/log', protected: true },
    { name: 'Watchlist', href: '/watchlist', protected: true },
    { name: 'Requests', href: '/requests', protected: true },
    { name: 'FAQ', href: '/faq', protected: false },
  ]

  const visibleLinks = allLinks.filter(link => 
    !link.protected || (link.protected && session)
  );

  // Background logic
  const isOverlay = variant === 'overlay';
  const bgClass = (isOverlay && !scrolled) 
    ? 'bg-transparent border-transparent' 
    : 'bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl'; 

  // Helper to scroll top
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
          
          {/* MOBILE HAMBURGER */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden text-white hover:text-yellow-500 transition-colors relative p-2 -ml-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            {session && unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse" />}
          </button>

          {/* LOGO (With Scroll To Top) */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase text-center md:text-left cursor-pointer"
          >
            Movie<span className="text-yellow-500">DB</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            
            {/* FILM DROPDOWN */}
            <div className="relative group">
              <button className="text-sm font-bold uppercase tracking-widest text-gray-300 group-hover:text-yellow-500 transition-colors py-6">
                Films
              </button>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 overflow-hidden flex flex-col p-2">
                {menuItems.films.map(item => (
                   <Link key={item.name} href={item.href} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                     {item.name}
                   </Link>
                ))}
              </div>
            </div>

            {/* TV DROPDOWN */}
            <div className="relative group">
              <button className="text-sm font-bold uppercase tracking-widest text-gray-300 group-hover:text-yellow-500 transition-colors py-6">
                TV Shows
              </button>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 overflow-hidden flex flex-col p-2">
                {menuItems.tv.map(item => (
                   <Link key={item.name} href={item.href} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                     {item.name}
                   </Link>
                ))}
              </div>
            </div>

            {visibleLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-yellow-500 transition-colors"
              >
                {link.name}
                {link.name === 'Inbox' && unreadCount > 0 && (
                   <span className="absolute -top-1.5 -right-2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </Link>
            ))}

            <div className="w-64">
              <Search />
            </div>

            {session ? (
               <Link href="/profile" className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xs uppercase hover:bg-yellow-400 transition-colors">
                  {session.user?.name?.[0] || "U"}
               </Link>
            ) : (
               <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-yellow-500">
                  Login
               </Link>
            )}
          </div>

          {/* Spacer for mobile layout balance */}
          <div className="w-8 md:hidden"></div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          
          <div className="relative w-full max-w-[320px] h-full bg-gray-950 border-r border-white/5 flex flex-col p-8 animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-10 mb-8">
              <Search onSearch={() => setIsMenuOpen(false)} />
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar pb-10">
              {/* FILMS */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveSubMenu(activeSubMenu === 'films' ? null : 'films')} 
                  className="text-lg font-bold text-white uppercase tracking-tight w-full flex justify-between items-center group"
                >
                  <span className={activeSubMenu === 'films' ? 'text-yellow-500' : ''}>Films</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeSubMenu === 'films' ? 'rotate-180 text-yellow-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" /></svg>
                </button>
                {activeSubMenu === 'films' && (
                  <div className="flex flex-col gap-2 mt-3 ml-4 border-l border-zinc-800 pl-4 animate-in fade-in slide-in-from-top-1">
                    {menuItems.films.map(i => (
                      <Link key={i.name} href={i.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-500 hover:text-white uppercase tracking-wide transition-colors py-1">{i.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* TV */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveSubMenu(activeSubMenu === 'tv' ? null : 'tv')} 
                  className="text-lg font-bold text-white uppercase tracking-tight w-full flex justify-between items-center group"
                >
                  <span className={activeSubMenu === 'tv' ? 'text-yellow-500' : ''}>TV Shows</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeSubMenu === 'tv' ? 'rotate-180 text-yellow-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" /></svg>
                </button>
                {activeSubMenu === 'tv' && (
                  <div className="flex flex-col gap-2 mt-3 ml-4 border-l border-zinc-800 pl-4 animate-in fade-in slide-in-from-top-1">
                    {menuItems.tv.map(i => (
                      <Link key={i.name} href={i.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-500 hover:text-white uppercase tracking-wide transition-colors py-1">{i.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {visibleLinks.map(l => (
                <Link 
                  key={l.name} 
                  href={l.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white hover:text-yellow-500 transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  {l.name}
                  {l.name === 'Inbox' && unreadCount > 0 && (
                     <span className="bg-blue-500 text-black text-[10px] px-2 rounded-full font-black">{unreadCount}</span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-6 hover:bg-blue-500/10 transition-all">
                  <span className="text-[14px] font-black uppercase tracking-widest text-blue-500">Admin Dashboard</span>
                </Link>
              )}
              {session ? (
                <div className="flex items-center justify-between">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="group">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest group-hover:text-yellow-500 transition-colors">Active</p>
                    <p className="text-white text-sm font-bold truncate max-w-[120px] group-hover:text-yellow-500 transition-colors">{session.user?.name}</p>
                  </Link>
                  <button onClick={() => signOut()} className="text-[12px] font-black p-2 px-3 rounded-lg bg-red-900/20 text-red-500 hover:bg-red-900/40 uppercase transition-colors">Sign Out</button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center bg-yellow-500 text-black p-3 rounded-xl font-black uppercase text-[16px] hover:bg-yellow-400 transition-all">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SPACER (Important for Fixed Header) */}
      {variant === 'default' && <div className="h-20 w-full" />}
    </>
  );
}