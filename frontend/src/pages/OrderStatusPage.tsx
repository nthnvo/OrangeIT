import { useState } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";
import { allProducts } from "../data/products";

interface OrderData {
    orderId: string;
    customer: { name: string; phone: string };
    items: { id: number; name: string; quantity: number; price: number; image: string }[];
    totalPrice: number;
    status: string;
    shippingStatus?: string;
    createdAt: any;
}

const shippingSteps = [
    { key: "pending", label: "รอดำเนินการ", icon: <Clock size={20} />, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-300" },
    { key: "packing", label: "กำลังแพ็คสินค้า", icon: <Package size={20} />, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-300" },
    { key: "preparing", label: "เตรียมส่งสินค้า", icon: <CheckCircle size={20} />, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-300" },
    { key: "shipped", label: "ส่งสินค้าแล้ว", icon: <Truck size={20} />, color: "text-green-500", bg: "bg-green-50", border: "border-green-300" },
];

export default function OrderStatusPage() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        const trimmed = orderId.trim().toUpperCase();
        if (!trimmed) return;
        setLoading(true);
        setError("");
        setOrder(null);
        setSearched(true);

        try {
            const { collection, query, where, getDocs } = await import("firebase/firestore");
            const q = query(collection(db, "orders"), where("orderId", "==", trimmed));
            const snap = await getDocs(q);

            if (snap.empty) {
                setError("ไม่พบหมายเลขคำสั่งซื้อนี้ กรุณาตรวจสอบอีกครั้ง");
            } else {
                setOrder({ id: snap.docs[0].id, ...snap.docs[0].data() } as any);
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
        setLoading(false);
    };

    const currentStep = shippingSteps.findIndex(
        (s) => s.key === (order?.shippingStatus || "pending")
    );

    const formatDate = (ts: any) => {
        if (!ts) return "-";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return (
            d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }) +
            " " +
            d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">ตรวจสอบสถานะสินค้า</h1>
                    <p className="text-gray-500 text-sm mt-1">กรอกหมายเลขคำสั่งซื้อเพื่อดูสถานะการจัดส่ง</p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        หมายเลขคำสั่งซื้อ (Order ID)
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="เช่น ORD-92512216"
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition font-mono"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <Search size={18} />
                            {loading ? "กำลังค้นหา..." : "ค้นหา"}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {searched && error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 mb-6">
                        <XCircle size={22} className="text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Result */}
                {order && (
                    <div className="space-y-4">

                        {/* Order Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">หมายเลขคำสั่งซื้อ</p>
                                    <p className="font-mono font-black text-gray-900 text-lg">{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">วันที่สั่งซื้อ</p>
                                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                                <span className="text-gray-500">
                                    ชื่อผู้รับ:{" "}
                                    <span className="font-semibold text-gray-800">{order.customer?.name}</span>
                                </span>
                                <span className="font-bold text-gray-900">฿{order.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Shipping Status Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-bold text-gray-800 mb-6">สถานะการจัดส่ง</h3>
                            <div className="relative">
                                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
                                <div
                                    className="absolute left-5 top-5 w-0.5 bg-orange-400 transition-all duration-500"
                                    style={{
                                        height: `${currentStep <= 0 ? 0 : (currentStep / (shippingSteps.length - 1)) * 100}%`,
                                    }}
                                />
                                <div className="space-y-6">
                                    {shippingSteps.map((step, i) => {
                                        const isDone = i <= currentStep;
                                        const isCurrent = i === currentStep;
                                        return (
                                            <div key={step.key} className="flex items-start gap-4 relative">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all ${isDone
                                                        ? `${step.bg} ${step.border} ${step.color}`
                                                        : "bg-white border-gray-200 text-gray-300"
                                                    } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}>
                                                    {step.icon}
                                                </div>
                                                <div className="pt-1.5">
                                                    <p className={`text-sm font-bold ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-xs text-orange-500 font-semibold mt-0.5">● สถานะปัจจุบัน</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-bold text-gray-800 mb-4">รายการสินค้า</h3>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, i) => {
                                    const productImage =
                                        item.image ||
                                        allProducts.find((p) => p.id === Number(item.id))?.image ||
                                        null;

                                    return (
                                        <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">

                                            {/* รูป */}
                                            <div className="w-14 h-14 border rounded-xl flex-shrink-0 bg-gray-50 flex items-center justify-center p-1 overflow-hidden">
                                                {productImage ? (
                                                    <img
                                                        src={productImage}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <Package size={20} className="text-gray-300" />
                                                )}
                                            </div>

                                            {/* ชื่อสินค้า */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                                            </div>

                                            {/* ราคา */}
                                            <span className="text-sm font-bold text-gray-800 whitespace-nowrap flex-shrink-0">
                                                ฿{(item.price * item.quantity).toLocaleString()}
                                            </span>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}