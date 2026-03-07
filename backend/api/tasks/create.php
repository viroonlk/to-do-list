<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->owner_id) && !empty($data->title)) {
    try {
        // เพิ่ม start_date เข้าไปในคำสั่ง SQL
        $query = "INSERT INTO tasks (owner_id, category_id, title, description, start_date, due_date) 
                  VALUES (:owner_id, :category_id, :title, :description, :start_date, :due_date)";
        $stmt = $conn->prepare($query);

        $category_id = !empty($data->category_id) ? $data->category_id : null;
        $description = !empty($data->description) ? $data->description : null;
        $start_date = !empty($data->start_date) ? $data->start_date : null; // รับค่าวันเริ่มงาน
        $due_date = !empty($data->due_date) ? $data->due_date : null;

        $stmt->bindParam(':owner_id', $data->owner_id);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':due_date', $due_date);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "สร้างงานสำเร็จ", "task_id" => $conn->lastInsertId()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "เกิดข้อผิดพลาด: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณาระบุผู้สร้างและชื่องาน"]);
}
?>