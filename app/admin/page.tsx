// app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch counts for the dashboard
  const userCount = await prisma.user.count();
  const pendingRequestCount = await prisma.request.count({
    where: { status: "PENDING" }
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-white transition text-sm flex items-center gap-1">
              ← Back to App
          </Link>
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter">Admin Dashboard</h1>
          <p className="text-zinc-500 mt-2">Manage your Elite Movie DB ecosystem.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Users" value={userCount} icon="👥" />
          <StatCard title="Pending Req" value={pendingRequestCount} icon="📩" color="text-yellow-500" />
        </div>

        <h2 className="text-xl font-bold mb-6 text-zinc-400 uppercase tracking-widest text-xs">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Management */}
          <Link href="/admin/users" className="group p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-blue-500 transition-all shadow-xl">
            <h3 className="text-xl font-black group-hover:text-blue-400 transition-colors">User Management</h3>
            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">Create new users, manage roles, and monitor account activity across your database.</p>
          </Link>
          
          {/* Request Manager - NOW ACTIVE */}
          <Link href="/admin/requests" className="group p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-yellow-500 transition-all shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black group-hover:text-yellow-500 transition-colors">Request Manager</h3>
                {pendingRequestCount > 0 && (
                  <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {pendingRequestCount} NEW
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">Review, approve, or reject movie and TV requests from your community members.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-white" }: { title: string; value: number; icon: string; color?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-lg hover:bg-zinc-800/50 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <div className="text-zinc-500 text-xs font-black uppercase tracking-widest">{title}</div>
      <div className={`text-4xl font-black mt-2 ${color}`}>{value}</div>
    </div>
  );
}