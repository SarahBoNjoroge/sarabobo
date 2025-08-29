<?php
header('Content-Type: application/json');
$mysqli = new mysqli("mysql", "root", "1234", "bookshop");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed."]);
  exit();
}

$result = $mysqli->query("SELECT id, customer_id, order_date, total FROM orders ORDER BY id DESC");
$orders = [];

while ($row = $result->fetch_assoc()) {
  $orders[] = $row;
}

echo json_encode(["success" => true, "orders" => $orders]);
