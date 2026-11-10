
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
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

require_once __DIR__ . "/../config/database.php";

function sendResponse($success, $message, $extra = [], $status = 200) {
    http_response_code($status);
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));
    exit;
}

$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    sendResponse(false, "Please login first.", [], 401);
}

// GET: Fetch profile
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $stmt = $pdo->prepare("
        SELECT id, name, email, role, profile_photo, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendResponse(false, "User not found.", [], 404);
    }

    sendResponse(true, "Profile loaded successfully.", [
        "user" => $user
    ]);
}

// POST: Update profile
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $input = json_decode(file_get_contents("php://input"), true);

    $name = trim($input["name"] ?? "");

    if ($name === "" || strlen($name) > 100) {
        sendResponse(false, "Name is required and must be under 100 characters.", [], 400);
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET name = ?
        WHERE id = ?
    ");

    $stmt->execute([$name, $userId]);

    $stmt = $pdo->prepare("
        SELECT id, name, email, role, profile_photo, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    sendResponse(true, "Profile updated successfully.", [
        "user" => $user
    ]);
}

sendResponse(false, "Method not allowed.", [], 405);
