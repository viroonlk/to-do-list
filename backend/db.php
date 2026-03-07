<?php
// 1. Headers สำหรับแก้ CORS (ต้องอยู่บรรทัดบนสุดห้ามมีเว้นวรรค)
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. ข้อมูลการเชื่อมต่อที่ถูกต้องจากรูป
$host = "sql103.infinityfree.com";
$db_name = "if0_41329480_to_do_list"; // ✅ ต้องมี prefix นำหน้า
$username = "if0_41329480"; 
$password = "lJBLiQva0aKbne"; // ✅ ตัวแรกคือเลข 1 (หนึ่ง)

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "DB Connection failed: " . $e->getMessage()]);
    exit();
}