<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB connection
$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Decode JSON
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->id) || !isset($data->username)) {
  echo json_encode(["success" => false, "message" => "Missing required fields."]);
  exit();
}

$id = $data->id;
$username = $data->username;

// Update logic
if (!empty($data->password)) {
  $password = password_hash($data->password, PASSWORD_DEFAULT);
  $stmt = $mysqli->prepare("UPDATE admins SET username = ?, password = ? WHERE id = ?");
  $stmt->bind_param("ssi", $username, $password, $id);
} else {
  $stmt = $mysqli->prepare("UPDATE admins SET username = ? WHERE id = ?");
  $stmt->bind_param("si", $username, $id);
}

// Execute and respond
if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to update admin."]);
}

$stmt->close();
$mysqli->close();
