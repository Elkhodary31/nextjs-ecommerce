"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import QuantitySelector from "./QuantitySelector";

export default function AddToCartSection({
  productId,
  maxQuantity,
}: {
  productId: string;
  maxQuantity: number;
}) {
  const { addItemToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItemToCart(productId);
  };

  return (
    <div className="flex gap-3">
      <QuantitySelector max={maxQuantity} onQuantityChange={setQuantity} />
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 h-11 cursor-pointer transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
