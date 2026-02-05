import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updateRequestStatus } from "@/app/actions/requests";
import { formatDistanceToNow } from "date-fns";

// 1. FIX: Import Prisma namespace to avoid naming collisions
import { Prisma } from "@prisma/client";

// 2. FIX: Use the official Payload helper for related data
type RequestWithUser = Prisma.RequestGetPayload<{
  include: { user: true };
}>;

export default async function AdminRequestManager() {
  // Fetch only pending requests
  const requests = await prisma.request.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { title: 'asc' } // Sorted Alphabetically A-Z
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-10 tracking-tighter italic">Request Manager</h1>
        <Link href="/admin" className="text-zinc-500 hover:text-white transition mb-10 text-sm flex items-center gap-1">
          ← Back to Dashboard
        </Link>
        
        <div className="grid gap-4 mt-6">
          {/* 3. The 'req' parameter is now explicitly typed for the build */}
          {requests.map((req: RequestWithUser) => {
            // Safe fallback for posterPath
            const posterUrl = req.posterPath 
              ? `https://image.tmdb.org/t/p/w185${req.posterPath}`
              : "https://via.placeholder.com/185x278?text=No+Poster";

            return (
              <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center gap-6 hover:border-zinc-700 transition-all">
                <img src={posterUrl} className="w-20 h-28 object-cover rounded-xl shadow-2xl bg-zinc-800" alt="" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {req.type}
                    </span>
                    <p className="text-zinc-600 text-xs font-medium">
                      {formatDistanceToNow(new Date(req.createdAt))} ago
                    </p>
                  </div>
                  <h3 className="font-bold text-xl">{req.title}</h3>
                  <p className="text-zinc-500 text-sm">
                    Requested by <span className="text-blue-400 font-bold">@{req.user?.username || 'user'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <form action={updateRequestStatus.bind(null, req.id, "REJECTED")}>
                    <button className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 font-black text-xs uppercase transition-all">
                      Reject
                    </button>
                  </form>
                  <form action={updateRequestStatus.bind(null, req.id, "ADDED")}>
                    <button className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                      Add to DB
                    </button>
                  </form>
                </div>
              </div>
            );
          })}

          {requests.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/50 rounded-[40px] border border-dashed border-zinc-800">
              <p className="text-zinc-500 italic font-medium">All caught up! No pending requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}