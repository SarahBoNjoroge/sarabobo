<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("mysql", "root", "1234", "bookshop");

$data = json_decode(file_get_contents("php://input"), true);

$customer_id = $data['customer_id'] ?? null;
$review = $data['review'] ?? '';
$rating = $data['rating'] ?? null;

if (!$customer_id || $review === '') {
  echo json_encode(["success" => false, "message" => "Missing fields"]);
  exit;
}

$stmt = $mysqli->prepare("INSERT INTO reviews (customer_id, review, rating) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $customer_id, $review, $rating);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Review submitted"]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to save review", "error" => $stmt->error]);
}
