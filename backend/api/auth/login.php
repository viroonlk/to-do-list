<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    // ค้นหาผู้ใช้จากอีเมล
    $query = "SELECT user_id, username, password_hash FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // ตรวจสอบรหัสผ่านที่ Hash ไว้
        if (password_verify($data->password, $row['password_hash'])) {
            http_response_code(200); // 200 OK
            // ส่งข้อมูลกลับไปให้ React (ไม่ส่งรหัสผ่านกลับไปเด็ดขาด)
            echo json_encode([
                "message" => "เข้าสู่ระบบสำเร็จ!",
                "user" => [
                    "user_id" => $row['user_id'],
                    "username" => $row['username']
                ]
            ]);
        } else {
            http_response_code(401); // 401 Unauthorized
            echo json_encode(["error" => "รหัสผ่านไม่ถูกต้อง"]);
        }
    } else {
        http_response_code(404); // 404 Not Found
        echo json_encode(["error" => "ไม่พบอีเมลนี้ในระบบ"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณากรอกอีเมลและรหัสผ่าน"]);
}
?>