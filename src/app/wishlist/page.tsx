"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import CartToast from "@/components/CartToast";
import ProductCard from "@/components/products/productCard";
import { useWishlistStore } from "@/lib/store/wishList.store";
import { useCart } from "@/context/CartProvider";

export default function WishlistPage() {
  const {
    wishlistProducts,
    loading,
    loadWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  } = useWishlistStore();

  const { addItemToCart, updateItemQuantity, cart, refreshCart } = useCart();

  const [confirmClear, setConfirmClear] = useState(false);
  const [addingAll, setAddingAll] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (wishlistProducts.length === 0) loadWishlist();
  }, [loadWishlist, wishlistProducts.length]);

  /* ================= EMPTY STATE ================= */
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-gray-500 animate-fade-in">
        <Image
          src="/images/wish.svg"
          alt="empty wishlist"
          width={256}
          height={256}
          className="mb-6 opacity-80 transition-transform duration-300 hover:scale-105"
        />

        <p className="mb-4 text-sm animate-slide-up">Your wishlist is empty</p>

        <Link
          href="/products"
          className="px-6 py-2 bg-black text-white rounded-lg
                     transition-all duration-300
                     hover:bg-gray-800 hover:scale-105
                     active:scale-95"
        >
          Browse products
        </Link>
      </div>
    );
  }

  /* ================= MAIN PAGE ================= */
  return (
    <div className="my-container pt-32 min-h-dvh">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              if (!wishlistProducts.length || addingAll) return;
              setAddingAll(true);
              try {
                for (const p of wishlistProducts) {
                  const id = p._id || p.id;
                  await addItemToCart(id, { showToast: false });
                  await toggleWishlist(id, { silent: true });
                }
                await refreshCart();
                toast.custom(
                  (t) => (
                    <div
                      className={
                        t.visible
                          ? "animate-in fade-in-0"
                          : "animate-out fade-out-0"
                      }
                    >
                      {cart && (
                        <CartToast
                          cart={cart}
                          onUpdateQuantity={(pid, count) =>
                            updateItemQuantity(pid, count)
                          }
                          onClose={() => toast.dismiss(t.id)}
                        />
                      )}
                    </div>
                  ),
                  { duration: 5000, position: "bottom-right" }
                );
              } finally {
                setAddingAll(false);
              }
            }}
            disabled={addingAll || wishlistProducts.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white
                       transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95
                       disabled:opacity-60 disabled:cursor-not-allowed"
            title="Add all wishlist items to cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {addingAll ? "Adding..." : "Add all to cart"}
          </button>

          <button
            onClick={() => setConfirmClear(true)}
            disabled={clearing}
            className="text-red-500 transition-all duration-300
                       hover:text-red-700 hover:scale-110
                       active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Trash2 />
          </button>
        </div>
      </div>

      <div className="relative mb-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70" />
      </div>

      {/* ===== Products Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            className="animate-fade-in transition-all duration-300
                       hover:-translate-y-1 hover:shadow-lg"
          >
            <ProductCard
              product={product}
              isWished={isInWishlist(product._id)}
              onToggleWish={(id) => toggleWishlist(id, { silent: true })}
              showRemove
              onRemove={(id) => toggleWishlist(id, { silent: true })}
            />
          </div>
        ))}
      </div>

      {/* ===== Loading Overlay ===== */}
      {addingAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Adding items to cart...
              </h3>
              <p className="text-sm text-gray-500">
                Please wait while we process your items
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Confirm Modal ===== */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-80 animate-scale-in">
            <h2 className="font-bold mb-4">Clear wishlist?</h2>

            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 transition-all duration-200
                           hover:scale-105"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setClearing(true);
                  clearWishlist().finally(() => setClearing(false));
                  setConfirmClear(false);
                }}
                disabled={clearing}
                className="bg-red-500 text-white px-4 py-2 rounded
                           transition-all duration-300
                           hover:bg-red-600 hover:scale-105
                           active:scale-95 disabled:opacity-50"
              >
                {clearing ? "Clearing..." : "Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
