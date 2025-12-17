"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for navigation start
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Use router events if available
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = function (...args: any[]) {
      setIsLoading(true);
      return originalPush.apply(router, args);
    } as any;

    router.replace = function (...args: any[]) {
      setIsLoading(true);
      return originalReplace.apply(router, args);
    } as any;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
