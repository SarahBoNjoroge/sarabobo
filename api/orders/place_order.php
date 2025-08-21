<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Hide warnings and clean output
ini_set('display_errors', 0);
error_reporting(E_ERROR);
ob_clean();

// Connect to DB
$mysqli = new mysqli("localhost", "root", "", "bookshop");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed."]);
  exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (
  !$data ||
  !isset($data['customer_id']) ||
  !isset($data['items']) ||
  !is_array($data['items']) ||
  !isset($data['address']) ||
  empty(trim($data['address']))
) {
  echo json_encode(["success" => false, "message" => "Missing customer_id, address or items."]);
  exit();
}

$customer_id = $data['customer_id'];
$address = $mysqli->real_escape_string(trim($data['address']));
$order_date = date('Y-m-d H:i:s');

// Calculate total
$total_amount = 0;
foreach ($data['items'] as $item) {
  $total_amount += $item['price'] * $item['quantity'];
}

// Insert into `orders` with address
$stmt = $mysqli->prepare("INSERT INTO orders (customer_id, order_date, total_amount, address) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isds", $customer_id, $order_date, $total_amount, $address);
$stmt->execute();

if ($stmt->error) {
  echo json_encode(["success" => false, "message" => "Failed to create order: " . $stmt->error]);
  exit();
}

$order_id = $stmt->insert_id;
$stmt->close();

// Insert each item
foreach ($data['items'] as $item) {
  $item_id = $item['item_id'];
  $type = $item['type'];
  $quantity = $item['quantity'];
  $price = $item['price'];
  $total_price = $price * $quantity;

  $stmt = $mysqli->prepare("INSERT INTO order_items (order_id, item_id, type, quantity, price, total_price) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("iisidd", $order_id, $item_id, $type, $quantity, $price, $total_price);
  $stmt->execute();
  $stmt->close();
}

// Respond success
echo json_encode([
  "success" => true,
  "order_id" => $order_id
]);
?>
