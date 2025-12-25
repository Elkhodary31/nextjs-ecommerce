import Products from "@/components/products/Products";
import Sidebar from "@/components/sidebar/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-screen sticky top-2 border-r overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Products</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Products />
        </main>
      </div>
    </Suspense>
  );
}
