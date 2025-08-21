<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

$result = $mysqli->query("SELECT * FROM books");
$books = [];

while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

echo json_encode(["success" => true, "books" => $books]);
?>
