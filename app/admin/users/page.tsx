import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteUserButton from "@/components/DeleteUserButton"; // Import our new button

export default async function AdminUsersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ success?: string; updated?: string }> 
}) {
  // 1. Await params for Next.js 15 compatibility
  const { success, updated } = await searchParams;
  const showMessage = success || updated;

  // 2. Fetch users in Alphabetical Order
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/admin" className="text-zinc-500 hover:text-white transition text-sm flex items-center gap-1">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black mt-2 tracking-tighter">User Management</h1>
          </div>
          <Link 
            href="/admin/users/new" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg active:scale-95"
          >
            + Create New User
          </Link>
        </div>

        {/* --- RE-ANIMATING POPUP --- */}
        {showMessage && (
          <div 
            key={success ? "created" : "updated"} // Reset animation on every new action
            className="mb-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <p className="text-blue-400 font-bold">
                {success ? "New account created!" : "User profile updated!"}
              </p>
            </div>
            <Link href="/admin/users" className="text-blue-400/50 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-blue-500/20 rounded-md">
              Dismiss
            </Link>
          </div>
        )}

        {/* --- TABLE --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Display Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Access Level</th>
                <th className="p-6 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</div>
                    <div className="text-zinc-500 text-xs">@{user.username}</div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border ${
                      user.role === 'admin' 
                        ? 'border-blue-500/50 bg-blue-500/5 text-blue-400' 
                        : 'border-zinc-700 bg-zinc-800/50 text-zinc-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Link 
                        href={`/admin/users/edit/${user.id}`} 
                        className="text-xs font-black uppercase text-zinc-500 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      {/* Using the Client Component button here */}
                      <DeleteUserButton userId={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}