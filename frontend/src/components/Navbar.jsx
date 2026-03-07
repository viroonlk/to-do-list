import { useState } from "react";

export default function Navbar({ user, searchQuery, setSearchQuery, urgentTasks }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full h-11 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all overflow-hidden">
          <span className="pl-4 text-slate-400">🔍</span>
          <input type="text" placeholder="ค้นหางาน หรือ หมวดหมู่..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-full px-3 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"/>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4 relative">
        {/* ปุ่มกระดิ่งแจ้งเตือน */}
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          🔔
          {urgentTasks.length > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Dropdown แจ้งเตือน */}
        {showNotifications && (
          <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
              การแจ้งเตือนงานด่วน ({urgentTasks.length})
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {urgentTasks.length === 0 ? (
                <p className="text-sm text-center text-slate-400 p-4">ไม่มีงานเร่งด่วนในขณะนี้ 🎉</p>
              ) : (
                urgentTasks.map(task => (
                  <div key={task.task_id} className="p-3 mb-1 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-rose-500 mt-1 font-medium">⏳ กำหนดส่ง: {new Date(task.due_date).toLocaleDateString('th-TH')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}