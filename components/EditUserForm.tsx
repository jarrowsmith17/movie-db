'use client';

import { useState } from 'react';
import { updateUser } from "@/app/actions/users";

export default function EditUserForm({ user }: { user: any }) {
  const [error, setError] = useState<string | null>(null);

  // Wrapper to handle the server action response
  async function handleSubmit(formData: FormData) {
    setError(null); // Clear previous errors
    
    // Call the server action
    const result = await updateUser(user.id, formData);

    // If the action returned an object with an error, set it
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col gap-6">
      
      {/* Identity Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Identity</h2>
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
      </div>

      {/* Security Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Change Password</h2>
        
        {/* Warning / Info Box */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-4">
          <p className="text-red-400 text-xs font-bold uppercase tracking-wide">Warning</p>
          <p className="text-zinc-400 text-xs mt-1">Leave these blank to keep the current password.</p>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-200 p-3 rounded-xl text-sm font-bold text-center animate-pulse">
                {error}
            </div>
        )}

        <div>
          <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 block">New Password</label>
          <input type="password" name="password" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
        </div>

        <div>
          <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 block">Confirm Password</label>
          <input type="password" name="confirmPassword" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
        </div>
      </div>

      <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-95">
        Save Changes
      </button>
    </form>
  );
}