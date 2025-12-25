"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  autoPlayMs?: number;
}

export default function HeroCarousel({ images, autoPlayMs = 4000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, autoPlayMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, autoPlayMs]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((i) => (i + 1) % images.length);
      }, autoPlayMs);
    }
  };

  return (
    <section className="relative w-full h-[200px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img}
            alt={`Slide ${idx + 1}`}
            fill
            priority={idx === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Circle Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              idx === currentIndex
                ? "bg-blue-600 border-blue-600 scale-125 shadow-lg"
                : "bg-white/30 border-white hover:bg-white/60 hover:border-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
