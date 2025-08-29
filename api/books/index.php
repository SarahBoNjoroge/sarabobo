<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("mysql", "root", "1234", "bookshop");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit;
}

$sql = "SELECT book_id, title, author, price, stock, description, created_at, cover_image FROM books";
$result = $conn->query($sql);

$books = [];

while ($row = $result->fetch_assoc()) {
  // If 'cover_image' has just the file name, append full URL
  $row['cover_image'] = "http://localhost/bookshop/uploads/" . $row['cover_image'];
  $books[] = $row;
}

echo json_encode(["success" => true, "books" => $books]);

$conn->close();
