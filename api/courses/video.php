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

function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendResponse(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);
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
    sendResponse(401, [
        "success" => false,
        "message" => "Please login first."
    ]);
}

$userId = (int) $_SESSION["user_id"];

$lessonId = filter_input(
    INPUT_GET,
    "lesson_id",
    FILTER_VALIDATE_INT
);

if (!$lessonId || $lessonId < 1) {
    sendResponse(400, [
        "success" => false,
        "message" => "Valid lesson ID is required."
    ]);
}

require_once __DIR__ . "/../config/database.php";

try {

    $sql = "
        SELECT
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
            AND o.course_id = e.course_id

        INNER JOIN users u
            ON u.id = e.user_id

        WHERE
            l.id = :lesson_id
            AND e.user_id = :user_id
            AND o.status = 'paid'
            AND c.published = 1
            AND (
                u.role <> 'student'
                OR u.account_status = 'active'
            )

        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":lesson_id" => $lessonId,
        ":user_id" => $userId
    ]);

    $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lesson) {
        sendResponse(403, [
            "success" => false,
            "message" => "Course access denied. Check your account status and enrollment."
        ]);
    }

    $driveFileId = trim((string) $lesson["drive_file_id"]);

    if (
        $driveFileId === "" ||
        strpos($driveFileId, "PENDING_UPLOAD_") === 0
    ) {
        sendResponse(404, [
            "success" => false,
            "message" => "Video is not available yet."
        ]);
    }

    sendResponse(200, [
        "success" => true,
        "message" => "Video access verified successfully.",
        "lesson" => [
            "id" => (int) $lesson["id"],
            "title" => $lesson["title"],
            "description" => $lesson["description"],
            "course_id" => (int) $lesson["course_id"],
            "drive_file_id" => $driveFileId
        ]
    ]);

} catch (Throwable $e) {

    error_log("Video access error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Unable to verify video access."
    ]);
}