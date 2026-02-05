'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import Search from './Search';

export default function Navbar({ variant = 'default', unreadCount = 0 }: { variant?: 'default' | 'overlay', unreadCount?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role?.toUpperCase() === 'ADMIN';

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

  const navLinks = [
    { name: 'Log', href: '/log' },
    { name: 'Watchlist', href: '/watchlist' },
    { name: 'Requests', href: '/requests' },
    { name: 'Inbox', href: '/inbox' },
  ];

  return (
    <>
      {/* 1. CENTERED LOGO LAYOUT */}
      <nav className={`${variant === 'overlay' ? 'absolute top-0 w-full' : 'w-full'} z-[100] px-6 py-6 grid grid-cols-3 items-center`}>
        <div className="flex justify-start">
          <button onClick={() => setIsMenuOpen(true)} className="text-white hover:text-yellow-500 transition-colors relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse" />}
          </button>
        </div>

        {/* CENTERED LOGO */}
        <Link href="/" className="text-2xl font-black text-yellow-500 uppercase italic tracking-tighter text-center">
          Movie-DB
        </Link>

        <div className="flex justify-end">
          <div className="hidden md:block w-full max-w-[250px]"><Search /></div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-[320px] h-full bg-gray-950 border-r border-white/5 flex flex-col p-8 animate-in slide-in-from-left duration-300">
            
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-10 mb-8"><Search /></div>

            {/* 2. SUB-MENUS: NORMAL FONT & SMALLER */}
            <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar pb-10">
              {['films', 'tv'].map((key) => (
                <div key={key} className="flex flex-col">
                  <button 
                    onClick={() => setActiveSubMenu(activeSubMenu === key ? null : key)} 
                    className="text-lg font-bold text-white uppercase tracking-tight w-full flex justify-between items-center group"
                  >
                    <span className={activeSubMenu === key ? 'text-yellow-500' : ''}>{key === 'films' ? 'Films' : 'TV Shows'}</span>
                    <svg className={`w-4 h-4 transition-transform ${activeSubMenu === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" /></svg>
                  </button>
                  {activeSubMenu === key && (
                    <div className="flex flex-col gap-2 mt-3 ml-4 border-l border-zinc-800 pl-4 animate-in fade-in slide-in-from-top-1">
                      {menuItems[key as keyof typeof menuItems].map(i => (
                        <Link key={i.name} href={i.href} className="text-sm font-medium text-zinc-500 hover:text-white uppercase tracking-wide transition-colors">{i.name}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {navLinks.map(l => (
                <Link key={l.name} href={l.href} className="text-lg font-bold text-white hover:text-yellow-500 transition-colors uppercase tracking-tight">
                  {l.name}
                </Link>
              ))}
            </div>

            {/* 3. ADMIN PINNED TO BOTTOM */}
            <div className="mt-auto pt-6 border-t border-white/5">
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-6 hover:bg-blue-500/10 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Admin Dashboard</span>
                </Link>
              )}
              {session ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Active</p>
                    <p className="text-white text-xs font-bold truncate max-w-[120px]">{session.user?.name}</p>
                  </div>
                  <button onClick={() => signOut()} className="text-[9px] font-black text-red-500 uppercase hover:text-red-400 transition-colors">Sign Out</button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center bg-yellow-500 text-black p-3 rounded-xl font-black uppercase text-[10px] hover:bg-yellow-400 transition-all">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}