// app/admin/users/page.tsx
import { createUser } from "../../../actions/users";
import Link from "next/link";

export default function AdminUsersPage({ searchParams }: { searchParams: { success?: string } }) {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* 1. Navigation Header */}
      <div className="max-w-md mx-auto mb-8 flex items-center justify-between">
        <Link href="/admin/users" className="text-zinc-500 hover:text-white flex items-center gap-2 transition">
            ← Back to Users
        </Link>
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* 2. Smart Success Popup */}
      {searchParams.success && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">✅</span>
          <p className="text-green-400 font-medium">User created successfully!</p>
        </div>
      )}

      {/* 3. Styled Form */}
      <form action={createUser} className="max-w-md mx-auto bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col gap-5">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
          <input name="name" placeholder="Name..." className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Username</label>
          <input name="username" placeholder="Username..." className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Temporary Password</label>
          <input name="password" type="password" placeholder="••••••••" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Access Level</label>
          <select name="role" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer">
            <option value="user">Standard User</option>
            <option value="admin">Admin (God Mode)</option>
          </select>
        </div>

        <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95">
          Create Account
        </button>
      </form>
    </div>
  );
}