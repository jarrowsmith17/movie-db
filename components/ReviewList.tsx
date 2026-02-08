// components/ReviewList.tsx
type Review = {
  id: string;
  rating: number;
  content: string | null;
  createdAt: Date;
  user: {
    username: string;
    name: string | null;
  };
};

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-800 pt-16">
      <h2 className="text-2xl font-bold text-white mb-8">Reviews</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold text-black uppercase">
                  {review.user.username.substring(0, 2)}
                </div>
                <div>
                   <p className="font-bold text-white text-sm">{review.user.name || review.user.username}</p>
                   <p className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
              {/* Star Display */}
              <div className="flex text-yellow-500 text-sm">
                {"★".repeat(review.rating)}
                <span className="text-gray-700">{"★".repeat(5 - review.rating)}</span>
              </div>
            </div>
            {review.content && (
              <p className="text-gray-300 leading-relaxed text-sm">{review.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}