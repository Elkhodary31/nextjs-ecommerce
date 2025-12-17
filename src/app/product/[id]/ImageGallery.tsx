"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageGallery({
  images,
  cover,
  title,
}: {
  images: string[];
  cover: string;
  title: string;
}) {
  const [idx, setIdx] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [bgPos, setBgPos] = useState("50% 50%");
  const list = images?.length ? images : [cover];

  // Auto-advance carousel with pause on hover
  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % list.length);
    }, 3500);
    if (isHovering) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [isHovering, list.length]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-lg border bg-white ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onMouseEnter={() => {
          setIsHovering(true);
          setIsZoomed(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsZoomed(false);
          setBgPos("50% 50%");
        }}
        onMouseMove={handleMove}
      >
        <Image
          src={list[idx] || cover}
          alt={title}
          fill
          className="object-contain p-4"
          priority
        />
        {/* Zoom overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${list[idx] || cover})`,
            backgroundSize: "200% 200%",
            backgroundPosition: bgPos,
            opacity: isZoomed ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
        />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition ${
                idx === i
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`Preview image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} - ${i + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
