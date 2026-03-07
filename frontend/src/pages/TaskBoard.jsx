import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 📦 เรียกใช้ Component ย่อยที่เราแยกส่วนไว้
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardTab from "../components/DashboardTab";
import ProjectsTab from "../components/ProjectsTab";
import SettingsTab from "../components/SettingsTab";
import EditTaskModal from "../components/EditTaskModal";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", color_code: "#6366F1" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); 
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(() => localStorage.getItem("notifyEnabled") !== "false");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_TASKS = "https://to-do-list-kz8a.onrender.com/api/tasks";
  const API_CATEGORIES = "https://to-do-list-kz8a.onrender.com/api/categories";

  useEffect(() => {
    localStorage.setItem("notifyEnabled", isNotificationEnabled);
  }, [isNotificationEnabled]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_TASKS}/edit_task.php`, { ...editingTask, owner_id: user.user_id, category_id: editingTask.category_id || null });
      setEditingTask(null);
      fetchTasks();
    } catch (error) { alert("เกิดข้อผิดพลาดในการแก้ไขงาน"); }
  };

  const handleRemoveTag = async (task_id, username) => {
    if (!window.confirm(`ต้องการลบ ${username} ออกจากงานนี้ใช่หรือไม่?`)) return;
    try {
      await axios.post(`${API_TASKS}/remove_tag.php`, { task_id, username });
      fetchTasks();
    } catch (error) { alert("เกิดข้อผิดพลาดในการลบแท็ก"); }
  };

  const urgentTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.due_date) return false;
    const due = new Date(t.due_date).getTime() + (23 * 60 * 60 * 1000);
    const now = new Date().getTime();
    return (due - now) < (3 * 24 * 60 * 60 * 1000);
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
        <Navbar user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} urgentTasks={urgentTasks} isNotificationEnabled={isNotificationEnabled} />

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {activeTab === 'dashboard' && (
              <DashboardTab 
                totalTasks={totalTasks} todoTasks={todoTasks} inProgressTasks={inProgressTasks} doneTasks={doneTasks}
                newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory}
                newTask={newTask} setNewTask={setNewTask} categories={categories} handleAddTask={handleAddTask}
                filteredTasks={filteredTasks} user={user} handleUpdateStatus={handleUpdateStatus} handleTagUser={handleTagUser}
                handleDeleteTask={handleDeleteTask} handleRemoveTag={handleRemoveTag} setEditingTask={setEditingTask}
              />
            )}

            {activeTab === 'projects' && <ProjectsTab filteredTasks={filteredTasks} />}

            {activeTab === 'settings' && (
              <SettingsTab 
                user={user} 
                isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
                isNotificationEnabled={isNotificationEnabled} setIsNotificationEnabled={setIsNotificationEnabled} 
                categories={categories}
              />
            )}

          </div>
        </div>
        
        <EditTaskModal editingTask={editingTask} setEditingTask={setEditingTask} handleEditSubmit={handleEditSubmit} categories={categories} />

      </main>
    </div>
  );
}