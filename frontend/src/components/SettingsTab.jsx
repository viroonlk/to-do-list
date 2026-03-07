import { useNavigate } from "react-router-dom";

export default function SettingsTab({ user, isDarkMode, setIsDarkMode, isNotificationEnabled, setIsNotificationEnabled, categories }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
          <span className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">👤</span> ข้อมูลบัญชีผู้ใช้
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">ชื่อผู้ใช้งาน (Username)</label>
            <input type="text" disabled value={user?.username} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">รหัสประจำตัว (User ID)</label>
            <input type="text" disabled value={`USER-${user?.user_id?.toString().padStart(4, '0')}`} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"/>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
          <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">⚙️</span> การแสดงผลและระบบ
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200">Dark Mode (โหมดกลางคืน)</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">เปลี่ยนธีมหน้าจอเป็นสีมืดเพื่อถนอมสายตา</p>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-7 rounded-full relative transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${isDarkMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200">การแจ้งเตือนงานด่วน</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">แสดงจุดสีแดงที่กระดิ่งเมื่องานใกล้ถึงกำหนดส่ง (3 วัน)</p>
            </div>
            <button onClick={() => setIsNotificationEnabled(!isNotificationEnabled)} className={`w-14 h-7 rounded-full relative transition-colors duration-300 focus:outline-none ${isNotificationEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${isNotificationEnabled ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
          <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">🏷️</span> หมวดหมู่ของคุณ
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.length > 0 ? categories.map(cat => (
            <div key={cat.category_id} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color_code }}></div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
          )) : <p className="text-sm text-slate-500 dark:text-slate-400">ยังไม่มีหมวดหมู่</p>}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-rose-100 dark:border-rose-900/30">
        <h2 className="text-xl font-bold text-rose-600 dark:text-rose-500 mb-6 flex items-center gap-3">
          <span className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl">⚠️</span> เขตอันตราย (Danger Zone)
        </h2>
        <div className="p-5 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">ออกจากระบบทุกอุปกรณ์</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ยกเลิกเซสชันการเข้าสู่ระบบของคุณ</p>
          </div>
          <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} className="px-6 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-200 dark:border-rose-800 whitespace-nowrap">ออกจากระบบ</button>
        </div>
      </div>
    </div>
  );
}