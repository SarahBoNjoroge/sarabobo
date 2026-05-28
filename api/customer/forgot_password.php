<?php
date_default_timezone_set('Africa/Nairobi');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mysqli = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data  = json_decode(file_get_contents("php://input"), true);
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

$user   = $result->fetch_assoc();
$token  = bin2hex(random_bytes(16));
$expiry = date("Y-m-d H:i:s", time() + 3600);

$mysqli->query("UPDATE customers SET reset_token = '$token', reset_token_expiry = '$expiry' WHERE customer_id = {$user['customer_id']}");

// ✅ Use live Vercel URL not localhost
$link = "https://sarabobo-git-devops-sarahbonjoroges-projects.vercel.app/customer/reset?token=$token";

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sarahwambuinjoroge22@gmail.com';
    $mail->Password   = 'sdhntelgcvmcstyg';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('noreply@brightmindbooks.co.ke', 'Brightmind Books');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Reset Your Password - Brightmind Books';
    $mail->Body    = "
        <div style='font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;'>
            <h2 style='color:#6b21a8'>Brightmind Books</h2>
            <h3>Password Reset Request</h3>
            <p>Click the button below to reset your password:</p>
            <a href='$link' style='display:inline-block;background:#6b21a8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;'>
                Reset Password
            </a>
            <p style='color:#6b7280;margin-top:16px;font-size:13px;'>This link expires in 1 hour. If you did not request this, ignore this email.</p>
        </div>
    ";

    $mail->send();
    echo json_encode(["success" => true, "message" => "Password reset link sent to your email"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Email error: " . $mail->ErrorInfo]);
}
?>