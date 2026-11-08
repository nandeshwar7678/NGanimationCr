
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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Please login first"]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$_SESSION["user_id"]]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user["role"] !== "admin") {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access denied"]);
        exit;
    }

    $students = (int) $pdo->query(
        "SELECT COUNT(*) FROM users WHERE role = 'student'"
    )->fetchColumn();

    $courses = (int) $pdo->query(
        "SELECT COUNT(*) FROM courses"
    )->fetchColumn();

    $enrollments = (int) $pdo->query(
        "SELECT COUNT(*) FROM enrollments"
    )->fetchColumn();

    $paidOrders = (int) $pdo->query(
        "SELECT COUNT(*) FROM orders WHERE status = 'paid'"
    )->fetchColumn();

    $revenue = (int) $pdo->query(
        "SELECT COALESCE(SUM(amount_paise), 0) FROM orders WHERE status = 'paid'"
    )->fetchColumn();

    echo json_encode([
        "success" => true,
        "stats" => [
            "total_students" => $students,
            "total_courses" => $courses,
            "total_enrollments" => $enrollments,
            "paid_orders" => $paidOrders,
            "total_revenue" => $revenue / 100
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load dashboard statistics"
    ]);
}
