
<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "http://localhost:5173",
    "https://aicloudetools.com"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

session_start();

require_once __DIR__ . "/../config/database.php";

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$currentPassword = $data["current_password"] ?? "";
$newPassword = $data["new_password"] ?? "";
$confirmPassword = $data["confirm_password"] ?? "";

if (!$currentPassword || !$newPassword || !$confirmPassword) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All password fields are required."
    ]);
    exit;
}

if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "New password must be at least 8 characters."
    ]);
    exit;
}

if ($newPassword !== $confirmPassword) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "New password and confirm password do not match."
    ]);
    exit;
}

try {
    $userId = (int) $_SESSION["user_id"];

    $stmt = $pdo->prepare(
        "SELECT password_hash FROM users WHERE id = ? LIMIT 1"
    );
    $stmt->execute([$userId]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($currentPassword, $user["password_hash"])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Current password is incorrect."
        ]);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $update = $pdo->prepare(
        "UPDATE users SET password_hash = ? WHERE id = ?"
    );

    $update->execute([$newHash, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Password changed successfully."
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to change password."
    ]);
}
