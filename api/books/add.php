<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

if ($mysqli->connect_error) {
  echo json_encode(['success' => false, 'message' => 'Database connection failed']);
  exit();
}

// Make sure form fields exist
$title = $_POST['title'] ?? '';
$author = $_POST['author'] ?? '';
$price = $_POST['price'] ?? '';
$stock = $_POST['stock'] ?? 0;
$description = $_POST['description'] ?? '';
$coverImage = null;

// Ensure uploads folder exists
$uploadDir = __DIR__ . '/../../uploads/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

// Handle image upload
if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] === UPLOAD_ERR_OK) {
  $originalName = basename($_FILES['cover_image']['name']);
  $extension = pathinfo($originalName, PATHINFO_EXTENSION);
  $filename = uniqid('book_', true) . '.' . $extension;
  $targetPath = $uploadDir . $filename;

  if (move_uploaded_file($_FILES['cover_image']['tmp_name'], $targetPath)) {
    $coverImage = $filename;
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
    exit();
  }
}

// Insert into database
$stmt = $mysqli->prepare("INSERT INTO books (title, author, price, stock, description, cover_image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiss", $title, $author, $price, $stock, $description, $coverImage);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to insert book', 'error' => $stmt->error]);
}
