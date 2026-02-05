'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import Search from './Search';

type NavbarProps = {
  variant?: 'default' | 'overlay';
  unreadCount?: number;
};

export default function Navbar({ variant = 'default', unreadCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubMenu(null);
  }, [pathname]);

  const navLinks = [
    { name: 'Log', href: '/log' },
    { name: 'Watchlist', href: '/watchlist' },
    { name: 'Requests', href: '/requests' },
    { name: 'Inbox', href: '/inbox' },
  ];

  const wrapperClasses = variant === 'overlay'
    ? "absolute top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 md:py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between gap-2"
    : "w-full max-w-7xl mx-auto px-4 md:px-10 py-4 md:py-6 flex items-center justify-between gap-2 z-[100] relative";

  return (
    <>
      <nav className={wrapperClasses}>
        <div className="flex-1 flex items-center justify-start">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-yellow-500 transition-colors p-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            {/* Subtle Notification Dot on Menu Button */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </button>
        </div>

        <Link href="/" className="flex-none text-xl md:text-2xl font-black text-yellow-500 hover:text-yellow-200 transition-colors drop-shadow-md tracking-tighter px-2 uppercase">
          Movie-DB
        </Link>

        <div className="flex-1 flex items-center justify-end">
          <div className="w-full max-w-md hidden md:block">
            <Search />
          </div>
          <div className="w-8 h-8 md:hidden" />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          
          <div className="relative w-[320px] h-full bg-gray-950 border-r border-gray-800 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* --- NEW MESSAGE BANNER --- */}
            {unreadCount > 0 && (
              <Link 
                href="/inbox" 
                className="mt-12 bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3 hover:bg-blue-600/20 transition-all"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  You have {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                </p>
              </Link>
            )}

            <div className={`flex flex-col gap-6 ${unreadCount > 0 ? 'mt-6' : 'mt-10'}`}>
              {session?.user?.role === 'admin' && (
                <Link href="/admin" className="text-xl font-black text-blue-500 hover:text-blue-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Dashboard
                </Link>
              )}

              <Link href="/" className="text-xl font-bold text-white hover:text-yellow-500">Home</Link>
              
              {/* Other sections (Films/TV) remain the same */}
              {/* ... */}

              <div className="h-px bg-gray-800 my-2" />

              {/* Clean Nav Links (No numbers) */}
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-xl font-bold text-white hover:text-yellow-500 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-gray-900">
              {session ? (
                <>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black mb-1">Authenticated</p>
                  <p className="text-white text-sm font-bold mb-4">{session.user?.name}</p>
                  <button onClick={() => signOut()} className="text-xs font-black text-red-500 uppercase hover:text-red-400 transition-colors">
                    End Session
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-yellow-500 font-black uppercase text-sm hover:text-yellow-400">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}