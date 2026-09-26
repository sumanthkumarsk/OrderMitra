import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <h2 className="text-4xl font-display font-bold text-gray-900 mb-3">404</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        The dashboard page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="bg-[#0F1B2D] text-white px-6 py-2.5 rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
