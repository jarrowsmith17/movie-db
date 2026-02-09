import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProfilePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) redirect("/login");

  // Fetch Stats
  const userId = session.user.id;

  const totalLogs = await prisma.watchLog.count({
    where: { userId }
  });

  const uniqueMovies = (await prisma.watchLog.findMany({
    where: { userId, type: 'MOVIE' },
    distinct: ['tmdbId']
  })).length;

   const uniqueShows = (await prisma.watchLog.findMany({
    where: { userId, type: 'TV' },
    distinct: ['tmdbId']
  })).length;

  const totalReviews = await prisma.review.count({
    where: { userId }
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 mt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
                 {session.user?.name}
              </h1>
              <p className="text-gray-500 font-medium">@{session.user?.username}</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <Link 
                 href="/profile/edit"
                 className="flex-1 md:flex-none text-center bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors"
              >
                 Edit Account
              </Link>
           </div>
        </div>

        {/* Success Message from Edit Page */}
        {params.updated && (
           <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl font-medium mb-8 text-center animate-pulse">
              Profile updated successfully.
           </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           <StatCard label="Total Logs" value={totalLogs} />
           <StatCard label="Unique Movies" value={uniqueMovies} />
           <StatCard label="Unique TV" value={uniqueShows} />
           <StatCard label="Reviews Written" value={totalReviews} />
        </div>

        {/* Recent Activity Preview (Optional - reuses logic if you want) */}
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Your Watch History</h3>
            <p className="text-gray-400 mb-6">View everything you have watched.</p>
            <Link href="/log" className="text-yellow-500 font-bold uppercase tracking-widest text-sm hover:underline">
               Go to Watch Log &rarr;
            </Link>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
   return (
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center hover:border-yellow-500/30 transition-colors group">
         <span className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-yellow-500 transition-colors">
            {value}
         </span>
         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
            {label}
         </span>
      </div>
   )
}