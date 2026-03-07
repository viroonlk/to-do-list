<?php
require_once '../../db.php';
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->category_id) && !empty($data->user_id)) {
    try {
        // ลบหมวดหมู่ที่ระบุ (เช็ค user_id เพื่อความปลอดภัย)
        $stmt = $conn->prepare("DELETE FROM categories WHERE category_id = :cat_id AND user_id = :u_id");
        $stmt->bindParam(':cat_id', $data->category_id);
        $stmt->bindParam(':u_id', $data->user_id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "ลบหมวดหมู่สำเร็จ"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "ล้มเหลว: " . $e->getMessage()]);
    }
}
?>