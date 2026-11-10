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

    // Verify admin access
    $check = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $check->execute([(int) $_SESSION["user_id"]]);
    $admin = $check->fetch(PDO::FETCH_ASSOC);

    if (!$admin || $admin["role"] !== "admin") {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit;
    }

    // Fetch orders with student and course details
    $stmt = $pdo->query("
        SELECT
            o.id,
            o.user_id,
            o.course_id,
            o.razorpay_order_id,
            o.razorpay_payment_id,
            o.amount_paise,
            o.status,
            o.created_at,

            u.name AS student_name,
            u.email AS student_email,
            u.account_status,

            c.title AS course_title,
            c.slug AS course_slug

        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN courses c ON c.id = o.course_id
        ORDER BY o.id DESC
    ");

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $summaryStmt = $pdo->query("
        SELECT
            COUNT(*) AS total_orders,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_orders,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_orders,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_paise ELSE 0 END), 0) AS total_revenue_paise
        FROM orders
    ");

    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total_orders" => count($orders),
        "summary" => $summary,
        "orders" => $orders
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load orders."
    ]);
}