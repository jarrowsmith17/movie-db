'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  seasons: any[];
  tvId: string;
};

export default function SeasonSelector({ seasons, tvId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Default to season 1 if no param exists, but check URL first
  const currentSeason = searchParams.get('season') || seasons[0]?.season_number?.toString();

  // Filter out "Specials" (Season 0) if you want, or keep them. keeping them is usually better.
  const validSeasons = seasons.filter(s => s.season_number > 0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonNum = e.target.value;
    // Push new URL (this triggers the server page to re-render with new data)
    router.push(`/tv/${tvId}?season=${seasonNum}`, { scroll: false });
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Select Season</label>
      <select 
        value={currentSeason} 
        onChange={handleChange}
        className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 w-full md:w-auto focus:outline-none focus:border-yellow-500"
      >
        {validSeasons.map((season) => (
          <option key={season.id} value={season.season_number}>
            {season.name} ({season.episode_count} Eps)
          </option>
        ))}
      </select>
    </div>
  );
}