"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/lib/interfaces/product";
import ProductCard from "@/components/products/productCard";
import { Clock } from "lucide-react";

interface Props {
  products: IProduct[];
  title?: string;
}

export default function FlashSale({ products, title = "Flash Sale" }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Fixed start date: Jan 1, 2025
      const saleStart = new Date("2025-01-01T00:00:00");
      const now = new Date();
      
      // Calculate how many 3-day cycles have passed
      const msPerCycle = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      const msSinceStart = now.getTime() - saleStart.getTime();
      const cyclesPassed = Math.floor(msSinceStart / msPerCycle);
      
      // Next sale end is start + (cycles + 1) * 3 days
      const nextSaleEnd = new Date(saleStart.getTime() + (cyclesPassed + 1) * msPerCycle);
      
      const diff = nextSaleEnd.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="my-container py-10">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-white" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
          
          <div className="flex gap-3">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-3 min-w-[70px]">
      <span className="text-2xl font-bold text-gray-900">{value.toString().padStart(2, "0")}</span>
      <span className="text-xs text-gray-600 uppercase">{label}</span>
    </div>
  );
}
