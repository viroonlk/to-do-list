<?php
require_once '../../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->name)) {
    try {
        $query = "INSERT INTO categories (user_id, name, color_code) VALUES (:user_id, :name, :color_code)";
        $stmt = $conn->prepare($query);
        
        // ถ้าไม่ได้ส่งสีมา ให้ใช้สีเทาเป็นค่าเริ่มต้น
        $color_code = !empty($data->color_code) ? $data->color_code : '#CCCCCC';

        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':color_code', $color_code);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "สร้างหมวดหมู่สำเร็จ", "category_id" => $conn->lastInsertId()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "เกิดข้อผิดพลาด: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "กรุณาระบุชื่อหมวดหมู่"]);
}
?>