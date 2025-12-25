"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, Package, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reorderFromOrder } from "@/lib/services/cart.service";
import { getUserOrders } from "@/lib/services/order.service";
import { useRouter } from "next/navigation";
import { IOrder } from "@/lib/interfaces/order";
import { getUserIdFromServer } from "./actions";
import Image from "next/image";

export default function OrdersList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const token = (session as any)?.token;

  // Fetch user's orders
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const userId = await getUserIdFromServer();
      if (!userId) {
        throw new Error("Could not get user ID");
      }
      const data = await getUserOrders(userId, token);
      setOrders(data);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order: IOrder) => {
    if (!token) return;

    try {
      setReorderingId(order._id);
      const productIds = ((order as any).cartItems || []).map((item: any) => item.product?._id || item.product?.id).filter(Boolean);
      if (productIds.length === 0) {
        toast.error("No products found in this order");
        return;
      }
      await reorderFromOrder(productIds, token);
      toast.success("Items added to cart! Redirecting...");
      
      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } catch (error: any) {
      console.error("Reorder error:", error);
      toast.error(error.message || "Failed to add items to cart");
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getOrderStatus = (order: any) => {
    if (order.isDelivered) return "delivered";
    if (order.isPaid) return "paid";
    return "pending";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders yet. Start shopping to place your first
          order!
        </p>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Order ID & Date */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Order ID
              </p>
              <p className="font-mono text-sm font-semibold">
                {order._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formatDate(order.createdAt ?? new Date().toISOString())}
              </p>
            </div>

            {/* Items Count */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Items
              </p>
              <p className="font-semibold">
                {((order as any).cartItems?.length || 0)} {((order as any).cartItems?.length || 0) === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Total */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="font-semibold text-lg">
                {(order as any).totalOrderPrice || 0} EGP
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Status
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                  getOrderStatus(order)
                )}`}
              >
                {getOrderStatus(order)}
              </span>
            </div>

            {/* Action */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Action
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReorder(order)}
                disabled={reorderingId === order._id}
                className="w-full"
              >
                {reorderingId === order._id ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Reordering...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Reorder
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="border-t pt-4">
            <button
              onClick={() => toggleExpanded(order._id)}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 mb-2 hover:text-gray-900 transition"
            >
              <span>Items in this order ({((order as any).cartItems?.length || 0)})</span>
              {expandedOrders.has(order._id) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedOrders.has(order._id) ? (
              <div className="space-y-3 mt-3">
                {((order as any).cartItems || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {item.product?.imageCover && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title || "Product"}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.product?.title || "Product"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.product?.brand?.name}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600">
                          Qty: {item.count}
                        </span>
                        <span className="text-xs text-gray-600">
                          Price: {item.price} EGP
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {item.price * item.count} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {((order as any).cartItems || []).map((item: any, idx: number) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                  >
                    {item.product?.title?.slice(0, 20) || "Product"} x{item.count}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="border-t pt-4 mt-4 text-sm">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Shipped To:
              </p>
              <p className="font-medium">{(order.shippingAddress as any)?.name}</p>
              <p className="text-gray-600">{(order.shippingAddress as any)?.details}</p>
              <p className="text-gray-600">{(order.shippingAddress as any)?.city}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
