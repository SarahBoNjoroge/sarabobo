<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "bookshop");

if ($mysqli->connect_errno) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $mysqli->connect_error
    ]);
    exit;
}

// Read and decode the input JSON
$data = json_decode(file_get_contents("php://input"), true);

$customer_id = isset($data['customer_id']) ? intval($data['customer_id']) : 0;
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');

// Validate
if ($customer_id <= 0 || $username === '' || $email === '') {
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid fields: username and email are required"
    ]);
    exit;
}

// Update only username and email
$stmt = $mysqli->prepare("UPDATE customers SET username = ?, email = ? WHERE customer_id = ?");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare failed",
        "error" => $mysqli->error
    ]);
    exit;
}

$stmt->bind_param("ssi", $username, $email, $customer_id);
$success = $stmt->execute();

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();
?>
