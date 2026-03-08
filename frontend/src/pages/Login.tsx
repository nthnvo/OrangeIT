import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ตัวอย่าง login แบบง่าย
    if (email === "admin@gmail.com" && password === "1234") {
      alert("เข้าสู่ระบบสำเร็จ");
      navigate("/"); // ไปหน้า Home
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              อีเมล
            </label>
            <input
              type="email"
              required
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
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            เข้าสู่ระบบ
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm mt-4">
          ยังไม่มีบัญชี?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            สมัครสมาชิก
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;