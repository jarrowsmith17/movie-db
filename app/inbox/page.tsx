import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { markAllAsRead } from "@/app/actions/notifications"; // We'll verify this action below

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div className="p-10 text-white">Please log in to view your inbox.</div>;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 1. Integrated Navbar */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* 2. Header with "Mark All as Read" logic */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Inbox</h1>
            <p className="text-zinc-500 mt-2 font-medium">
              Notifications regarding your requests and account activity.
            </p>
          </div>
          
          {notifications.some(n => !n.isRead) && (
            <form action={markAllAsRead.bind(null, session.user.id)}>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors border border-blue-500/20 px-4 py-2 rounded-xl bg-blue-500/5">
                Mark all as read
              </button>
            </form>
          )}
        </header>

        {/* 3. The Notification List */}
        <div className="space-y-3">
          {notifications.map((note) => (
            <div 
              key={note.id} 
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                note.isRead 
                  ? 'bg-zinc-800/20 border-zinc-500 opacity-60 hover:opacity-100 text-zinc 250' 
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-blue-500/50 shadow-lg shadow-blue-900/5'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {!note.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                    note.isRead ? 'text-zinc-600' : 'text-blue-400'
                  }`}>
                    {note.isRead ? 'Archived' : 'New Message'}
                  </span>
                </div>
                <p className="text-zinc-600 text-[10px] font-bold">
                  {formatDistanceToNow(new Date(note.createdAt))} ago
                </p>
              </div>
              
              <p className={`text-sm md:text-base leading-relaxed ${
                note.isRead ? 'text-zinc-500' : 'text-zinc-200 font-medium'
              }`}>
                {note.message}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-3xl">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-zinc-500 italic font-medium">No messages found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}