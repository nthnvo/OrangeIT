import { useNavigate } from "react-router-dom";
import { Trash2, ChevronLeft, Plus, Minus } from "lucide-react";
import { useCart } from "./CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-5xl mx-auto flex gap-5 items-start">

        {/* Left: Cart Items */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-5 pb-4 border-b border-gray-100">
            ตะกร้าสินค้า ({totalItems})
          </h2>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
              <p className="text-base">ไม่มีสินค้าในตะกร้า</p>
              <button
                className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-yellow-500 transition"
                onClick={() => navigate("/")}
              >
                กลับไปช้อปปิ้ง
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-50">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain bg-gray-50 border border-gray-100 rounded-lg p-1 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    {item.color && (
                      <p className="text-xs text-gray-400 mb-1">{item.color}</p>
                    )}
                    <p className="text-xs text-yellow-500 font-medium">
                      โปรโมชั่นผ่อน 0% ที่ร่วมรายการ
                    </p>
                  </div>

                  {/* Price */}
                  <span className="text-base font-bold text-gray-900 min-w-[90px] text-right">
                    ฿{item.price.toLocaleString()}
                  </span>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold border-x border-gray-200 leading-8">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    className="text-gray-300 hover:text-red-500 transition p-1.5 rounded"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                className="flex items-center gap-1 text-yellow-500 text-sm font-medium mt-5 hover:text-yellow-600 transition"
                onClick={() => navigate("/")}
              >
                <ChevronLeft size={16} /> ดูสินค้าอื่นๆ
              </button>
            </>
          )}
        </div>

        {/* Right: Summary */}
        {cartItems.length > 0 && (
          <div className="w-72 flex-shrink-0 flex flex-col gap-3 sticky top-6">

            

            {/* Coupon */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex gap-2">
              <input
                type="text"
                placeholder="กรอกคูปองส่วนลด"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400"
              />
              <button className="bg-gray-900 text-white text-sm font-semibold px-4 rounded-lg hover:bg-gray-700 transition">
                ใช้งาน
              </button>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>ยอดรวม</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>ส่วนลด</span>
                <span>- ฿0</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                <span>ยอดรวมสุทธิ</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-lg text-base hover:bg-yellow-500 transition"
              onClick={() => navigate("/checkout")}
            >
              ดำเนินการสั่งซื้อ
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;