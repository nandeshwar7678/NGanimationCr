
<?php
header("X-Login-File: my-login-php");
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

header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off"),
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

error_log("LOGIN DEBUG - HTTPS: " . ($_SERVER["HTTPS"] ?? "NOT SET"));
error_log("LOGIN DEBUG - SESSION ID: " . session_id());
error_log("LOGIN DEBUG - COOKIE: " . json_encode($_COOKIE));

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    sendResponse(400, [
        "success" => false,
        "message" => "Invalid request data."
    ]);
}

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

if (
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !is_string($password) ||
    $password === ""
) {
    sendResponse(422, [
        "success" => false,
        "message" => "Valid email and password required."
    ]);
}

try {

    $stmt = $pdo->prepare(
        "SELECT id, name, email, password_hash, role, account_status
         FROM users
         WHERE email = ?
         LIMIT 1"
    );

    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
        !$user ||
        !password_verify($password, $user["password_hash"])
    ) {
        sendResponse(401, [
            "success" => false,
            "message" => "Invalid email or password."
        ]);
    }

    // Block inactive student accounts.
    // Admin accounts are not affected by student status.
    if (
        $user["role"] === "student" &&
        $user["account_status"] !== "active"
    ) {
        sendResponse(403, [
            "success" => false,
            "message" => "Your account is inactive. Please contact the administrator."
        ]);
    }

    session_regenerate_id(true);

    $_SESSION["user_id"] = (int) $user["id"];
    $_SESSION["user_role"] = $user["role"];

    sendResponse(200, [
        "success" => true,
        "message" => "Login successful.",
        "user" => [
            "id" => (int) $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);

} catch (Throwable $e) {

    error_log("Login error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Login failed. Please try again."
    ]);
}