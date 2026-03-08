import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      // สมัครสมาชิกกับ Firebase
      await createUserWithEmailAndPassword(auth, email, password);

      alert("สมัครสมาชิกสำเร็จ");

      navigate("/login");

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          สมัครสมาชิก
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              ชื่อ
            </label>

            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="ชื่อของคุณ"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              อีเมล
            </label>

            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              รหัสผ่าน
            </label>

            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            สมัครสมาชิก
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;