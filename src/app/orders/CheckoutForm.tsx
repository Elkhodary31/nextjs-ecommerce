"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartProvider";
import { getAllAddresses, addAddress } from "@/lib/services/address.service";
import { IAddress, IAddressRequest } from "@/lib/interfaces/address";
import { CheckoutSkeleton } from "./components/CheckoutSkeleton";
import { AddressSection } from "./components/AddressSection";
import { PaymentSection } from "./components/PaymentSection";
import { OrderSummary } from "./components/OrderSummary";

const PAYMENT_METHODS = {
  CASH: "cash" as const,
  CARD: "card" as const,
};

const INITIAL_ADDRESS = { name: "", details: "", phone: "", city: "" };

export default function CheckoutForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, loading } = useCart();
  const token = (session as any)?.token;

  // State management
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">(
    PAYMENT_METHODS.CASH
  );
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddressRequest>(
    INITIAL_ADDRESS
  );

  // Load addresses on mount
  useEffect(() => {
    if (token) {
      loadAddresses();
    }
  }, [token]);

  const loadAddresses = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingAddresses(true);
      const response = await getAllAddresses(token);
      const addressList = response.data || [];
      setAddresses(addressList);
      if (addressList.length > 0) {
        setSelectedAddressId(addressList[0]._id);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  }, [token]);

  const handleAddAddress = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) return;

      const { name, details, phone } = newAddress;
      if (!name || !details || !phone) {
        toast.error("Please fill in all address fields");
        return;
      }

      try {
        setSavingAddress(true);
        const response = await addAddress(token, newAddress);
        const addedAddress = Array.isArray(response.data) 
          ? response.data[response.data.length - 1] 
          : response.data;
        setAddresses((prev) => [...prev, addedAddress]);
        setSelectedAddressId(addedAddress._id);
        setNewAddress(INITIAL_ADDRESS);
        setShowAddressForm(false);
        toast.success("Address added successfully");
      } catch (error: any) {
        console.error("Failed to add address:", error);
        toast.error(error.message || "Failed to add address");
      } finally {
        setSavingAddress(false);
      }
    },
    [token, newAddress]
  );

  const handlePlaceOrder = useCallback(async () => {
    if (!cart || !selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartId: cart._id,
          shippingAddress: selectedAddressId,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const orderData = await response.json();
      toast.success("Order placed successfully!");

      if (paymentMethod === PAYMENT_METHODS.CARD) {
        window.location.href = orderData.paymentUrl || "/order-confirmation";
      } else {
        router.push(`/order-confirmation?orderId=${orderData.data._id}`);
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }, [cart, selectedAddressId, paymentMethod, token, router]);

  // Computed values
  const cartId = cart?._id || "";
  const itemCount = cart?.products?.length || 0;
  const totalPrice = cart?.totalCartPrice || 0;
  const cartProducts = cart?.products || [];

  // Loading state
  if (loading || !cart) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Address First */}
        <AddressSection
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onAddressChange={setSelectedAddressId}
          loadingAddresses={loadingAddresses}
          showAddressForm={showAddressForm}
          onShowAddressForm={setShowAddressForm}
          newAddress={newAddress}
          onNewAddressChange={setNewAddress}
          onAddAddress={handleAddAddress}
          savingAddress={savingAddress}
        />

        {/* Payment Second */}
        <PaymentSection
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>

      {/* Order Summary Sidebar */}
      <OrderSummary
        cartId={cartId}
        itemCount={itemCount}
        totalPrice={totalPrice}
        cartProducts={cartProducts}
        loading={loading}
        loadingAddresses={loadingAddresses}
        selectedAddressId={selectedAddressId}
        submitting={submitting}
        paymentMethod={paymentMethod}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
