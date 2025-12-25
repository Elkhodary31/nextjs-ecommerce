"use client";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/interfaces/product";

export default function CartPage() {
  const {
    cart,
    cartCount,
    loading,
    updateItemQuantity,
    removeItem,
    clearUserCart,
    refreshCart,
  } = useCart();

  const [operatingItem, setOperatingItem] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // Refresh cart when page mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  if (loading && !cart) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border p-4 flex gap-4 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded mt-3"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && (!cart || !cart.products || cart.products.length === 0)) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">Add items to get started</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Early return if still loading or no cart yet
  if (!cart) return null;

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setClearing(true);
              try {
                await clearUserCart();
              } finally {
                setClearing(false);
              }
            }}
            disabled={clearing}
            className="text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item) => {
              const product =
                typeof item.product === "object"
                  ? (item.product as IProduct & { id?: string })
                  : null;
              if (!product) return null;
              const productId = (product._id ?? product.id) as string;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border p-4 flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${product._id || product.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product._id || product.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.brand?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {item.price} EGP
                      </span>
                      <span className="text-sm text-gray-500">each</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={async () => {
                            setOperatingItem(productId);
                            try {
                              await updateItemQuantity(
                                productId,
                                Math.max(1, item.count - 1)
                              );
                            } finally {
                              setOperatingItem(null);
                            }
                          }}
                          disabled={
                            item.count <= 1 || operatingItem === productId
                          }
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.count}</span>
                        <button
                          onClick={async () => {
                            setOperatingItem(productId);
                            try {
                              await updateItemQuantity(
                                productId,
                                item.count + 1
                              );
                            } finally {
                              setOperatingItem(null);
                            }
                          }}
                          disabled={operatingItem === productId}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={async () => {
                          setOperatingItem(productId);
                          try {
                            await removeItem(productId);
                          } finally {
                            setOperatingItem(null);
                          }
                        }}
                        disabled={operatingItem === productId}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      {item.price * item.count} EGP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{cart.totalCartPrice} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{cart.totalCartPrice} EGP</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 text-base">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full h-10 mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
