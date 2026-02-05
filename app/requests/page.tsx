import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";

export default async function UserRequestsPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch user's requests
  const myRequests = await prisma.request.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 1. Integrated Navbar */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* 2. Clean Title Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter">Your Requests</h1>
          <p className="text-zinc-500 mt-2 font-medium">
            View the status of movies and shows you've suggested to the community.
          </p>
        </header>

        {/* 3. The "Elite" List */}
        <div className="space-y-4">
          {myRequests.map((req) => (
            <div 
              key={req.id} 
              className="group flex items-center gap-6 p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
            >
              {/* Small Poster Preview */}
              <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg shadow-xl">
                <img 
                  src={req.posterPath ? `https://image.tmdb.org/t/p/w185${req.posterPath}` : "/placeholder.png"} 
                  className="object-cover w-full h-full" 
                  alt="" 
                />
              </div>

              {/* Request Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {req.type}
                  </span>
                  <span className="text-zinc-600 text-[10px] font-bold">
                    {formatDistanceToNow(new Date(req.createdAt))} ago
                  </span>
                </div>
                <h3 className="text-lg font-bold truncate group-hover:text-blue-400 transition-colors">
                  {req.title}
                </h3>
              </div>

              {/* Status Indicator */}
              <div className="pr-2">
                <StatusBadge status={req.status} />
              </div>
            </div>
          ))}

          {myRequests.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-3xl">
              <div className="text-4xl mb-4">📩</div>
              <p className="text-zinc-500 italic font-medium">You haven't made any requests yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Modern Status Badge with dynamic colors
 */
function StatusBadge({ status }: { status: string }) {
  const variants: any = {
    PENDING: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    ADDED: "text-green-500 bg-green-500/10 border-green-500/20",
    REJECTED: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest ${variants[status] || variants.PENDING}`}>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`} />
      {status}
    </div>
  );
}