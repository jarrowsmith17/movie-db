"use client";

import { useState } from "react";
import { logAndReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";

type Props = {
  tmdbId: number;
  type: "MOVIE" | "TV";
  title: string;
  posterPath: string | null; // <-- New Prop
  initialRating?: number;
  initialReview?: string | null;
};

export default function ReviewButton({
  tmdbId,
  type,
  title,
  posterPath, // <-- Destructure
  initialRating,
  initialReview,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rating, setRating] = useState(initialRating || 0);
  const [review, setReview] = useState(initialReview || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass title and posterPath to the action
      await logAndReview(tmdbId, type, new Date(date), title, posterPath, rating, review);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 border bg-white/10 text-white border-white/20 hover:bg-white/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>{initialRating ? "Log / Edit" : "Log / Review"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Log: {title}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Date Watched</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? "text-yellow-500" : "text-gray-700 hover:text-gray-500"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your thoughts..."
                  rows={4}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 rounded-lg font-bold bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}