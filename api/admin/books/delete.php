<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("mysql", "root", "1234", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

if (!isset($_GET['id'])) {
  echo json_encode(["success" => false, "message" => "Missing book ID"]);
  exit;
}

$book_id = intval($_GET['id']);

$stmt = $mysqli->prepare("DELETE FROM books WHERE book_id = ?");
$stmt->bind_param("i", $book_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to delete book"]);
}

$stmt->close();
$mysqli->close();
