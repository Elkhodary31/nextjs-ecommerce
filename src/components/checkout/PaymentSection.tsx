"use client";

import { CreditCard, Wallet } from "lucide-react";

interface PaymentSectionProps {
  paymentMethod: "cash" | "card";
  onPaymentMethodChange: (method: "cash" | "card") => void;
}

export function PaymentSection({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Payment Method</h2>

      <div className="space-y-3">
        {/* Cash on Delivery */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition">
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => onPaymentMethodChange(e.target.value as "cash")}
            className="mr-3"
          />
          <Wallet className="w-5 h-5 mr-3 text-green-600" />
          <div className="flex-1">
            <p className="font-semibold">Cash on Delivery</p>
            <p className="text-sm text-gray-600">Pay when your order arrives</p>
          </div>
        </label>

        {/* Credit Card */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => onPaymentMethodChange(e.target.value as "card")}
            className="mr-3"
          />
          <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
          <div className="flex-1">
            <p className="font-semibold">Credit Card</p>
            <p className="text-sm text-gray-600">Secure payment via Stripe</p>
          </div>
        </label>
      </div>

      {paymentMethod === "card" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💳 You'll be redirected to our secure payment page to complete your
            transaction.
          </p>
        </div>
      )}
    </div>
  );
}
