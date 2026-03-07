<?php
// ตั้งค่า CORS (Cross-Origin Resource Sharing) อนุญาตให้ React (ที่มักจะรันบนพอร์ต 5173) เรียกใช้งาน API ได้
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// จัดการกับ OPTIONS request ที่เบราว์เซอร์ส่งมาก่อน (Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
$host = "localhost";
$db_name = "to_do_list"; // ชื่อ Database ที่เราตกลงกันไว้
$username = "root";      // ใส่ username ของ MySQL คุณ (ค่าเริ่มต้น XAMPP คือ root)
$password = "";          // ใส่รหัสผ่านของ MySQL คุณ (ค่าเริ่มต้น XAMPP คือ รหัสว่าง)

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