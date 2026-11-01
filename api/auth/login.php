
<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: https://aicloudetools.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === "") {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Valid email and password required."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1"
    );
    $stmt->execute([$email]);

    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user["password_hash"])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid email or password."]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);

} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Login failed."]);
}
