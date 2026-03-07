<?php
// Headers สำหรับ CORS (ลบ / ออกให้ตรงกัน)
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(http_response_code(200)); }

// อัปเกรดการดึงค่า Environment Variables สำหรับ Docker
$host = $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? '';
$db_name = $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? '';
$username = $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? '';
$password = $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? '';
$port = $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?? "4000";

// ฟอลแบ็ค (Fallback): ถ้าอ่านค่าจาก Render ไม่ได้จริงๆ ให้ใช้ค่านี้ไปก่อน
if (empty($host)) {
    $host = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
    $db_name = "to_do_list";
    $username = "4H5rYsXj9o3CLjq.root";
    $password = "Ra6fA5tyeKepCwQ4";
    $port = "4000";
}

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Connection Failed", "message" => $e->getMessage()]);
    exit();
}
?>