<?php
// Headers สำหรับ CORS
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(http_response_code(200)); }

$host = $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? '';
$db_name = $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? '';
$username = $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? '';
$password = $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? '';
$port = $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?? "4000";

// ฟอลแบ็ค: ใส่ค่าล่าสุดตามรูปของคุณ
if (empty($host)) {
    $host = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
    $db_name = "to_do_list";
    $username = "4H5rYsXj9o3CLjq.root"; // ตัวใหม่
    $password = "L3XZ39WWIHBVVlGZ";     // ตัวใหม่
    $port = "4000";
}

try {
    // 🌟 พระเอกของงานนี้: เพิ่มตั้งค่า SSL 
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // ชี้ไปที่โฟลเดอร์เก็บใบรับรอง SSL พื้นฐานของระบบ Linux/Docker
        PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/ca-certificates.crt',
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false 
    ];

    // โยน $options เข้าไปเป็น Parameter ตัวสุดท้าย
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$db_name;charset=utf8", $username, $password, $options);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Connection Failed", "message" => $e->getMessage()]);
    exit();
}
?>