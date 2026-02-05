// app/admin/users/edit/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { updateUser } from "@/app/actions/users";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js 15+ requires params to be a Promise
export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await the params to get the actual ID
  const { id } = await params;

  // 2. Fetch user data using the awaited ID
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <Link href="/admin/users" className="text-zinc-500 hover:text-white transition text-sm">
          ← Back to List
        </Link>
        <h1 className="text-3xl font-black mt-2 mb-8">Edit User</h1>

        {/* Use .bind to pass the ID securely to your Server Action */}
        <form action={updateUser.bind(null, user.id)} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col gap-5">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
            <input name="name" defaultValue={user.name || ""} className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 block">Username</label>
            <input name="username" defaultValue={user.username} className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 block">Access Level</label>
            <select name="role" defaultValue={user.role} className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="user">Standard User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-95">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}