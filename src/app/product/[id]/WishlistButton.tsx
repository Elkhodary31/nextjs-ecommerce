"use client";
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishList.store";
import { cn } from "@/lib/utils";

export default function WishlistButton({ productId }: { productId: string }) {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(productId));
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  // Ensure wishlist is hydrated for guests (localStorage) and authed users.
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return (
    <Button
      variant={isInWishlist ? "secondary" : "outline"}
      size="icon"
      aria-pressed={isInWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => toggleWishlist(productId)}
      className={cn(
        "h-11 w-11 transition-transform duration-150 ease-out",
        "hover:scale-105 active:scale-95 cursor-pointer",
        isInWishlist
          ? "bg-rose-50 text-rose-600 border-rose-200"
          : "hover:border-rose-200"
      )}
    >
      <Heart
        className="w-5 h-5"
        fill={isInWishlist ? "currentColor" : "none"}
        strokeWidth={isInWishlist ? 2 : 1.8}
      />
    </Button>
  );
}
