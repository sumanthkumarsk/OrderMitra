import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 p-6 text-center">
      <div className="text-6xl mb-4">🍽️</div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-[250px]">
        We couldn&apos;t find the page you were looking for in the menu.
      </p>
      <Link 
        href="/menu" 
        className="bg-[#C1440E] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-[#a6390a] transition-colors"
      >
        Back to Menu
      </Link>
    </div>
  );
}
