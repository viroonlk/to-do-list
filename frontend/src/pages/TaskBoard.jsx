import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", color_code: "#6366F1" }); // เปลี่ยนสี Default เป็น Indigo
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const API_TASKS = "http://localhost/MY-TODO-PROJECT/backend/api/tasks"; // เช็ค URL ให้ตรงกับเครื่องคุณด้วยนะครับ
  const API_CATEGORIES = "http://localhost/MY-TODO-PROJECT/backend/api/categories";

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_TASKS}/get_tasks.php?user_id=${user.user_id}`);
      setTasks(res.data);
    } catch (error) { console.error("Error fetching tasks:", error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_CATEGORIES}/get_categories.php?user_id=${user.user_id}`);
      setCategories(res.data);
    } catch (error) { console.error("Error fetching categories:", error); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    try {
      await axios.post(`${API_CATEGORIES}/create.php`, { user_id: user.user_id, ...newCategory });
      setNewCategory({ name: "", color_code: "#6366F1" });
      fetchCategories();
    } catch (error) { console.error("Error adding category:", error); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      await axios.post(`${API_TASKS}/create.php`, { owner_id: user.user_id, ...newTask, category_id: newTask.category_id || null });
      setNewTask({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
      fetchTasks();
    } catch (error) { console.error("Error adding task:", error); }
  };

  const handleUpdateStatus = async (task_id, currentStatus) => {
    let newStatus = "todo";
    if (currentStatus === "todo") newStatus = "in_progress";
    else if (currentStatus === "in_progress") newStatus = "done";
    try {
      await axios.put(`${API_TASKS}/update.php`, { task_id, owner_id: user.user_id, status: newStatus, title: tasks.find(t => t.task_id === task_id).title });
      fetchTasks();
    } catch (error) { console.error("Error updating status:", error); }
  };

  const handleDeleteTask = async (task_id) => {
    if (!window.confirm("ลบงานนี้แน่ใช่ไหม?")) return;
    try {
      await axios.delete(`${API_TASKS}/delete.php`, { data: { task_id, owner_id: user.user_id } });
      fetchTasks();
    } catch (error) { console.error("Error deleting task:", error); }
  };

  const handleTagUser = async (task_id) => {
    const usernameToTag = window.prompt("👤 ใส่ชื่อผู้ใช้งาน (Username) ที่ต้องการแท็ก:");
    if (!usernameToTag) return;
    try {
      await axios.post(`${API_TASKS}/tag_user.php`, { task_id, owner_id: user.user_id, username: usernameToTag.trim() });
      alert(`แท็ก ${usernameToTag} สำเร็จแล้ว!`);
      fetchTasks(); 
    } catch (error) { alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการแท็ก"); }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.category_name && task.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 📝 Component การ์ดงานที่ปรับ UI ใหม่ให้ดูพรีเมียมขึ้น
  const TaskCard = ({ task }) => (
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

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* 🟢 SIDEBAR (แผงเมนูด้านซ้าย) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
                ✓
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">TaskFlow</h1>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            <div className="px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center gap-3 cursor-pointer">
              <span>📊</span> Dashboard
            </div>
            <div className="px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
              <span>📁</span> โปรเจกต์ทั้งหมด
            </div>
            <div className="px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
              <span>⚙️</span> ตั้งค่า
            </div>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{user?.username}</p>
              <p className="text-[11px] text-slate-400">Online</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} className="w-full py-2.5 text-sm font-bold text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors shadow-sm">
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT (พื้นที่แสดงผลหลัก) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Navbar ด้านบน */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex-1 max-w-xl">
            {/* ช่องค้นหาถูกย้ายมาอยู่บน Navbar */}
            <div className="relative flex items-center w-full h-11 rounded-full bg-slate-100 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-sm focus-within:ring-4 focus-within:ring-indigo-50 transition-all overflow-hidden">
              <span className="pl-4 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหางาน หรือ หมวดหมู่..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full h-full px-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">🔔</button>
            <div className="md:hidden flex items-center gap-2">
              <span className="font-bold">{user?.username}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content (ส่วนที่เลื่อนได้) */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* 📊 Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500">
                <span className="text-slate-500 text-sm font-semibold">งานทั้งหมด</span>
                <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-800">{totalTasks}</span><span className="text-sm text-slate-400 mb-1">งาน</span></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-slate-400">
                <span className="text-slate-500 text-sm font-semibold">รอดำเนินการ</span>
                <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-600">{todoTasks}</span><span className="text-sm text-slate-400 mb-1">งาน</span></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                <span className="text-blue-500 text-sm font-semibold">กำลังทำ</span>
                <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-blue-600">{inProgressTasks}</span><span className="text-sm text-blue-300 mb-1">งาน</span></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
                <span className="text-emerald-500 text-sm font-semibold">เสร็จสิ้นแล้ว</span>
                <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-emerald-600">{doneTasks}</span><span className="text-sm text-emerald-300 mb-1">งาน</span></div>
              </div>
            </div>

            {/* 🛠️ Action Section (จัดฟอร์มเพิ่มงานและหมวดหมู่ใหม่) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* ฟอร์มสร้างหมวดหมู่ */}
              <div className="col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">🏷️</div>
                  <h3 className="font-bold text-slate-700">สร้างหมวดหมู่ใหม่</h3>
                </div>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <input type="text" placeholder="ชื่อหมวดหมู่..." required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
                  <div className="flex gap-2">
                    <input type="color" value={newCategory.color_code} onChange={(e) => setNewCategory({...newCategory, color_code: e.target.value})} className="w-12 h-11 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"/>
                    <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                      บันทึกหมวดหมู่
                    </button>
                  </div>
                </form>
              </div>

              {/* ฟอร์มเพิ่มงาน */}
              <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✨</div>
                  <h3 className="font-bold text-slate-700">สร้างงานใหม่</h3>
                </div>
                <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <input type="text" placeholder="ตั้งชื่องานที่ต้องทำ..." required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"/>
                    </div>
                    <select value={newTask.category_id} onChange={(e) => setNewTask({...newTask, category_id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600 font-medium appearance-none cursor-pointer">
                      <option value="">-- ไม่มีหมวดหมู่ --</option>
                      {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-6">
                      <input type="text" placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"/>
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider">วันเริ่มงาน</span>
                      <input type="date" value={newTask.start_date} onChange={(e) => setNewTask({...newTask, start_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600"/>
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider">กำหนดส่ง</span>
                      <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600"/>
                    </div>
                    <div className="md:col-span-2 flex items-end h-full pt-5">
                      <button type="submit" className="w-full h-[42px] font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-colors shadow-md shadow-slate-300 flex items-center justify-center gap-2">
                        <span>+</span> เพิ่มงาน
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* 📋 โซน Kanban Board 3 คอลัมน์ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div> To Do
                  </h3>
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">{todoTasks}</span>
                </div>
                <div className="flex-1 bg-slate-100/50 rounded-2xl p-3 min-h-[500px]">
                  {filteredTasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task.task_id} task={task} />)}
                  {filteredTasks.filter(t => t.status === 'todo').length === 0 && <div className="h-32 flex items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl mt-2">ไม่มีงานใหม่ 🎉</div>}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b-2 border-blue-200">
                  <h3 className="text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div> In Progress
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{inProgressTasks}</span>
                </div>
                <div className="flex-1 bg-blue-50/50 rounded-2xl p-3 min-h-[500px]">
                  {filteredTasks.filter(t => t.status === 'in_progress').map(task => <TaskCard key={task.task_id} task={task} />)}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200">
                  <h3 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Done
                  </h3>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{doneTasks}</span>
                </div>
                <div className="flex-1 bg-emerald-50/30 rounded-2xl p-3 min-h-[500px]">
                  {filteredTasks.filter(t => t.status === 'done').map(task => <TaskCard key={task.task_id} task={task} />)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}