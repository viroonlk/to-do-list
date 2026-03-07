import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // ✅ แก้ไข: ให้ชี้ไปที่โฟลเดอร์ auth เท่านั้น และเช็คชื่อโดเมนให้ถูกต้อง
  const API_URL = "https://to-do-list-kz8a.onrender.com/api/auth";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      if (isLogin) {
        // ✅ ผลลัพธ์จะเป็น .../api/auth/login.php เป๊ะๆ
        const res = await axios.post(`${API_URL}/login.php`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage({ type: "success", text: "เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าแรก..." });
        setTimeout(() => navigate("/dashboard"), 1000);

      } else {
        // ✅ ผลลัพธ์จะเป็น .../api/auth/register.php
        await axios.post(`${API_URL}/register.php`, formData);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ (CORS หรือ URL ผิด)",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h2>

        {message.text && (
          <div className={`p-3 text-sm rounded-lg font-medium ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">ชื่อผู้ใช้</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required={!isLogin} className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-blue-500 outline-none" placeholder="ตั้งชื่อผู้ใช้งาน" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">อีเมล</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-blue-500 outline-none" placeholder="example@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">รหัสผ่าน</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-blue-500 outline-none" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none transition">
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-slate-400">
          {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้ว? "}
          <button onClick={() => { setIsLogin(!isLogin); setMessage({ type: "", text: "" }); }} className="font-medium text-blue-600 hover:underline">
            {isLogin ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบเลย"}
          </button>
        </p>
      </div>
    </div>
  );
}