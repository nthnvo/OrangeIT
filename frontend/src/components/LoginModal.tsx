import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  openRegister: () => void;
}

function LoginModal({ onClose, openRegister }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Admin login
    if (email === "Admin" && password === "123456") {
      onClose();
      navigate("/admin");
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      login({
        name: firebaseUser.displayName || firebaseUser.email || "",
        email: firebaseUser.email || "",
      });
      onClose();
    } catch (err: any) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-[400px] relative">
        <button onClick={onClose} className="absolute top-3 right-4">✕</button>

        <h2 className="text-xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email หรือ Username"
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
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          ยังไม่มีบัญชี ?
          <button onClick={openRegister} className="text-blue-500 ml-1">
            สมัครสมาชิก
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;