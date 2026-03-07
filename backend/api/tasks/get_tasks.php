<?php
require_once '../../db.php';

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(["error" => "กรุณาระบุ user_id"]));

try {
    // โค้ดนี้มีการเพิ่ม LEFT JOIN users o ON t.owner_id = o.user_id เพื่อดึงชื่อ o.username
    $query = "SELECT t.*, c.name as category_name, c.color_code, o.username as owner_name,
              (SELECT GROUP_CONCAT(u.username SEPARATOR ', ') 
               FROM task_collaborators tc 
               JOIN users u ON tc.user_id = u.user_id 
               WHERE tc.task_id = t.task_id) as tagged_users
              FROM tasks t 
              LEFT JOIN categories c ON t.category_id = c.category_id 
              LEFT JOIN users o ON t.owner_id = o.user_id
              WHERE t.owner_id = :user_id 
                 OR t.task_id IN (SELECT task_id FROM task_collaborators WHERE user_id = :user_id)
              ORDER BY t.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($tasks);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "ดึงข้อมูลล้มเหลว: " . $e->getMessage()]);
}
?>