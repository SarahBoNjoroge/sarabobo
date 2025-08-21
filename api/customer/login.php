<?php
// Show PHP errors during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
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

// Read and parse JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

// Check for missing fields
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

// CORRECTED COLUMN NAME HERE 👇
$stmt = $conn->prepare("SELECT customer_id, password FROM customers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
} else {
    $user = $result->fetch_assoc();

    // Using plaintext password match (⚠️ insecure, fix later)
    if ($password === $user['password']) {
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'userId' => $user['customer_id'] // CORRECT KEY 👈
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
}

$stmt->close();
$conn->close();
