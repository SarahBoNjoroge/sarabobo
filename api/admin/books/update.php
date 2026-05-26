<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$book_id     = (int)($_POST['book_id']  ?? 0);
$title       = $_POST['title']          ?? '';
$author      = $_POST['author']         ?? '';
$price       = (float)($_POST['price']  ?? 0);
$stock       = (int)($_POST['stock']    ?? 0);
$description = $_POST['description']    ?? '';
$level       = $_POST['level']          ?? '';
$grade       = $_POST['grade']          ?? '';
$subject     = $_POST['subject']        ?? '';

if (!$book_id) {
  echo json_encode(["success" => false, "message" => "Invalid book ID"]);
  exit();
}

$cover_image = null;
if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] == 0) {
  $filename    = time() . '_' . basename($_FILES['cover_image']['name']);
  $target_path = "../../uploads/" . $filename;
  if (move_uploaded_file($_FILES['cover_image']['tmp_name'], $target_path)) {
    $cover_image = "uploads/" . $filename;
  } else {
    echo json_encode(["success" => false, "message" => "Image upload failed"]);
    exit();
  }
}

if ($cover_image) {
  // 10 variables: s s d i s s s s s i
  $stmt = $mysqli->prepare("UPDATE books SET title=?, author=?, price=?, stock=?, description=?, cover_image=?, level=?, grade=?, subject=? WHERE book_id=?");
  $stmt->bind_param("ssdisssssi", $title, $author, $price, $stock, $description, $cover_image, $level, $grade, $subject, $book_id);
} else {
  // 9 variables: s s d i s s s s i
  $stmt = $mysqli->prepare("UPDATE books SET title=?, author=?, price=?, stock=?, description=?, level=?, grade=?, subject=? WHERE book_id=?");
  $stmt->bind_param("ssdissssi", $title, $author, $price, $stock, $description, $level, $grade, $subject, $book_id);
}

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Book updated"]);
} else {
  echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>