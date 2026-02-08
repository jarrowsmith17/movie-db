"use client";

import { deleteLog } from "@/app/actions/reviews";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLogButton({ logId }: { logId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the movie page
    e.stopPropagation(); // Stop event bubbling

    if (!confirm("Are you sure you want to remove this log?")) return;

    setLoading(true);
    try {
      await deleteLog(logId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-2 left-2 z-20 flex items-center justify-center w-8 h-8 bg-red-600/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg disabled:opacity-50"
      title="Remove from history"
    >
      {loading ? (
        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}