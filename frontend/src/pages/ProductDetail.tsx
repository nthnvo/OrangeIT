import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  BarChart2,
} from "lucide-react";

const mockProducts: Record<string, any> = {
  /* New Product */
  "1": {
    id: 1,
    brand: "APPLE",
    sku: "195951030982",
    title: "Apple iPhone 17e 256GB Soft Pink",
    price: 22900,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: true,
    images: [
      "/img/New Product/iPhone_17e1.jpg",
      "/img/New Product/iPhone_17e2.jpg",
      "/img/New Product/iPhone_17e3.jpg",
    ],
    capacities: ["256GB"],
    colors: [{ name: "Soft Pink", hex: "#fdb0c0" }],
    defaultColor: "Soft Pink",
    applecare: {
      name: "AppleCare+ for iPhone 17e (แผน 2 ปี)",
      price: 4190,
      image: "/img/applecare.jpg",
    },
    bundle: {
      label: "iPhone 17e + Accessories",
      bundlePrice: 25010,
      image: "/img/bundle.jpg",
    },
    description:
      "iPhone 17e จาก Apple สมาร์ทโฟนดีไซน์คุ้มค่า มาพร้อมจอ Super Retina XDR 6.1 นิ้ว ชิป A19 กล้อง Fusion 48MP รองรับ USB-C และ MagSafe",
    specs: [
      "จอ Super Retina XDR 6.1 นิ้ว",
      "ชิป A19",
      "กล้อง Fusion 48MP",
      "แบต 26 ชั่วโมง",
      "รองรับ USB-C และ MagSafe",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "2": {
    id: 2,
    brand: "XIAOMI",
    sku: "6932554483944",
    title: "สมาร์ทโฟน Xiaomi 17 Ultra (16+512GB) Starlit Green (5G)",
    price: 44990,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/xiaomi1.jpg",
      "/img/New Product/xiaomi2.jpg",
      "/img/New Product/xiaomi3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Starlit Green", hex: "#566232" }],
    defaultColor: "Starlit Green",
    description:
      "Xiaomi 17 Ultra สมาร์ทโฟนเรือธงสำหรับสายถ่ายภาพ ด้วยพลังของ Essential Leica Imagery มิติภาพระดับพรีเมียมในแบบฉบับ Leica ขับเคลื่อนด้วยขุมพลัง Snapdragon 8 Elite Gen 5 เร็วแรง ลื่นไหล รองรับการประมวลผลภาพขั้นสูง สั้งซื้อได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "Bluetooth จอ 6.85 inch รีเฟรชเรท 120Hz.3",
      "กล้องหน้า 50MP + กล้องหลัง 50MP",
      "แบตเตอรี่ 6,000 mAh ชาร์จไว 90W ชาร์จไร้สาย 50W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "3": {
    id: 3,
    brand: "SONY",
    sku: "4948872964159",
    title: "จอยคอนโทรลเลอร์ Sony DualSense Midnight Black + USB Cable for PC",
    price: 2590,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/sony1.jpg",
      "/img/New Product/sony2.jpg",
      "/img/New Product/sony3.jpg",
    ],
    capacities: [],
    colors: [],
    description:
      "จอยคอนโทรลเลอร์ DualSense จาก BaNANA นิยามใหม่ของการดื่มด่ำในเกม PC ปลดปล่อยพลังแห่งการควบคุมที่ละเอียดอ่อนและสมจริง ไม่ว่าจะเป็นแรงต้านของอาวุธหรือสภาพแวดล้อมในเกมระดับ AAA ก็ถ่ายทอดออกมาได้อย่างยอดเยี่ยม ที่สุดของไอเทมที่จะเปลี่ยนคอมพิวเตอร์ของคุณให้กลายเป็นสนามรบสุดมัน",
    specs: [
      "รองรับ PS5, PC, macOS, Android, iOS",
      "ไมโครโฟนและช่องเสียบหูในตัว",
      "สัมผัสการจับที่กระชับมือ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "4": {
    id: 4,
    brand: "XIAOMI",
    sku: "6932554472870",
    title: "แท็บเล็ต Xiaomi Pad 8 Wi-Fi (8+256GB) Gray",
    price: 15990,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/xiaomi-tablet1.jpg",
      "/img/New Product/xiaomi-tablet2.jpg",
      "/img/New Product/xiaomi-tablet3.jpg",
    ],
    capacities: ["8+256GB"],
    colors: [{ name: "Gray", hex: "#CED2D7" }],
    defaultColor: "Gray",
    description:
      "Xiaomi Pad 8 Wi-Fi  สัมผัสประสบการณ์ใหม่ของแท็บเล็ตระดับไฮเอนด์ Xiaomi Pad 8 ที่รวมความแรงของชิปเซ็ตรุ่นล่าสุด เข้ากับหน้าจอความละเอียดสูงระดับ 3.2K ให้คุณใช้งานได้เต็มประสิทธิภาพไม่ว่าจะทำงานระดับมืออาชีพ หรือรับชมความบันเทิงสุดล้ำ ซื้อสินค้าแล้วได้ที่ BaNANA",
    specs: [
      "ชิป Snapdragon 8s Gen 4",
      "ขนาดหน้าจอใหญ่ 11.2  นิ้ว",
      "แบตเตอรี่ 9,200 mAh  ใช้งานได้อย่างยาวนาน",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "5": {
    id: 5,
    brand: "VIVO",
    sku: "6932204518934",
    title: "สมาร์ทโฟน vivo V70 (12+512GB) Alpine Gray (5G)",
    price: 20999,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/vivov1.jpg",
      "/img/New Product/vivov2.jpg",
      "/img/New Product/vivov3.jpg",
    ],
    capacities: ["12+512GB"],
    colors: [{ name: "Alpine Gray", hex: "#9FA4A9" }],
    defaultColor: "Alpine Gray",
    description:
      "vivo V70 สมาร์ทโฟนดีไซน์พรีเมียม พร้อมกล้อง AI คมชัดระดับโปร หน้าจอความละเอียดสูงลื่นไหลเต็มตา แบตอึดใช้งานยาวนาน และประสิทธิภาพแรงตอบโจทย์ทุกไลฟ์สไตล์ ทั้งถ่ายภาพ เล่นโซเชียล ทำงาน และความบันเทิงครบจบในเครื่องเดียว สวยระดับลูกรักพระเจ้า พร้อมของแถมมากมายที่ BaNANA 📱✨",
    specs: [
      "จอ Amoled 6.59 นิ้ว รีเฟรชเรท 120Hz",
      "กล้องหลัก 50MP กล้องหน้า 50MP",
      "แบต 6,500 mAh ชาร์จเร็ว 90W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "6": {
    id: 6,
    brand: "SONY",
    sku: "4548736171831",
    title: "หูฟังไร้สาย Sony WF-1000XM6 Silver",
    price: 11990,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/sony-headphone1.jpg",
      "/img/New Product/sony-headphone2.jpg",
      "/img/New Product/sony-headphone3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Silver", hex: "#C0C0C0" }],
    defaultColor: "Silver",
    description:
      "Sony WF-1000XM6 หูฟังไร้สาย True Wireless รุ่นเรือธง พร้อมเทคโนโลยีตัดเสียงรบกวนล้ำสมัย มอบการตัดเสียงรบกวนขั้นสุดยอด คุณภาพเสียงที่คมชัด และความสบายตลอดวัน ออกแบบมาสำหรับผู้ที่คาดหวังความเป็นเลิศในทุกช่วงเวลา สั่งซื้อได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "ระบบตัดเสียงรบกวนที่ดีที่สุด พร้อมคุณภาพเสียงระดับพรีเมียม",
      "สวมใส่สบาย กระชับ และแนบสนิทกับหู",
      "Bluetooth 5.3 คุณภาพการโทรที่คมชัดยิ่งขึ้น",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "7": {
    id: 7,
    brand: "HARMAN KARDON",
    sku: "1200130028298",
    title: "ลำโพงบลูทูธ Harman Kardon SoundSticks 5 White",
    price: 14900,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/harman-kardon1.jpg",
      "/img/New Product/harman-kardon2.jpg",
      "/img/New Product/harman-kardon3.jpg",
    ],
    capacities: [],
    colors: [{ name: "White", hex: "#FFFFFF" }],
    defaultColor: "White",
    description:
      "Harman Kardon SoundSticks 5 ลำโพงดีไซน์โดมใสระดับตำนาน มาพร้อมระบบเสียง 2.1 แชนแนลที่ทรงพลัง เบสลึกสะใจ และแสง Ambient Light ที่เคลื่อนไหวตามจังหวะเพลง พร้อมยกระดับความบันเทิงในบ้านให้เป็นโรงหนังส่วนตัวได้ง่ายๆ ด้วยการเชื่อมต่อ HDMI ARC เพียงเส้นเดียว ซื้อสินค้าแล้วได้ที่ BaNANA",
    specs: [
      "ดีไซน์ไอคอนิกและแสงไฟสุดล้ำ",
      "ระบบเสียง 2.1 ทรงพลัง 190W",
      "เชื่อมต่อทีวีง่ายด้วย HDMI ARC",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "8": {
    id: 8,
    brand: "SONY",
    sku: "4548736175259",
    title: "หูฟังครอบหู Sony WH-1000XM6 Sand Pink",
    price: 11990,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/sony-headphone-set1.jpg",
      "/img/New Product/sony-headphone-set2.jpg",
      "/img/New Product/sony-headphone-set3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Sand Pink", hex: "#F4C2C2" }],
    defaultColor: "Sand Pink",
    description:
      "Sony  WH-1000XM6 สัมผัสประสบการณ์ หูฟังครอบหู เสียงระดับพรีเมียม ระบบตัดเสียงรบกวนแบบ Adaptive Noise Cancelling อัจฉริยะ เสียงคุณภาพสูง  ใช้งานได้นานต่อเนื่อง  เหมาะสำหรับทุกไลฟ์สไตล์การฟังเพลงหรือประชุมออนไลน์ เป็นเจ้าของได้แล้วที่ BaNANA",
    specs: [
      "รองรับ Bluetooth 5.3",
      "ดีไซน์พับเก็บสะดวก",
      " พร้อมไมโครโฟนในตัว",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "9": {
    id: 9,
    brand: "VIVO",
    sku: "6932204518651",
    title: "สมาร์ทโฟน vivo V70 (12+256GB) Authentic Black (5G)",
    price: 18499,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/vivo-smartphone-v70b1.jpg",
      "/img/New Product/vivo-smartphone-v70b2.jpg",
      "/img/New Product/vivo-smartphone-v70b3.jpg",
    ],
    capacities: ["12+256GB"],
    colors: [{ name: "Authentic Black", hex: "#1C1C1E" }],
    defaultColor: "Authentic Black",
    description:
      "vivo V70 สมาร์ทโฟนดีไซน์พรีเมียม พร้อมกล้อง AI คมชัดระดับโปร หน้าจอความละเอียดสูงลื่นไหลเต็มตา แบตอึดใช้งานยาวนาน และประสิทธิภาพแรงตอบโจทย์ทุกไลฟ์สไตล์ ทั้งถ่ายภาพ เล่นโซเชียล ทำงาน และความบันเทิงครบจบในเครื่องเดียว สวยระดับลูกรักพระเจ้า พร้อมของแถมมากมายที่ BaNANA 📱✨",
    specs: [
      "จอ Amoled 6.59 นิ้ว รีเฟรชเรท 120Hz",
      "กล้องหลัก 50MP กล้องหน้า 50MP",
      "แบต 6,500 mAh ชาร์จเร็ว 90W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "10": {
    id: 10,
    brand: "SONY",
    sku: "4548736171787",
    title: "หูฟังไร้สาย Sony WF-1000XM6 Black",
    price: 11990,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/sony-headphone-mini1.jpg",
      "/img/New Product/sony-headphone-mini2.jpg",
      "/img/New Product/sony-headphone-mini3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "WF1000XM6 หูฟังไร้สาย True Wireless รุ่นเรือธง พร้อมเทคโนโลยีตัดเสียงรบกวนล้ำสมัย มอบการตัดเสียงรบกวนขั้นสุดยอด คุณภาพเสียงที่คมชัด และความสบายตลอดวัน ออกแบบมาสำหรับผู้ที่คาดหวังความเป็นเลิศในทุกช่วงเวลา สั่งซื้อได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "ระบบตัดเสียงรบกวนที่ดีที่สุด พร้อมคุณภาพเสียงระดับพรีเมียม",
      "สวมใส่สบาย กระชับ และแนบสนิทกับหู",
      "Bluetooth 5.3 คุณภาพการโทรที่คมชัดยิ่งขึ้น",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "11": {
    id: 11,
    brand: "EPSON",
    sku: "V11HB72352",
    title: "โปรเจคเตอร์ Epson EF-61G Ice Green",
    price: 20790,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/epson-projector1.jpg",
      "/img/New Product/epson-projector2.jpg",
      "/img/New Product/epson-projector3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Ice Green", hex: "#C7EDE4" }],
    defaultColor: "Ice Green",
    description:
      "Epson Lifestudio Pop EF-61G Ice Green โปรเจคเตอร์พกพา Full HD ดีไซน์พรีเมียม สีพาสเทลสุดมินิมอล เปลี่ยนทุกมุมบ้านให้เป็นโฮมเธียเตอร์ได้ง่าย ๆ 🎬✨ เหมาะสำหรับคนที่อยากได้โปรเจคเตอร์พกพา ภาพสวย เสียงดี ใช้งานง่าย ดีไซน์แต่งบ้านได้แบบลงตัว 💚🛒 ช้อปเลย! ที่ BaNANA",
    specs: [
      "Full HD คมชัดสูงสุด 150 นิ้ว ภาพใหญ่สะใจ ดูหนังเต็มอารมณ์📺",
      "ความสว่าง 700 ลูเมน สีสด ภาพชัดในห้องทั่วไป☀️",
      " Google TV ในตัว ดู Netflix, YouTube ได้ทันที ไม่ต้องต่อกล่อง📡",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "12": {
    id: 12,
    brand: "VIVO",
    sku: "6932204523716",
    title: "สมาร์ทโฟน vivo Y05 (4+128GB) Summit Platinum",
    price: 4599,
    warranty: "รับประกัน 1 ปี",
    isNew: true,
    isPreOrder: false,
    images: [
      "/img/New Product/vivo-smartphone-y05-1.jpg",
      "/img/New Product/vivo-smartphone-y05-2.jpg",
      "/img/New Product/vivo-smartphone-y05-3.jpg",
    ],
    capacities: ["4+128GB"],
    colors: [{ name: "Summit Platinum", hex: "#E5E4E2" }],
    defaultColor: "Summit Platinum",
    description:
      "vivo Y05 สมาร์ตโฟนแบตอึด ดีไซน์พรีเมียม ใช้งานได้ยาวนานตลอดวัน ใช้คุ้มทุกเปอร์เซ็นต์ รองรับทุกการใช้งานในชีวิตประจำวัน ไม่ว่าจะทำงาน ดูหนัง ฟังเพลงจับถนัดมือ ให้สัมผัสพรีเมียม พร้อมผ่านการรับรองความทนทานต่อการตกกระแทก ใช้งานได้อย่างมั่นใจในทุกวัน สมารถสั้งซื้อได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "จอ 6.74 นิ้ว + รีเฟรชเรท 120Hz",
      "แบตเตอรี่ 6,500 mAh ชาร์จเร็ว 15W",
      " กล้องหลัก 8MP + กล้องหน้า 5MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  /* BestSeller */
  "13": {
    id: 13,
    brand: "APPLE",
    sku: "194253408598",
    title: "Apple iPhone 14 128GB Starlight",
    price: 17100,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/iPhone_14_Starlight_1.jpg",
      "/img/BestSeller/iPhone_14_Starlight_2.jpg",
      "/img/BestSeller/iPhone_14_Starlight_3.jpg",
    ],
    capacities: ["128GB"],
    colors: [{ name: "Starlight", hex: "#F5E6C8" }],
    defaultColor: "Starlight",
    description:
      "iPhone 14 มาพร้อมระบบกล้องคู่ที่น่าประทับใจที่สุดเท่าที่เคยมีมาบน iPhone ซึ่งถ่ายภาพได้อย่างน่าทึ่งทั้งในที่ที่มีแสงน้อยและแสงจ้า  นอกจากนี้ยังมีการตรวจจับการชนกัน ซึ่งเป็นคุณสมบัติใหม่ด้านความปลอดภัย ที่พร้อมโทรขอความช่วยเหลือเมื่อคุณไม่สามารถ",
    specs: [
      "จอภาพ Super Retina XDR ขนาด 6.1 นิ้ว",
      "แ ระบบกล้องสุดล้ำเพื่อภาพถ่ายที่ดียิ่งขึ้นในทุกสภาพแสง",
      "  ชิป A15 Bionic พร้อม GPU แบบ 5-core เพื่อประสิทธิภาพที่เร็วสุดขั้ว",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "14": {
    id: 14,
    brand: "VIVO",
    sku: "6932204509000",
    title: "สมาร์ทโฟน vivo V60 (12+256GB) Mist Gray (5G)",
    price: 15699,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/vivo-smartphone-v60-12-256gb-1.jpg",
      "/img/BestSeller/vivo-smartphone-v60-12-256gb-2.jpg",
      "/img/BestSeller/vivo-smartphone-v60-12-256gb-3.jpg",
    ],
    capacities: ["12+256GB"],
    colors: [{ name: "Mist Gray", hex: "#BFC3C7" }],
    defaultColor: "Mist Gray",
    description:
      "vivo V60 5G สมาร์ทโฟนเรียบหรู ทุกมุมมองคือความเรียบง่ายที่ลงตัวอย่างแท้จริง ถ่ายภาพพอร์ตเทรตเวทีซูมไกล 10x กันน้ำและป้องกันฝุ่นอย่างดีเยี่ยม การแช่น้ำ และมือที่เปียกหรือมัน ให้คุณใช้งานได้อย่างไร้กังวลในทุกสภาพแวดล้อม พร้อมระบบกันตกขั้นสูง",
    specs: [
      "หน้าจอ   6.77 นิ้ว",
      "กล้องหลักคมชัด   50   ล้านพิกเซล",
      "  แบตเตอรี่ขนาดใหญ่จุใจ   6,500 mAh",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "15": {
    id: 15,
    brand: "VIVO",
    sku: "6935117899619",
    title: "สมาร์ทโฟน vivo V60 Lite (8+256GB) Elegant Black (5G)",
    price: 9999,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/vivo-Smartphone-V60-Lite-8-Black-1.jpg",
      "/img/BestSeller/vivo-Smartphone-V60-Lite-8-Black-2.jpg",
      "/img/BestSeller/vivo-Smartphone-V60-Lite-8-Black-3.jpg",
    ],
    capacities: ["8+256GB"],
    colors: [{ name: "Elegant Black", hex: "#111111" }],
    defaultColor: "Elegant Black",
    description:
      "vivo V60 Lite 5G ราคาพิเศษที่ BaNANA เท่านั้น สมาร์ทโฟนตัวเครื่องเพรียวบาง มาพร้อมหน้าจอ AMOLED ความสว่าง 1000 นิต   ชิป Dimensity 7360 Turbo รุ่นใหม่ กันน้ำกันฝุ่น IP65 แบตเตอรี่ยาวนานใช้ได้ทั้งวัน เป็นเจ้าของกันได้แล้ววันนี้ปักลงตะกร้าได้เลย",
    specs: [
      "ขนาดหน้าจอ 6.77 นิ้ว",
      "กล้องหลัก Sony 50 ล้านพิกเซล",
      "แบตเตอรี่ 6,500 mAh ชาร์จเร็ว 90W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "16": {
    id: 16,
    brand: "VIVO",
    sku: "6932204512925",
    title: "สมาร์ทโฟน vivo X300 (12+256GB) Phantom Black (5G)",
    price: 29999,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/vivo-smartphone-x300-1.jpg",
      "/img/BestSeller/vivo-smartphone-x300-2.jpg",
      "/img/BestSeller/vivo-smartphone-x300-3.jpg",
    ],
    capacities: ["12+256GB"],
    colors: [{ name: "Phantom Black", hex: "#0F0F0F" }],
    defaultColor: "Phantom Black",
    description:
      "X300 5G สมาร์ทโฟนจับถนัดมือ หน้าจอเล็กกะทัดรัด พกพาสะดวกแต่ทรงพลังด้วยเลนส์เทเลโฟโต้และชิปคู่สำหรับการถ่ายภาพระดับมืออาชีพ แบตเตอรี่ BlueVolt อึดและชาร์จไว การจัดการพลังงานขั้นสูง ให้แบตเตอรี่อึดขึ้นและน้ำหนักเบา สั่งซื้อเลยที่ BaNANA",
    specs: [
      "จอ 6.31 นิ้ว",
      "แบต 6,040 mAh ชาร์จเร็ว 90W",
      "กล้องหลัง 200MP กลัองหน้า 50MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "17": {
    id: 17,
    brand: "VIVO",
    sku: "6932204513243",
    title: "สมาร์ทโฟน vivo X300 Pro (16+512GB) Dune Brown (5G)",
    price: 39999,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/vivo-smartphone-x300pro-1.jpg",
      "/img/BestSeller/vivo-smartphone-x300pro-2.jpg",
      "/img/BestSeller/vivo-smartphone-x300pro-3.jpg",
    ],
    capacities: ["16+512GB"],
    colors: [{ name: "Dune Brown", hex: "#8B6F47" }],
    defaultColor: "Dune Brown",
    description:
      "X300 Pro 5G สมาร์ทโฟนราชาแห่งเลนส์เทเลโฟโต้ในวงการ! มาพร้อมกับชิปคู่สำหรับการถ่ายภาพระดับมืออาชีพ แบตเตอรี่ BlueVol ไม่เพียงแต่มีความจุที่มากขึ้นเท่านั้น แต่ยังใช้เทคโนโลยีซิลิคอนรุ่นที่ 4 และการเพิ่มประสิทธิภาพการใช้พลังงาน น้ำหนักเบาของระบบ สั่งเลยที่ BaNANA",
    specs: [
      "ขนาดจอ 6.78 นิ้ว",
      "กล้องเทเลโฟโต้ 200MP กล้องหน้า 50MP",
      " แบต 6,510 mAh ชาร์จไว 90W ชาร์จไร้สาย 40W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "18": {
    id: 18,
    brand: "SAMSUNG",
    sku: "8806097010821",
    title:
      "สมาร์ทโฟน Samsung Galaxy S25 Ultra (12+256GB) Titanium Whitesilver (5G)",
    price: 40900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/samsung-smartphone-galaxy-s25-1.jpg",
      "/img/BestSeller/samsung-smartphone-galaxy-s25-2.jpg",
      "/img/BestSeller/samsung-smartphone-galaxy-s25-3.jpg",
    ],
    capacities: ["12+256GB"],
    colors: [{ name: "Titanium Whitesilver", hex: "#E5E4E2" }],
    defaultColor: "Titanium Whitesilver",
    description:
      "สั่งซื้อ Galaxy S25 Ultra พร้อมส่วนลดราคาพิเศษได้ที่ BaNANA มาพร้อมปากกา S Pen ที่เป็นมากกว่าปากกา เปรียบเสมือนผู้ช่วยส่วนตัว ใช้สั่งถ่ายรูป เปลี่ยนสไลด์ แปลภาษา แต่งรูป เล่นเกม พร้อมด้วยกล้องคุณภาพสูง ถ่ายภาพสวย คมชัด เก็บครบทุกรายละเอียด",
    specs: [
      "ขนาดหน้าจอ 6.9 นิ้ว",
      "แบตเตอรี่ 5,000 mAh ชาร์จเร็ว 45W",
      "กล้องหลัก 200MP กล้องหน้า 12MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "19": {
    id: 19,
    brand: "FENDER",
    sku: "8885021970158",
    title: "ลำโพงบลูทูธ FenderELIE 12 White",
    price: 17900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/fender-bluetooth-speaker-elie-1.jpg",
      "/img/BestSeller/fender-bluetooth-speaker-elie-2.jpg",
      "/img/BestSeller/fender-bluetooth-speaker-elie-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "White", hex: "#FFFFFF" }],
    defaultColor: "White",
    description:
      "ลำโพงบลูทูธดีไซน์พรีเมียมสไตล์แอมป์กีตาร์จาก Fender ให้พลังเสียงคมชัด เบสแน่น ฟังสนุกทุกแนวดนตรี เชื่อมต่อ Bluetooth ได้รวดเร็ว ใช้งานง่าย เหมาะทั้งตั้งโต๊ะทำงาน คาเฟ่ หรือพกไปปาร์ตี้ เติมบรรยากาศดนตรีระดับตำนานในทุกช่วงเวลาของคุณ ซื้อสินค้าแล้วได้ที่ BaNANA",
    specs: [
      "ชาร์จเร็วทันใจ",
      "มาตรฐานกันน้ำกันฝุ่นระดับ IP54",
      "รองรับระบบเสียงสเตอริโอ / เชื่อมต่อหลายตัว",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "20": {
    id: 20,
    brand: "SAMSUNG",
    sku: "8806097875130",
    title: "แท็บเล็ต Samsung Galaxy Tab A11+ 5G (6+128GB) Gray",
    price: 8990,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/samsung-tablet-galaxy-tab-a11-1.jpg",
      "/img/BestSeller/samsung-tablet-galaxy-tab-a11-2.jpg",
      "/img/BestSeller/samsung-tablet-galaxy-tab-a11-3.jpg",
    ],
    capacities: ["6+128GB"],
    colors: [{ name: "Gray", hex: "#808080" }],
    defaultColor: "Gray",
    description:
      "Galaxy Tab A11+ 5G แท็บเล็ตจอใหญ่ขนาด 11 นิ้ว 90Hz เพลิดเพลินกับภาพที่คมชัดลื่นไหล  มาพร้อมกับลำโพง Quad Speakers ดื่มด่ำกับเสียงคุณภาพเสียงรอบทิศทาง แบตเตอรี่ 7,040 mAh ใช้ได้ยาวนานและรองรับการชาร์จไฟ 25W ใช้งานเป็นไปอย่างราบรื่น ไม่มีสะดุด   ซื้อสินค้าได้ที่ BaNANA ส่งเร็วทันใจ",
    specs: ["หน้าจอ 11 นิ้ว", "ชิป MT8775(MTK)", "แบตเตอรี่จุใจ 7,040 mAh"],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "21": {
    id: 21,
    brand: "MSI",
    sku: "4711377337236",
    title: "จอมอนิเตอร์ MSI MAG 272PF X24 Gaming Monitor (Rapid IPS 240Hz)",
    price: 4690,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/msi-monitor-mag-272pf-x24-1.jpg",
      "/img/BestSeller/msi-monitor-mag-272pf-x24-2.jpg",
      "/img/BestSeller/msi-monitor-mag-272pf-x24-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "จอมอนิเตอร์ MSI MAG 272PF X24 มาพร้อมแผงหน้าจอความละเอียด Full HD มีอัตรารีเฟรชเรทที่สูง และเวลาตอบสนองที่รวดเร็ว 0.5ms จอภาพรองรับ HDR ช่วยเพิ่มรายละเอียดที่คมชัดยิ่งขึ้นด้วยการปรับคอนทราสต์และเงา ออกแบบมาสำหรับเกม FPS แนวแข่งขัน เกม RPG/MMORPG มุมมองบุคคลที่หนึ่ง และเกมจำลองการบิน/แข่งรถ สั่งซื้อได้ที่ BaNANA",
    specs: [
      "หน้าจอ IPS 27 นิ้ว",
      "ความละเอียด 1920 x 1080",
      " รีเฟรชเรทสูงสุด 240 Hz",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "22": {
    id: 22,
    brand: "XIAOMI",
    sku: "6932554481636",
    title: "สมาร์ทโฟน Xiaomi Redmi Note 15 Pro+ (12+512GB) Mocha Brown (5G)",
    price: 13990,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/xiaomi-smartphone-redmi-note-15-pro-1.jpg",
      "/img/BestSeller/xiaomi-smartphone-redmi-note-15-pro-2.jpg",
      "/img/BestSeller/xiaomi-smartphone-redmi-note-15-pro-3.jpg",
    ],
    capacities: ["12+512GB"],
    colors: [{ name: "Mocha Brown", hex: "#6F4E37" }],
    defaultColor: "Mocha Brown",
    description:
      "Redmi Note 15 Pro+   สมาร์ทโฟนป้องกันการตกกระแทก 2.5 เมตรตามมาตรฐาน SGS มาตรฐาน IP69K ทนทานต่อแรงดันน้ำ 176°F ที่แรงดัน 1,450 psi  แช่น้ำลึกได้ 2 เมตร นานถึง 24 ชั่วโมง กล้องรุ่นใหม่ ถ่ายชัดทุกมุมมอง จับคู่กับเลนส์ Ultra-wide คมชัดทุกรายละเอียด สั่งเลยที่ BaNANA",
    specs: [
      "ขนาดจอ 6.83 นิ้ว",
      "กล้องหลัก 200MP กล้องหน้า 32MP",
      "แบต 6,500 mAh ชาร์จเร็ว 100W",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "23": {
    id: 23,
    brand: "JOYROOM",
    sku: "6956116770143",
    title: "หูฟัง JOYROOM TYPE-C Series JR-EC06 Silver",
    price: 249,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/joyroom-jr-ec06-type-c-1.jpg",
      "/img/BestSeller/joyroom-jr-ec06-type-c-2.jpg",
      "/img/BestSeller/joyroom-jr-ec06-type-c-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Silver", hex: "#C0C0C0" }],
    defaultColor: "Silver",
    description:
      "ฟังเพลงสนุกด้วยเสียงที่ชัดเจนด้วย หูฟัง JOYROOM JR-EC06  หูฟังแบบจุกซิลิโคนที่เป็นมิตรต่อผิวหนัง การออกแบบเอียง 45° กระชับพอดีสวมใส่สบายยาวนาน วัสดุสายเป็น TPE นุ่ม ยืดหยุ่นและทนทาน จัดเก็บง่าย ขั้วต่อดิจิทัล Type-C ที่รองรับหลากหลายส่งสัญญาณได้เสถียร",
    specs: [
      "ขั้วต่อ Type-C",
      "ไมโครโฟนคุณภาพสูง",
      "วัสดุสาย TPE ยืดหยุ่นทนทาน",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "24": {
    id: 24,
    brand: "AMAZFIT",
    sku: "6970100377866",
    title: "สมาร์ทวอทช์ Amazfit Bip 6 Black",
    price: 2690,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/BestSeller/amazfit-smartwatch-bip-6-black-1.jpg",
      "/img/BestSeller/amazfit-smartwatch-bip-6-black-2.jpg",
      "/img/BestSeller/amazfit-smartwatch-bip-6-black-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "สมาร์ทวอทช์ Amazfit Bip 6  ⌚ หน้าจอสวยงามและคมชัด AMOLED ขนาดใหญ่ 1.97 นิ้ว มีความสว่างสูงถึง 2,000 นิต ทำให้มองเห็นชัดเจนในทุกสภาพแสง   🌟 พร้อม GPS ที่สามารถจับสัญญาณได้รวดเร็ว และติดตามเส้นทางได้อย่างแม่นยำ แม้ในพื้นที่ที่มีสิ่งกีดขวาง   เป็นเจ้าของได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "รับสาย - โทรออก ผ่าน Bluetooth",
      "ควบคุมเสียงผ่าน Zepp Flow ได้",
      "มีเซ็นเซอร์ BioTracker 6.0 สำหรับวัดค่าสุขภาพต่าง ๆ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  /* iPhone */
  "25": {
    id: 25,
    brand: "APPLE",
    sku: "195950644197",
    title: "Apple iPhone 17 256GB Lavender",
    price: 29900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_17_Lavender_1.jpg",
      "/img/GoodVibe/iPhone_17_Lavender_2.jpg",
      "/img/GoodVibe/iPhone_17_Lavender_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Lavender", hex: "#BFA8E8" }],
    defaultColor: "Lavender",
    description:
      "iPhone 17 ประทับใจยิ่งกว่า ทนทานยิ่งขึ้น ด้วยจอภาพ ProMotion ขนาด 6.3 นิ้ว Ceramic Shield กล้องหลัง 48MP ทั้งหมด กล้องหน้า Center Stage ชิป A19 และอีกมากมาย iPhone 17 มาใน 5 สีสันสุดสวยและด้านหน้าแบบ Ceramic Shield 2 ที่ทนการขีดข่วนได้ดีขึ้น 3 เท่า",
    specs: [
      "จอภาพขนาด 6.3 นิ้ว",
      "กล้องหน้า 18MP Center Stage",
      "กล้องหลังระบบคู่ Fusion 48MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "26": {
    id: 26,
    brand: "APPLE",
    sku: "195950627251",
    title: "Apple iPhone 17 Pro 256GB Silver",
    price: 43900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_17_Pro_Silver_1.jpg",
      "/img/GoodVibe/iPhone_17_Pro_Silver_2.jpg",
      "/img/GoodVibe/iPhone_17_Pro_Silver_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Silver", hex: "#C0C0C0" }],
    defaultColor: "Silver",
    description:
      "iPhone 17 Pro คือ iPhone ที่ทรงพลังที่สุดเท่าที่เคยมีมา โดยมาพร้อมจอภาพขนาด 6.3 นิ้วที่สวยสด, ดีไซน์แบบอะลูมิเนียมชิ้นเดียว, ชิป A19 Pro, กล้องหลัง 48MP ทั้งหมด และแบตเตอรี่ที่ใช้งานได้นานที่สุดเท่าที่เคยมีมา",
    specs: [
      "ชิป A19 Pro ",
      "6.3 นิ้ว จอภาพ Super Retina XDR ",
      "เล่นวิดีโอได้นานสูงสุด 31 ชั่วโมง",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "27": {
    id: 27,
    brand: "APPLE",
    sku: "195950639308",
    title: "Apple iPhone 17 Pro Max 256GB Deep Blue",
    price: 48900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_17_Pro_Max_1.jpg",
      "/img/GoodVibe/iPhone_17_Pro_Max_2.jpg",
      "/img/GoodVibe/iPhone_17_Pro_Max_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Deep Blue", hex: "#1E3A8A" }],
    defaultColor: "Deep Blue",
    description:
      "iPhone 17 Pro Max คือ iPhone ที่ทรงพลังที่สุดเท่าที่เคยมีมา โดยมาพร้อมจอภาพขนาด 6.9 นิ้วที่สวยสด ดีไซน์แบบอะลูมิเนียมชิ้นเดียว ชิป A19 Pro กล้องหลัง 48MP ทั้งหมด และแบตเตอรี่ที่ใช้งานได้นานที่สุดเท่าที่เคยมีมา",
    specs: [
      "A19 Pro เป็นชิป iPhone ที่ทรงพลังที่สุดเท่า",
      "Ceramic Shield ที่ทนทาน ทั้งด้านหน้าและด้านหลัง",
      "ระบบกล้อง Fusion โปร 48MP กล้องหลัง 48MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "28": {
    id: 28,
    brand: "APPLE",
    sku: "195950623277",
    title: "Apple iPhone Air 256GB Sky Blue",
    price: 32900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_Air_Sky_Blue_1.jpg",
      "/img/GoodVibe/iPhone_Air_Sky_Blue_2.jpg",
      "/img/GoodVibe/iPhone_Air_Sky_Blue_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Sky Blue", hex: "#87CEEB" }],
    defaultColor: "Sky Blue",
    description:
      "iPhone Air iPhone ที่บางที่สุดเท่าที่เคยมีมา ด้วยจอภาพขนาด 6.5 นิ้ว Ceramic Shield ที่ทนทานทั้งด้านหน้าและด้านหลัง ชิป A19 Pro ระบบกล้อง Fusion 48MP และกล้องหน้า Center Stage ดีไซน์ที่สดใหม่พร้อม Liquid Glass ทั้งสวยงาม เพลิดเพลิน และรู้สึกคุ้นเคยในทันที มาพร้อมหน้าจอล็อคที่มีชีวิตชีวา พื้นหลังที่ปรับแต่งได้ แถมยังมีแบบสำรวจในแอปข้อความ การคัดกรองสายโทร และอีกมากมาย",
    specs: [
      "6.5 นิ้ว จอภาพ Super Retina XDR  ",
      "กล้องหน้า 18MP Center Stage",
      "กล้องหลัก Fusion 48MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "29": {
    id: 29,
    brand: "APPLE",
    sku: "195950386561",
    title:
      "Apple Watch SE 3 GPS 40mm Starlight Aluminium Case with Starlight Sport Band - S/M",
    price: 8500,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/Apple_Watch_SE_3_40mm_1.jpg",
      "/img/GoodVibe/Apple_Watch_SE_3_40mm_2.jpg",
      "/img/GoodVibe/Apple_Watch_SE_3_40mm_3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "Apple Watch SE 3 เป็นการอัปเกรดที่คุ้มค่ามากสำหรับผู้ที่กำลังมองหาสมาร์ทวอทช์ Apple เครื่องแรกด้วยการนำคุณสมบัติระดับพรีเมียมอย่างหน้าจอ Always-On, ชิป S10 และการควบคุมด้วยท่าทางมาไว้ในราคาเริ่มต้นที่เข้าถึงง่าย แบตเตอรี่ที่ใช้งานได้ตลอดวันถึง 18 ชั่วโมง และยังชาร์จได้เร็วขึ้นสูงสุด 2 เท่าด้วยการชาร์จเร็วแบบใหม่",
    specs: [
      "ชิป S10 หน้าจอ Always-On Display",
      "ใช้งานได้ยาวนานตลอดวันถึง 18 ชั่วโมง",
      "ทนน้ำที่ระดับ 50 ม. (กันน้ำขณะว่ายน้ำ)",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "30": {
    id: 30,
    brand: "APPLE",
    sku: "195950461220",
    title:
      "Apple Watch Series 11 GPS 42mm Rose Gold Aluminium Case with Light Blush Sport Band - S/M",
    price: 14900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/Apple_Watch_Series_11_46mm_1.jpg",
      "/img/GoodVibe/Apple_Watch_Series_11_46mm_2.jpg",
      "/img/GoodVibe/Apple_Watch_Series_11_46mm_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Rose Gold", hex: "#B76E79" }],
    defaultColor: "Rose Gold",
    description:
      "Apple Watch Series 11 มาพร้อมข้อมูลเชิงลึกด้านสุขภาพที่สำคัญซึ่งรวมถึงการแจ้งเตือนอัตราการเต้นของหัวใจเร็วหรือช้าและคะแนนการนอนหลับ ทั้งยังมีตัวชี้วัดขั้นสูงสำหรับทุกการออกกำลังกายเพื่อยกระดับความฟิตของคุณ พร้อมด้วยแบตเตอรี่ที่ใช้งานได้ นานสูงสุด 24 ชั่วโมง Series 11 ทั้งบางและเบา จึงสวมใส่แบบสบายๆ ได้ตลอดทั้งวัน",
    specs: [
      "ชิป S10 ใหม่",
      "จอภาพ Retina แบบติดตลอด",
      "ทนฝุ่นที่ระดับ IP6X และกันน้ำที่ระดับ 50 ม.",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "31": {
    id: 31,
    brand: "APPLE",
    sku: "195950610024",
    title:
      "Apple Watch Ultra 3 GPS + Cellular 49mm Black Titanium Case with Black Ocean Band",
    price: 29900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/Apple_Watch_Ultra_3_49mm_1.jpg",
      "/img/GoodVibe/Apple_Watch_Ultra_3_49mm_2.jpg",
      "/img/GoodVibe/Apple_Watch_Ultra_3_49mm_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "Apple Watch Ultra 3 แกร่งกล้า ท้าคุณ นาฬิกาสปอร์ตและการผจญภัยที่เหนือชั้น จอภาพ แบบมุมกว้างทำให้จอภาพสว่างขึ้นเมื่อมองจากด้านข้าง และเทคโนโลยี LTPO3 ที่ประหยัดพลังงานช่วยให้คุณเห็นการขยับทุกวินาทีบนหน้าปัดนาฬิกาได้ แบตเตอรี่ที่ใช้งานได้นานที่สุดในบรรดา Apple Watch ใช้งานได้นานสูงสุด 42 ชั่วโมงเมื่อใช้งานปกติ การเชื่อมต่อ 5G ที่เร็วสุดๆ ",
    specs: [
      "ตัวเรือนไทเทเนียม 49 มม.",
      "ทนน้ำที่ระดับ 100 ม",
      "Always-On Retina display ชิป S10 ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "32": {
    id: 32,
    brand: "APPLE",
    sku: "194252707517",
    title: "Apple iPhone 13 128GB Starlight",
    price: 15200,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_13_PDP_Position-1A_Color_Starlight_1.jpg",
      "/img/GoodVibe/iPhone_13_PDP_Position-1A_Color_Starlight_2.jpg",
      "/img/GoodVibe/iPhone_13_PDP_Position-1A_Color_Starlight_3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "iPhone 13 ระบบกล้องคู่ที่ล้ำหน้าที่สุดเท่าที่เคยมีมาบน iPhone พร้อมชิป A15 Bionic ที่เร็วสุดขั้ว, แบตเตอรี่ที่ใช้งานได้นานขึ้น แบบก้าวกระโดดครั้งใหญ่, ดีไซน์ที่ทนทาน, 5G ที่เร็วสุดแรงและจอภาพ Super Retina XDR ที่สว่างยิ่งขึ้น",
    specs: [
      "จอภาพ Super Retina XDR ขนาด 6.1 นิ้ว",
      "โหมดภาพยนตร์เพิ่มมิติความชัดตื้นและสลับจุดโฟกัสในวิดีโอของคุณโดยอัตโนมัติ",
      "ระบบกล้องคู่สุดล้ำที่ประกอบด้วยกล้องไวด์และอัลตร้าไวด์ ความละเอียด 12MP",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "33": {
    id: 33,
    brand: "APPLE",
    sku: " 195949036613",
    title: "Apple iPhone 15 128GB Blue",
    price: 23500,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_15_Blue_2-1.jpg",
      "/img/GoodVibe/iPhone_15_Blue_2-2.jpg",
      "/img/GoodVibe/iPhone_15_Blue_2-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Blue", hex: "#4A90E2" }],
    defaultColor: "Blue",
    description:
      "iPhone 15 Dynamic Island มาอยู่บน iPhone 15 แล้วทำให้คุณไม่พลาดเรื่องราวต่าง ๆ เสริมด้วยกล้องหลัก 48 MP ถ่ายภาพที่มีความละเอียดสูงได้แบบง่าย ๆ ทั้งยังมีเทเลโฟโต้ 2 เท่าอีกด้วย และเปลี่ยนช่องเชื่อมต่อเป็น USB-C มาในดีไซน์แบบกระจกแต่งสีและอะลูมิเนียมที่ทนทาน",
    specs: [
      "การเชื่อมต่อด้วยช่องต่อ USB-C",
      "Dynamic Island ให้คุณไม่พลาดเรื่องราวไหนๆ",
      "ชิป A16 Bionic สุดทรงพลัง ชิปที่เร็วสุดแรงสุด",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "34": {
    id: 34,
    brand: "APPLE",
    sku: "195949822339",
    title: "Apple iPhone 16 128GB Pink",
    price: 26400,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_16_Pink_1.jpg",
      "/img/GoodVibe/iPhone_16_Pink_2.jpg",
      "/img/GoodVibe/iPhone_16_Pink_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Pink", hex: "#FF8FA3" }],
    defaultColor: "Pink",
    description:
      "iPhone 16 ขอแนะนำตัวควบคุมกล้องให้คุณเข้าถึงเครื่องมือของกล้องได้อย่างรวดเร็ว และพบกับปุ่มแอ็คชั่น แค่กดค้างไว้ก็เรียกใช้สิ่งที่คุณต้องการได้ทันที ไม่ว่าจะเป็นไฟฉาย เสียงบันทึก โหมดปิดเสียง และอีกมากมาย",
    specs: [
      "ชิป A18 ที่ฉลาดสุดล้ำ",
      "กล้อง Fusion 48MP ถ่ายภาพความละเอียดสูง และซูมเข้าด้วยเทเลโฟโต้ 2 เท่า",
      "จอภาพ Super Retina XDR ขนาด 6.1 นิ้ว",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "35": {
    id: 35,
    brand: "APPLE",
    sku: "195950112504",
    title: "Apple iPhone 16e 128GB White",
    price: 19900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPhone_16e_White_1.jpg",
      "/img/GoodVibe/iPhone_16e_White_2.jpg",
      "/img/GoodVibe/iPhone_16e_White_3.jpg",
    ],
    capacities: [],
    colors: [{ name: "white", hex: "#FFFFFF" }],
    defaultColor: "white",
    description:
      "iPhone 16e ครั้งแรกกับชิปโมเด็ม Apple C1 มาพร้อมกล้อง Fusion 48MP ให้คุณได้ถ่ายภาพความละเอียดสูงเป็นพิเศษ รวมทั้งแบตเตอรี่ที่ใช้งานได้นานจุใจใช้งานได้นานที่สุดใน iPhone ขนาด 6.1 นิ้วที่ให้คุณมีเวลาส่งข้อความ ท่องเว็บ และยังทำนั่นทำนี่ได้มากขึ้น",
    specs: [
      "ขุมพลังแห่งชิป A18",
      "พอร์ตการเชื่อมต่อ USB-C",
      "ปุ่ม Action ตั้งค่าได้หลากหลาย",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },

  "36": {
    id: 36,
    brand: "APPLE",
    sku: "195950086294",
    title: "Apple iPad 11 (2025) A16 Wi-Fi 128GB Silver (11th Gen)",
    price: 12900,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GoodVibe/iPad_A16_WiFi_Silver-1.jpg",
      "/img/GoodVibe/iPad_A16_WiFi_Silver-2.jpg",
      "/img/GoodVibe/iPad_A16_WiFi_Silver-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Silver", hex: "#C0C0C0" }],
    defaultColor: "Silver",
    description:
      "รักเลย วาดเลย เอาใจไปเลย! ด้วย iPad รุ่น 11 นิ้ว วันนี้มากความสามารถยิ่งกว่าที่เคยด้วยชิป A16 ที่เร็วสุดแรงเป็นอุปกรณ์ที่ครบครันทั้งในด้านขนาด ประสิทธิภาพ และคุณสมบัติอื่นๆ บอกเลยว่า iPad คือวิธีอันทรงพลังที่จะช่วยให้คุณสร้างสรรค์ ต่อติดกับทุกเรื่องเสมอและทำนู่นทำนี่ให้เสร็จได้ ซึ่งทั้งหมดนี้มาในราคาที่เป็นเจ้าของได้ง่ายๆ จนคุณต้องแปลกใจ",
    specs: [
      "จอภาพ LIQUID RETINA ขนาด 11 นิ้ว",
      "ชิป A16 ที่เร็วสุดแรงมาพร้อมประสิทธิภาพที่สูงขึ้น",
      "กล้องหน้า 12MP Center Stage ที่เหมาะสุดๆ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  /* Game */
  "37": {
    id: 37,
    brand: "GAMESIR",
    sku: "6936685220409",
    title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Shadow Ember",
    price: 2690,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-g7-pro-game-1.jpg",
      "/img/GameSir/gamesir-g7-pro-game-2.jpg",
      "/img/GameSir/gamesir-g7-pro-game-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Shadow Ember", hex: "#5C1F1F" }],
    defaultColor: "Shadow Ember",
    description:
      "จอยคอนโทรลเลอร์ GameSir G7 Pro มาพร้อมจอยสติ๊ก TMR, ทริกเกอร์ Hall Effect, ปุ่ม Mini Bumper และตัวหยุดทริกเกอร์แบบคลิก มอบการตอบสนองที่รวดเร็วและแม่นยำ รองรับการเชื่อมต่อ 3 โหมด ทั้งแบบมีสาย, 2.4GHz และ Bluetooth ใช้งานได้กับ Xbox, PC และ Android ออกแบบเพื่อประสบการณ์การเล่นเกมระดับ E-sports มีจำหน่ายผ่าน BaNANA ",
    specs: [
      "การเชื่อมต่อแบบ Tri-mode Xbox / PC / Android",
      "โครงสร้างแข็งแรง จับถนัดมือ เล่นเกมนานไม่เมื่อยมือ",
      "รองรับทั้งแบบมีสายและไร้สาย 2.4G",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "38": {
    id: 38,
    brand: "GAMESIR",
    sku: "6936685222670",
    title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Wasabi",
    price: 790,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-1.jpg",
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-2.jpg",
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Wasabi", hex: "#9DC209" }],
    defaultColor: "Wasabi",
    description:
      "GameSir X5 Lite สั่งซื้อได้แล้ววันนี้ที่ BaNANA คอนโทรลเลอร์มือถืออระดับเริ่มต้นที่เชื่อมต่อง่ายและรองรับหลากหลายอุปกรณ์ (Android / iOS 105-213 มม.) พอร์ต Type-C ให้การเล่นเกมที่มีความหน่วงต่ำ ก้านอนาล็อก Hall Effect แม่นยำ ป้องกันดริฟต์ ออกแบบตามหลักสรีรศาสตร์ น้ำหนักเบา จับสบาย ปุ่ม / ทริกเกอร์ Membrane นุ่มทนทาน มีฟังก์ชัน Turbo ปรับแต่งได้",
    specs: [
      "รองรับสมาร์ทโฟนหลากหลายรุ่น",
      "เชื่อมต่อผ่านพอร์ต Type-C โดยตรง",
      "รองรับการชาร์จขณะเล่น",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "39": {
    id: 39,
    brand: "GAMESIR",
    sku: "6936685222991",
    title: "จอยคอนโทรลเลอร์ GameSir G8+ MFI Mobile Gamepad White",
    price: 2190,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-g8-mfi-game-controller-white-1.jpg",
      "/img/GameSir/gamesir-g8-mfi-game-controller-white-2.jpg",
      "/img/GameSir/gamesir-g8-mfi-game-controller-white-3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "GameSir G8+ MFi คอนโทรลเลอร์ Type-C ระดับพรีเมียมที่ออกแบบมาเพื่อยกระดับการเล่นเกมบนมือถือให้ได้อารมณ์แบบคอนโซลอย่างแท้จริง รองรับ iPhone, iPad และ Android ด้วยการรับรอง Apple MFi ให้การเชื่อมต่อเสถียรแบบ Plug-and-Play ดีไซน์ยืดได้กว้าง 125–215 มม. รองรับอุปกรณ์ตั้งแต่มือถือจนถึง iPad mini สั่งซื้อได้แล้วที่ BaNANA",
    specs: [
      "รองรับทั้ง iOS และ Android ผ่าน Type-C",
      "ปุ่ม Trigger แบบ Analog ตอบสนองลื่นไหล",
      "ปรับแต่ง Physical Layout ได้ ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "40": {
    id: 40,
    brand: "GAMESIR",
    sku: "6936685221994",
    title: "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad Blue",
    price: 1490,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-blue-1.jpg",
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-blue-2.jpg",
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-blue-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Blue", hex: "#4A90E2" }],
    defaultColor: "Blue",
    description:
      "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad ที่ BaNANA จอยเกมมัลติแพลตฟอร์มที่มีฟีเจอร์ครบครัน! ด้วย Hall Effect Sticks และ Triggers ที่ช่วย แก้ปัญหา Stick Drift อย่างถาวร, Polling Rate 1000Hz และดีไซน์ที่สามารถปรับแต่งได้ ตอบโจทย์การเล่นเกมบนหลายแพลตฟอร์มได้อย่างดีเยี่ยม",
    specs: [
      "ทริกเกอร์ Hall Effect ที่ปรับแต่งความแม่นยำได้",
      "เปลี่ยนโหมดเชื่อมต่อง่ายดายเพียงสวิตช์เดียว",
      "รองรับทั้งการเชื่อมต่อแบบมีสายและดองเกิลไร้สาย",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "41": {
    id: 41,
    brand: "GAMESIR",
    sku: "6936685223219",
    title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Wuchang",
    price: 3490,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-g7-pro-game-controller-wuchang-1.jpg",
      "/img/GameSir/gamesir-g7-pro-game-controller-wuchang-2.jpg",
      "/img/GameSir/gamesir-g7-pro-game-controller-wuchang-3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "จอยคอนโทรลเลอร์ GameSir G7 Pro Wuchang พร้อมให้เกมเมอร์เป็นเจ้าของแล้วที่ BaNANA จอยเกมมิ่งระดับโปรที่รองรับ Tri-mode ทั้ง Wireless 2.4G/Wired พร้อม GameSir Mag-Res TMR sticks ที่ไร้อาการดริฟท์ ให้การควบคุมที่ราบรื่นและแม่นยำสูงสุด",
    specs: [
      "การเชื่อมต่อไร้สายสำหรับ Xbox / PC และ Android",
      "ปุ่ม ABXY เป็นแบบ Optical Micro Switch",
      "ดีไซน์พิเศษจากเกม Wuchang Fallen Feathers",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "42": {
    id: 42,
    brand: "GAMESIR",
    sku: "6936685222892",
    title: "GAMESIR × ZENLESS ZONE ZERO จอยคอนโทรลเลอร์ G7 Pro Edition",
    price: 4290,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-gaming-controller-g7-pro-zenless-zone-zero-1.jpg",
      "/img/GameSir/gamesir-gaming-controller-g7-pro-zenless-zone-zero-2.jpg",
      "/img/GameSir/gamesir-gaming-controller-g7-pro-zenless-zone-zero-3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "ยกระดับความเร็วแรงสู่ระดับ E-sports ด้วย GameSir G7 Pro Zenless Zone Zero Edition ที่ BaNANA คอนโทรลเลอร์ Xbox รุ่นแรกที่มาพร้อมจอยสติ๊ก TMR และทริกเกอร์ Hall Effect อัปเกรดใหม่ด้วยความหน่วงต่ำเป็นพิเศษ (Low Latency) รองรับการเชื่อมต่อ 3 โหมดทั้ง Xbox, PC และ Android พร้อมดีไซน์ลิขสิทธิ์แท้สุดพรีเมียมเพื่อเกมเมอร์ที่ต้องการประสิทธิภาพและความแม่นยำขั้นสุด",
    specs: [
      "ปุ่มที่สามารถกำหนดค่าใหม่ได้ 4 ปุ่ม",
      "ช่องเสียบเสียง 3.5 มม. รองรับทั้งแบบมีสายและไร้สาย 2.4G",
      "อัตราการส่งข้อมูล 1000Hz บนพีซีผ่านทั้งการเชื่อมต่อแบบใช้สายและ 2.4G",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "43": {
    id: 43,
    brand: "GAMESIR",
    sku: "6936685222267",
    title: "จอยคอนโทรลเลอร์ GameSir G7 Pro Mech White",
    price: 2690,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-g7-pro-game-controller-mech-white-1.jpg",
      "/img/GameSir/gamesir-g7-pro-game-controller-mech-white-2.jpg",
      "/img/GameSir/gamesir-g7-pro-game-controller-mech-white-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Mech White", hex: "#F5F5F5" }],
    defaultColor: "Mech White",
    description:
      "จอยคอนโทรลเลอร์ GameSir G7 Pro มาพร้อมจอยสติ๊ก TMR, ทริกเกอร์ Hall Effect, ปุ่ม Mini Bumper และตัวหยุดทริกเกอร์แบบคลิก มอบการตอบสนองที่รวดเร็วและแม่นยำ รองรับการเชื่อมต่อ 3 โหมด ทั้งแบบมีสาย, 2.4GHz และ Bluetooth ใช้งานได้กับ Xbox, PC และ Android ออกแบบเพื่อประสบการณ์การเล่นเกมระดับ E-sports มีจำหน่ายผ่าน BaNANA",
    specs: [
      "การเชื่อมต่อแบบ Tri-mode Xbox / PC / Android",
      "โครงสร้างแข็งแรง จับถนัดมือ เล่นเกมนานไม่เมื่อยมือ",
      "รองรับทั้งแบบมีสายและไร้สาย 2.4G ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "44": {
    id: 44,
    brand: "GAMESIR",
    sku: "6936685223073",
    title:
      "จอยคอนโทรลเลอร์ GameSir Nova 2 Lite Wireless Gamepad Iron Edition (Red)",
    price: 1090,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-iron-edition-red-1.jpg",
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-iron-edition-red-2.jpg",
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-iron-edition-red-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "GameSir Nova 2 Lite คือคอนโทรลเลอร์เกมไร้สายที่สมบูรณ์แบบสำหรับผู้ที่ชื่นชอบเกมต่อสู้ ด้วย D-pad ทรงกลมแบบกลไก ที่ปรับแต่งโดย XiaoHai มันมอบการควบคุมที่แม่นยำและราบรื่น ด้วย อัตราการรายงานผล 1000Hz และ ความหน่วงที่ต่ำมาก ทั้งปุ่มและแกนอนาล็อก ทำให้คุณสามารถเล่นเกมได้อย่างตอบสนองฉับไวและปราศจากอาการหน่วง มี ปุ่ม Trigger Stop สองจังหวะ ที่ปรับแต่งได้ และรองรับแท่นชาร์จเพื่อความสะดวกสบาย พบกับประสิทธิภาพและความแม่นยำที่ลงตัวได้แล้ววันนี้ที่ BaNANA",
    specs: [
      "ปุ่มและแท่งควบคุมที่มีความหน่วงต่ำเป็นพิเศษเพื่อการตอบสนองทันที",
      "อัตราการสำรวจ 1,000Hz สำหรับการเชื่อมต่อดองเกิลแบบมีสายและไร้สาย",
      "แบตเตอรี่ในตัวความจุ 600mAh และรองรับแท่นชาร์จแบบสตาร์ท-หยุดอัตโนมัติ",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "45": {
    id: 45,
    brand: "GAMESIR",
    sku: "6936685222007",
    title: "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad Pink",
    price: 1490,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-pink-1.jpg",
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-pink-2.jpg",
      "/img/GameSir/gamesir-super-nova-wireless-gamepad-pink-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Pink", hex: "#FF8FA3" }],
    defaultColor: "Pink",
    description:
      "จอยคอนโทรลเลอร์ GameSir Super Nova Wireless Gamepad จอยเกมมัลติแพลตฟอร์ม มีฟีเจอร์ครบครัน ด้วย Hall Effect Sticks และ Triggers ที่ช่วยแก้ปัญหา Stick Drift, การเชื่อมต่อที่หลากหลาย, Polling Rate 1000Hz, และดีไซน์ที่สามารถปรับแต่งได้ ทำให้จอยนี้สามารถตอบโจทย์การเล่นเกมบนหลายแพลตฟอร์มได้อย่างดีเยี่ยม",
    specs: [
      "ทริกเกอร์ Hall Effect ที่ปรับแต่งความแม่นยำได้",
      "เปลี่ยนโหมดเชื่อมต่อง่ายดายเพียงสวิตช์เดียว",
      "รองรับทั้งการเชื่อมต่อแบบมีสายและดองเกิลไร้สาย",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "46": {
    id: 46,
    brand: "GAMESIR",
    sku: "6970100377866",
    title:
      "จอยคอนโทรลเลอร์ GameSir Nova 2 Lite Wireless Gamepad Champion Edition (Gold)",
    price: 1090,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-champion-edition-gold-1.jpg",
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-champion-edition-gold-2.jpg",
      "/img/GameSir/gamesir-gaming-controller-nova-2-lite-wireless-gamepad-champion-edition-gold-3.jpg",
    ],
    capacities: [],
    colors: [],
    defaultColor: "",
    description:
      "GameSir Nova 2 Lite คอนโทรลเลอร์เกมไร้สายที่เร็วที่สุดสำหรับคุณ ด้วย D-pad กลไก ที่แม่นยำ และอัตราการตอบสนองสุดแรงถึง 1000Hz ทำให้ปุ่มและแกนอนาล็อกหน่วงต่ำเป็นพิเศษ ตอบสนองได้ทันที ไร้ดีเลย์ เหมาะอย่างยิ่งสำหรับเกมต่อสู้ พร้อมปุ่ม Trigger Stop สองจังหวะ ที่ปรับแต่งได้ และรองรับแท่นชาร์จเพื่อความสะดวก นี่คือการผสมผสานที่ลงตัวของความแม่นยำและความเร็วที่คุณต้องมี   สามารถหาซื้อได้ที่  BaNANA",
    specs: [
      "อัตราการรายงานผลที่ 1000Hz",
      "การเชื่อมต่อสามโหมดเพื่อความเข้ากันได้กับหลายแพลตฟอร์ม",
      "ปุ่มด้านหลังสองปุ่ม รองรับทั้งการแมปปุ่มเดียวและการบันทึกแมโคร",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "47": {
    id: 47,
    brand: "GAMESIR",
    sku: "6936685221901",
    title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Black",
    price: 790,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-black-1.jpg",
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-black-2.jpg",
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-black-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Black", hex: "#000000" }],
    defaultColor: "Black",
    description:
      "GameSir X5 Lite สั่งซื้อได้แล้ววันนี้ที่ BaNANA คอนโทรลเลอร์มือถืออระดับเริ่มต้นที่เชื่อมต่อง่ายและรองรับหลากหลายอุปกรณ์ (Android / iOS 105-213 มม.) พอร์ต Type-C ให้การเล่นเกมที่มีความหน่วงต่ำ ก้านอนาล็อก Hall Effect แม่นยำ ป้องกันดริฟต์ ออกแบบตามหลักสรีรศาสตร์ น้ำหนักเบา จับสบาย ปุ่ม / ทริกเกอร์ Membrane นุ่มทนทาน มีฟังก์ชัน Turbo ปรับแต่งได้",
    specs: [
      "รองรับสมาร์ทโฟนหลากหลายรุ่น",
      "เชื่อมต่อผ่านพอร์ต Type-C โดยตรง",
      "รองรับการชาร์จขณะเล่น",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
  "48": {
    id: 48,
    brand: "GAMESIR",
    sku: "6936685223806",
    title: "จอยคอนโทรลเลอร์ GameSir X5 Lite Mobile Gamepad Gray",
    price: 790,
    warranty: "รับประกัน 1 ปี",
    isNew: false,
    isPreOrder: false,
    images: [
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-grey-1.jpg",
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-grey-2.jpg",
      ,
      "/img/GameSir/gamesir-x5-lite-wireless-gamepad-grey-3.jpg",
    ],
    capacities: [],
    colors: [{ name: "Gray", hex: "#BFC3C7" }],
    defaultColor: "Gray",
    description:
      "GameSir X5 Lite สั่งซื้อได้แล้ววันนี้ที่ BaNANA คอนโทรลเลอร์มือถืออระดับเริ่มต้นที่เชื่อมต่อง่ายและรองรับหลากหลายอุปกรณ์ (Android / iOS 105-213 มม.) พอร์ต Type-C ให้การเล่นเกมที่มีความหน่วงต่ำ ก้านอนาล็อก Hall Effect แม่นยำ ป้องกันดริฟต์ ออกแบบตามหลักสรีรศาสตร์ น้ำหนักเบา จับสบาย ปุ่ม / ทริกเกอร์ Membrane นุ่มทนทาน มีฟังก์ชัน Turbo ปรับแต่งได้",
    specs: [
      "รองรับสมาร์ทโฟนหลากหลายรุ่น",
      "เชื่อมต่อผ่านพอร์ต Type-C โดยตรง",
      "รองรับการชาร์จขณะเล่น",
    ],
    shippingNote: "จัดส่งภายใน 1–3 วันทำการ",
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = mockProducts[id as string];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedCap, setSelectedCap] = useState(
    product?.capacities?.[0] ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.defaultColor ?? "",
  );
  const [withAddon] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">ไม่พบสินค้า</p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = product.price + (withAddon ? product.addon.price : 0);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: `${product.title}${selectedCap ? " " + selectedCap : ""} ${selectedColor}`.trim(),
        brand: product.brand,
        price: totalPrice,
        image: product.images[0],
        color: [selectedCap, selectedColor].filter(Boolean).join(" | "),
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };
  const prevImg = () =>
    setActiveImg(
      (p) => (p - 1 + product.images.length) % product.images.length,
    );
  const nextImg = () => setActiveImg((p) => (p + 1) % product.images.length);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* ===== LEFT: GALLERY ===== */}
            <div className="md:sticky md:top-24">
              <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-400 bg-white">
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-yellow-400 border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <img
                  src={product.images[activeImg]}
                  alt={product.title}
                  className="w-full h-96 object-contain p-6"
                  onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://placehold.co/400x400?text=No+Image")
                  }
                />
                <div className="bg-orange-400 px-6 py-3 flex items-center gap-3">
                  <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded -skew-x-3">
                    NEW
                  </span>
                  <span className="font-black text-lg">ของใหม่เข้าแล้ว</span>
                </div>
                <button
                  onClick={nextImg}
                  className="absolute right-3 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-yellow-400 border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl border-2 p-1.5 bg-white transition ${activeImg === i ? "border-yellow-400" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-contain"
                      onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://placehold.co/80x80?text=img")
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ===== RIGHT: INFO ===== */}
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  แบรนด์:{" "}
                  <span className="font-semibold text-gray-600">
                    {product.brand}
                  </span>
                  <span className="mx-2 text-gray-300">|</span> SKU:{" "}
                  {product.sku}
                </p>
              </div>

              <p className="text-4xl font-extrabold text-red-500">
                ฿{product.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield size={13} /> {product.warranty}
              </div>

              <div className="flex gap-2 flex-wrap items-center">
                {product.isNew && (
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded -skew-x-3">
                    NEW!
                  </span>
                )}
                {product.isPreOrder && (
                  <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded text-center leading-tight">
                    PRE
                    <br />
                    ORDER
                  </span>
                )}
                <button className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-yellow-300 transition">
                  ฿<sub className="text-[10px]">0%</sub> ดูเพิ่มเติม
                </button>
              </div>

              {/* Capacity */}
              {product.capacities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Capacity
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.capacities.map((cap: string) => (
                      <button
                        key={cap}
                        onClick={() => setSelectedCap(cap)}
                        className={`px-5 py-2 rounded-lg border-2 text-sm font-semibold transition ${selectedCap === cap ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Color{" "}
                    <span className="font-bold text-gray-900">
                      {selectedColor}
                    </span>
                  </p>

                  <div className="flex gap-3">
                    {product.colors.map((c: { name: string; hex: string }) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className={`w-9 h-9 rounded-full border-4 transition ${selectedColor === c.name
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:border-gray-400"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <ul className="space-y-1">
                  {product.specs.map((s: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-yellow-500 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-medium">จำนวน</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-medium transition"
                  ></button>
                  <span className="px-6 py-2 font-semibold text-sm min-w-[3rem] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-medium transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-2">
                📦 {product.shippingNote}
              </p>

              {/* CTA */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-400 hover:bg-orange-300 active:scale-95 text-black font-black py-4 rounded-xl text-base transition"
                >
                  ซื้อสินค้า
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-black hover:text-white active:scale-95 text-black border-2 border-black font-bold py-3.5 rounded-xl text-base transition"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>

              <div className="flex justify-center gap-6 pb-4">
                {[
                  { icon: <BarChart2 size={14} />, label: "เปรียบเทียบสินค้า" },
                  { icon: <Heart size={14} />, label: "เพิ่มเป็นรายการโปรด" },
                  { icon: <Share2 size={14} />, label: "แชร์" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-500 transition"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
