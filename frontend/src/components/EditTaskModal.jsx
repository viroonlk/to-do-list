export default function EditTaskModal({ editingTask, setEditingTask, handleEditSubmit, categories }) {
  if (!editingTask) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><span>✏️</span> แก้ไขรายละเอียดงาน</h3>
          <button onClick={() => setEditingTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-colors">✖</button>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">ชื่องาน</label>
            <input type="text" required value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-slate-700 dark:text-slate-200"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">หมวดหมู่</label>
            <select value={editingTask.category_id || ""} onChange={(e) => setEditingTask({...editingTask, category_id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-600 dark:text-slate-300">
              <option value="">-- ไม่มีหมวดหมู่ --</option>
              {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">รายละเอียด (ถ้ามี)</label>
            <textarea rows="3" value={editingTask.description || ""} onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-slate-200 resize-none"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">วันเริ่มงาน</label>
              <input type="date" value={editingTask.start_date ? editingTask.start_date.split(' ')[0] : ""} onChange={(e) => setEditingTask({...editingTask, start_date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-slate-600 dark:text-slate-300"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">กำหนดส่ง</label>
              <input type="date" value={editingTask.due_date ? editingTask.due_date.split(' ')[0] : ""} onChange={(e) => setEditingTask({...editingTask, due_date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-slate-600 dark:text-slate-300"/>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setEditingTask(null)} className="flex-1 px-4 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">ยกเลิก</button>
            <button type="submit" className="flex-1 px-4 py-3 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md shadow-amber-200 dark:shadow-none transition-colors">💾 บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  );
}