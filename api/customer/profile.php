<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$mysqli = new mysqli("mysql.railway.internal", "root", "jPTqOuiOdjJjqfAfuzOwIuXqmVqGjQBe", "bookshop", 3306);
if ($mysqli->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// GET profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $customerId = $_GET['id'] ?? null;
    if (!$customerId) {
        echo json_encode(["success" => false, "message" => "Customer ID is required"]);
        exit();
    }

    $stmt = $mysqli->prepare("SELECT customer_id, username, full_name, phone, email FROM customers WHERE customer_id = ?");
    $stmt->bind_param("i", $customerId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "success" => true,
            "data"    => [
                "id"        => $row["customer_id"],
                "username"  => $row["username"],
                "full_name" => $row["full_name"],
                "phone"     => $row["phone"],
                "email"     => $row["email"]
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Customer not found"]);
    }
}

// POST - update profile
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id        = (int)($data['id']        ?? 0);
    $username  = trim($data['username']   ?? '');
    $full_name = trim($data['full_name']  ?? '');
    $phone     = trim($data['phone']      ?? '');
    $email     = trim($data['email']      ?? '');

    if (!$id || !$username || !$full_name || !$phone || !$email) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit();
    }

    // Validate phone
    if (!preg_match('/^(07|01)\d{8}$/', $phone)) {
        echo json_encode(["success" => false, "message" => "Invalid phone format. Use 07XXXXXXXX."]);
        exit();
    }

    $stmt = $mysqli->prepare("UPDATE customers SET username=?, full_name=?, phone=?, email=? WHERE customer_id=?");
    $stmt->bind_param("ssssi", $username, $full_name, $phone, $email, $id);
    $stmt->execute();

    if ($stmt->affected_rows >= 0) {
        echo json_encode(["success" => true, "message" => "Profile updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed"]);
    }
}

// DELETE account
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id   = (int)($data['id'] ?? 0);

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Customer ID required"]);
        exit();
    }

    $stmt = $mysqli->prepare("DELETE FROM customers WHERE customer_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Account deleted"]);
    } else {
        echo json_encode(["success" => false, "message" => "Delete failed"]);
    }
}

$mysqli->close();
?>