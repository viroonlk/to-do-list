export default function ProjectsTab({ filteredTasks }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">📁 รายการโปรเจกต์และงานทั้งหมด</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold border-b border-slate-200 dark:border-slate-700">ชื่องาน</th>
              <th className="p-4 font-semibold border-b border-slate-200 dark:border-slate-700">สถานะ</th>
              <th className="p-4 font-semibold border-b border-slate-200 dark:border-slate-700">เริ่ม/สิ้นสุด</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.task_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <td className="p-4"><p className="font-bold text-slate-700 dark:text-slate-200">{task.title}</p></td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${task.status === 'todo' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'}`}>
                    {task.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{task.due_date ? new Date(task.due_date).toLocaleDateString("th-TH") : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && <div className="p-8 text-center text-slate-400">ไม่พบข้อมูลงาน</div>}
      </div>
    </div>
  );
}