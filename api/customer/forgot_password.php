<?php
date_default_timezone_set('Africa/Nairobi');  // or 'UTC' if your DB uses UTC

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mysqli = new mysqli("mysql", "root", "1234", "bookshop");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $mysqli->real_escape_string($data['email'] ?? '');

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

$result = $mysqli->query("SELECT customer_id FROM customers WHERE email = '$email'");
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No account with that email"]);
    exit;
}

$user = $result->fetch_assoc();
$token = bin2hex(random_bytes(16));
$expiry = date("Y-m-d H:i:s", time() + 3600); // 1 hour expiry

$mysqli->query("UPDATE customers SET reset_token = '$token', reset_token_expiry = '$expiry' WHERE customer_id = {$user['customer_id']}");

$link = "http://localhost:3000/customer/reset?token=$token";

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'sarahwambuinjoroge22@gmail.com';
    $mail->Password = 'sdhntelgcvmcstyg';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('noreply@bookshop.com', 'Compeers Bookshop');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Reset Your Password';
    $mail->Body = "
        <h3>Password Reset Request</h3>
        <p>Click below to reset your password:</p>
        <a href='$link'>Reset Password</a>
        <p>This link expires in 1 hour.</p>
    ";

    $mail->send();
    echo json_encode(["success" => true, "message" => "Password reset link sent to your email"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Email error: " . $mail->ErrorInfo]);
}
