<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("mysql", "root", "1234", "bookshop");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing stationery ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM stationery WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $item = $result->fetch_assoc();
    $item['image'] = "http://localhost/bookshop/uploads/" . $item['image'];
    echo json_encode(["success" => true, "item" => $item]);
} else {
    echo json_encode(["success" => false, "message" => "Item not found"]);
}

$stmt->close();
$conn->close();
