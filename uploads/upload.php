<?php
$targetDir = "../../uploads/";
if (!is_dir($targetDir)) {
  mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $title = $_POST['title'];
  $author = $_POST['author'];
  $description = $_POST['description'];
  $price = $_POST['price'];

  $coverName = null;

  // Upload image
  if (isset($_FILES['cover']) && $_FILES['cover']['error'] === 0) {
    $fileName = basename($_FILES['cover']['name']);
    $targetFile = $targetDir . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (in_array($imageFileType, $allowed)) {
      if (move_uploaded_file($_FILES['cover']['tmp_name'], $targetFile)) {
        $coverName = $fileName;
      } else {
        echo json_encode(['success' => false, 'message' => 'Failed to move image.']);
        exit;
      }
    } else {
      echo json_encode(['success' => false, 'message' => 'Invalid image type.']);
      exit;
    }
  }

  // Save to database
  $conn = new mysqli("localhost", "root", "", "bookshop");
  if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
  }

  $stmt = $conn->prepare("INSERT INTO books (title, author, description, price, cover) VALUES (?, ?, ?, ?, ?)");
  $stmt->bind_param("sssds", $title, $author, $description, $price, $coverName);

  if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Book uploaded successfully.']);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to save book.']);
  }

  $stmt->close();
  $conn->close();
}
