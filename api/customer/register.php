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

require_once('../../app/db/connection.php');

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

// Validate phone (must be 10 digits starting with 07 or 01)
if (!preg_match('/^(07|01)\d{8}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number. Use format 07XXXXXXXX.']);
    exit;
}

try {
    // Check email exists
    $stmt = $db->prepare("SELECT customer_id FROM customers WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }

    // Check phone exists
    $stmt2 = $db->prepare("SELECT customer_id FROM customers WHERE phone = ?");
    $stmt2->execute([$phone]);
    if ($stmt2->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number already registered.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insert = $db->prepare("INSERT INTO customers (username, full_name, phone, email, password) VALUES (?, ?, ?, ?, ?)");
    $insert->execute([$username, $full_name, $phone, $email, $hashedPassword]);

    echo json_encode([
        'success'  => true,
        'userId'   => $db->lastInsertId(),
        'username' => $username,
        'name'     => $full_name,
        'phone'    => $phone
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
}
?>