<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "bookshop");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit();
}

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    echo json_encode(["success" => false, "message" => "Order ID required"]);
    exit();
}

/* ✅ FIX 1: correct column names */
$orderSql = "SELECT order_id, customer_id, order_date, total_price 
             FROM orders 
             WHERE order_id = ?";

$orderStmt = $conn->prepare($orderSql);
$orderStmt->bind_param("i", $order_id);
$orderStmt->execute();
$orderResult = $orderStmt->get_result();

if ($orderResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Order not found"]);
    exit();
}

$order = $orderResult->fetch_assoc();
$orderStmt->close();

/* ✅ ITEMS (your logic is fine, just safer joins) */
$itemsSql = "
    SELECT 
        oi.quantity, 
        oi.price,
        (oi.quantity * oi.price) AS total,
        CASE 
            WHEN oi.item_type = 'book' THEN b.title
            WHEN oi.item_type = 'stationery' THEN s.name
            ELSE 'Unknown Item'
        END AS item_name
    FROM order_items oi
    LEFT JOIN books b ON oi.item_type = 'book' AND oi.item_id = b.book_id
    LEFT JOIN stationery s ON oi.item_type = 'stationery' AND oi.item_id = s.id
    WHERE oi.order_id = ?
";

$itemsStmt = $conn->prepare($itemsSql);
$itemsStmt->bind_param("i", $order_id);
$itemsStmt->execute();
$itemsResult = $itemsStmt->get_result();

$items = [];

while ($row = $itemsResult->fetch_assoc()) {
    $items[] = [
        "name" => $row['item_name'],
        "quantity" => $row['quantity'],
        "price" => $row['price'],
        "total" => $row['total']
    ];
}

$itemsStmt->close();

/* RESPONSE */
echo json_encode([
    "success" => true,
    "order" => $order,
    "items" => $items
]);

$conn->close();
?>