<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
$conn = new mysqli("localhost", "root", "", "bookshop");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing book ID"]);
    exit;
}

// Fetch the book
$stmt = $conn->prepare("SELECT * FROM books WHERE book_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $row['cover_image'] = "http://localhost/bookshop/uploads/" . $row['cover_image'];
    echo json_encode(["success" => true, "book" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "Book not found"]);
}

$stmt->close();
$conn->close();
