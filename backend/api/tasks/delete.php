<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->task_id) && !empty($data->owner_id)) {
    try {
        $query = "DELETE FROM tasks WHERE task_id = :task_id AND owner_id = :owner_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':task_id', $data->task_id);
        $stmt->bindParam(':owner_id', $data->owner_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "ลบงานสำเร็จ"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "ลบข้อมูลล้มเหลว: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณาระบุงานที่ต้องการลบ"]);
}
?>