<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("localhost", "root", "", "bookshop");

$result = $mysqli->query("SELECT r.id, r.review, r.rating, r.created_at, c.username 
                          FROM reviews r 
                          JOIN customers c ON r.customer_id = c.customer_id 
                          ORDER BY r.created_at DESC");

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode(["success" => true, "reviews" => $reviews]);
