export default function TaskCard({ task, user, handleUpdateStatus, handleTagUser, handleDeleteTask }) {
  return (
    <div className="flex flex-col h-full min-h-[200px] p-5 mb-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div>
        <div className="flex justify-between items-start mb-3">
          {task.category_name ? (
            <span className="inline-block px-3 py-1 text-[11px] font-bold text-white rounded-full uppercase tracking-wider" style={{ backgroundColor: task.color_code || '#ccc' }}>
              {task.category_name}
            </span>
          ) : <span></span>}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <span className="text-[10px] text-slate-400">👤 สร้างโดย:</span>
            <span className="text-[11px] font-medium text-slate-600">{task.owner_name}</span>
          </div>
        </div>
        
        <h4 className="text-[17px] font-bold text-slate-800 leading-tight">{task.title}</h4>
        {task.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{task.description}</p>}
        
        <div className="mt-4 flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
          {task.start_date && <p className="text-xs font-medium text-indigo-600 flex items-center gap-1.5">🚀 เริ่ม: <span className="text-slate-600 font-normal">{new Date(task.start_date).toLocaleDateString("th-TH")}</span></p>}
          {task.due_date && <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5">⏰ สิ้นสุด: <span className="text-slate-600 font-normal">{new Date(task.due_date).toLocaleDateString("th-TH")}</span></p>}
          {!task.start_date && !task.due_date && <p className="text-xs text-slate-400 italic">ไม่มีกำหนดเวลา</p>}
        </div>
      </div>

      <div className="mt-auto pt-4">
        {task.tagged_users && (
          <div className="mb-4 flex items-start gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            <span className="text-indigo-400">👥</span>
            <p className="text-xs text-indigo-700 font-medium leading-relaxed">
              ผู้เกี่ยวข้อง: <span className="font-normal">{task.tagged_users}</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button onClick={() => handleUpdateStatus(task.task_id, task.status)} className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-colors shadow-sm ${task.status === 'todo' ? 'bg-indigo-500 hover:bg-indigo-600' : task.status === 'in_progress' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400 hover:bg-slate-500'}`}>
              {task.status === 'todo' ? 'เริ่มทำ' : task.status === 'in_progress' ? 'เสร็จสิ้น' : 'ทำซ้ำ'}
            </button>
            {task.owner_id === user.user_id && (
              <button onClick={() => handleTagUser(task.task_id)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                + แท็กคน
              </button>
            )}
          </div>
          {task.owner_id === user.user_id && (
            <button onClick={() => handleDeleteTask(task.task_id)} className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-white bg-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 rounded-lg transition-all shadow-sm">ลบ</button>
          )}
        </div>
      </div>
    </div>
  );
}