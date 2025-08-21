<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Connection failed"]);
  exit();
}

$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$image = $_FILES['image']['name'] ?? null;

// If image is uploaded
if ($image) {
  $targetDir = "../../uploads/";
  $targetPath = $targetDir . basename($image);
  move_uploaded_file($_FILES['image']['tmp_name'], $targetPath);

  $stmt = $mysqli->prepare("UPDATE stationery SET name=?, description=?, price=?, image=? WHERE id=?");
  $stmt->bind_param("ssdsi", $name, $description, $price, $image, $id);
} else {
  $stmt = $mysqli->prepare("UPDATE stationery SET name=?, description=?, price=? WHERE id=?");
  $stmt->bind_param("ssdi", $name, $description, $price, $id);
}

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Update failed"]);
}

$stmt->close();
$mysqli->close();
