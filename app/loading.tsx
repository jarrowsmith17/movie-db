export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gray-950">
      {/* 1. Navbar Spacer */}
      <div className="h-20 w-full" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col gap-10 mt-4">
        
        {/* Recommended / Hero Placeholder */}
        <section className="space-y-6">
          <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[130px] md:min-w-[200px] shrink-0 space-y-3">
                <div className="aspect-[2/3] w-full bg-gray-900 rounded-xl animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* Trending Section Placeholder */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-32 bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-gray-900 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[130px] md:min-w-[200px] shrink-0 space-y-3">
                <div className="aspect-[2/3] w-full bg-gray-900 rounded-xl animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* New Releases Placeholder */}
        <section className="space-y-6">
          <div className="h-8 w-40 bg-gray-800 rounded-lg animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[130px] md:min-w-[200px] shrink-0 space-y-3">
                <div className="aspect-[2/3] w-full bg-gray-900 rounded-xl animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}