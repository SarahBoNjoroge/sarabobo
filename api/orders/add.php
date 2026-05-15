<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "bookshop");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "DB error"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "No data received"]);
  exit;
}

/* ORDER DATA */
$customer_id = $data['customer_id'];
$total_price = $data['total_price'];

$delivery_type = $data['delivery_type'] ?? null;
$latitude = $data['latitude'] ?? null;
$longitude = $data['longitude'] ?? null;
$pickup_point = $data['pickup_point'] ?? null;
$parcel_service = $data['parcel_service'] ?? null;
$receiver_phone = $data['receiver_phone'] ?? null;

/* 1. INSERT ORDER */
$stmt = $conn->prepare("
  INSERT INTO orders 
  (customer_id, total_price, delivery_type, latitude, longitude, pickup_point, parcel_service, receiver_phone)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
  "idssssss",
  $customer_id,
  $total_price,
  $delivery_type,
  $latitude,
  $longitude,
  $pickup_point,
  $parcel_service,
  $receiver_phone
);

$stmt->execute();

$order_id = $stmt->insert_id;

/* 2. INSERT ITEMS */
foreach ($data['items'] as $item) {

  $stmt2 = $conn->prepare("
    INSERT INTO order_items (order_id, item_type, item_id, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  ");

  $stmt2->bind_param(
    "isiii",
    $order_id,
    $item['type'],
    $item['id'],
    $item['quantity'],
    $item['price']
  );

  $stmt2->execute();
}

/* RESPONSE */
echo json_encode([
  "success" => true,
  "order_id" => $order_id
]);

$conn->close();
?>