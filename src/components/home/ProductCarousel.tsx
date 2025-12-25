"use client";

import { useEffect, useRef, useState } from "react";
import { IProduct } from "@/lib/interfaces/product";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/productCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  products: IProduct[];
  title?: string;
  speedPxPerTick?: number;
}

export default function ProductCarousel({ products, title = "Featured Products", speedPxPerTick = 2 }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = products ?? [];
  const loopItems = [...items, ...items];

  useEffect(() => {
    if (!scrollerRef.current) return;

    const start = () => {
      if (tickRef.current) return;
      tickRef.current = setInterval(() => {
        const el = scrollerRef.current!;
        el.scrollLeft += speedPxPerTick;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft = el.scrollLeft - half;
        }
      }, 16);
    };

    const stop = () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };

    if (paused) stop();
    else start();

    return () => stop();
  }, [paused, speedPxPerTick]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const dist = Math.max(200, el.clientWidth * 0.8);
    el.scrollLeft += dir === "right" ? dist : -dist;
  };

  return (
    <section className="my-container py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2 items-center">
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium mr-2">View All</Link>
          <Button variant="outline" size="icon" onClick={() => scrollBy("left")} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scrollBy("right")} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={scrollerRef} className="w-full overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4">
            {loopItems.map((p, idx) => (
              <div key={`${p._id}-${idx}`} className="min-w-[260px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
