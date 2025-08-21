<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "root", "", "bookshop");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit;
}

$customer_id = $data['customer_id'];
$book_id = $data['book_id'];
$quantity = $data['quantity'];
$total_price = $data['total_price'];

$sql = "INSERT INTO orders (customer_id, book_id, quantity, total_price, order_date) 
        VALUES (?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiid", $customer_id, $book_id, $quantity, $total_price);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Order failed to save"]);
}

$conn->close();
