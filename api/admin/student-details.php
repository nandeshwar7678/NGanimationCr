
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

    $studentId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$studentId || $studentId < 1) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Valid student ID is required."]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, name, email, role, created_at, profile_photo, account_status
        FROM users
        WHERE id = ? AND role = 'student'
        LIMIT 1
    ");
    $stmt->execute([$studentId]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Student not found."]);
        exit;
    }

    $courseStmt = $pdo->prepare("
        SELECT c.id, c.title, c.slug, e.created_at AS enrolled_at
        FROM enrollments e
        INNER JOIN courses c ON c.id = e.course_id
        WHERE e.user_id = ?
        ORDER BY e.created_at DESC
    ");
    $courseStmt->execute([$studentId]);
    $courses = $courseStmt->fetchAll(PDO::FETCH_ASSOC);

    $orderStmt = $pdo->prepare("
        SELECT
            o.id,
            o.course_id,
            c.title AS course_title,
            o.razorpay_order_id,
            o.razorpay_payment_id,
            o.amount_paise,
            o.status,
            o.created_at
        FROM orders o
        LEFT JOIN courses c ON c.id = o.course_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    ");
    $orderStmt->execute([$studentId]);
    $orders = $orderStmt->fetchAll(PDO::FETCH_ASSOC);

    $summaryStmt = $pdo->prepare("
        SELECT
            COUNT(*) AS total_orders,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_orders,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_orders,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_paise ELSE 0 END), 0) AS total_paid_paise,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount_paise ELSE 0 END), 0) AS total_pending_paise
        FROM orders
        WHERE user_id = ?
    ");
    $summaryStmt->execute([$studentId]);
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "student" => $student,
        "summary" => $summary,
        "total_enrollments" => count($courses),
        "courses" => $courses,
        "orders" => $orders
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load student details."
    ]);
}
