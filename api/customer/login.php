<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$input = file_get_contents("php://input");
$data  = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

if (empty($data['phone']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Phone and password are required']);
    exit();
}

$phone    = trim($data['phone']);
$password = $data['password'];

$stmt = $conn->prepare("SELECT customer_id, username, full_name, phone, email, password FROM customers WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid phone number or password']);
} else {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            'success'  => true,
            'message'  => 'Login successful',
            'userId'   => $user['customer_id'],
            'username' => $user['username'],
            'name'     => $user['full_name'],
            'phone'    => $user['phone'],
            'email'    => $user['email']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid phone number or password']);
    }
}

$stmt->close();
$conn->close();
?>