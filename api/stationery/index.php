<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$sql = "SELECT id, name, description, price, image, created_at FROM stationery";
$result = $conn->query($sql);

$items = [];
while ($row = $result->fetch_assoc()) {
    // Fix image URL — use image column not cover_image
    if ($row['image']) {
        $row['image'] = "https://tender-empathy-production-c8ad.up.railway.app/uploads/" . $row['image'];
    }
    $items[] = $row;
}

echo json_encode(["success" => true, "items" => $items]);
$conn->close();
?>