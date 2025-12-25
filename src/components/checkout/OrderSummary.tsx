"use client";

import { Loader2, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/interfaces/product";

interface OrderSummaryProps {
  cartId: string;
  itemCount: number;
  totalPrice: number;
  cartProducts: any[];
  loading: boolean;
  loadingAddresses: boolean;
  selectedAddressId: string | null;
  submitting: boolean;
  paymentMethod: "cash" | "card";
  onPlaceOrder: () => Promise<void>;
}

export function OrderSummary({
  cartId,
  itemCount,
  totalPrice,
  cartProducts,
  loading,
  loadingAddresses,
  selectedAddressId,
  submitting,
  paymentMethod,
  onPlaceOrder,
}: OrderSummaryProps) {
  const isReadyToOrder =
    !loading &&
    !loadingAddresses &&
    selectedAddressId &&
    itemCount > 0 &&
    !submitting;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
      <h2 className="text-lg font-bold mb-6">Order Summary</h2>

      {/* Cart Items Preview */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm font-semibold">{itemCount} Items</span>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cartProducts.slice(0, 5).map((item: any) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate flex-1">
                {typeof item.product === 'object' ? item.product?.title : 'Product'} x{item.count}
              </span>
              <span className="font-medium">
                {(item.price * item.count).toFixed(2)} EGP
              </span>
            </div>
          ))}
          {itemCount > 5 && (
            <p className="text-xs text-gray-500">+{itemCount - 5} more items</p>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2 mb-6 pb-6 border-b text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{totalPrice.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method</span>
          <span className="capitalize font-medium">
            {paymentMethod === "cash" ? "Cash on Delivery" : "Credit Card"}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            {totalPrice.toFixed(2)} EGP
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={!isReadyToOrder}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Package className="mr-2 h-4 w-4" />
            Place Order
          </>
        )}
      </Button>

      {!selectedAddressId && !loadingAddresses && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Please select an address
        </p>
      )}
    </div>
  );
}
