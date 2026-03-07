<?php
require_once '../../db.php';
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->task_id) && !empty($data->username)) {
    try {
        // 1. หา user_id จากชื่อที่ส่งมาเพื่อลบ
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE username = :username LIMIT 1");
        $stmt->bindParam(':username', $data->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $userToRemove = $stmt->fetch(PDO::FETCH_ASSOC);

            // 2. ลบออกจากตาราง task_collaborators
            $query = "DELETE FROM task_collaborators WHERE task_id = :task_id AND user_id = :user_id";
            $deleteStmt = $conn->prepare($query);
            $deleteStmt->bindParam(':task_id', $data->task_id);
            $deleteStmt->bindParam(':user_id', $userToRemove['user_id']);
            
            if ($deleteStmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "ลบแท็กสำเร็จ"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "ไม่พบผู้ใช้"]);
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