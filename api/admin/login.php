<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

$stmt = $mysqli->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
    $admin = $result->fetch_assoc();
    if (password_verify($password, $admin['password'])) {
        echo json_encode(['success' => true, 'admin' => ['id' => $admin['id'], 'username' => $admin['username']]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found']);
}
