import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  brand: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({
  id,
  brand,
  title,
  description,
  price,
  image,
  isNew = false,
}: ProductCardProps) {
  return (
    <Link to={`/product/${id}`} className="block h-full">
      <div className="bg-white rounded-2xl shadow-md h-full flex flex-col overflow-hidden group hover:shadow-lg transition">

        {/* Image Section */}
        <div className="relative bg-white h-56 flex items-center justify-center">

          {/* Brand */}
          <span className="absolute top-3 left-4 text-xs text-gray-600 font-semibold">
            {brand}
          </span>

          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-12 shadow">
              NEW!
            </div>
          )}

          <img
            src={image}
            alt={title}
            className="h-36 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">

          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
            {title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mt-1">
            {description}
          </p>

          {/* Price */}
          <p className="text-red-500 font-bold text-lg mt-auto">
            ฿{price.toLocaleString()}
          </p>

        </div>
      </div>
    </Link>
  );
}