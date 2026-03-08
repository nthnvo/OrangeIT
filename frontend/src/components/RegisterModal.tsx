import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface Props {
  onClose: () => void;
}

function RegisterModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. สร้าง user ใน Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // 2. บันทึกชื่อลงใน Auth profile
      await updateProfile(firebaseUser, { displayName: name });

      // 3. บันทึกข้อมูลลง Firestore (collection "users")
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });

      alert("สมัครสมาชิกสำเร็จ");
      onClose();
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("อีเมลนี้ถูกใช้งานแล้ว");
      } else if (err.code === "auth/weak-password") {
        setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-[400px] relative">
        <button onClick={onClose} className="absolute top-3 right-4">✕</button>

        <h2 className="text-xl font-bold mb-6 text-center">สมัครสมาชิก</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border px-3 py-2 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-black text-white py-2 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;