<?php
// Headers สำหรับ CORS
header("Access-Control-Allow-Origin: https://to-do-list-pi-pearl-97.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(http_response_code(200)); }

// ดึงค่าจาก Environment Variables ของ Render
$host = getenv('gateway01.ap-southeast-1.prod.aws.tidbcloud.com');
$db_name = getenv('to_do_list');
$username = getenv('FibA8HWnkaUm3zD.root');
$password = getenv('5XnL8dAvTgMRGcdu');
$port = getenv('4000') ?: "4000";

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Connection Failed"]);
    exit();
}