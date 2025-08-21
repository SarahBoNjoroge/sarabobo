<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$name = $_POST['name'];
$description = $_POST['description'] ?? '';
$price = $_POST['price'];
$image = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/';
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $target = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        $image = $filename;
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
        exit();
    }
}

$stmt = $mysqli->prepare("INSERT INTO stationery (name, description, price, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssds", $name, $description, $price, $image);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to insert stationery item"]);
}
