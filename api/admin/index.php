<?php
// Enable error display for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "bookshop");

// Check connection
if ($mysqli->connect_errno) {
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed: " . $mysqli->connect_error
  ]);
  exit();
}

// Fetch stationery items
$result = $mysqli->query("SELECT id, name, description, price, image FROM stationery ORDER BY id DESC");

$stationery = [];

while ($row = $result->fetch_assoc()) {
  $stationery[] = $row;
}

// Return as JSON
echo json_encode([
  "success" => true,
  "stationery" => $stationery
]);
