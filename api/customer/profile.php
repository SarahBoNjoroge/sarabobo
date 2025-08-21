<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

$customerId = $_GET['id'] ?? null;
if (!$customerId) {
  echo json_encode(["success" => false, "message" => "Customer ID is required"]);
  exit;
}

// Use correct field names based on your table structure
$stmt = $mysqli->prepare("SELECT customer_id, username, email FROM customers WHERE customer_id = ?");
$stmt->bind_param("i", $customerId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  echo json_encode([
    "success" => true,
    "data" => [
      "id" => $row["customer_id"],     // Rename to 'id' for frontend compatibility
      "username" => $row["username"],
      "email" => $row["email"]
    ]
  ]);
} else {
  echo json_encode(["success" => false, "message" => "Customer not found"]);
}
