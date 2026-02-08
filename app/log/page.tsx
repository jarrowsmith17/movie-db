import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DeleteLogButton from "@/components/DeleteLogButton"; // <--- Import this

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function LogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch logs sorted by date (newest first)
  const logs = await prisma.watchLog.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      watchedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-10">
        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-8">
          Watch History
        </h1>

        {logs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">You haven't logged any films yet.</p>
            <Link href="/" className="text-yellow-500 hover:underline mt-4 inline-block">
              Start browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {logs.map((log) => (
              <div key={log.id} className="group relative">
                
                {/* Delete Button (New) */}
                <DeleteLogButton logId={log.id} />

                {/* Date Badge */}
                <div className="absolute top-2 right-2 z-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-bold border border-white/20 shadow-lg pointer-events-none">
                  {new Date(log.watchedAt).toLocaleDateString("en-GB")}
                </div>

                <Link href={`/${log.type === "MOVIE" ? "movie" : "tv"}/${log.tmdbId}`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 border border-gray-800 group-hover:border-yellow-500/50">
                    {log.posterPath ? (
                      <img
                        src={IMAGE_BASE_URL + log.posterPath}
                        alt={log.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-bold text-sm md:text-base leading-tight drop-shadow-md truncate">
                        {log.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                        {log.type}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}