'use client' // <--- This line is magic. It tells Next.js "This part runs in the browser"

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // This lets us change the URL

export default function Search() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    if (!query) return; // Do nothing if empty
    router.push(`/search/${query}`); // Go to the new URL (we will build this page next)
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mb-8 flex gap-2">
      <input
        type="text"
        placeholder="Search for a movie..."
        className="flex-1 bg-white-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-600 dark:text-white focus:outline-none focus:border-yellow-500 transition"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
      >
        Search
      </button>
    </form>
  );
}