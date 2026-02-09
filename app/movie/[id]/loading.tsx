export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gray-950">
      {/* 1. Header Spacer - matches your fixed Navbar height */}
      <div className="h-20 w-full" />

      {/* 2. Hero Skeleton */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      {/* 3. Content Skeletons */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <div className="space-y-4">
             <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
             <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
             <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-48 w-full bg-gray-900 rounded-2xl animate-pulse" />
        </div>
        
        <div className="hidden md:block bg-gray-900 p-6 rounded-xl border border-gray-800 h-[400px] animate-pulse" />
      </div>
    </div>
  );
}