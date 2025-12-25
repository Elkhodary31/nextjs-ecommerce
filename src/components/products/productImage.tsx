import { useState } from "react";
import Image from "next/image";
import { IProduct } from "@/lib/interfaces/product";

export default function ProductImage({ product }: { product: IProduct }) {
  const [backgroundPos, setBackgroundPos] = useState("50% 50%");
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPos(`${x}% ${y}%`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      className="
        w-full 
        h-56 
        bg-white   
        flex items-center justify-center
        overflow-hidden rounded-t-2xl relative
        cursor-zoom-in
      "
    >
      <Image
        src={product.imageCover}
        alt={product.title}
        width={500}
        height={500}
        className={`
          max-w-full max-h-full
          object-fill 
          transition-transform duration-700 
          ${isZoomed ? "scale-[1.8]" : "scale-100"}
        `}
        style={{
          transformOrigin: backgroundPos,
        }}
      />
    </div>
  );
}
