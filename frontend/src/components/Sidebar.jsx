import { useNavigate } from "react-router-dom";

export default function Sidebar({ user, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const getTabClass = (tabName) => {
    const baseClass = "px-4 py-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer transition-colors ";
    if (activeTab === tabName) return baseClass + "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300";
    return baseClass + "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 font-medium";
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex z-10 transition-colors duration-300">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none">✓</div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">TaskFlow</h1>
          </div>
        </div>
        <nav className="p-4 space-y-1.5">
          <div onClick={() => setActiveTab('dashboard')} className={getTabClass('dashboard')}><span>📊</span> Dashboard</div>
          <div onClick={() => setActiveTab('projects')} className={getTabClass('projects')}><span>📁</span> โปรเจกต์ทั้งหมด</div>
          <div onClick={() => setActiveTab('settings')} className={getTabClass('settings')}><span>⚙️</span> ตั้งค่า</div>
        </nav>
      </div>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">{user?.username.charAt(0).toUpperCase()}</div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.username}</p>
            <p className="text-[11px] text-emerald-500 font-medium">Online</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shadow-sm">ออกจากระบบ</button>
      </div>
    </aside>
  );
}