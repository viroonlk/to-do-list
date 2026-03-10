import React from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsTab({ 
  user, 
  isDarkMode, 
  setIsDarkMode, 
  isNotificationEnabled, 
  setIsNotificationEnabled, 
  categories,
  onDeleteCategory // 🌟 รับ Prop ฟังก์ชันลบเข้ามา
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ส่วนที่ 1: การตั้งค่าระบบ */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          ⚙️ การแสดงผลและระบบ
        </h3>
        
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">Dark Mode (โหมดกลางคืน)</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">เปลี่ยนธีมหน้าจอเป็นสีมืดเพื่อถนอมสายตา</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800"></div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">การแจ้งเตือนงานด่วน</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">แสดงจุดสีแดงที่กระดิ่งเมื่องานใกล้ถึงกำหนดส่ง (3 วัน)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isNotificationEnabled} onChange={() => setIsNotificationEnabled(!isNotificationEnabled)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 🌟 ส่วนที่ 2: จัดการหมวดหมู่ (เพิ่มปุ่มลบตรงนี้) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          🏷️ หมวดหมู่ของคุณ
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div 
                key={cat.category_id} 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border shadow-sm transition-all hover:-translate-y-0.5"
                style={{ 
                  borderColor: cat.color_code, 
                  backgroundColor: isDarkMode ? `${cat.color_code}15` : '#ffffff',
                  color: isDarkMode ? '#e2e8f0' : '#334155'
                }}
              >
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color_code }}></span>
                {cat.name}
                
                {/* 🌟 ปุ่มกากบาทสำหรับลบหมวดหมู่ */}
                <button 
                  onClick={() => onDeleteCategory(cat.category_id)}
                  className="ml-2 flex items-center justify-center w-5 h-5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                  title="ลบหมวดหมู่นี้"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-400 italic">ยังไม่มีหมวดหมู่ที่สร้างไว้</p>
          )}
        </div>
      </div>

      {/* ส่วนที่ 3: เขตอันตราย (Logout) */}
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
          ⚠️ เขตอันตราย (Danger Zone)
        </h3>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">ออกจากระบบทุกอุปกรณ์</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">ยกเลิกเซสชันการเข้าสู่ระบบของคุณ</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border-2 border-red-200 text-red-600 dark:border-red-800/50 dark:text-red-400 font-bold rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-all focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

    </div>
  );
}