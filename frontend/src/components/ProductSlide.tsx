import { useRef } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  brand: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
}

interface Props {
  title: string;
  products: Product[];
}

export default function ProductSlider({ title, products }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-8 relative">

      {/* Title */}
      <div className="px-3 pb-3 text-2xl font-bold">
        {title}
      </div>

      {/* ปุ่มซ้าย */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
      >
        ❮
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-8 no-scrollbar"
      >
        {products.map((p) => (
          <div key={p.id} className="min-w-[250px]">
            <ProductCard {...p} />
          </div>
        ))}
      </div>

      {/* ปุ่มขวา */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
      >
        ❯
      </button>
    </div>
  );
}