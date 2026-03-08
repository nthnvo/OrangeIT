import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection, getDocs, query, orderBy,
    doc, setDoc, writeBatch, updateDoc, increment
} from "firebase/firestore";
import { db } from "../firebase";
import { allProducts } from "../data/products";
import {
    Users, Package, ShoppingCart, TrendingUp,
    ClipboardList, BarChart2, LogOut, Menu, X, DollarSign,
    Truck,
} from "lucide-react";

interface Order {
    id: string;
    orderId: string;
    customer: { name: string; phone: string };
    items: { id: number; name: string; quantity: number; price: number }[];
    totalPrice: number;
    status: string;
    createdAt: any;
}

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: any;
}

interface StockItem {
    productId: number;
    title: string;
    brand: string;
    price: number;
    image: string;
    stock: number;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [editingStock, setEditingStock] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const ordersSnap = await getDocs(
                query(collection(db, "orders"), orderBy("createdAt", "desc"))
            );
            setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[]);

            const usersSnap = await getDocs(collection(db, "users"));
            setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as User[]);

            const stockSnap = await getDocs(collection(db, "stock"));
            if (!stockSnap.empty) {
                const stockData = stockSnap.docs
                    .map((d) => d.data() as StockItem)
                    .sort((a, b) => a.productId - b.productId);
                setStockItems(stockData);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    };

    // อัพโหลด stock ครั้งแรก — ตั้งต้น 99 ชิ้น
    const handleSeedStock = async () => {
        setSeeding(true);
        const batch = writeBatch(db);
        for (const p of allProducts) {
            batch.set(doc(db, "stock", String(p.id)), {
                productId: p.id,
                title: p.title,
                brand: p.brand,
                price: p.price,
                image: p.image,
                stock: 99,
            });
        }
        await batch.commit();
        await fetchData();
        setSeeding(false);
    };

    // ซิงค์ stock จาก order ทั้งหมดที่มีอยู่ — reset 99 แล้วหักตาม orders จริง
    const handleSyncStock = async () => {
        setSyncing(true);
        setSyncResult("");

        // reset stock ทั้งหมดกลับ 99 ก่อน
        const resetBatch = writeBatch(db);
        for (const p of allProducts) {
            resetBatch.set(doc(db, "stock", String(p.id)), {
                productId: p.id,
                title: p.title,
                brand: p.brand,
                price: p.price,
                image: p.image,
                stock: 99,
            });
        }
        await resetBatch.commit();

        // รวมจำนวนที่ขายแต่ละ product id จาก orders ทั้งหมด
        const ordersSnap = await getDocs(collection(db, "orders"));
        const deductions: Record<string, number> = {};
        ordersSnap.docs.forEach((d) => {
            const order = d.data();
            order.items?.forEach((item: any) => {
                const id = String(item.id);
                deductions[id] = (deductions[id] || 0) + item.quantity;
            });
        });

        // หัก stock ตามที่ขายไป
        await Promise.all(
            Object.entries(deductions).map(([id, qty]) =>
                updateDoc(doc(db, "stock", id), { stock: increment(-qty) })
            )
        );

        setSyncResult(`✅ ซิงค์เสร็จ! จาก ${ordersSnap.size} orders`);
        await fetchData();
        setSyncing(false);
    };

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    const menuItems = [
        { id: "overview", label: "ภาพรวม", icon: <BarChart2 size={18} /> },
        { id: "orders", label: "คำสั่งซื้อ", icon: <ShoppingCart size={18} /> },
        { id: "users", label: "จัดการผู้ใช้งาน", icon: <Users size={18} /> },
        { id: "products", label: "ตรวจสอบสินค้า", icon: <Package size={18} /> },
        { id: "stock", label: "อัปเดตสต็อกสินค้า", icon: <ClipboardList size={18} /> },
        { id: "revenue", label: "รายงานยอดขาย", icon: <TrendingUp size={18} /> },
        { id: "payment", label: "ตรวจสอบการชำระเงิน", icon: <DollarSign size={18} /> },
        { id: "shipping", label: "ตรวจสอบสถานะสินค้า", icon: <Truck size={18} /> },

    ];

    const formatDate = (ts: any) => {
        if (!ts) return "-";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
    };

    const formatTime = (ts: any) => {
        if (!ts) return "";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    };

    const statusColor: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        confirmed: "bg-blue-100 text-blue-700",
        shipped: "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const statusLabel: Record<string, string> = {
        pending: "รอดำเนินการ",
        confirmed: "ยืนยันแล้ว",
        shipped: "จัดส่งแล้ว",
        delivered: "ส่งถึงแล้ว",
        cancelled: "ยกเลิก",
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">

            {/* SIDEBAR */}
            <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg flex flex-col transition-all duration-300 flex-shrink-0`}>
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
                    <div className="w-9 h-9 bg-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-black text-sm">B</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="font-black text-gray-900 text-sm">Orange Admin</p>
                            <p className="text-xs text-gray-400">ระบบจัดการหลังบ้าน</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-4 space-y-1 px-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === item.id
                                    ? "bg-orange-400 text-white"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span>ออกจากระบบ</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* TOP BAR */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen((v) => !v)} className="text-gray-500 hover:text-orange-400 transition">
                            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">
                            {menuItems.find((m) => m.id === activeTab)?.label}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Admin</span>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* ===== OVERVIEW ===== */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "คำสั่งซื้อทั้งหมด", value: orders.length, icon: <ShoppingCart size={22} />, color: "bg-blue-50 text-blue-500" },
                                            { label: "รายได้รวม", value: `฿${totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: "bg-green-50 text-green-500" },
                                            { label: "รอดำเนินการ", value: pendingOrders, icon: <ClipboardList size={22} />, color: "bg-yellow-50 text-yellow-500" },
                                            { label: "ผู้ใช้ทั้งหมด", value: users.length, icon: <Users size={22} />, color: "bg-purple-50 text-purple-500" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                                    {stat.icon}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">{stat.label}</p>
                                                    <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                            <h2 className="font-bold text-gray-800">คำสั่งซื้อล่าสุด</h2>
                                            <button onClick={() => setActiveTab("orders")} className="text-xs text-orange-400 font-semibold hover:underline">
                                                ดูทั้งหมด
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left">เลขที่คำสั่งซื้อ</th>
                                                        <th className="px-6 py-3 text-left">ลูกค้า</th>
                                                        <th className="px-6 py-3 text-left">วันที่</th>
                                                        <th className="px-6 py-3 text-right">ยอดรวม</th>
                                                        <th className="px-6 py-3 text-center">สถานะ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {orders.slice(0, 5).map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{order.orderId}</td>
                                                            <td className="px-6 py-4 text-gray-700">{order.customer?.name || "-"}</td>
                                                            <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)} {formatTime(order.createdAt)}</td>
                                                            <td className="px-6 py-4 text-right font-bold text-gray-800">฿{order.totalPrice?.toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-gray-100 text-gray-500"}`}>
                                                                    {statusLabel[order.status] || order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {orders.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีคำสั่งซื้อ</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== ORDERS ===== */}
                            {activeTab === "orders" && (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="font-bold text-gray-800">คำสั่งซื้อทั้งหมด ({orders.length} รายการ)</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">เลขที่</th>
                                                    <th className="px-6 py-3 text-left">ลูกค้า</th>
                                                    <th className="px-6 py-3 text-left">เบอร์โทร</th>
                                                    <th className="px-6 py-3 text-left">สินค้า</th>
                                                    <th className="px-6 py-3 text-left">วันที่</th>
                                                    <th className="px-6 py-3 text-right">ยอดรวม</th>
                                                    <th className="px-6 py-3 text-center">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{order.orderId}</td>
                                                        <td className="px-6 py-4 text-gray-700">{order.customer?.name || "-"}</td>
                                                        <td className="px-6 py-4 text-gray-500 text-xs">{order.customer?.phone || "-"}</td>
                                                        <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px]">
                                                            {order.items?.map((item, i) => (
                                                                <p key={i} className="truncate">{item.name} x{item.quantity}</p>
                                                            ))}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                                                        <td className="px-6 py-4 text-right font-bold text-gray-800">฿{order.totalPrice?.toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-gray-100 text-gray-500"}`}>
                                                                {statusLabel[order.status] || order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {orders.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีคำสั่งซื้อ</p>}
                                    </div>
                                </div>
                            )}

                            {/* ===== USERS ===== */}
                            {activeTab === "users" && (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="font-bold text-gray-800">จัดการผู้ใช้งาน ({users.length} คน)</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">ลำดับ</th>
                                                    <th className="px-6 py-3 text-left">ชื่อ</th>
                                                    <th className="px-6 py-3 text-left">Email</th>
                                                    <th className="px-6 py-3 text-left">วันที่สมัคร</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {users.map((user, i) => (
                                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                                                        <td className="px-6 py-4 font-semibold text-gray-700">{user.name}</td>
                                                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {users.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีผู้ใช้งาน</p>}
                                    </div>
                                </div>
                            )}

                            {/* ===== ตรวจสอบสินค้า (พนักงานดูสต็อก) ===== */}
                            {activeTab === "products" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "สินค้าทั้งหมด", value: `${stockItems.length} รายการ`, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "สินค้าใกล้หมด (≤5 ชิ้น)", value: `${stockItems.filter((s) => s.stock > 0 && s.stock <= 5).length} รายการ`, color: "text-yellow-600", bg: "bg-yellow-50" },
                                            { label: "สินค้าหมดสต็อก", value: `${stockItems.filter((s) => s.stock === 0).length} รายการ`, color: "text-red-600", bg: "bg-red-50" },
                                        ].map((s) => (
                                            <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
                                                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                            <h2 className="font-bold text-gray-800">สถานะสต็อกสินค้าทั้งหมด</h2>
                                            {stockItems.length === 0 && (
                                                <button
                                                    onClick={handleSeedStock}
                                                    disabled={seeding}
                                                    className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                                                >
                                                    {seeding ? "กำลังโหลด..." : "🚀 เพิ่มข้อมูล Stock ครั้งแรก"}
                                                </button>
                                            )}
                                        </div>

                                        {stockItems.length === 0 ? (
                                            <div className="text-center py-16 text-gray-400">
                                                <Package size={40} className="mx-auto mb-3 opacity-30" />
                                                <p className="text-sm">ยังไม่มีข้อมูล Stock</p>
                                                <p className="text-xs mt-1">กดปุ่ม "เพิ่มข้อมูล Stock ครั้งแรก" ด้านบน</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left w-12">ID</th>
                                                            <th className="px-4 py-3 text-left">สินค้า</th>
                                                            <th className="px-4 py-3 text-center w-28">คงเหลือ</th>
                                                            <th className="px-4 py-3 text-center w-28">สถานะ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {stockItems.map((item) => (
                                                            <tr key={item.productId} className={`transition ${item.stock === 0 ? "bg-red-50" : item.stock <= 5 ? "bg-yellow-50" : "hover:bg-gray-50"
                                                                }`}>
                                                                <td className="px-4 py-3 text-gray-400 text-xs">{item.productId}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={item.image} alt={item.title} className="w-10 h-10 object-contain flex-shrink-0 rounded-lg border p-0.5" />
                                                                        <div>
                                                                            <p className="text-xs text-orange-500 font-semibold">{item.brand}</p>
                                                                            <p className="text-gray-700 text-sm line-clamp-1 max-w-sm">{item.title}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <span className={`text-lg font-black ${item.stock === 0 ? "text-red-500" : item.stock <= 5 ? "text-yellow-600" : "text-gray-800"
                                                                        }`}>
                                                                        {item.stock}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 ml-1">ชิ้น</span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    {item.stock === 0 ? (
                                                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">หมดสต็อก</span>
                                                                    ) : item.stock <= 5 ? (
                                                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">ใกล้หมด</span>
                                                                    ) : (
                                                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">พร้อมขาย</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ===== อัปเดตสต็อก (Admin แก้ตัวเลขได้) ===== */}
                            {activeTab === "stock" && (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                                        <h2 className="font-bold text-gray-800">อัปเดตสต็อกสินค้า ({stockItems.length} รายการ)</h2>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {syncResult && (
                                                <span className="text-xs text-green-600 font-semibold">{syncResult}</span>
                                            )}
                                            <button
                                                onClick={handleSyncStock}
                                                disabled={syncing}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                                            >
                                                {syncing ? "กำลังซิงค์..." : "🔄 ซิงค์ Stock จาก Orders"}
                                            </button>
                                            <p className="text-xs text-gray-400">แก้ไขตัวเลขแล้วกด บันทึก</p>
                                        </div>
                                    </div>

                                    {stockItems.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">ไปที่ "ตรวจสอบสินค้า" เพื่อเพิ่มข้อมูล Stock ก่อนครับ</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left w-12">ID</th>
                                                        <th className="px-4 py-3 text-left">สินค้า</th>
                                                        <th className="px-4 py-3 text-center w-32">สต็อก (ชิ้น)</th>
                                                        <th className="px-4 py-3 text-center w-24">บันทึก</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {stockItems.map((item) => (
                                                        <tr key={item.productId} className="hover:bg-gray-50 transition">
                                                            <td className="px-4 py-3 text-gray-400 text-xs">{item.productId}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={item.image} alt={item.title} className="w-10 h-10 object-contain flex-shrink-0 rounded-lg border p-0.5" />
                                                                    <div>
                                                                        <p className="text-xs text-orange-500 font-semibold">{item.brand}</p>
                                                                        <p className="text-gray-700 text-sm line-clamp-1 max-w-sm">{item.title}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    defaultValue={item.stock}
                                                                    key={item.productId}
                                                                    onChange={(e) =>
                                                                        setEditingStock((prev) => ({
                                                                            ...prev,
                                                                            [item.productId]: Number(e.target.value),
                                                                        }))
                                                                    }
                                                                    className={`w-20 text-center border rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 ${item.stock === 0
                                                                            ? "border-red-300 text-red-500"
                                                                            : item.stock <= 5
                                                                                ? "border-yellow-300 text-yellow-600"
                                                                                : "border-gray-200 text-gray-800"
                                                                        }`}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <button
                                                                    onClick={async () => {
                                                                        const newStock = editingStock[item.productId] ?? item.stock;
                                                                        await setDoc(
                                                                            doc(db, "stock", String(item.productId)),
                                                                            { stock: newStock, updatedAt: new Date() },
                                                                            { merge: true }
                                                                        );
                                                                        setStockItems((prev) =>
                                                                            prev.map((s) =>
                                                                                s.productId === item.productId ? { ...s, stock: newStock } : s
                                                                            )
                                                                        );
                                                                    }}
                                                                    className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                                                >
                                                                    บันทึก
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ===== REVENUE ===== */}
                            {activeTab === "revenue" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "รายได้รวมทั้งหมด", value: `฿${totalRevenue.toLocaleString()}`, color: "text-green-600" },
                                            { label: "จำนวนคำสั่งซื้อ", value: `${orders.length} รายการ`, color: "text-blue-600" },
                                            { label: "เฉลี่ยต่อคำสั่งซื้อ", value: orders.length > 0 ? `฿${Math.round(totalRevenue / orders.length).toLocaleString()}` : "฿0", color: "text-orange-500" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100">
                                            <h2 className="font-bold text-gray-800">รายงานยอดขาย</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left">เลขที่คำสั่งซื้อ</th>
                                                        <th className="px-6 py-3 text-left">ลูกค้า</th>
                                                        <th className="px-6 py-3 text-left">วันที่</th>
                                                        <th className="px-6 py-3 text-right">ยอด</th>
                                                        <th className="px-6 py-3 text-center">สถานะ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {orders.map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 font-mono text-xs font-semibold">{order.orderId}</td>
                                                            <td className="px-6 py-4 text-gray-700">{order.customer?.name}</td>
                                                            <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                                                            <td className="px-6 py-4 text-right font-bold text-green-600">฿{order.totalPrice?.toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-gray-100 text-gray-500"}`}>
                                                                    {statusLabel[order.status] || order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {orders.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีข้อมูล</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== PAYMENT ===== */}
                            {activeTab === "payment" && (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="font-bold text-gray-800">ตรวจสอบการชำระเงิน</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">เลขที่</th>
                                                    <th className="px-6 py-3 text-left">ลูกค้า</th>
                                                    <th className="px-6 py-3 text-left">วันที่ชำระ</th>
                                                    <th className="px-6 py-3 text-left">วิธีชำระ</th>
                                                    <th className="px-6 py-3 text-right">ยอด</th>
                                                    <th className="px-6 py-3 text-center">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-mono text-xs font-semibold">{order.orderId}</td>
                                                        <td className="px-6 py-4 text-gray-700">{order.customer?.name}</td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)} {formatTime(order.createdAt)}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">QR Code</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-gray-800">฿{order.totalPrice?.toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">ชำระแล้ว</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {orders.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีข้อมูลการชำระเงิน</p>}
                                    </div>
                                </div>
                            )}
                            {/* ===== SHIPPING STATUS ===== */}
                            {activeTab === "shipping" && (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="font-bold text-gray-800">ตรวจสอบสถานะสินค้า ({orders.length} รายการ)</h2>
                                        <p className="text-xs text-gray-400 mt-1">อัปเดตสถานะการจัดส่งสำหรับแต่ละคำสั่งซื้อ</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">เลขที่</th>
                                                    <th className="px-6 py-3 text-left">ลูกค้า</th>
                                                    <th className="px-6 py-3 text-left">สินค้า</th>
                                                    <th className="px-6 py-3 text-left">วันที่</th>
                                                    <th className="px-6 py-3 text-center w-56">สถานะการจัดส่ง</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{order.orderId}</td>
                                                        <td className="px-6 py-4 text-gray-700">{order.customer?.name || "-"}</td>
                                                        <td className="px-6 py-4 text-gray-500 text-xs max-w-[180px]">
                                                            {order.items?.slice(0, 2).map((item, i) => (
                                                                <p key={i} className="truncate">{item.name} x{item.quantity}</p>
                                                            ))}
                                                            {(order.items?.length || 0) > 2 && (
                                                                <p className="text-gray-400">+{order.items.length - 2} รายการ</p>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <select
                                                                value={(order as any).shippingStatus || "pending"}
                                                                onChange={async (e) => {
                                                                    const newStatus = e.target.value;
                                                                    const { updateDoc, doc: firestoreDoc } = await import("firebase/firestore");
                                                                    await updateDoc(firestoreDoc(db, "orders", order.id), {
                                                                        shippingStatus: newStatus,
                                                                    });
                                                                    setOrders((prev) =>
                                                                        prev.map((o) =>
                                                                            o.id === order.id ? { ...o, shippingStatus: newStatus } as any : o
                                                                        )
                                                                    );
                                                                }}
                                                                className={`text-xs font-semibold px-3 py-2 rounded-xl border-2 outline-none cursor-pointer transition ${((order as any).shippingStatus || "pending") === "pending" ? "bg-yellow-50 border-yellow-300 text-yellow-700" :
                                                                        ((order as any).shippingStatus) === "packing" ? "bg-blue-50 border-blue-300 text-blue-700" :
                                                                            ((order as any).shippingStatus) === "preparing" ? "bg-purple-50 border-purple-300 text-purple-700" :
                                                                                ((order as any).shippingStatus) === "shipped" ? "bg-green-50 border-green-300 text-green-700" :
                                                                                    "bg-gray-50 border-gray-200 text-gray-500"
                                                                    }`}
                                                            >
                                                                <option value="pending">รอดำเนินการ</option>
                                                                <option value="packing">กำลังแพ็คสินค้า</option>
                                                                <option value="preparing">เตรียมส่งสินค้า</option>
                                                                <option value="shipped">ส่งสินค้าแล้ว</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {orders.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">ยังไม่มีคำสั่งซื้อ</p>}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}