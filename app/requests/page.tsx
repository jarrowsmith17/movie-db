import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation"; // Import redirect
import Navbar from "@/components/Navbar";

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);

  // 1. SECURITY CHECK: Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  // Fetch requests for this specific user
  const requests = await prisma.request.findMany({
    where: { userId: session.user.id }, // Only their requests
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-10">
        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-8 border-l-4 border-yellow-500 pl-6">
          Your Requests
        </h1>

        {requests.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">You haven't made any requests yet.</p>
            <p className="text-sm mt-2">Find a movie or TV show to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex gap-4">
                {request.posterPath ? (
                   <img 
                     src={`https://image.tmdb.org/t/p/w200${request.posterPath}`} 
                     alt={request.title}
                     className="w-20 h-30 object-cover rounded-lg"
                   />
                ) : (
                   <div className="w-20 h-30 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">{request.title}</h3>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">{request.type}</p>
                  
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      request.status === 'ADDED' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      request.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}