import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductSlider from "../components/ProductSlide";

function Home() {
  const images = [
    "/img/Promotion1.jpg",
    "/img/Promotion2.jpg",
    "/img/Promotion3.jpg",
    "/img/Promotion4.jpg",
    "/img/Promotion5.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="grow">
        <div className="container mx-auto px-4">

          {/* ================= PROMOTION SLIDER ================= */}
          <div className="relative w-full max-w-[1200px] aspect-[3/1] mx-auto mt-6 overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Promotion ${index}`}
                  className="w-full object-cover shrink-0"
                />
              ))}
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded">❮</button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded">❯</button>
          </div>

          {/* ================= NEW PRODUCTS ================= */}
          <div id="new">
            <ProductSlider
              title="𝙉𝙚𝙬 ของใหม่เข้าแล้ว 👀"
              products={[
                { id: 1, brand: "APPLE", title: "Apple iPhone 17e 256GB Soft Pink", description: "", price: 22900, image: "/img/New Product/iPhone_17e1.jpg", isNew: true },
                { id: 2, brand: "XIAOMI", title: "สมาร์ทโฟน Xiaomi 17 Ultra (16+512GB) Starlit Green (5G)", description: "6.85 inch | Snapdragon 8 Elite Gen 5 | RAM 16GB / ROM 512GB | HyperOS 3 | IP68 | 6,000 mAh | 2 Years", price: 44900, image: "/img/New Product/xiaomi1.jpg", isNew: true },
                { id: 3, brand: "SONY", title: "จอยคอนโทรลเลอร์ Sony DualSense Midnight Black + USB Cable for PC", description: "Wireless Controller | USB-C / Bluetooth | Haptic Feedback | Adaptive trigger | Midnight Black | 1 Year", price: 2590, image: "/img/New Product/sony1.jpg", isNew: true },
                { id: 4, brand: "XIAOMI", title: "แท็บเล็ต Xiaomi Pad 8 Wi-Fi (8+256GB) Gray", description: "Screen Size : 11.2 inch | Snapdragon 8s Gen 4 | RAM 8GB / ROM 256GB | Android V16/HyperOS 3.0 | Warranty : 15 Months", price: 15990, image: "/img/New Product/xiaomi-tablet1.jpg", isNew: true },
                { id: 5, brand: "VIVO", title: "สมาร์ทโฟน vivo V70 (12+512GB) Alpine Gray (5G)", description: "6.59 inch | Snapdragon 7 Gen 4 | RAM 12GB / ROM 512GB | Android 16 | 6,500 mAh | 1 Year", price: 20999, image: "/img/New Product/vivov1.jpg", isNew: true },
                { id: 6, brand: "SONY", title: "หูฟังไร้สาย Sony WF-1000XM6 Silver", description: "Type In-Ear Headphone | Connector Bluetooth 5.3 | Warranty 1 Year", price: 11990, image: "/img/New Product/sony-headphone1.jpg", isNew: true },
                { id: 7, brand: "HARMAN KARDON", title: "ลำโพงบลูทูธ Harman Kardon SoundSticks 5 White", description: "Type : Bluetooth Speaker | Power output : 190 W RMS | Frequency Response : 40 Hz – 20 kHz (-6 dB) | Signal to Noise Ratio : 80 dB A-weighted | Warranty : 1 Year", price: 14900, image: "/img/New Product/harman-kardon1.jpg", isNew: true },
                { id: 8, brand: "SONY", title: "หูฟังครอบหู Sony WH-1000XM6 Sand Pink", description: "Full Size Headphone | Microphone Frequency Response : 20 Hz - 40 kHz | Connector : Bluetooth v5.3 / USB-C | Input Impedance : 48 ohm | Warranty : 1 Year", price: 11900, image: "/img/New Product/sony-headphone-set1.jpg", isNew: true },
                { id: 9, brand: "VIVO", title: "สมาร์ทโฟน vivo V70 (12+256GB) Authentic Black (5G)", description: "6.59 inch | Snapdragon 7 Gen 4 | RAM 12GB / ROM 256GB | Android 16 | 6,500 mAh | 1 Year", price: 18499, image: "/img/New Product/vivo-smartphone-v70b1.jpg", isNew: true },
                { id: 10, brand: "SONY", title: "หูฟังไร้สาย Sony WF-1000XM6 Black", description: "Type In-Ear Headphone | Connector Bluetooth 5.3 | Warranty 1 Year", price: 11990, image: "/img/New Product/sony-headphone-mini1.jpg", isNew: true },
                { id: 11, brand: "EPSON", title: "โปรเจคเตอร์ Epson EF-61G Ice Green", description: "Full HD 1080p + 700 lm + HDR Support | Google TV Built-in, Netflix / YouTube | Sound by Bose + Dolby Audio | 2 Years Warranty", price: 20790, image: "/img/New Product/epson-projector1.jpg", isNew: true },
                { id: 12, brand: "VIVO", title: "สมาร์ทโฟน vivo Y05 (4+128GB) Summit Platinum", description: "6.74 inch | Unisoc T7225 | RAM 4GB / ROM 128GB | Android 16 | 6,500 mAh | 1 Year", price: 4599, image: "/img/New Product/vivo-smartphone-y05-1.jpg", isNew: true },
              ]}
            />
          </div>

          {/* ================= ขายดีประจำเดือน ================= */}
          <div id="best">
            <ProductSlider
              title="ขายดีประจำเดือน✨"
              products={[
                { id: 13, brand: "APPLE", title: "Apple iPhone 14 128GB Starlight", description: "", price: 17100, image: "/img/BestSeller/iPhone_14_Starlight_1.jpg", isNew: false },
                { id: 14, brand: "VIVO", title: "สมาร์ทโฟน vivo V60 (12+256GB) Mist Gray (5G)", description: "6.77 inch | Snapdragon 7 Gen 4 | RAM 12GB / ROM 256GB | Android 15 | 6,500 mAh | Warranty 1 Year", price: 15699, image: "/img/BestSeller/vivo-smartphone-v60-12-256gb-1.jpg", isNew: false },
                { id: 15, brand: "VIVO", title: "สมาร์ทโฟน vivo V60 Lite (8+256GB) Elegant Black (5G)", description: "6.77 inch | MediaTek Dimensity 7360 Turbo | RAM 8GB / ROM 256GB | Android 15 | 6,500 mAh | 1 Year", price: 9999, image: "/img/BestSeller/vivo-Smartphone-V60-Lite-8-Black-1.jpg", isNew: false },
                { id: 16, brand: "VIVO", title: "สมาร์ทโฟน vivo X300 (12+256GB) Phantom Black (5G)", description: "6.31 inch | MediaTek Dimensity 9500 | RAM 12GB / ROM 256GB | Android 16 | 6,040 mAh | 1 Year", price: 29999, image: "/img/BestSeller/vivo-smartphone-x300-1.jpg", isNew: false },
                { id: 17, brand: "VIVO", title: "สมาร์ทโฟน vivo X300 Pro (16+512GB) Dune Brown (5G)", description: "6.78 inch | MediaTek Dimensity 9500 | RAM 16GB / ROM 512GB | Android 16 | 6,510 mAh | 1 Year", price: 39999, image: "/img/BestSeller/vivo-smartphone-x300pro-1.jpg", isNew: false },
                { id: 18, brand: "SAMSUNG", title: "สมาร์ทโฟน Samsung Galaxy S25 Ultra (12+256GB) Titanium Whitesilver (5G)", description: "6.9 inch | Snapdragon 8 Elite | Android 15 | 5,000 mAh | Warranty : 1 Year", price: 40900, image: "/img/BestSeller/samsung-smartphone-galaxy-s25-1.jpg", isNew: false },
                { id: 19, brand: "FENDER", title: "ลำโพงบลูทูธ FenderELIE 12 White", description: "Type : Bluetooth Speaker | Frequency Response : 101db @ 1m | Color : Olympic White | Warranty : 1 Year", price: 17900, image: "/img/BestSeller/fender-bluetooth-speaker-elie-1.jpg", isNew: false },
                { id: 20, brand: "SAMSUNG", title: "แท็บเล็ต Samsung Galaxy Tab A11+ 5G (6+128GB) Gray", description: "Screen Size : 11 inch | MT8775(MTK) | RAM 6GB / ROM 128GB | 7,040 mAh | Warranty : 1 Year", price: 8990, image: "/img/BestSeller/samsung-tablet-galaxy-tab-a11-1.jpg", isNew: false },
                { id: 21, brand: "MSI", title: "จอมอนิเตอร์ MSI MAG 272PF X24 Gaming Monitor (Rapid IPS 240Hz)", description: "27.0 inch | 1920 x 1080 @ 240 Hz | 1.07 Billions | 300 cd/m2 | 1000:1 | 0.5 ms | 16:9 | IPS | Adaptive-Sync", price: 4690, image: "/img/BestSeller/msi-monitor-mag-272pf-x24-1.jpg", isNew: false },
                { id: 22, brand: "XIAOMI", title: "สมาร์ทโฟน Xiaomi Redmi Note 15 Pro+ (12+512GB) Mocha Brown (5G)", description: "6.83 inch | Snapdragon 7s Gen 4 | RAM 12GB / ROM 512GB | HyperOS 2 | 6,500 mAh | 2 Years", price: 13990, image: "/img/BestSeller/xiaomi-smartphone-redmi-note-15-pro-1.jpg", isNew: false },
                { id: 23, brand: "JOYROOM", title: "หูฟัง JOYROOM TYPE-C Series JR-EC06 Silver", description: "", price: 249, image: "/img/BestSeller/joyroom-jr-ec06-type-c-1.jpg", isNew: false },
                { id: 24, brand: "AMAZFIT", title: "สมาร์ทวอทช์ Amazfit Bip 6 Black", description: "Display : 1.97 inch | Water Resistance : 5 ATM | Power and Baterry : 340 mAh | Warranty : 1 Year", price: 2690, image: "/img/BestSeller/amazfit-smartwatch-bip-6-black-1.jpg", isNew: false },
              ]}
            />
          </div>

          {/* ================= Good vibe ด้วย Apple ================= */}
          <div id="apple">
            <ProductSlider
              title="Good vibe ด้วย Apple🍎"
              products={[
                { id: 25, brand: "APPLE", title: "Apple iPhone 17 256GB Lavender", description: "", price: 29900, image: "/img/GoodVibe/iPhone_17_Lavender_1.jpg", isNew: false },
                { id: 26, brand: "APPLE", title: "Apple iPhone 17 Pro 256GB Silver", description: "", price: 43900, image: "/img/GoodVibe/iPhone_17_Pro_Silver_1.jpg", isNew: false },
                { id: 27, brand: "APPLE", title: "Apple iPhone 17 Pro Max 256GB Deep Blue", description: "", price: 48900, image: "/img/GoodVibe/iPhone_17_Pro_Max_1.jpg", isNew: false },
                { id: 28, brand: "APPLE", title: "Apple iPhone Air 256GB Sky Blue", description: "", price: 32900, image: "/img/GoodVibe/iPhone_Air_Sky_Blue_1.jpg", isNew: false },
                { id: 29, brand: "APPLE", title: "Apple Watch SE 3 GPS 40mm Starlight Aluminium Case with Starlight Sport Band - S/M", description: "", price: 8500, image: "/img/GoodVibe/Apple_Watch_SE_3_40mm_1.jpg", isNew: false },
                { id: 30, brand: "APPLE", title: "Apple Watch Series 11 GPS 42mm Rose Gold Aluminium Case with Light Blush Sport Band - S/M", description: "", price: 14900, image: "/img/GoodVibe/Apple_Watch_Series_11_46mm_1.jpg", isNew: false },
                { id: 31, brand: "APPLE", title: "Apple Watch Ultra 3 GPS + Cellular 49mm Black Titanium Case with Black Ocean Band", description: "", price: 29900, image: "/img/GoodVibe/Apple_Watch_Ultra_3_49mm_1.jpg", isNew: false },
                { id: 32, brand: "APPLE", title: "Apple iPhone 13 128GB Starlight", description: "", price: 15200, image: "/img/GoodVibe/iPhone_13_PDP_Position-1A_Color_Starlight_1.jpg", isNew: false },
                { id: 33, brand: "APPLE", title: "Apple iPhone 15 128GB Blue", description: "  ", price: 23500, image: "/img/GoodVibe/iPhone_15_Blue_2-1.jpg", isNew: false },
                { id: 34, brand: "APPLE", title: "Apple iPhone 16 128GB Pink", description: "", price: 26400, image: "/img/GoodVibe/iPhone_16_Pink_1.jpg", isNew: false },
                { id: 35, brand: "APPLE", title: "Apple iPhone 16e 128GB White", description: "", price: 19900, image: "/img/GoodVibe/iPhone_16e_White_1.jpg", isNew: false },
                { id: 36, brand: "APPLE", title: "Apple iPad 11 (2025) A16 Wi-Fi 128GB Silver (11th Gen)", description: "", price: 12900, image: "/img/GoodVibe/iPad_A16_WiFi_Silver-1.jpg", isNew: false },
              ]}
            />
          </div>

          {/* ================= GameSir ================= */}
          <div id="gamesir">
            <ProductSlider
              title="GameSir ลดจริงไม่จกตา🎮👀"
              products={[
                { id: 37, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Shadow Ember", description: "Controller | Tri-mode : Xbox / PC / Android | Hall Effect | Rumble Motors | USB-C | Mech White | 1 Year", price: 2690, image: "/img/GameSir/gamesir-g7-pro-game-1.jpg", isNew: false },
                { id: 38, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Wasabi", description: "Mobile Gamepad | USB-C | Android / iOS | Hall Effect Sensing Sticks | Wasabi | 1 Year", price: 790, image: "/img/GameSir/gamesir-x5-lite-wireless-gamepad-1.jpg", isNew: false },
                { id: 39, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir G8+ MFI Mobile Gamepad White", description: "Mobile Gamepad | USB-C | iOS / Android | 125-215mm Ultra-Wide Stretch | White | 1 Year", price: 2190, image: "/img/GameSir/gamesir-g8-mfi-game-controller-white-1.jpg", isNew: false },
                { id: 40, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad Blue", description: "Controller | Hall Effect Sticks / Triggers / Stick Drift | Bluetooth / USB-C / Wireless Dongle | Blue | 1 Year", price: 1490, image: "/img/GameSir/gamesir-super-nova-wireless-gamepad-blue-1.jpg", isNew: false },
                { id: 41, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Wuchang", description: "Controller | Xbox / PC / Android | USB-C / Bluetooth | Wuchang Fallen Feathers Edition | 1 Year", price: 3490, image: "/img/GameSir/gamesir-g7-pro-game-controller-wuchang-1.jpg", isNew: false },
                { id: 42, brand: "GAMESIR", title: "GAMESIR × ZENLESS ZONE ZERO จอยคอนโทรลเลอร์ G7 Pro Edition", description: "Controller Bluetooth | Wireless technology : 2.4 | Battery Life : 1200mAh | Warranty : 1 Year", price: 4290, image: "/img/GameSir/gamesir-gaming-controller-g7-pro-zenless-zone-zero-1.jpg", isNew: false },
                { id: 43, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Mech White", description: "Controller | Tri-mode : Xbox / PC / Android | Hall Effect | Rumble Motors | USB-C | Mech White | 1 Year", price: 2690, image: "/img/GameSir/gamesir-g7-pro-game-controller-mech-white-1.jpg", isNew: false },
                { id: 44, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir Nova 2 Lite Wireless Gamepad Iron Edition (Red)", description: "Controller Bluetooth | Bluetooth, Wired, and Wireless Dongle | Built-in 600mAh | Type-C | 1 Year", price: 1090, image: "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-iron-edition-red-1.jpg", isNew: false },
                { id: 45, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad Pink", description: "Controller | Hall Effect Sticks / Triggers / Stick Drift | Bluetooth / USB-C / Wireless Dongle | Pink | 1 Year", price: 1490, image: "/img/GameSir/gamesir-super-nova-wireless-gamepad-pink-1.jpg", isNew: false },
                { id: 46, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir Nova 2 Lite Wireless Gamepad Champion Edition (Gold)", description: "Controller Bluetooth | Bluetooth, Wired, and Wireless Dongle | Built-in 600mAh | Gold | 1 Year", price: 1090, image: "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-champion-edition-gold-1.jpg", isNew: false },
                { id: 47, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Black", description: "Mobile Gamepad | USB-C | Android / iOS | Hall Effect Sensing Sticks | Black | 1 Year", price: 790, image: "/img/GameSir/gamesir-x5-lite-wireless-gamepad-black-1.jpg", isNew: false },
                { id: 48, brand: "GAMESIR", title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Gray", description: "Mobile Gamepad | USB-C | Android / iOS | Hall Effect Sensing Sticks | Gray | 1 Year", price: 790, image: "/img/GameSir/gamesir-x5-lite-wireless-gamepad-grey-1.jpg", isNew: false },
              ]}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;