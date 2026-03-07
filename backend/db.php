<?php
// 1. Headers สำหรับ CORS (ต้องอยู่บรรทัดบนสุด ห้ามมีช่องว่างก่อน <?php)
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// 2. จัดการ Preflight Request (OPTIONS) - สำคัญมากสำหรับการเรียก API ข้ามโดเมน
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { 
    http_response_code(200);
    exit(); 
}

// 3. ดึงค่าจาก Environment Variables (ใส่ชื่อ "Key" ที่เราตั้งใน Render)
$host = getenv('gateway01.ap-southeast-1.prod.aws.tidbcloud.com');
$db_name = getenv('to_do_list');
$username = getenv('FibA8HWnkaUm3zD.root');
$password = getenv('5XnL8dAvTgMRGcdu');
$port = getenv('4000') ?: "4000"; // ถ้าไม่ได้ตั้ง ให้ใช้ 4000 เป็นค่าเริ่มต้น

try {
    // เชื่อมต่อฐานข้อมูลผ่าน PDO
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // ส่ง Error กลับเป็น JSON เพื่อให้เช็คปัญหาได้ง่ายขึ้นในหน้า Console
    http_response_code(500);
    echo json_encode([
        "error" => "Database Connection Failed",
        "message" => $e->getMessage() 
    ]);
    exit();
}