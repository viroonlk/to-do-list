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
  const [activeTab, setActiveTab] = useState("dashboard"); 
  
  // 🌙 State สำหรับ Dark Mode (จำค่าไว้ในเครื่อง)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_TASKS = "http://localhost/MY-TODO-PROJECT/backend/api/tasks";
  const API_CATEGORIES = "http://localhost/MY-TODO-PROJECT/backend/api/categories";

  // จัดการเปิด/ปิด Dark Mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

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

  // 🔔 คำนวณงานด่วน (ใกล้กำหนดส่งใน 3 วัน และยังไม่เสร็จ)
  const urgentTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.due_date) return false;
    const due = new Date(t.due_date).getTime() + (23 * 60 * 60 * 1000); // สิ้นวัน
    const now = new Date().getTime();
    return (due - now) < (3 * 24 * 60 * 60 * 1000); // น้อยกว่า 3 วัน
  });

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.category_name && task.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden text-slate-800 transition-colors duration-300">
      
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* ส่ง urgentTasks ไปให้ Navbar */}
        <Navbar user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} urgentTasks={urgentTasks} />

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">งานทั้งหมด</span>
                    <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-800 dark:text-white">{totalTasks}</span><span className="text-sm text-slate-400 mb-1">งาน</span></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-slate-400">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">รอดำเนินการ</span>
                    <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-slate-600 dark:text-slate-300">{todoTasks}</span><span className="text-sm text-slate-400 mb-1">งาน</span></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-blue-500">
                    <span className="text-blue-500 dark:text-blue-400 text-sm font-semibold">กำลังทำ</span>
                    <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-blue-600 dark:text-blue-400">{inProgressTasks}</span><span className="text-sm text-blue-300 dark:text-blue-500 mb-1">งาน</span></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-emerald-500">
                    <span className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold">เสร็จสิ้นแล้ว</span>
                    <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{doneTasks}</span><span className="text-sm text-emerald-300 dark:text-emerald-500 mb-1">งาน</span></div>
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
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div> To Do</h3>
                    </div>
                    <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-blue-200 dark:border-blue-900/50">
                      <h3 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div> In Progress</h3>
                    </div>
                    <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'in_progress').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200 dark:border-emerald-900/50">
                      <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Done</h3>
                    </div>
                    <div className="flex-1 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl p-3 min-h-[500px]">
                      {filteredTasks.filter(t => t.status === 'done').map(task => <TaskCard key={task.task_id} task={task} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser} handleDeleteTask={handleDeleteTask} />)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* หน้าโปรเจกต์ทั้งหมด */}
            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
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
                </div>
              </div>
            )}

            {/* หน้าตั้งค่า (Settings UI แบบจัดเต็ม) */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                
                {/* 1. ข้อมูลบัญชี */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">👤</span> 
                    ข้อมูลบัญชีผู้ใช้
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

                {/* 2. การตั้งค่าระบบ */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">⚙️</span> 
                    การแสดงผลและระบบ
                  </h2>
                  <div className="space-y-4">
                    
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200">Dark Mode (โหมดกลางคืน)</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">เปลี่ยนธีมหน้าจอเป็นสีมืดเพื่อถนอมสายตา</p>
                      </div>
                      <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-7 rounded-full relative transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${isDarkMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
                      </button>
                    </div>

                    {/* Notification Toggle (UI จำลอง) */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200">การแจ้งเตือนงานด่วน</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">แสดงจุดสีแดงที่กระดิ่งเมื่องานใกล้ถึงกำหนดส่ง (3 วัน)</p>
                      </div>
                      <button className="w-14 h-7 rounded-full relative transition-colors duration-300 focus:outline-none bg-emerald-500 cursor-default">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-1 translate-x-8 shadow-sm"></div>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 3. จัดการหมวดหมู่ */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">🏷️</span> 
                    หมวดหมู่ของคุณ
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {categories.length > 0 ? categories.map(cat => (
                      <div key={cat.category_id} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color_code }}></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                        {/* ถ้าต้องการให้ลบได้จริง ต้องไปทำ API delete_category.php เพิ่ม แต่นี่ใส่ UI ไว้ก่อน */}
                        <button className="ml-2 text-slate-400 hover:text-rose-500 transition-colors" title="ลบหมวดหมู่">✖</button>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">ยังไม่มีหมวดหมู่</p>
                    )}
                  </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-rose-100 dark:border-rose-900/30">
                  <h2 className="text-xl font-bold text-rose-600 dark:text-rose-500 mb-6 flex items-center gap-3">
                    <span className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl">⚠️</span> 
                    เขตอันตราย (Danger Zone)
                  </h2>
                  <div className="p-5 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">ออกจากระบบทุกอุปกรณ์</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ยกเลิกเซสชันการเข้าสู่ระบบของคุณ</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} className="px-6 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-200 dark:border-rose-800 whitespace-nowrap">
                      ออกจากระบบ
                    </button>
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