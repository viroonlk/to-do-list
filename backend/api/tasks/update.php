<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->task_id)) {
    try {
        // อัปเดตข้อมูล (สมมติว่าอัปเดตสถานะเป็นหลัก แต่รองรับการแก้ title ด้วย)
        $query = "UPDATE tasks 
                  SET title = :title, status = :status, description = :description 
                  WHERE task_id = :task_id AND owner_id = :owner_id";
        
        $stmt = $conn->prepare($query);

        $stmt->bindParam(':task_id', $data->task_id);
        $stmt->bindParam(':owner_id', $data->owner_id); // ป้องกันไม่ให้คนอื่นมาแก้งานของเรา
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':description', $data->description);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "อัปเดตงานเรียบร้อย"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "อัปเดตล้มเหลว: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "ข้อมูลไม่ครบถ้วน"]);
}
?>