<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connect to DB
$mysqli = new mysqli("mysql", "root", "1234", "bookshop");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Query all admins
$result = $mysqli->query("SELECT id, username FROM admins");

$admins = [];
while ($row = $result->fetch_assoc()) {
  $admins[] = $row;
}

// Respond with data
echo json_encode([
  "success" => true,
  "admins" => $admins
]);

$mysqli->close();
