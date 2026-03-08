import { useLocation, useNavigate } from "react-router-dom";

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, items, totalPrice, customerName } = location.state || {};

  if (!orderId) {
    navigate("/");
    return null;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-orange-400 text-white text-center px-6 pt-8 pb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold mx-auto mb-4">
            ✓
          </div>
          <h2 className="text-xl font-bold mb-1">ชำระเงินเสร็จสิ้น</h2>
          <p className="text-sm text-white">ขอบคุณที่ใช้บริการ</p>
        </div>

        {/* Order Badge */}
        <div className="text-center p-5 bg-gray-50">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            เลขที่คำสั่งซื้อ
          </p>
          <p className="text-xl font-bold text-gray-900 font-mono tracking-widest">
            {orderId}
          </p>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 mx-5" />

        {/* Info */}
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">ผู้สั่งซื้อ</span>
            <span className="font-semibold text-gray-900">{customerName}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">วันที่ชำระ</span>
            <span className="font-semibold text-gray-900">{dateStr}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">เวลา</span>
            <span className="font-semibold text-gray-900">{timeStr}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-400">สถานะ</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              ✓ ชำระแล้ว
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 mx-5" />

        {/* Items */}
        <div className="px-6 py-4">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
            รายการสินค้า
          </p>

          {items?.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-start mb-3"
            >
              <div className="flex flex-col gap-1 flex-1 pr-3">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {item.name}
                </span>
                <span className="text-xs text-gray-400">
                  จำนวน {item.quantity} ชิ้น
                </span>
              </div>

              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                ฿{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-gray-200 mx-5" />

        {/* Total */}
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              ยอดรวมสุทธิ
            </span>
            <span className="text-2xl font-bold text-red-600">
              ฿{totalPrice?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              วิธีชำระเงิน
            </span>
            <span className="text-sm text-gray-400">QR Code</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 mx-5" />

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 leading-relaxed px-6 py-4">
          สินค้าจะจัดส่งภายใน 1-3 วันทำการ
          <br />
          กรุณาเก็บเลขที่คำสั่งซื้อไว้สำหรับติดตาม
        </p>

        {/* Button */}
        <div className="px-6 pb-6">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-black text-white rounded-lg font-bold hover:opacity-90 transition"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;