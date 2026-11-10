<?php

header("Content-Type: application/json; charset=utf-8");

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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendResponse(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (empty($_SESSION["user_id"])) {
    sendResponse(401, [
        "success" => false,
        "message" => "Please login first."
    ]);
}

require_once __DIR__ . "/../config/database.php";

try {

    $stmt = $pdo->prepare(
        "SELECT id, name, email, role, account_status
         FROM users
         WHERE id = ?
         LIMIT 1"
    );

    $stmt->execute([(int) $_SESSION["user_id"]]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $_SESSION = [];
        session_destroy();

        sendResponse(401, [
            "success" => false,
            "message" => "User not found. Please login again."
        ]);
    }

    if (
        $user["role"] === "student" &&
        $user["account_status"] !== "active"
    ) {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                "",
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();

        sendResponse(403, [
            "success" => false,
            "message" => "Your account is inactive. Please contact the administrator."
        ]);
    }

    unset($user["account_status"]);

    sendResponse(200, [
        "success" => true,
        "user" => $user
    ]);

} catch (Throwable $e) {

    error_log("Session check error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Unable to verify user session."
    ]);
}