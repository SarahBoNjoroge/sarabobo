<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "bookshop");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Connection failed"]);
  exit();
}

if (!isset($_GET['id'])) {
  echo json_encode(["success" => false, "message" => "Missing ID"]);
  exit;
}

$id = intval($_GET['id']);
$stmt = $mysqli->prepare("DELETE FROM stationery WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Delete failed"]);
}

$stmt->close();
$mysqli->close();
