<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Create connection
$mysqli = new mysqli("localhost", "root", "", "bookshop");

// Check connection
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Validate input
if (!isset($_GET['id'])) {
  echo json_encode(["success" => false, "message" => "Missing admin ID"]);
  exit;
}

$id = intval($_GET['id']);

// Prepare and execute delete
$stmt = $mysqli->prepare("DELETE FROM admins WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to delete admin."]);
}

$stmt->close();
$mysqli->close();
