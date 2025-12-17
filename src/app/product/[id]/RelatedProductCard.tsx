"use client";
import ProductCard from "@/components/products/productCard";
import { IProduct } from "@/lib/interfaces/product";
import { useWishlistStore } from "@/lib/store/wishList.store";
import { useEffect } from "react";

export default function RelatedProductCard({ product }: { product: IProduct }) {
  const { isInWishlist, toggleWishlist, loadWishlist } = useWishlistStore();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isWished = isInWishlist(product._id || product.id);

  return (
    <ProductCard
      product={product}
      isWished={isWished}
      onToggleWish={() => toggleWishlist(product._id || product.id)}
      showRemove={false}
    />
  );
}
