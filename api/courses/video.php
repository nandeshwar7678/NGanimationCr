
<?php

header("Content-Type: application/json; charset=utf-8");

// CORS Configuration
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
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

// Start the existing login session
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

// Check login
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

$userId = (int) $_SESSION["user_id"];

// Get lesson ID
$lessonId = filter_input(INPUT_GET, "lesson_id", FILTER_VALIDATE_INT);

if (!$lessonId || $lessonId < 1) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Valid lesson ID is required."
    ]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

try {

    // Check lesson, course enrollment and successful payment
    $stmt = $pdo->prepare(
        "SELECT
            l.id,
            l.title,
            l.description,
            l.drive_file_id,
            c.id AS course_id
         FROM lessons l
         INNER JOIN courses c
            ON c.id = l.course_id
         INNER JOIN enrollments e
            ON e.course_id = c.id
         INNER JOIN orders o
            ON o.id = e.order_id
            AND o.user_id = e.user_id
         WHERE
            l.id = ?
            AND e.user_id = ?
            AND o.status = 'paid'
            AND c.published = 1
         LIMIT 1"
    );

    $stmt->execute([$lessonId, $userId]);

    $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lesson) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "You are not enrolled in this course or payment is not verified."
        ]);
        exit;
    }

    // Do not expose pending placeholder IDs
    $driveFileId = $lesson["drive_file_id"];

    if (
        !$driveFileId ||
        strpos($driveFileId, "PENDING_UPLOAD_") === 0
    ) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Video is not available yet."
        ]);
        exit;
    }

    // Return video ID only after server-side authorization.
    // The actual player integration will be added next.
    echo json_encode([
        "success" => true,
        "lesson" => [
            "id" => (int) $lesson["id"],
            "title" => $lesson["title"],
            "description" => $lesson["description"],
            "course_id" => (int) $lesson["course_id"],
            "drive_file_id" => $driveFileId
        ]
    ]);

} catch (PDOException $e) {

    error_log("Video access error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to verify video access."
    ]);
}
