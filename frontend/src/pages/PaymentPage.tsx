import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const { orderId, items, totalPrice, customerName } = location.state || {};
  const [countdown, setCountdown] = useState(3);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/cart");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePaymentSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  const handlePaymentSuccess = async () => {
    setPaid(true);
    // Update order status in Firestore
    try {
      const q = query(collection(db, "orders"), where("orderId", "==", orderId));
      const snap = await getDocs(q);
      snap.forEach(async (d) => {
        await updateDoc(doc(db, "orders", d.id), {
          status: "paid",
          paidAt: new Date(),
        });
      });
    } catch (err) {
      console.error(err);
    }

    clearCart();

    // Go to receipt after short pause
    setTimeout(() => {
      navigate("/receipt", {
        state: { orderId, items, totalPrice, customerName },
      });
    }, 800);
  };

  if (!orderId) return null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>ชำระเงิน</h2>

        {/* Order info */}
        <div style={styles.orderInfo}>
          <div style={styles.orderRow}>
            <span style={styles.orderLabel}>เลขที่คำสั่งซื้อ</span>
            <span style={styles.orderValue}>{orderId}</span>
          </div>
          <div style={styles.orderRow}>
            <span style={styles.orderLabel}>ยอดชำระ</span>
            <span style={styles.orderTotal}>฿{totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Items summary */}
        <div style={styles.itemsBox}>
          {items?.map((item: any) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.itemName}>{item.name} x{item.quantity}</span>
              <span>฿{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Fake QR */}
        <div style={styles.qrSection}>
          <p style={styles.qrLabel}>สแกน QR Code เพื่อชำระเงิน</p>
          <div style={styles.qrBox}>
            {/* Fake QR pattern */}
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Corner squares */}
              <rect x="10" y="10" width="40" height="40" rx="4" fill="#111" />
              <rect x="18" y="18" width="24" height="24" rx="2" fill="#fff" />
              <rect x="24" y="24" width="12" height="12" rx="1" fill="#111" />

              <rect x="110" y="10" width="40" height="40" rx="4" fill="#111" />
              <rect x="118" y="18" width="24" height="24" rx="2" fill="#fff" />
              <rect x="124" y="24" width="12" height="12" rx="1" fill="#111" />

              <rect x="10" y="110" width="40" height="40" rx="4" fill="#111" />
              <rect x="18" y="118" width="24" height="24" rx="2" fill="#fff" />
              <rect x="24" y="124" width="12" height="12" rx="1" fill="#111" />

              {/* Fake data pattern */}
              {[60,70,80,90,100].map((x) =>
                [10,20,30,40,50,60,70,80,90,100,110,120,130,140].map((y) =>
                  Math.random() > 0.5 ? (
                    <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#111" rx="1" />
                  ) : null
                )
              )}
              {[10,20,30,40,50].map((x) =>
                [60,70,80,90,100,110,120,130,140].map((y) =>
                  Math.random() > 0.5 ? (
                    <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#111" rx="1" />
                  ) : null
                )
              )}
              {[110,120,130,140,150].map((x) =>
                [60,70,80,90,100,110,120,130,140].map((y) =>
                  Math.random() > 0.5 ? (
                    <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#111" rx="1" />
                  ) : null
                )
              )}
            </svg>

            {/* Countdown overlay */}
            {!paid && (
              <div style={styles.countdownOverlay}>
                <div style={styles.countdownCircle}>
                  <span style={styles.countdownNum}>{countdown}</span>
                </div>
                <p style={styles.countdownText}>กำลังตรวจสอบการชำระเงิน...</p>
              </div>
            )}

            {paid && (
              <div style={styles.paidOverlay}>
                <div style={styles.checkCircle}>✓</div>
                <p style={styles.paidText}>ชำระเงินสำเร็จ!</p>
              </div>
            )}
          </div>
          <p style={styles.qrNote}>ระบบจะตรวจสอบอัตโนมัติ</p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "36px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "24px",
    color: "#111",
  },
  orderInfo: {
    background: "#f9f9f9",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  orderLabel: {
    fontSize: "13px",
    color: "#666",
  },
  orderValue: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
    fontFamily: "monospace",
  },
  orderTotal: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#e53935",
  },
  itemsBox: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "12px 0",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#555",
  },
  itemName: {
    flex: 1,
    paddingRight: "12px",
  },
  qrSection: {
    textAlign: "center",
  },
  qrLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
    marginBottom: "16px",
  },
  qrBox: {
    position: "relative",
    display: "inline-block",
    border: "2px solid #eee",
    borderRadius: "12px",
    padding: "16px",
    background: "#fff",
  },
  countdownOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255,255,255,0.92)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  countdownCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNum: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#fff",
  },
  countdownText: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  paidOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255,255,255,0.95)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  checkCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#4caf50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    color: "#fff",
    fontWeight: 700,
  },
  paidText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#4caf50",
    margin: 0,
  },
  qrNote: {
    fontSize: "12px",
    color: "#aaa",
    marginTop: "12px",
  },
};

export default PaymentPage;