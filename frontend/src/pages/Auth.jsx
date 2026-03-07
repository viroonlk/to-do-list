import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // URL ของ API หลังบ้าน (แก้ใหตรงกับ Path ใน XAMPP ของคุณ)
// ตัดเครื่องหมาย / ที่อยู่หน้าคำว่า backend ออก 1 อันครับ
const API_URL = "https://viroontodo.infinityfreeapp.com/backend/api/auth/login.php";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      if (isLogin) {
        // --- ยิง API เข้าสู่ระบบ ---
        const res = await axios.post(`${API_URL}/login.php`, {
          email: formData.email,
          password: formData.password,
        });
        
        // บันทึกข้อมูล User ลง localStorage เพื่อเอาไปใช้หน้าอื่น
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage({ type: "success", text: "เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าแรก..." });
        
        // พาไปหน้า Dashboard หลังจากล็อคอินเสร็จ (หน่วงเวลาเล็กน้อยให้เห็นข้อความ)
        setTimeout(() => navigate("/dashboard"), 1000);

      } else {
        // --- ยิง API สมัครสมาชิก ---
        await axios.post(`${API_URL}/register.php`, formData);
        setMessage({ type: "success", text: "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ" });
        setIsLogin(true); // สลับกลับมาหน้า Login
        setFormData({ username: "", email: "", password: "" }); // ล้างฟอร์ม
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h2>

        {/* แสดงข้อความแจ้งเตือน (สำเร็จ/ผิดพลาด) */}
        {message.text && (
          <div className={`p-3 text-sm rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="ตั้งชื่อผู้ใช้งาน"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้ว? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ type: "", text: "" }); // ล้างข้อความแจ้งเตือนตอนสลับหน้า
            }}
            className="font-medium text-blue-600 hover:underline"
          >
            {isLogin ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบเลย"}
          </button>
        </p>
      </div>
    </div>
  );
}