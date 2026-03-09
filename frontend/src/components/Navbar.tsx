import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

import { useCart } from "../pages/CartContext";
import { useAuth } from "../context/AuthContext";
import { allProducts } from "../data/products";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPrice } = useCart();
  const { user, logout } = useAuth();

  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof allProducts>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCart(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const topics: { name: string; id: string; type: "scroll" | "navigate" }[] = [
    { name: "🆕 𝙉𝙚𝙬 ของใหม่เข้าแล้ว 👀", id: "new", type: "scroll" },
    { name: "✨ ขายดีประจำเดือน", id: "best", type: "scroll" },
    { name: "🍎 Good vibe ด้วย Apple", id: "apple", type: "scroll" },
    { name: "🎮 GameSir ลดจริงไม่จกตา 👀", id: "gamesir", type: "scroll" },
    { name: "📦 ตรวจสอบสถานะสินค้า", id: "order-status", type: "navigate" },
  ];

  const handleTopicClick = (id: string, type: "scroll" | "navigate") => {
    setShowMenu(false);
    if (type === "navigate") {
      navigate(`/${id}`);
      return;
    }
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = allProducts
        .filter((p) =>
          `${p.title} ${p.brand}`.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const SearchInput = () => (
    <div ref={searchRef} className="flex flex-1 items-center gap-2 relative">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="ค้นหาสินค้าที่ต้องการที่นี่..."
          className="w-full border-b border-orange-500 focus:border-orange-600 outline-none px-3 py-2 text-sm"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          autoFocus
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-1 overflow-hidden">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  navigate(`/product/${p.id}`);
                  setSearchQuery("");
                  setShowSuggestions(false);
                  setShowMobileSearch(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-left transition"
              >
                <img src={p.image} alt={p.title} className="w-10 h-10 object-contain flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-500 font-semibold">{p.brand}</p>
                  <p className="text-sm text-gray-800 truncate">{p.title}</p>
                </div>
                <p className="text-sm font-bold text-red-500 whitespace-nowrap">
                  ฿{p.price.toLocaleString()}
                </p>
              </button>
            ))}
            <button
              onClick={handleSearch}
              className="w-full text-center text-sm text-orange-500 font-semibold py-3 border-t border-gray-100 hover:bg-orange-50 transition"
            >
              ดูผลการค้นหาทั้งหมดสำหรับ "{searchQuery}"
            </button>
          </div>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-lg transition flex-shrink-0"
      >
        <CiSearch size={22} />
      </button>
    </div>
  );

  return (
    <>
      <nav className="px-4 py-3 shadow-sm bg-white sticky top-0 z-50">

        {/* ===== DESKTOP ROW ===== */}
        <div className="flex items-center justify-between gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <GiHamburgerMenu
              size={24}
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => setShowMenu(true)}
            />
            <img
              src="/img/OrangeLogo.jpg"
              alt="Logo"
              className="h-10 md:h-14 object-contain cursor-pointer w-auto"
              onClick={() => navigate("/")}
            />
          </div>

          {/* SEARCH — hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center gap-3 mx-4 relative" ref={searchRef}>
            
            <SearchInput />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Search icon — mobile only */}
            <button
              className="md:hidden hover:text-orange-500"
              onClick={() => setShowMobileSearch((v) => !v)}
            >
              <CiSearch size={26} />
            </button>

            {/* User */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <FaUser size={18} />
                <span className="text-sm font-semibold">{user.name}</span>
                <button onClick={logout} className="text-xs text-red-500 hover:underline">
                  ออก
                </button>
              </div>
            ) : (
              <div
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer"
              >
                <FaUser size={20} />
                <span className="text-sm hidden md:inline">เข้าสู่ระบบ</span>
              </div>
            )}

            {/* CART */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="relative hover:text-yellow-500 cursor-pointer"
                onClick={() => setShowCart((v) => !v)}
              >
                <FaBasketShopping size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black rounded-full min-w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {showCart && (
                <div className="absolute right-0 top-10 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {cartItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <FaBasketShopping size={36} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">ไม่มีสินค้าในตะกร้า</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto divide-y">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain border rounded-lg p-1" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">จำนวน {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-red-500">
                              ฿{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t">
                        <div className="flex justify-between text-sm mb-3">
                          <span>{totalItems} ชิ้น</span>
                          <span className="font-bold">฿{totalPrice.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => { setShowCart(false); navigate("/cart"); }}
                          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl"
                        >
                          ไปที่ตะกร้า
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== MOBILE SEARCH ROW ===== */}
        {showMobileSearch && (
          <div className="md:hidden mt-3 flex items-center gap-2">
            <SearchInput />
          </div>
        )}

        {/* ===== MOBILE USER (logged in) ===== */}
        {user && (
          <div className="md:hidden flex items-center justify-end gap-2 mt-1 text-xs text-gray-600">
            <FaUser size={12} />
            <span>{user.name}</span>
            <button onClick={logout} className="text-red-500 hover:underline">ออกจากระบบ</button>
          </div>
        )}

      </nav>

      {/* SIDE MENU */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowMenu(false)} />
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
            <div className="p-6 border-b font-bold text-lg">หมวดหมู่</div>
            <div className="flex-1 overflow-y-auto">
              {topics.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTopicClick(item.id, item.type)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-yellow-400 ${item.type === "navigate" ? "border-t border-gray-100 font-semibold text-orange-500" : ""
                    }`}
                >
                  <span>{item.name}</span>
                  <span>›</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          openRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
   
  );
}

export default Navbar;