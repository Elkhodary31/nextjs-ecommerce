import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-24">
      <div className="max-w-md w-full text-center">
        <div className="relative w-full h-64 mb-6">
          <Image
            src="/images/NotFound.svg"
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find what you're looking for.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <span className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
              Go Home
            </span>
          </Link>
          <Link href="/products">
            <span className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg transition">
              Browse Products
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
