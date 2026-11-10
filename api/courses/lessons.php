<?php

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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function sendResponse($success, $message, $extra = [], $status = 200) {
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendResponse(false, "Method not allowed.", [], 405);
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (empty($_SESSION["user_id"])) {
    sendResponse(false, "Please login first.", [], 401);
}

require_once __DIR__ . "/../config/database.php";

try {

    $userId = (int) $_SESSION["user_id"];
    $slug = trim($_GET["slug"] ?? "");

    if ($slug === "") {
        sendResponse(false, "Course slug is required.", [], 400);
    }

    // Verify active student account.
    $userStmt = $pdo->prepare(
        "SELECT role, account_status
         FROM users
         WHERE id = ?
         LIMIT 1"
    );

    $userStmt->execute([$userId]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendResponse(false, "User not found.", [], 401);
    }

    if (
        $user["role"] === "student" &&
        $user["account_status"] !== "active"
    ) {
        sendResponse(
            false,
            "Your account is inactive. Please contact the administrator.",
            [],
            403
        );
    }

    $courseStmt = $pdo->prepare(
        "SELECT id, title
         FROM courses
         WHERE slug = ? AND published = 1
         LIMIT 1"
    );

    $courseStmt->execute([$slug]);

    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(false, "Course not found.", [], 404);
    }

    $courseId = (int) $course["id"];

    // Verify enrollment and paid order.
    $enrollmentStmt = $pdo->prepare(
        "SELECT e.id
         FROM enrollments e
         INNER JOIN orders o
            ON o.id = e.order_id
            AND o.user_id = e.user_id
            AND o.course_id = e.course_id
         WHERE e.user_id = ?
           AND e.course_id = ?
           AND o.status = 'paid'
         LIMIT 1"
    );

    $enrollmentStmt->execute([
        $userId,
        $courseId
    ]);

    if (!$enrollmentStmt->fetch(PDO::FETCH_ASSOC)) {
        sendResponse(
            false,
            "You are not enrolled in this course or payment is not verified.",
            [],
            403
        );
    }

    $lessonStmt = $pdo->prepare(
        "SELECT id, title, description, position
         FROM lessons
         WHERE course_id = ?
         ORDER BY position ASC, id ASC"
    );

    $lessonStmt->execute([$courseId]);

    $lessons = $lessonStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($lessons as &$lesson) {
        $lesson["id"] = (int) $lesson["id"];
        $lesson["position"] = (int) $lesson["position"];
    }

    unset($lesson);

    sendResponse(true, "Lessons loaded successfully.", [
        "course" => [
            "id" => $courseId,
            "title" => $course["title"]
        ],
        "lessons" => $lessons
    ]);

} catch (Throwable $e) {

    error_log("Student lessons API error: " . $e->getMessage());

    sendResponse(
        false,
        "Server error while loading lessons.",
        [],
        500
    );
}