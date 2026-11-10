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

    // Fetch enrollments with student, course and order details
    $stmt = $pdo->query("
        SELECT
            e.id,
            e.user_id,
            e.course_id,
            e.order_id,
            e.created_at AS enrolled_at,

            u.name AS student_name,
            u.email AS student_email,
            u.account_status,

            c.title AS course_title,
            c.slug AS course_slug,

            o.status AS order_status,
            o.amount_paise,
            o.razorpay_order_id,
            o.razorpay_payment_id,
            o.created_at AS order_created_at

        FROM enrollments e
        LEFT JOIN users u ON u.id = e.user_id
        LEFT JOIN courses c ON c.id = e.course_id
        LEFT JOIN orders o ON o.id = e.order_id
        ORDER BY e.id DESC
    ");

    $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $summaryStmt = $pdo->query("
        SELECT
            COUNT(*) AS total_enrollments,
            COUNT(DISTINCT user_id) AS enrolled_students,
            COUNT(DISTINCT course_id) AS enrolled_courses
        FROM enrollments
    ");

    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total_enrollments" => count($enrollments),
        "summary" => $summary,
        "enrollments" => $enrollments
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load enrollments."
    ]);
}