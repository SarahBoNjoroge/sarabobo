<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$username  = trim($data['username']  ?? '');
$full_name = trim($data['full_name'] ?? '');
$phone     = trim($data['phone']     ?? '');
$email     = trim($data['email']     ?? '');
$password  = trim($data['password']  ?? '');

if (!$username || !$full_name || !$phone || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!preg_match('/^(07|01)\d{8}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number. Use format 07XXXXXXXX.']);
    exit;
}

// Check email exists
$stmt = $conn->prepare("SELECT customer_id FROM customers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered.']);
    exit;
}
$stmt->close();

// Check phone exists
$stmt2 = $conn->prepare("SELECT customer_id FROM customers WHERE phone = ?");
$stmt2->bind_param("s", $phone);
$stmt2->execute();
$stmt2->store_result();
if ($stmt2->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Phone number already registered.']);
    exit;
}
$stmt2->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insert = $conn->prepare("INSERT INTO customers (username, full_name, phone, email, password) VALUES (?, ?, ?, ?, ?)");
$insert->bind_param("sssss", $username, $full_name, $phone, $email, $hashedPassword);

if ($insert->execute()) {
    echo json_encode([
        'success'  => true,
        'userId'   => $conn->insert_id,
        'username' => $username,
        'name'     => $full_name,
        'phone'    => $phone
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $conn->error]);
}

$insert->close();
$conn->close();
?>