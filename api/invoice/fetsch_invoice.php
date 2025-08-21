<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'bookshop';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;
if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid order ID']);
    exit();
}

// Get order details
$order_sql = "
    SELECT o.orders_id, o.order_date, c.name AS customer_name, SUM(o.total_price) as total
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.orders_id = ?
    GROUP BY o.orders_id
";

$stmt = $conn->prepare($order_sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invoice not found']);
    exit();
}

$order = $result->fetch_assoc();

// Get ordered items
$item_sql = "
    SELECT b.title, o.quantity, o.total_price / o.quantity AS price
    FROM orders o
    JOIN books b ON o.book_id = b.book_id
    WHERE o.orders_id = ?
";

$stmt = $conn->prepare($item_sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$item_result = $stmt->get_result();

$items = [];
while ($row = $item_result->fetch_assoc()) {
    $items[] = [
        'title' => $row['title'],
        'quantity' => (int) $row['quantity'],
        'price' => (float) $row['price'],
    ];
}

// Build invoice response
$invoice = [
    'invoice_id' => $order_id,
    'customer_name' => $order['customer_name'],
    'date' => $order['order_date'],
    'total' => (float) $order['total'],
    'items' => $items,
];

echo json_encode(['success' => true, 'invoice' => $invoice]);
$conn->close();
