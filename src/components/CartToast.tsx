"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { ICart } from "@/lib/interfaces/cart";
import { IProduct } from "@/lib/interfaces/product";

interface CartToastProps {
  cart: ICart;
  onUpdateQuantity: (productId: string, count: number) => void;
  onClose: () => void;
}

export default function CartToast({
  cart,
  onUpdateQuantity,
  onClose,
}: CartToastProps) {
  return (
    <div className="bg-white rounded-lg shadow-2xl border w-[340px] max-h-[460px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-green-600" />
          <h3 className="font-bold">Cart</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {cart.products.map((item) => {
          console.log("item", item);
          const isObject = typeof item.product === "object" && item.product !== null;
          const p = isObject ? (item.product as IProduct & { id?: string }) : null;
          const productId = isObject
            ? ((p!._id ?? p!.id) as string)
            : String(item.product);

          return (
            <div
              key={item._id}
              className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg"
            >
              {p ? (
                <Link href={`/product/${productId}`}>
                  <div className="relative w-16 h-16 rounded bg-gray-100 flex-shrink-0">
                    <Image
                      src={p.imageCover}
                      alt={p.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </Link>
              ) : (
                <Link href={`/product/${productId}`}>
                  <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              )}

              <div className="flex-1 min-w-0">
                <Link href={`/product/${productId}`}>
                  <h4 className="text-sm font-medium line-clamp-2 hover:text-blue-600 transition">
                    {p ? p.title : "Product"}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500 truncate">
                  ID: {productId}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {item.price} EGP
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(productId, Math.max(1, item.count - 1))
                    }
                    disabled={item.count <= 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">
                    {item.count}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(productId, item.count + 1)}
                    className="p-1 hover:bg-gray-200 rounded transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {item.price * item.count}
                </p>
                <p className="text-xs text-gray-500">EGP</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-gray-900">
            {cart.totalCartPrice} EGP
          </span>
        </div>
        <Link href="/cart" onClick={onClose}>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
            View Cart
          </button>
        </Link>
      </div>
    </div>
  );
}
