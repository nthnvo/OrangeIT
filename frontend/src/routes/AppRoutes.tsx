import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderStatusPage from "../pages/OrderStatusPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/Checkout";
import PaymentPage from "../pages/PaymentPage";
import ReceiptPage from "../pages/ReceiptPage";
import SearchPage from "../pages/SearchPage";
import AdminDashboard from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;