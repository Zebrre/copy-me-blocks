
export const CardSkeleton = ({ size = "1x1" }: { size?: "1x1" | "1x2" | "2x1" | "2x2" }) => {
  const gridSizeClasses = {
    "1x1": "col-span-1 row-span-1",
    "1x2": "col-span-1 row-span-2", 
    "2x1": "col-span-2 row-span-1",
    "2x2": "col-span-2 row-span-2",
  };

  return (
    <div className={`${gridSizeClasses[size]} animate-pulse`}>
      <div className="h-full w-full rounded-2xl border-2 p-4 bg-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded flex-1 max-w-32"></div>
          </div>
        </div>
        
        <div className="mb-3 flex-1">
          <div className="bg-gray-200 rounded-xl h-20"></div>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
