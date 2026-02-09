export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gray-950">
      {/* 1. Navbar Spacer */}
      <div className="h-20 w-full" />

      {/* 2. Hero Section Skeleton */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            {/* Overview Skeleton */}
            <section>
              <div className="h-8 w-40 bg-gray-800 rounded-lg animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse" />
              </div>
            </section>

            {/* Episode/Season Section Skeleton */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-32 bg-gray-800 rounded-lg animate-pulse" />
                {/* Season Selector placeholder */}
                <div className="h-10 w-40 bg-gray-800 rounded-xl animate-pulse" />
              </div>
              {/* Episode Carousel pulse */}
              <div className="flex gap-4 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="min-w-[280px] md:min-w-[320px] h-48 bg-gray-900 border border-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </section>

            {/* Cast Skeleton */}
            <section>
              <div className="h-8 w-28 bg-gray-800 rounded-lg animate-pulse mb-6" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info Skeleton */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6 animate-pulse">
              <div className="h-4 w-24 bg-gray-800 rounded" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-2 w-12 bg-gray-800 rounded" />
                    <div className="h-4 w-20 bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}