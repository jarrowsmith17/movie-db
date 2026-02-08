import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import WatchlistCard from "@/components/WatchlistCard";
import Navbar from "@/components/Navbar";

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-10">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 border-l-4 border-yellow-500 pl-6">
          Your Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">Your watchlist is empty.</p>
            <p className="text-sm mt-2">Start adding movies and shows to keep track of what you want to watch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((item) => (
              <WatchlistCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}