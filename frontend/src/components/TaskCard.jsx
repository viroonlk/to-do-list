import { useEffect, useState } from "react";

export default function TaskCard({ task, user, handleUpdateStatus, handleTagUser, handleDeleteTask }) {
  const [countdown, setCountdown] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);

  // ฟังก์ชันคำนวณเวลานับถอยหลัง
  useEffect(() => {
    if (!task.due_date || task.status === 'done') {
      setCountdown("");
      return;
    }
    
    const calculateTime = () => {
      const due = new Date(task.due_date).getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000); // นับถึงสิ้นวัน (23:59 น.)
      const now = new Date().getTime();
      const diff = due - now;

      if (diff < 0) {
        setIsOverdue(true);
        setCountdown("หมดเวลาแล้ว!");
      } else {
        setIsOverdue(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setCountdown(`${days > 0 ? `${days} วัน ` : ''}${hours} ชม.`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // อัปเดตทุก 1 นาที
    return () => clearInterval(timer);
  }, [task.due_date, task.status]);

  return (
    <div className="flex flex-col h-full min-h-[200px] p-5 mb-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        <div className="flex justify-between items-start mb-3">
          {task.category_name ? (
            <span className="inline-block px-3 py-1 text-[11px] font-bold text-white rounded-full uppercase tracking-wider" style={{ backgroundColor: task.color_code || '#ccc' }}>{task.category_name}</span>
          ) : <span></span>}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] text-slate-400">👤 สร้างโดย:</span>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{task.owner_name}</span>
          </div>
        </div>
        
        <h4 className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">{task.title}</h4>
        {task.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{task.description}</p>}
        
        <div className="mt-4 flex flex-col gap-1.5 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          {task.start_date && <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex justify-between">🚀 เริ่ม: <span className="text-slate-600 dark:text-slate-300">{new Date(task.start_date).toLocaleDateString("th-TH")}</span></p>}
          {task.due_date && <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex justify-between">⏰ สิ้นสุด: <span className="text-slate-600 dark:text-slate-300">{new Date(task.due_date).toLocaleDateString("th-TH")}</span></p>}
          
          {/* แสดงเวลานับถอยหลัง */}
          {countdown && (
            <div className={`mt-1 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs font-bold ${isOverdue ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-orange-500 dark:text-orange-400'}`}>
              <span>⏳ เวลาที่เหลือ:</span>
              <span>{countdown}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        {task.tagged_users && (
          <div className="mb-4 flex items-start gap-2 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <span className="text-indigo-400">👥</span>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed">
              ผู้เกี่ยวข้อง: <span className="font-normal">{task.tagged_users}</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button onClick={() => handleUpdateStatus(task.task_id, task.status)} className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-colors shadow-sm ${task.status === 'todo' ? 'bg-indigo-500 hover:bg-indigo-600' : task.status === 'in_progress' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400 hover:bg-slate-500 dark:bg-slate-600'}`}>
              {task.status === 'todo' ? 'เริ่มทำ' : task.status === 'in_progress' ? 'เสร็จสิ้น' : 'ทำซ้ำ'}
            </button>
            {task.owner_id === user.user_id && (
              <button onClick={() => handleTagUser(task.task_id)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                + แท็กคน
              </button>
            )}
          </div>
          {task.owner_id === user.user_id && (
            <button onClick={() => handleDeleteTask(task.task_id)} className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-white bg-white hover:bg-rose-500 dark:bg-slate-800 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900 rounded-lg transition-all shadow-sm">ลบ</button>
          )}
        </div>
      </div>
    </div>
  );
}