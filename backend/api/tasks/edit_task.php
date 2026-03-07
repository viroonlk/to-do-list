<?php
require_once '../../db.php';
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->task_id) && !empty($data->owner_id) && !empty($data->title)) {
    try {
        // อัปเดตข้อมูลงานเฉพาะอันที่ตัวเองเป็นเจ้าของ
        $query = "UPDATE tasks SET title = :title, description = :description, start_date = :start_date, due_date = :due_date, category_id = :category_id 
                  WHERE task_id = :task_id AND owner_id = :owner_id";
        $stmt = $conn->prepare($query);

        $category_id = !empty($data->category_id) ? $data->category_id : null;
        $description = !empty($data->description) ? $data->description : null;
        $start_date = !empty($data->start_date) ? $data->start_date : null;
        $due_date = !empty($data->due_date) ? $data->due_date : null;

        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':due_date', $due_date);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':task_id', $data->task_id);
        $stmt->bindParam(':owner_id', $data->owner_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "แก้ไขงานสำเร็จ"]);
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