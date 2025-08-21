<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load DB connection
require_once('../../app/db/connection.php'); // Make sure this path is correct

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$username || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

try {
    // Check if email exists
    $stmt = $db->prepare("SELECT customer_id FROM customers WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $insert = $db->prepare("INSERT INTO customers (username, email, password) VALUES (?, ?, ?)");
    $insert->execute([$username, $email, $hashedPassword]);

    echo json_encode(['success' => true, 'userId' => $db->lastInsertId()]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
}
