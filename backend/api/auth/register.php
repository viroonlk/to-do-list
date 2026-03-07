<?php
require_once '../../db.php'; // เรียกใช้ไฟล์ตั้งค่า Database

// รับข้อมูล JSON ที่ส่งมาจาก Frontend
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    try {
        // เข้ารหัสผ่าน
        $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

        // เตรียมคำสั่ง SQL
        $query = "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)";
        $stmt = $conn->prepare($query);

        // ผูกค่าตัวแปร
        $stmt->bindParam(':username', $data->username);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password_hash', $password_hash);

        // สั่งรัน SQL
        if ($stmt->execute()) {
            http_response_code(201); // 201 Created
            echo json_encode(["message" => "สมัครสมาชิกสำเร็จ!"]);
        }
    } catch (PDOException $e) {
        http_response_code(400); // 400 Bad Request (เช่น อีเมลหรือชื่อซ้ำ)
        echo json_encode(["error" => "ไม่สามารถสมัครสมาชิกได้ อาจมีชื่อผู้ใช้หรืออีเมลนี้ในระบบแล้ว"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณากรอกข้อมูลให้ครบถ้วน"]);
}
?>