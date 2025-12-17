"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuantitySelector({
  max,
  onQuantityChange,
}: {
  max: number;
  onQuantityChange?: (qty: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  return (
    <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-gray-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="h-8 w-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-8 text-center font-semibold text-lg transition-all">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="h-8 w-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
