"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Address Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="bg-white rounded-lg shadow p-6 h-fit">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-2 mb-6 pb-6 border-b">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-2 mb-6 pb-6 border-b">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
