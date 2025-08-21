<?php
date_default_timezone_set('Africa/Nairobi');  // or 'UTC' if your DB uses UTC

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(["success" => false, "message" => "Token required"]);
    exit;
}

$result = $mysqli->query("SELECT customer_id FROM customers WHERE reset_token = '$token' AND reset_token_expiry > NOW()");
if ($result && $result->num_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
}
