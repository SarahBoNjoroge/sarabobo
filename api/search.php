<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'mysql';
$user = 'root';
$pass = '1234';
$db = 'bookshop';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($query === '') {
    echo json_encode([]);
    exit;
}

$search = "%" . $conn->real_escape_string($query) . "%";

$results = [];

// Search in books
$book_sql = "SELECT book_id AS id, title, author, price, cover_image AS image, 'book' AS type 
             FROM books 
             WHERE title LIKE ? OR author LIKE ?";
$book_stmt = $conn->prepare($book_sql);
$book_stmt->bind_param("ss", $search, $search);
$book_stmt->execute();
$book_result = $book_stmt->get_result();
while ($row = $book_result->fetch_assoc()) {
    $results[] = $row;
}
$book_stmt->close();

// Search in stationery
$stationery_sql = "SELECT id, name AS title, '' AS author, price, image, 'stationery' AS type 
                   FROM stationery 
                   WHERE name LIKE ?";
$stationery_stmt = $conn->prepare($stationery_sql);
$stationery_stmt->bind_param("s", $search);
$stationery_stmt->execute();
$stationery_result = $stationery_stmt->get_result();
while ($row = $stationery_result->fetch_assoc()) {
    $results[] = $row;
}
$stationery_stmt->close();

$conn->close();

echo json_encode($results);
