
<?php
header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = ["http://localhost:5173", "https://aicloudetools.com"];
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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
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
    echo json_encode(["success" => false, "message" => "Please login first."]);
    exit;
}

try {
    require_once __DIR__ . "/../config/database.php";

    $check = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $check->execute([(int)$_SESSION["user_id"]]);
    $admin = $check->fetch(PDO::FETCH_ASSOC);

    if (!$admin || $admin["role"] !== "admin") {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit;
    }

    $stmt = $pdo->query("
        SELECT
            u.id,
            u.name,
            u.email,
            u.role,
            u.created_at,
            u.profile_photo,
            u.account_status,

            (SELECT COUNT(*)
             FROM enrollments e
             WHERE e.user_id = u.id) AS total_enrollments,

            (SELECT COUNT(*)
             FROM orders o
             WHERE o.user_id = u.id AND o.status = 'paid') AS paid_orders,

            (SELECT COUNT(*)
             FROM orders o
             WHERE o.user_id = u.id AND o.status = 'pending') AS pending_orders,

            (SELECT COALESCE(SUM(o.amount_paise), 0)
             FROM orders o
             WHERE o.user_id = u.id AND o.status = 'paid') AS total_paid_paise

        FROM users u
        WHERE u.role = 'student'
        ORDER BY u.id DESC
    ");

    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total_students" => count($students),
        "students" => $students
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load students."
    ]);
}
