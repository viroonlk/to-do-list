<?php
require_once '../../db.php';

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(["error" => "กรุณาระบุ user_id"]));

try {
    $query = "SELECT * FROM categories WHERE user_id = :user_id ORDER BY category_id DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($categories);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "ดึงข้อมูลล้มเหลว: " . $e->getMessage()]);
}
?>