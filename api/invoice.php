<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connect to DB
$conn = new mysqli("mysql", "root", "1234", "bookshop");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit();
}

// Validate order ID
$order_id = $_GET['order_id'] ?? null;
if (!$order_id) {
    echo json_encode(["success" => false, "message" => "Order ID is required"]);
    exit();
}

// Fetch order
$orderSql = "SELECT id, customer_id, order_date, total_amount FROM orders WHERE id = ?";
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

// Fetch items from order_items using item_id and type
$itemsSql = "
    SELECT 
        oi.quantity, 
        oi.price,
        oi.total_price,
        CASE 
            WHEN oi.type = 'book' THEN b.title
            WHEN oi.type = 'stationery' THEN s.name
            ELSE 'Unknown Item'
        END AS item_name
    FROM order_items oi
    LEFT JOIN books b ON (oi.type = 'book' AND oi.item_id = b.book_id)
    LEFT JOIN stationery s ON (oi.type = 'stationery' AND oi.item_id = s.id)
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
        "total" => $row['total_price']
    ];
}
$itemsStmt->close();

echo json_encode([
    "success" => true,
    "order" => $order,
    "items" => $items
]);
$conn->close();
