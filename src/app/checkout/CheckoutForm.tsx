"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartProvider";
import { getAllAddresses, addAddress } from "@/lib/services/address.service";
import { IAddress, IAddressRequest } from "@/lib/interfaces/address";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { AddressSection } from "@/components/checkout/AddressSection";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import {
  createCheckoutSession,
  createCashOrder,
} from "@/lib/services/order.service";

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
      const addressList = await getAllAddresses(token);
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
        const addressList = await addAddress(token, newAddress);
        const addedAddress = addressList[addressList.length - 1];
        setAddresses(addressList);
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

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Selected address not found");
      return;
    }

    try {
      setSubmitting(true);

      if (paymentMethod === PAYMENT_METHODS.CARD) {
        // Create checkout session for card payment
        const response = await createCheckoutSession(
          cart._id,
          {
            details: selectedAddress.details,
            phone: selectedAddress.phone,
            city: selectedAddress.city,
          },
          token,
          `${window.location.origin}/orders`
        );

        toast.success("Redirecting to payment...");
        // Redirect to Stripe checkout
        window.location.href = response.session.url;
      } else {
        // Create cash on delivery order
        const orderData = await createCashOrder(
          cart._id,
          selectedAddressId,
          token
        );

        toast.success("Order placed successfully!");
        router.push(`/orders`);
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to place order");
      setSubmitting(false);
    }
  }, [cart, selectedAddressId, addresses, paymentMethod, token, router]);

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
