import TaskCard from "./TaskCard";

export default function DashboardTab({ 
  totalTasks, todoTasks, inProgressTasks, doneTasks, 
  newCategory, setNewCategory, handleAddCategory, 
  newTask, setNewTask, categories, handleAddTask, 
  filteredTasks, user, handleUpdateStatus, handleTagUser, 
  handleDeleteTask, handleRemoveTag, setEditingTask 
}) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">งานทั้งหมด</span>
          <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-800 dark:text-white">{totalTasks}</span></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-slate-400">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">รอดำเนินการ</span>
          <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-600 dark:text-slate-300">{todoTasks}</span></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-blue-500">
          <span className="text-blue-500 dark:text-blue-400 text-sm font-semibold">กำลังทำ</span>
          <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-blue-600 dark:text-blue-400">{inProgressTasks}</span></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-emerald-500">
          <span className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold">เสร็จสิ้นแล้ว</span>
          <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{doneTasks}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">🏷️</div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200">สร้างหมวดหมู่ใหม่</h3>
          </div>
          <form onSubmit={handleAddCategory} className="space-y-3">
            <input type="text" placeholder="ชื่อหมวดหมู่..." required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"/>
            <div className="flex gap-2">
              <input type="color" value={newCategory.color_code} onChange={(e) => setNewCategory({...newCategory, color_code: e.target.value})} className="w-12 h-11 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"/>
              <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">บันทึก</button>
            </div>
          </form>
        </div>

        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">✨</div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200">สร้างงานใหม่</h3>
          </div>
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input type="text" placeholder="ตั้งชื่องานที่ต้องทำ..." required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 dark:text-slate-200"/>
              </div>
              <select value={newTask.category_id} onChange={(e) => setNewTask({...newTask, category_id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 dark:text-slate-300 font-medium">
                <option value="">-- ไม่มีหมวดหมู่ --</option>
                {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-6">
                <input type="text" placeholder="รายละเอียดเพิ่มเติม" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-slate-200"/>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 ml-2 mb-1 uppercase tracking-wider">วันเริ่มงาน</span>
                <input type="date" value={newTask.start_date} onChange={(e) => setNewTask({...newTask, start_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600 dark:text-slate-300"/>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 ml-2 mb-1 uppercase tracking-wider">กำหนดส่ง</span>
                <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600 dark:text-slate-300"/>
              </div>
              <div className="md:col-span-2 pt-5">
                <button type="submit" className="w-full h-[42px] font-bold text-white bg-slate-800 dark:bg-indigo-600 rounded-xl hover:bg-slate-900 dark:hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">เพิ่มงาน</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* TO DO Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div> To Do</h3>
          </div>
          <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-3 min-h-[500px]">
            {filteredTasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} handleRemoveTag={handleRemoveTag} setEditingTask={setEditingTask} />)}
          </div>
        </div>
        {/* IN PROGRESS Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b-2 border-blue-200 dark:border-blue-900/50">
            <h3 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div> In Progress</h3>
          </div>
          <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-3 min-h-[500px]">
            {filteredTasks.filter(t => t.status === 'in_progress').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} handleRemoveTag={handleRemoveTag} setEditingTask={setEditingTask} />)}
          </div>
        </div>
        {/* DONE Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200 dark:border-emerald-900/50">
            <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Done</h3>
          </div>
          <div className="flex-1 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl p-3 min-h-[500px]">
            {filteredTasks.filter(t => t.status === 'done').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} handleRemoveTag={handleRemoveTag} setEditingTask={setEditingTask} />)}
          </div>
        </div>
      </div>
    </div>
  );
}