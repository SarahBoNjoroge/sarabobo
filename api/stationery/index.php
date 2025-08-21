<?php
header("Content-Type: application/json");

// Allow CORS (for frontend access during development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to database
$conn = new mysqli("localhost", "root", "", "bookshop");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Query stationery items
$sql = "SELECT id, name, description, price, image, created_at FROM stationery";
$result = $conn->query($sql);

$items = [];

while ($row = $result->fetch_assoc()) {
    $row['image'] = "http://localhost/bookshop/uploads/" . $row['image'];
    $items[] = $row;
}

echo json_encode(["success" => true, "items" => $items]);

$conn->close();
