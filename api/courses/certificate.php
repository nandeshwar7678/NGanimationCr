
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

// Login check
$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    sendResponse(false, "Please login first.", [], 401);
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendResponse(false, "Method not allowed.", [], 405);
}

$slug = trim($_GET["slug"] ?? "");

if ($slug === "") {
    sendResponse(false, "Course slug is required.", [], 400);
}

// Get course
$stmt = $pdo->prepare("
    SELECT id, title
    FROM courses
    WHERE slug = ? AND published = 1
    LIMIT 1
");
$stmt->execute([$slug]);
$course = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$course) {
    sendResponse(false, "Course not found.", [], 404);
}

// Verify enrollment
$stmt = $pdo->prepare("
    SELECT id
    FROM enrollments
    WHERE user_id = ? AND course_id = ?
    LIMIT 1
");
$stmt->execute([$userId, $course["id"]]);

if (!$stmt->fetch()) {
    sendResponse(false, "You are not enrolled in this course.", [], 403);
}

// Total lessons
$stmt = $pdo->prepare("
    SELECT COUNT(*)
    FROM lessons
    WHERE course_id = ?
");
$stmt->execute([$course["id"]]);
$totalLessons = (int)$stmt->fetchColumn();

if ($totalLessons === 0) {
    sendResponse(false, "This course has no lessons yet.", [], 400);
}

// Completed lessons
$stmt = $pdo->prepare("
    SELECT COUNT(DISTINCT lp.lesson_id)
    FROM lesson_progress lp
    INNER JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.user_id = ?
    AND l.course_id = ?
");
$stmt->execute([$userId, $course["id"]]);
$completedLessons = (int)$stmt->fetchColumn();

// Check course completion
if ($completedLessons < $totalLessons) {
    sendResponse(false, "Complete all lessons to get your certificate.", [
        "total_lessons" => $totalLessons,
        "completed_lessons" => $completedLessons,
        "progress" => round(($completedLessons / $totalLessons) * 100)
    ], 403);
}

// Get student name
$stmt = $pdo->prepare("
    SELECT name
    FROM users
    WHERE id = ?
    LIMIT 1
");
$stmt->execute([$userId]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    sendResponse(false, "Student not found.", [], 404);
}

// Generate certificate number
$certificateNumber = "NGAC-" . date("Ymd") . "-" . strtoupper(bin2hex(random_bytes(4)));

// Issue certificate only once
$stmt = $pdo->prepare("
    INSERT IGNORE INTO certificates
    (user_id, course_id, certificate_number)
    VALUES (?, ?, ?)
");
$stmt->execute([
    $userId,
    $course["id"],
    $certificateNumber
]);

// Fetch certificate
$stmt = $pdo->prepare("
    SELECT certificate_number, issued_at
    FROM certificates
    WHERE user_id = ? AND course_id = ?
    LIMIT 1
");
$stmt->execute([$userId, $course["id"]]);
$certificate = $stmt->fetch(PDO::FETCH_ASSOC);

sendResponse(true, "Certificate available.", [
    "certificate" => [
        "student_name" => $student["name"],
        "course_name" => $course["title"],
        "certificate_number" => $certificate["certificate_number"],
        "issued_at" => $certificate["issued_at"]
    ],
    "total_lessons" => $totalLessons,
    "completed_lessons" => $completedLessons
]);
