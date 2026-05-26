<?php
// api/db.php — Central database configuration
// Used by all PHP files — change credentials here only

$host     = "mysql.railway.internal";
$user     = "root";
$password = "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe";
$database = "bookshop";
$port     = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");