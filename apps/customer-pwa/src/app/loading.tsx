export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#C1440E] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
}
