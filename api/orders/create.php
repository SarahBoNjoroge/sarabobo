<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "bookshop");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['customer_id'], $data['book_id'], $data['quantity'], $data['total_price'])) {
    echo json_encode(["success" => false, "message" => "Missing input fields"]);
    exit;
}

$customer_id = (int)$data['customer_id'];
$book_id = (int)$data['book_id'];
$quantity = (int)$data['quantity'];
$total_price = (float)$data['total_price'];
$order_date = date("Y-m-d H:i:s");

$stmt = $conn->prepare("INSERT INTO orders (customer_id, book_id, quantity, total_price, order_date) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iiids", $customer_id, $book_id, $quantity, $total_price, $order_date);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}
$conn->close();
?>
