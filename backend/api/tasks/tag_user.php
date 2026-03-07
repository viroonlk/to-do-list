<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->task_id) && !empty($data->username)) {
    try {
        // 1. หา user_id จาก username ที่พิมพ์เข้ามา
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE username = :username LIMIT 1");
        $stmt->bindParam(':username', $data->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $collab = $stmt->fetch(PDO::FETCH_ASSOC);

            // ป้องกันการแท็กตัวเอง
            if ($collab['user_id'] == $data->owner_id) {
                http_response_code(400);
                echo json_encode(["error" => "ไม่สามารถแท็กตัวเองได้"]);
                exit();
            }

            // 2. บันทึกลงตาราง task_collaborators (ใช้ INSERT IGNORE เพื่อป้องกันการกดแท็กเพื่อนคนเดิมซ้ำ)
            $query = "INSERT IGNORE INTO task_collaborators (task_id, user_id) VALUES (:task_id, :user_id)";
            $insertStmt = $conn->prepare($query);
            $insertStmt->bindParam(':task_id', $data->task_id);
            $insertStmt->bindParam(':user_id', $collab['user_id']);
            
            if ($insertStmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "แท็กผู้ใช้สำเร็จ"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "ไม่พบผู้ใช้งานชื่อนี้ในระบบ"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "เกิดข้อผิดพลาด: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "ข้อมูลไม่ครบถ้วน"]);
}
?>