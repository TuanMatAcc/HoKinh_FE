export function BranchesSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-start mb-5">
      <div className="flex-1">
        <div className="h-7 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    {/* Basic Info Skeleton */}
    <div className="grid md:grid-cols-2 gap-4 mb-5">
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-11 bg-gray-200 rounded"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-11 bg-gray-200 rounded"></div>
      </div>
      <div className="md:col-span-2">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-11 bg-gray-200 rounded"></div>
      </div>
    </div>

    {/* Image Skeleton */}
    <div className="mb-5">
      <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
  );
}