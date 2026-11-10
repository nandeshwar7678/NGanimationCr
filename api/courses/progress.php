
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

// Student login check
$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    sendResponse(false, "Please login first.", [], 401);
}

// GET: Fetch completed lessons
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $slug = trim($_GET["slug"] ?? "");

    if ($slug === "") {
        sendResponse(false, "Course slug is required.", [], 400);
    }

    $stmt = $pdo->prepare("
        SELECT id FROM courses
        WHERE slug = ? AND published = 1
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(false, "Course not found.", [], 404);
    }

    $stmt = $pdo->prepare("
        SELECT id FROM enrollments
        WHERE user_id = ? AND course_id = ?
        LIMIT 1
    ");
    $stmt->execute([$userId, $course["id"]]);

    if (!$stmt->fetch()) {
        sendResponse(false, "You are not enrolled in this course.", [], 403);
    }

    $stmt = $pdo->prepare("
        SELECT lp.lesson_id
        FROM lesson_progress lp
        INNER JOIN lessons l ON l.id = lp.lesson_id
        WHERE lp.user_id = ?
        AND l.course_id = ?
        ORDER BY lp.lesson_id ASC
    ");
    $stmt->execute([$userId, $course["id"]]);

    $completed = $stmt->fetchAll(PDO::FETCH_COLUMN);

    sendResponse(true, "Progress loaded.", [
        "completed_lessons" => array_map("intval", $completed)
    ]);
}

// POST: Mark lesson as complete
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $input = json_decode(file_get_contents("php://input"), true);
    $lessonId = (int)($input["lesson_id"] ?? 0);

    if ($lessonId <= 0) {
        sendResponse(false, "Valid lesson ID is required.", [], 400);
    }

    // Verify lesson belongs to a course the student purchased
    $stmt = $pdo->prepare("
        SELECT l.id
        FROM lessons l
        INNER JOIN enrollments e ON e.course_id = l.course_id
        WHERE l.id = ? AND e.user_id = ?
        LIMIT 1
    ");
    $stmt->execute([$lessonId, $userId]);

    if (!$stmt->fetch()) {
        sendResponse(false, "You do not have access to this lesson.", [], 403);
    }

    $stmt = $pdo->prepare("
        INSERT INTO lesson_progress (user_id, lesson_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$userId, $lessonId]);

    sendResponse(true, "Lesson marked as complete.");
}

sendResponse(false, "Method not allowed.", [], 405);