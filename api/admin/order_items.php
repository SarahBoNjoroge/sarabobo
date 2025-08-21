<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connect to DB
$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

$orders = [];
$orderResult = $mysqli->query("SELECT * FROM orders ORDER BY id DESC");

while ($order = $orderResult->fetch_assoc()) {
  $orderId = (int) $order['id'];
  $items = [];

  $itemResult = $mysqli->query("SELECT * FROM order_items WHERE order_id = $orderId");

  while ($item = $itemResult->fetch_assoc()) {
    $type = $item['type'];
    $item_id = (int) $item['item_id'];
    $title = 'Unknown';

    if ($type === 'book') {
      $res = $mysqli->query("SELECT title FROM books WHERE book_id = $item_id");
      if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $title = $row['title'];
      } else {
        $title = 'Unknown Book';
      }
    } elseif ($type === 'stationery') {
      $res = $mysqli->query("SELECT name FROM stationery WHERE id = $item_id");
      if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $title = $row['name'];
      } else {
        $title = 'Unknown Item';
      }
    }

    $items[] = [
      "type" => $type,
      "item_id" => $item_id,
      "title" => $title,
      "quantity" => $item['quantity'],
      "price" => $item['price'],
    ];
  }

  $orders[] = [
    "id" => $orderId,
    "customer_id" => $order['customer_id'],
    "order_date" => $order['order_date'],
    "total_amount" => $order['total_amount'],
    "items" => $items,
  ];
}

// Output JSON
echo json_encode(["success" => true, "orders" => $orders]);
$mysqli->close();
