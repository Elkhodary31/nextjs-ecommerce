"use client";
import ProductImage from "./productImage";
import { Star, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { useState, memo } from "react";
import { IproductCardProps } from "@/lib/interfaces/productCard";
import { IProduct } from "@/lib/interfaces/product";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";

function ProductCard({
  product,
  isWished,
  onToggleWish,
  showRemove,
  onRemove,
}: IproductCardProps) {
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(false);
  const p = product as IProduct & { id?: string };
  const productId = (p._id ?? p.id) as string;
  const { addItemToCart } = useCart();

  return (
    <Link
      href={productId ? `/product/${productId}` : "#"}
      className="
        w-full h-96 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-md
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        ring-1 ring-transparent hover:ring-gray-300 flex flex-col overflow-hidden cursor-pointer group
      "
    >
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <ProductImage product={product} />

        {product.category?.name && (
          <span
            className="
              absolute bottom-2 right-2 bg-black/70 text-white 
              text-xs px-2 py-1 rounded-md backdrop-blur-sm
            "
          >
            {product.category.name}
          </span>
        )}

        {!showRemove && (
          <Heart
            size={22}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWish?.(product._id);
            }}
            className={`
            absolute top-3 right-3 hover:fill-red-500 transition-all duration-300 
            cursor-pointer  
            ${isWished ? "text-red-500 fill-red-500" : "text-gray-400"}
            ${hover ? "scale-110 " : "scale-100"}
          `}
          />
        )}
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="flex items-center h-6 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(product.ratingsAverage)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-xs text-gray-600 ml-2">
            {product.ratingsAverage} / 5
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-16">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold text-gray-900">
            {product.price} <span className="text-sm text-gray-500">EGP</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="
                flex items-center gap-1 bg-blue-600 text-white 
                hover:bg-blue-700 transition-all duration-300 
                px-3 py-2 rounded-lg text-sm shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!productId || adding) return;
                setAdding(true);
                try {
                  await addItemToCart(productId);
                } finally {
                  setAdding(false);
                }
              }}
              disabled={adding}
              title={adding ? "Adding to cart..." : "Add to cart"}
            >
              <ShoppingCart size={18} /> {adding ? "Adding..." : "Add"}
            </button>

            {showRemove && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove?.(product._id);
                }}
                className="px-1 py-2 border border-blue-500 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
