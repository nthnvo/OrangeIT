import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allProducts } from "../data/products";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = allProducts.filter((p) =>
    `${p.title} ${p.brand}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="grow max-w-6xl mx-auto px-4 py-8 w-full">
        <p className="text-sm text-gray-500 mb-6">
          ผลการค้นหา "<span className="font-semibold text-gray-800">{query}</span>"
          — พบ {results.length} รายการ
        </p>

        {results.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-lg">
            ไม่พบสินค้าที่ตรงกับคำค้นหา
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-44 flex items-center justify-center bg-white p-4">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 font-semibold">{p.brand}</p>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5 min-h-[40px]">
                    {p.title}
                  </p>
                  <p className="text-red-500 font-bold mt-2">
                    ฿{p.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}