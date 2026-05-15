<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "No data"]);
  exit;
}

$phone = $data['phone'];
$amount = $data['amount'];
$order_id = $data['order_id'] ?? 0;

// 🔑 YOUR KEYS
$consumerKey = "ST5BKg7ItLr0oVXTEIfTtGYonksZDOWCE4EOUUHBAYGR00GC";
$consumerSecret = "VdeEzUnpgrjx1b0MA8GoAPYG6SZtRVEjItyYbgpx4lZSwVilDSlEP7FmpL19AELQ";

$shortcode = "174379";
$passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

// TOKEN
$credentials = base64_encode($consumerKey . ":" . $consumerSecret);

$ch = curl_init("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Basic $credentials"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (!$response) {
  echo json_encode(["success" => false, "message" => "Token failed"]);
  exit;
}

$token = json_decode($response)->access_token;

// STK
$timestamp = date("YmdHis");
$password = base64_encode($shortcode . $passkey . $timestamp);

$payload = [
  "BusinessShortCode" => $shortcode,
  "Password" => $password,
  "Timestamp" => $timestamp,
  "TransactionType" => "CustomerPayBillOnline",
  "Amount" => $amount,
  "PartyA" => $phone,
  "PartyB" => $shortcode,
  "PhoneNumber" => $phone,
  "CallBackURL" => "https://anywhere-partition-cotton.ngrok-free.app/bookshop/api/callback.php",
  "AccountReference" => $order_id,
  "TransactionDesc" => "Bookshop Payment"
];

$stk = curl_init("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest");

curl_setopt($stk, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer $token",
  "Content-Type: application/json"
]);

curl_setopt($stk, CURLOPT_POST, true);
curl_setopt($stk, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($stk, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($stk);

if (!$result) {
  echo json_encode(["success" => false, "message" => "STK failed"]);
  exit;
}

echo $result;