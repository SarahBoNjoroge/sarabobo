<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$orders = [];

// ✅ FIXED: correct column name is order_id not orders_id
$orderResult = $mysqli->query("SELECT * FROM orders ORDER BY order_id DESC");

if (!$orderResult) {
  echo json_encode([
    "success" => false,
    "message" => "Orders query failed",
    "error" => $mysqli->error
  ]);
  exit();
}

while ($order = $orderResult->fetch_assoc()) {
  $orderId = (int) $order['order_id'];
  $items = [];

  // ✅ FIXED: correct column name is item_type not type
  $itemResult = $mysqli->query("SELECT * FROM order_items WHERE order_id = $orderId");

  if ($itemResult) {
    while ($item = $itemResult->fetch_assoc()) {

      $type = $item['item_type']; // ✅ FIXED
      $item_id = (int) $item['item_id'];
      $title = 'Unknown';

      if ($type === 'book') {
        $res = $mysqli->query("SELECT title FROM books WHERE book_id = $item_id");
        if ($res && $res->num_rows > 0) {
          $title = $res->fetch_assoc()['title'];
        }
      } elseif ($type === 'stationery') {
        $res = $mysqli->query("SELECT name FROM stationery WHERE id = $item_id");
        if ($res && $res->num_rows > 0) {
          $title = $res->fetch_assoc()['name'];
        }
      }

      $items[] = [
        "type"     => $type,
        "item_id"  => $item_id,
        "title"    => $title,
        "quantity" => $item['quantity'],
        "price"    => $item['price']
      ];
    }
  }

  // ✅ Build delivery info based on type
  $deliveryType = $order['delivery_type'] ?? null;
  $deliveryInfo = "N/A";

  if ($deliveryType === 'doorstep') {
    $lat = $order['latitude'] ?? null;
    $lng = $order['longitude'] ?? null;
    if ($lat && $lng) {
      $deliveryInfo = "Doorstep → Lat: $lat, Lng: $lng";
    } else {
      $deliveryInfo = "Doorstep (no location)";
    }
  } elseif ($deliveryType === 'pickup') {
    $deliveryInfo = "Pickup → " . ($order['pickup_point'] ?? 'N/A');
  } elseif ($deliveryType === 'parcel') {
    $deliveryInfo = "Parcel → " . ($order['parcel_service'] ?? 'N/A') . " | Receiver: " . ($order['receiver_phone'] ?? 'N/A');
  }

  // ✅ FULL ORDER OBJECT with all delivery fields
  $orders[] = [
    "id"             => $orderId,
    "customer_id"    => $order['customer_id'],
    "order_date"     => $order['order_date'],
    "total_amount"   => $order['total_price'] ?? 0,
    "delivery_type"  => $deliveryType,
    "delivery_info"  => $deliveryInfo,
    "latitude"       => $order['latitude'] ?? null,
    "longitude"      => $order['longitude'] ?? null,
    "pickup_point"   => $order['pickup_point'] ?? null,
    "parcel_service" => $order['parcel_service'] ?? null,
    "receiver_phone" => $order['receiver_phone'] ?? null,
    "status"         => $order['status'] ?? "PENDING",
    "items"          => $items
  ];
}

echo json_encode([
  "success" => true,
  "orders"  => $orders
]);

$mysqli->close();
?>