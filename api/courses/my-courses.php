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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
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
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

try {
    require_once __DIR__ . "/../config/database.php";

    $userId = (int) $_SESSION["user_id"];

    $sql = "
        SELECT
            c.id,
            c.title,
            c.slug,
            c.description,
            c.thumbnail_url,
            c.level,
            c.duration,
            c.price_paise,
            e.created_at AS enrolled_at
        FROM enrollments e
        INNER JOIN courses c
            ON c.id = e.course_id
        INNER JOIN orders o
            ON o.id = e.order_id
        WHERE
            e.user_id = :user_id
            AND o.user_id = e.user_id
            AND o.course_id = e.course_id
            AND o.status = 'paid'
            AND c.published = 1
        ORDER BY e.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":user_id" => $userId
    ]);

    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($courses as &$course) {
        $course["id"] = (int) $course["id"];
        $course["price"] = (int) $course["price_paise"] / 100;
        $course["price_paise"] = (int) $course["price_paise"];
    }
    unset($course);

    echo json_encode([
        "success" => true,
        "courses" => $courses
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load your courses."
    ]);
}