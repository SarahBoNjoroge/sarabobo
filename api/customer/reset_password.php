<?php
// CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB connection
$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "DB failed"]);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);
$token = $mysqli->real_escape_string($data['token'] ?? '');
$password = password_hash($data['password'] ?? '', PASSWORD_BCRYPT);

// Validate
if (!$token || !$password) {
    echo json_encode(["success" => false, "message" => "Missing token or password"]);
    exit;
}

// Check token
$result = $mysqli->query("SELECT customer_id FROM customers WHERE reset_token = '$token' AND reset_token_expiry > NOW()");
if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $mysqli->query("UPDATE customers SET password = '$password', reset_token = NULL, reset_token_expiry = NULL WHERE customer_id = {$user['customer_id']}");
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
}
