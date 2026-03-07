import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  // เพิ่ม start_date เข้าไปใน State
  const [newTask, setNewTask] = useState({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", color_code: "#3B82F6" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
const API_TASKS = "http://localhost/MY-TODO-PROJECT/backend/api/tasks";
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
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_CATEGORIES}/get_categories.php?user_id=${user.user_id}`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    try {
      await axios.post(`${API_CATEGORIES}/create.php`, {
        user_id: user.user_id,
        name: newCategory.name,
        color_code: newCategory.color_code,
      });
      setNewCategory({ name: "", color_code: "#3B82F6" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      await axios.post(`${API_TASKS}/create.php`, {
        owner_id: user.user_id,
        title: newTask.title,
        description: newTask.description,
        start_date: newTask.start_date, // ส่งวันเริ่มงานไปด้วย
        due_date: newTask.due_date,
        category_id: newTask.category_id || null
      });
      // ล้างฟอร์ม
      setNewTask({ title: "", description: "", start_date: "", due_date: "", category_id: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateStatus = async (task_id, currentStatus) => {
    let newStatus = "todo";
    if (currentStatus === "todo") newStatus = "in_progress";
    else if (currentStatus === "in_progress") newStatus = "done";
    try {
      await axios.put(`${API_TASKS}/update.php`, {
        task_id: task_id,
        owner_id: user.user_id,
        status: newStatus,
        title: tasks.find(t => t.task_id === task_id).title
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteTask = async (task_id) => {
    if (!window.confirm("ลบงานนี้แน่ใช่ไหม?")) return;
    try {
      await axios.delete(`${API_TASKS}/delete.php`, {
        data: { task_id: task_id, owner_id: user.user_id }
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTagUser = async (task_id) => {
    const usernameToTag = window.prompt("👤 ใส่ชื่อผู้ใช้งาน (Username) ที่ต้องการแท็ก:");
    if (!usernameToTag) return;
    try {
      await axios.post(`${API_TASKS}/tag_user.php`, {
        task_id: task_id,
        owner_id: user.user_id,
        username: usernameToTag.trim()
      });
      alert(`แท็ก ${usernameToTag} สำเร็จแล้ว!`);
      fetchTasks(); 
    } catch (error) {
      alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการแท็ก");
    }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.category_name && task.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const TaskCard = ({ task }) => (
    // ใช้ flex และ flex-col เพื่อดันปุ่มลงไปด้านล่างสุดเสมอ
    <div className="p-4 mb-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col h-full min-h-[200px]">
      <div>
        <div className="flex justify-between items-start mb-2">
          {task.category_name && (
            <span className="inline-block px-2 py-1 text-xs text-white rounded-full" style={{ backgroundColor: task.color_code || '#ccc' }}>
              {task.category_name}
            </span>
          )}
          {/* โชว์ชื่อคนสร้างงาน */}
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">👤 สร้างโดย: {task.owner_name}</span>
        </div>
        
        <h4 className="font-semibold text-gray-800 text-lg">{task.title}</h4>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        
        {/* โชว์วันเริ่ม และ วันสิ้นสุด */}
        <div className="mt-3 text-xs font-medium space-y-1">
          {task.start_date && <p className="text-blue-600">📅 เริ่ม: {new Date(task.start_date).toLocaleDateString("th-TH")}</p>}
          {task.due_date && <p className="text-red-500">⏰ สิ้นสุด: {new Date(task.due_date).toLocaleDateString("th-TH")}</p>}
        </div>
      </div>

      {/* mt-auto จะดันเนื้อหาส่วนนี้ไปอยู่ล่างสุดของการ์ดเสมอ */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        {/* โชว์ชื่อเพื่อนที่ถูกแท็ก (ย้ายมาไว้ล่างสุด) */}
        {task.tagged_users && (
          <p className="text-xs text-indigo-600 font-medium bg-indigo-50 inline-block px-2 py-1 rounded mb-3 w-full">
            👥 ผู้เกี่ยวข้อง: {task.tagged_users}
          </p>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => handleUpdateStatus(task.task_id, task.status)} className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 shadow-sm">
              {task.status === 'todo' ? 'เริ่มทำ' : task.status === 'in_progress' ? 'เสร็จสิ้น' : 'ทำซ้ำ'}
            </button>
            
            {task.owner_id === user.user_id && (
              <button onClick={() => handleTagUser(task.task_id)} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 shadow-sm">
                + แท็กคน
              </button>
            )}
          </div>
          
          {task.owner_id === user.user_id && (
            <button onClick={() => handleDeleteTask(task.task_id)} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 shadow-sm">ลบ</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📌 Task Board ของ {user?.username}</h1>
          <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} className="px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-600 rounded hover:bg-red-50">ออกจากระบบ</button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">งานทั้งหมด</span>
            <span className="text-3xl font-bold text-gray-800">{totalTasks}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">รอดำเนินการ</span>
            <span className="text-3xl font-bold text-gray-500">{todoTasks}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center justify-center">
            <span className="text-blue-500 text-sm font-medium">กำลังทำ</span>
            <span className="text-3xl font-bold text-blue-600">{inProgressTasks}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex flex-col items-center justify-center">
            <span className="text-green-500 text-sm font-medium">เสร็จสิ้นแล้ว</span>
            <span className="text-3xl font-bold text-green-600">{doneTasks}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="font-bold text-gray-700 mb-3">🏷️ สร้างหมวดหมู่ใหม่</h3>
            <input type="text" placeholder="ชื่อหมวดหมู่..." required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
            <div className="flex gap-2">
              <input type="color" value={newCategory.color_code} onChange={(e) => setNewCategory({...newCategory, color_code: e.target.value})} className="w-10 h-10 border rounded cursor-pointer"/>
              <button type="submit" className="flex-1 px-4 py-2 text-sm font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">เพิ่ม</button>
            </div>
          </form>

          <div className="col-span-3 flex flex-col gap-4">
            <form onSubmit={handleAddTask} className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex gap-3">
                <input type="text" placeholder="ชื่องาน..." required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                <select value={newTask.category_id} onChange={(e) => setNewTask({...newTask, category_id: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none">
                  <option value="">-- ไม่มีหมวดหมู่ --</option>
                  {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
                </select>
              </div>
              
              {/* แยกฟอร์มวันที่เริ่ม และ วันสิ้นสุด */}
              <div className="flex gap-3 items-center">
                <input type="text" placeholder="รายละเอียด (ไม่บังคับ)" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 ml-1">วันเริ่มงาน</span>
                  <input type="date" value={newTask.start_date} onChange={(e) => setNewTask({...newTask, start_date: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 ml-1">กำหนดส่ง</span>
                  <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                </div>

                <button type="submit" className="px-6 py-2 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 h-[42px]">
                  + เพิ่มงาน
                </button>
              </div>
            </form>

            <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-2">
              <span className="text-gray-400 pl-2">🔍</span>
              <input type="text" placeholder="ค้นหางาน หรือ หมวดหมู่..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-2 py-1 outline-none text-gray-700"/>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-700 mb-2 border-b-2 border-gray-300 pb-2 flex justify-between">
              <span>📋 To Do</span>
              <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">{todoTasks}</span>
            </h3>
            {filteredTasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task.task_id} task={task} />)}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-blue-700 mb-2 border-b-2 border-blue-300 pb-2 flex justify-between">
              <span>⏳ In Progress</span>
              <span className="bg-blue-200 text-blue-700 text-sm px-2 py-1 rounded-full">{inProgressTasks}</span>
            </h3>
            {filteredTasks.filter(t => t.status === 'in_progress').map(task => <TaskCard key={task.task_id} task={task} />)}
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-green-700 mb-2 border-b-2 border-green-300 pb-2 flex justify-between">
              <span>✅ Done</span>
              <span className="bg-green-200 text-green-700 text-sm px-2 py-1 rounded-full">{doneTasks}</span>
            </h3>
            {filteredTasks.filter(t => t.status === 'done').map(task => <TaskCard key={task.task_id} task={task} />)}
          </div>
        </div>
      </div>
    </div>
  );
}