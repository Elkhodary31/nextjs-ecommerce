"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Monkey-patch router to show a loading veil on navigation triggers
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = ((href: string, options?: Parameters<typeof originalPush>[1]) => {
      setIsLoading(true);
      return originalPush(href, options);
    }) as typeof router.push;

    router.replace = ((href: string, options?: Parameters<typeof originalReplace>[1]) => {
      setIsLoading(true);
      return originalReplace(href, options);
    }) as typeof router.replace;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  // Close the loading veil when the URL actually changes
  useEffect(() => {
    if (isLoading) setIsLoading(false);
  }, [pathname]);

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
