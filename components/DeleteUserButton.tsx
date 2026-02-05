'use client'; // This tells Next.js this file runs in the browser

import { deleteUser } from "@/app/actions/users";

export default function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <button 
      className="text-xs font-black uppercase text-zinc-700 hover:text-red-500 transition-colors"
      onClick={async () => {
        if (confirm("Are you sure you want to delete this user?")) {
          await deleteUser(userId);
        }
      }}
    >
      Delete
    </button>
  );
}