<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$mysqli = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['order_id']) || !isset($data['status'])) {
  echo json_encode(["success" => false, "message" => "Missing order_id or status"]);
  exit();
}

$order_id = (int) $data['order_id'];
$status   = $mysqli->real_escape_string($data['status']);

// Only allow valid statuses
$allowed = ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
if (!in_array(strtoupper($status), $allowed)) {
  echo json_encode(["success" => false, "message" => "Invalid status"]);
  exit();
}

$stmt = $mysqli->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
$stmt->bind_param("si", $status, $order_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode(["success" => true, "message" => "Status updated"]);
} else {
  echo json_encode(["success" => false, "message" => "Nothing updated"]);
}

$mysqli->close();
?>