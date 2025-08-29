<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("mysql", "root", "1234", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$book_id = $_POST['book_id'];
$title = $_POST['title'];
$author = $_POST['author'];
$price = $_POST['price'];
$stock = $_POST['stock'];
$description = $_POST['description'];

// Optional cover image
$cover_image = null;
if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] == 0) {
  $filename = time() . '_' . basename($_FILES['cover_image']['name']);
  $target_path = "../../uploads/" . $filename;

  if (move_uploaded_file($_FILES['cover_image']['tmp_name'], $target_path)) {
    $cover_image = $filename;
  } else {
    echo json_encode(["success" => false, "message" => "Failed to upload image"]);
    exit();
  }
}

if ($cover_image) {
  $stmt = $mysqli->prepare("UPDATE books SET title=?, author=?, price=?, stock=?, description=?, cover_image=? WHERE book_id=?");
  $stmt->bind_param("ssdisss", $title, $author, $price, $stock, $description, $cover_image, $book_id);
} else {
  $stmt = $mysqli->prepare("UPDATE books SET title=?, author=?, price=?, stock=?, description=? WHERE book_id=?");
  $stmt->bind_param("ssdisi", $title, $author, $price, $stock, $description, $book_id);
}

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Update failed"]);
}

$stmt->close();
$mysqli->close();
