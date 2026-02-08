import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { updateRequestStatus } from "@/app/actions/requests";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

type RequestWithUser = Prisma.RequestGetPayload<{
  include: { user: true };
}>;

export default async function AdminRequestManager() {
  // FIX: Fetch EVERYTHING pending, even if user link is weird
  const requests = await prisma.request.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter">REQUESTS</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
              {requests.length} Pending Action
            </p>
          </div>
          <Link href="/admin" className="text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-full transition-all">
            ← Dashboard
          </Link>
        </div>

        <div className="grid gap-4">
          {requests.map((req: RequestWithUser) => {
            const posterUrl = req.posterPath 
              ? `https://image.tmdb.org/t/p/w185${req.posterPath}`
              : "https://via.placeholder.com/185x278?text=No+Poster";

            return (
              <div key={req.id} className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Poster + Meta - Centered on Mobile */}
                  <div className="flex gap-4 items-start">
                    <img 
                      src={posterUrl} 
                      className="w-24 md:w-28 aspect-[2/3] object-cover rounded-2xl shadow-2xl ring-1 ring-white/10" 
                      alt="" 
                    />
                    <div className="flex-1 py-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-tighter bg-blue-500 text-white px-2 py-0.5 rounded-md">
                          {req.type}
                        </span>
                        <span className="text-zinc-600 text-[10px] font-bold">
                          {formatDistanceToNow(new Date(req.createdAt))} ago
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black leading-tight mb-1">{req.title}</h3>
                      <p className="text-zinc-500 text-sm font-medium">
                        from <span className="text-zinc-300">@{req.user?.username || 'anonymous'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions - Big, easy-to-tap buttons at the bottom for mobile */}
                  <div className="flex flex-row md:flex-col gap-2 mt-auto md:ml-auto w-full md:w-40">
                    <form action={updateRequestStatus.bind(null, req.id, "ADDED")} className="flex-1">
                      <button className="w-full py-4 md:py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                        Approve
                      </button>
                    </form>
                    <form action={updateRequestStatus.bind(null, req.id, "REJECTED")} className="flex-1">
                      <button className="w-full py-4 md:py-3 bg-zinc-800 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}

          {requests.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-full mb-4">
                <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-zinc-600 font-bold italic">All content cleared.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}