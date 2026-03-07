<?php
// 1. ตั้งค่า Header ให้ครบถ้วนและอยู่บรรทัดบนสุด
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app"); // ใส่ชื่อเว็บ Vercel ของคุณตรงๆ จะชัวร์กว่า
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// 2. จัดการคำขอแบบ OPTIONS (สำคัญมาก!)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ... โค้ดเชื่อมต่อฐานข้อมูลตัวเดิมของคุณ ...

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
$host = "sql103.infinityfree.com";
$db_name = "if0_41329480_to_do_list"; // ชื่อ Database ที่เราตกลงกันไว้
$username = "if0_41329480";      // ใส่ username ของ MySQL คุณ (ค่าเริ่มต้น XAMPP คือ root)
$password = "lJBLiQva0aKbne";          // ใส่รหัสผ่านของ MySQL คุณ (ค่าเริ่มต้น XAMPP คือ รหัสว่าง)

try {
    // ใช้ PDO เพื่อความปลอดภัยจากการถูก SQL Injection
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo json_encode(["message" => "Connected successfully"]); // เปิดคอมเมนต์บรรทัดนี้เพื่อเทสต์การเชื่อมต่อได้
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>