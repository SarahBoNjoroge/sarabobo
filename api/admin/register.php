<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$mysqli = new mysqli("mysql", "root", "1234", "bookshop");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if username exists
$check = $mysqli->prepare("SELECT id FROM admins WHERE username = ?");
$check->bind_param("s", $username);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "Username already taken."]);
  exit();
}

// Insert new admin
$stmt = $mysqli->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashedPassword);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Admin registered successfully"]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to register admin"]);
}
