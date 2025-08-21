<?php
// db/connection.php

$host = "localhost"; // or 127.0.0.1
$dbname = "bookshop"; // change to your DB name
$username = "sarabobo";   // default for XAMPP
$password = "1234";       // default for XAMPP (no password)

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

