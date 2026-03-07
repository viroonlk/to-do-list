<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        // ค้นหาผู้ใช้จากอีเมล
        $query = "SELECT user_id, username, password_hash FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // ตรวจสอบรหัสผ่านที่ Hash ไว้
            if (password_verify($data->password, $row['password_hash'])) {
                http_response_code(200);
                echo json_encode([
                    "message" => "เข้าสู่ระบบสำเร็จ!",
                    "user" => [
                        "user_id" => $row['user_id'],
                        "username" => $row['username']
                    ]
                ], JSON_UNESCAPED_UNICODE); // 🌟 อ่านภาษาไทยออกแล้ว
            } else {
                http_response_code(401);
                echo json_encode(["error" => "รหัสผ่านไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "ไม่พบอีเมลนี้ในระบบ"], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        // 🌟 ดัก Error! ถ้าไม่มีตาราง users จะพ่น JSON ออกมา ไม่ใช่ HTML
        http_response_code(500);
        echo json_encode(["error" => "SQL Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณากรอกอีเมลและรหัสผ่าน"], JSON_UNESCAPED_UNICODE);
}
?>