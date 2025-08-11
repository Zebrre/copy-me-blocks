
export const CardSkeleton = ({ size = "1x1" }: { size?: "1x1" | "1x2" | "2x1" | "2x2" }) => {
  const gridSizeClasses = {
    "1x1": "col-span-1 row-span-1",
    "1x2": "col-span-2 row-span-1", // Wide rectangle
    "2x1": "col-span-1 row-span-2", // Tall rectangle
    "2x2": "col-span-2 row-span-2",
  };

  return (
    <div className={`${gridSizeClasses[size]} animate-pulse`}>
      <div className="h-full w-full rounded-3xl border border-gray-200/50 p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gray-200 rounded-xl p-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded-lg flex-1 max-w-40"></div>
          </div>
        </div>
        
        <div className="mb-4 flex-1">
          <div className="bg-gray-200 rounded-2xl h-24 min-h-[120px]"></div>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
