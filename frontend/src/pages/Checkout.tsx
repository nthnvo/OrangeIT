import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    zip: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.province || !form.zip) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const orderId = "ORD-" + Date.now().toString().slice(-8);

    await addDoc(collection(db, "orders"), {
      orderId,
      customer: { name: form.name, phone: form.phone },
      shippingAddress: {
        address: form.address,
        province: form.province,
        zip: form.zip,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalPrice,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    await Promise.all(
      cartItems.map((item) =>
        updateDoc(doc(db, "stock", String(item.id)), {
          stock: increment(-item.quantity),
        })
      )
    );

    navigate("/payment", {
      state: { orderId, items: cartItems, totalPrice, customerName: form.name },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Step Bar */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">1</div>
          <span className="text-sm font-semibold text-gray-900">ที่อยู่จัดส่ง</span>
        </div>

        <div className="w-10 md:w-14 h-0.5 bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">2</div>
          <span className="text-sm text-gray-400">ชำระเงิน</span>
        </div>

        <div className="w-10 md:w-14 h-0.5 bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">3</div>
          <span className="text-sm text-gray-400">ใบเสร็จ</span>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-5 items-start">

        {/* Form */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 md:p-6">

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h2 className="text-base font-bold text-gray-900">
              ข้อมูลสำหรับจัดส่ง
            </h2>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              ชื่อ-นามสกุล *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="กรอกชื่อ-นามสกุล"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              เบอร์โทรศัพท์ *
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0XXXXXXXXX"
              maxLength={10}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              ที่อยู่ *
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="บ้านเลขที่ ถนน แขวง/ตำบล"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                จังหวัด *
              </label>

              <input
                name="province"
                value={form.province}
                onChange={handleChange}
                placeholder="จังหวัด"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                รหัสไปรษณีย์ *
              </label>

              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="XXXXX"
                maxLength={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
              />
            </div>
          </div>

        </div>

        {/* Summary */}
        <div className="w-full md:w-72 flex-shrink-0 md:sticky md:top-6">

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-5">

            <h3 className="text-base font-bold mb-4 pb-4 border-b border-gray-100">
              สรุปคำสั่งซื้อ
            </h3>

            <div className="flex flex-col gap-3 mb-4">

              {cartItems.map((item) => (

                <div key={item.id} className="flex items-center gap-3">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain bg-gray-50 border border-gray-100 rounded-lg p-1"
                  />

                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </p>

                    {item.color && (
                      <p className="text-xs text-gray-400">{item.color}</p>
                    )}

                    <p className="text-xs text-gray-400">
                      x{item.quantity}
                    </p>

                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>

                </div>

              ))}

            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">

              <div className="flex justify-between text-sm text-gray-500">
                <span>ยอดรวม</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>ค่าจัดส่ง</span>
                <span className="text-green-600 font-semibold">ฟรี</span>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>ยอดรวมสุทธิ</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>

            </div>

            <button
              onClick={handleSubmit}
              className="hidden md:block w-full bg-yellow-400 text-black font-bold py-3.5 rounded-lg text-sm mt-4 hover:bg-yellow-500"
            >
              ดำเนินการชำระเงิน →
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 md:hidden">

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg"
        >
          ชำระเงิน ฿{totalPrice.toLocaleString()}
        </button>

      </div>

    </div>
  );
};

export default CheckoutPage;