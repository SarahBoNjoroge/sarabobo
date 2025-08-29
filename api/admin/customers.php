<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to database
$mysqli = new mysqli("mysql", "1234", "", "bookshop");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed."]);
  exit();
}

// Fetch customers
$query = "SELECT customer_id AS id, username, email, created_at FROM customers ORDER BY customer_id ASC";
$result = $mysqli->query($query);

$customers = [];
while ($row = $result->fetch_assoc()) {
  $customers[] = $row;
}

echo json_encode(["success" => true, "customers" => $customers]);
