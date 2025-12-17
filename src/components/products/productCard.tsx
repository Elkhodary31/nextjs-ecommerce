"use client";
import { IProduct } from "@/lib/interfaces/product";
import ProductImage from "./productImage";
import { Star, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { useState, memo } from "react";

interface Props {
  product: IProduct;
  isWished?: boolean;
  onToggleWish?: (id: string) => void;
  showRemove?: boolean;
  onRemove?: (id: string) => void;
}

function ProductCard({
  product,
  isWished,
  onToggleWish,
  showRemove,
  onRemove,
}: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="
        w-full bg-gray-100 h-96 rounded-2xl shadow-sm border 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300
        flex flex-col overflow-hidden cursor-pointer
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

        <Heart
          size={22}
          onClick={(e) => {
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
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="
                flex items-center gap-1 bg-blue-600 text-white 
                hover:bg-blue-700 transition-all duration-300 
                px-3 py-2 rounded-lg text-sm shadow-sm
              "
            >
              <ShoppingCart size={18} /> Add
            </button>

            {showRemove && (
              <button
                onClick={(e) => {
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
    </div>
  );
}

export default memo(ProductCard);
