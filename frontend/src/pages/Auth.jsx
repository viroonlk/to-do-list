import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://to-do-list-kz8a.onrender.com/api/auth";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- เข้าสู่ระบบ ---
        const res = await axios.post(`${API_URL}/login.php`, {
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        // ดักทางกรณี Backend ส่งมาเป็น String
        const responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

        if (responseData && responseData.user) {
          localStorage.setItem("user", JSON.stringify(responseData.user));
          setMessage({ type: "success", text: "เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าแรก..." });
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          setMessage({ type: "error", text: "ล็อกอินผ่าน แต่โหลดข้อมูลโปรไฟล์ไม่สำเร็จ" });
        }

      } else {
        // --- สมัครสมาชิก ---
        await axios.post(`${API_URL}/register.php`, formData, { withCredentials: true });
        setMessage({ type: "success", text: "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบเพื่อใช้งาน" });
        setIsLogin(true); 
        setFormData({ username: "", email: "", password: "" }); 
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const errorMsg = error.response?.data?.error || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 ฟังก์ชันใหม่: สำหรับให้ HR กดปุ่มเดียวแล้วล็อกอินเลย
  const handleDemoLogin = async () => {
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login.php`, {
        // ⚠️ แก้ไขอีเมลและรหัสผ่านตรงนี้ให้เป็นบัญชีที่คุณมีในฐานข้อมูล
        email: "testuser@gmail.com", 
        password: "123456" // <--- ⚠️ เปลี่ยนเป็นรหัสผ่านจริงของคุณ
      }, { withCredentials: true });

      const responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

      if (responseData && responseData.user) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
        setMessage({ type: "success", text: "🚀 เข้าสู่ระบบบัญชีทดลองสำเร็จ!..." });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Demo Auth Error:", error);
      setMessage({ type: "error", text: "ไม่สามารถเข้าสู่ระบบบัญชีทดลองได้ กรุณาตรวจสอบรหัสผ่านในโค้ด" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border dark:border-slate-800 transition-all">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          {isLogin ? "ยินดีต้อนรับกลับมา" : "สร้างบัญชีใหม่"}
        </h2>

        {message.text && (
          <div className={`p-4 text-sm rounded-lg font-medium animate-pulse ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">ชื่อผู้ใช้</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required={!isLogin} 
                className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Viroon_ITDS" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">อีเมล</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
              className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="example@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">รหัสผ่าน</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required 
              className="w-full px-4 py-2 mt-1 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full px-4 py-2 font-bold text-white rounded-lg shadow-md transition-all ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isLoading ? "กำลังประมวลผล..." : (isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก")}
          </button>
        </form>

        {/* 🌟 ปุ่มสำหรับ Demo Login (จะแสดงเฉพาะตอนอยู่หน้า "เข้าสู่ระบบ") */}
        {isLogin && (
          <div className="mt-4">
            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
              <span className="absolute px-3 bg-white dark:bg-slate-900 text-sm text-gray-500 dark:text-slate-400">หรือ</span>
            </div>
            <button 
              type="button" 
              onClick={handleDemoLogin} 
              disabled={isLoading}
              className={`w-full mt-2 px-4 py-2 font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              🚀 เข้าสู่ระบบด้วยบัญชีทดลอง (สำหรับผู้ประเมิน)
            </button>
          </div>
        )}

        <p className="text-sm text-center text-gray-600 dark:text-slate-400 mt-4">
          {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้ว? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setMessage({ type: "", text: "" }); }} 
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
          >
            {isLogin ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบเลย"}
          </button>
        </p>
      </div>
    </div>
  );
}