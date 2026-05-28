<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
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

// Search books
$book_stmt = $conn->prepare("SELECT book_id AS id, title, author, price, cover_image AS image, 'book' AS type FROM books WHERE title LIKE ? OR author LIKE ?");
$book_stmt->bind_param("ss", $search, $search);
$book_stmt->execute();
$book_result = $book_stmt->get_result();
while ($row = $book_result->fetch_assoc()) {
    $results[] = $row;
}
$book_stmt->close();

// Search stationery
$stat_stmt = $conn->prepare("SELECT id, name AS title, '' AS author, price, image, 'stationery' AS type FROM stationery WHERE name LIKE ?");
$stat_stmt->bind_param("s", $search);
$stat_stmt->execute();
$stat_result = $stat_stmt->get_result();
while ($row = $stat_result->fetch_assoc()) {
    $results[] = $row;
}
$stat_stmt->close();

$conn->close();
echo json_encode($results);
?>