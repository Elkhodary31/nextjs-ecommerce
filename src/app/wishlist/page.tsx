"use client";
import { useEffect, useCallback } from "react";
import { useWishlistStore } from "@/lib/store/wishList.store";
import ProductCard from "@/components/products/productCard";

export default function WishlistPage() {
  const wishlistProducts = useWishlistStore((s) => s.wishlistProducts);
  const loading = useWishlistStore((s) => s.loading);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleWishlist(id);
    },
    [toggleWishlist]
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-gray-500">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="my-container  pt-32 min-h-dvh">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isWished={isInWishlist(product._id)}
            onToggleWish={handleToggle}
            showRemove
            onRemove={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
