import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import TaskBoard from "./pages/TaskBoard"; // นำเข้า TaskBoard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/* เปลี่ยนเส้นทาง /dashboard มาใช้คอมโพเนนต์ TaskBoard */}
        <Route path="/dashboard" element={<TaskBoard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;