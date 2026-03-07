import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", color_code: "#6366F1" });
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🌟 เพิ่ม State สำหรับจัดการหน้า (Tab) ที่กำลังเปิดอยู่
  const [activeTab, setActiveTab] = useState("dashboard"); 

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const API_TASKS = "http://localhost/MY-TODO-PROJECT/backend/api/tasks";
  const API_CATEGORIES = "http://localhost/MY-TODO-PROJECT/backend/api/categories";

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_TASKS}/get_tasks.php?user_id=${user.user_id}`);
      setTasks(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_CATEGORIES}/get_categories.php?user_id=${user.user_id}`);
      setCategories(res.data);
    } catch (error) { console.error(error); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    try {
      await axios.post(`${API_CATEGORIES}/create.php`, { user_id: user.user_id, ...newCategory });
      setNewCategory({ name: "", color_code: "#6366F1" });
      fetchCategories();
    } catch (error) { console.error(error); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      await axios.post(`${API_TASKS}/create.php`, { owner_id: user.user_id, ...newTask, category_id: newTask.category_id || null });
      setNewTask({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleUpdateStatus = async (task_id, currentStatus) => {
    let newStatus = "todo";
    if (currentStatus === "todo") newStatus = "in_progress";
    else if (currentStatus === "in_progress") newStatus = "done";
    try {
      await axios.put(`${API_TASKS}/update.php`, { task_id, owner_id: user.user_id, status: newStatus, title: tasks.find(t => t.task_id === task_id).title });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (task_id) => {
    if (!window.confirm("ลบงานนี้แน่ใช่ไหม?")) return;
    try {
      await axios.delete(`${API_TASKS}/delete.php`, { data: { task_id, owner_id: user.user_id } });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleTagUser = async (task_id) => {
    const usernameToTag = window.prompt("👤 ใส่ชื่อผู้ใช้งาน (Username) ที่ต้องการแท็ก:");
    if (!usernameToTag) return;
    try {
      await axios.post(`${API_TASKS}/tag_user.php`, { task_id, owner_id: user.user_id, username: usernameToTag.trim() });
      alert(`แท็ก ${usernameToTag} สำเร็จแล้ว!`);
      fetchTasks(); 
    } catch (error) { alert(error.response?.data?.error || "เกิดข้อผิดพลาด"); }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.category_name && task.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* ส่ง activeTab และฟังก์ชันเปลี่ยน Tab ไปให้ Sidebar */}
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* 🔴 ส่วนที่ 1: หน้า Dashboard (แสดงเมื่อ activeTab === 'dashboard') */}
            {activeTab === 'dashboard' && (
              <>
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">🏷️</div>
                      <h3 className="font-bold text-slate-700">สร้างหมวดหมู่ใหม่</h3>
                    </div>
                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <input type="text" placeholder="ชื่อหมวดหมู่..." required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
                      <div className="flex gap-2">
                        <input type="color" value={newCategory.color_code} onChange={(e) => setNewCategory({...newCategory, color_code: e.target.value})} className="w-12 h-11 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"/>
                        <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">บันทึก</button>
                      </div>
                    </form>
                  </div>

                  <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✨</div>
                      <h3 className="font-bold text-slate-700">สร้างงานใหม่</h3>
                    </div>
                    <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <input type="text" placeholder="ตั้งชื่องานที่ต้องทำ..." required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"/>
                        </div>
                        <select value={newTask.category_id} onChange={(e) => setNewTask({...newTask, category_id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium">
                          <option value="">-- ไม่มีหมวดหมู่ --</option>
                          {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-6">
                          <input type="text" placeholder="รายละเอียดเพิ่มเติม" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
                        </div>
                        <div className="md:col-span-2 flex flex-col">
                          <span className="text-[11px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider">วันเริ่มงาน</span>
                          <input type="date" value={newTask.start_date} onChange={(e) => setNewTask({...newTask, start_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600"/>
                        </div>
                        <div className="md:col-span-2 flex flex-col">
                          <span className="text-[11px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider">กำหนดส่ง</span>
                          <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600"/>
                        </div>
                        <div className="md:col-span-2 pt-5">
                          <button type="submit" className="w-full h-[42px] font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 shadow-md flex items-center justify-center gap-2">เพิ่มงาน</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div> To Do</h3>
                    </div>
                    <div className="flex-1 bg-slate-100/50 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-blue-200">
                      <h3 className="text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div> In Progress</h3>
                    </div>
                    <div className="flex-1 bg-blue-50/50 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'in_progress').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200">
                      <h3 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Done</h3>
                    </div>
                    <div className="flex-1 bg-emerald-50/30 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'done').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 🔴 ส่วนที่ 2: หน้าโปรเจกต์ทั้งหมด (Table View) */}
            {activeTab === 'projects' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">📁 รายการโปรเจกต์และงานทั้งหมด</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold border-b border-slate-200">ชื่องาน</th>
                        <th className="p-4 font-semibold border-b border-slate-200">หมวดหมู่</th>
                        <th className="p-4 font-semibold border-b border-slate-200">สถานะ</th>
                        <th className="p-4 font-semibold border-b border-slate-200">เริ่ม/สิ้นสุด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(task => (
                        <tr key={task.task_id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                          <td className="p-4">
                            <p className="font-bold text-slate-700">{task.title}</p>
                            <p className="text-xs text-slate-400 mt-1">สร้างโดย: {task.owner_name}</p>
                          </td>
                          <td className="p-4">
                            {task.category_name ? (
                              <span className="px-3 py-1 text-xs font-bold text-white rounded-full" style={{ backgroundColor: task.color_code || '#ccc' }}>
                                {task.category_name}
                              </span>
                            ) : <span className="text-slate-400 text-xs">-</span>}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg ${task.status === 'todo' ? 'bg-slate-100 text-slate-600' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {task.start_date ? new Date(task.start_date).toLocaleDateString("th-TH") : '-'} <br/>
                            <span className="text-rose-500 text-xs">{task.due_date ? `ถึง: ${new Date(task.due_date).toLocaleDateString("th-TH")}` : ''}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTasks.length === 0 && <div className="p-8 text-center text-slate-400">ไม่พบข้อมูลงาน</div>}
                </div>
              </div>
            )}

            {/* 🔴 ส่วนที่ 3: หน้าตั้งค่า (Settings UI Placeholder) */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>👤</span> ข้อมูลส่วนตัว</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                      <input type="text" disabled value={user?.username} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"/>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-1">รหัสพนักงาน / ไอดี</label>
                      <input type="text" disabled value={`USER-${user?.user_id}`} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"/>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 opacity-70">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>🎨</span> การตั้งค่าระบบ (Coming Soon)</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-700">Dark Mode</h4>
                        <p className="text-xs text-slate-500">เปลี่ยนธีมหน้าจอเป็นสีมืด</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-300 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-700">การแจ้งเตือนผ่านอีเมล</h4>
                        <p className="text-xs text-slate-500">รับอีเมลเมื่องานใกล้ถึงกำหนด</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}