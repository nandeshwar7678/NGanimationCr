
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

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
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

function response($success, $message, $extra = [], $status = 200) {
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if (!isset($_SESSION["user_id"])) {
    response(false, "Please login first.", [], 401);
}

require_once __DIR__ . "/../config/database.php";

try {

    // ADMIN AUTHENTICATION
    $auth = $pdo->prepare(
        "SELECT role FROM users WHERE id = ? LIMIT 1"
    );

    $auth->execute([$_SESSION["user_id"]]);
    $user = $auth->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user["role"] !== "admin") {
        response(false, "Admin access denied.", [], 403);
    }

    $method = $_SERVER["REQUEST_METHOD"];

    // GET: COURSES + LESSONS
    if ($method === "GET") {

        $courses = $pdo->query(
            "SELECT id, title, slug, published
             FROM courses
             ORDER BY id DESC"
        )->fetchAll(PDO::FETCH_ASSOC);

        $sql = "
            SELECT
                l.id,
                l.course_id,
                l.title,
                l.description,
                l.drive_file_id,
                l.position,
                c.title AS course_title
            FROM lessons l
            INNER JOIN courses c ON c.id = l.course_id
        ";

        $params = [];

        if (isset($_GET["course_id"]) && $_GET["course_id"] !== "") {
            $sql .= " WHERE l.course_id = ?";
            $params[] = (int) $_GET["course_id"];
        }

        $sql .= " ORDER BY l.course_id ASC, l.position ASC, l.id ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $lessons = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($lessons as &$lesson) {
            $lesson["id"] = (int) $lesson["id"];
            $lesson["course_id"] = (int) $lesson["course_id"];
            $lesson["position"] = (int) $lesson["position"];
        }

        unset($lesson);

        echo json_encode([
            "success" => true,
            "courses" => $courses,
            "lessons" => $lessons
        ]);

        exit;
    }

    // READ JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        response(false, "Invalid JSON data.", [], 400);
    }

    // ADD LESSON
    if ($method === "POST") {

        $courseId = (int) ($data["course_id"] ?? 0);
        $title = trim($data["title"] ?? "");
        $description = trim($data["description"] ?? "");
        $driveFileId = trim($data["drive_file_id"] ?? "");
        $position = isset($data["position"])
            ? (int) $data["position"]
            : 1;

        if ($courseId < 1 || $title === "") {
            response(
                false,
                "Course and lesson title are required.",
                [],
                400
            );
        }

        $courseCheck = $pdo->prepare(
            "SELECT id FROM courses WHERE id = ? LIMIT 1"
        );

        $courseCheck->execute([$courseId]);

        if (!$courseCheck->fetch()) {
            response(false, "Selected course not found.", [], 404);
        }

        if ($position < 1) {
            response(false, "Position must be at least 1.", [], 400);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO lessons
            (course_id, title, description, drive_file_id, position)
            VALUES (?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $courseId,
            $title,
            $description,
            $driveFileId !== "" ? $driveFileId : null,
            $position
        ]);

        response(
            true,
            "Lesson added successfully.",
            [
                "lesson_id" => (int) $pdo->lastInsertId()
            ]
        );
    }

    // EDIT LESSON
    if ($method === "PUT") {

        $id = (int) ($data["id"] ?? 0);

        if ($id < 1) {
            response(false, "Valid lesson ID is required.", [], 400);
        }

        $check = $pdo->prepare(
            "SELECT * FROM lessons WHERE id = ? LIMIT 1"
        );

        $check->execute([$id]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            response(false, "Lesson not found.", [], 404);
        }

        $courseId = isset($data["course_id"])
            ? (int) $data["course_id"]
            : (int) $existing["course_id"];

        $title = trim($data["title"] ?? $existing["title"]);

        $description = $data["description"]
            ?? $existing["description"];

        $driveFileId = array_key_exists("drive_file_id", $data)
            ? trim((string) $data["drive_file_id"])
            : ($existing["drive_file_id"] ?? "");

        $position = isset($data["position"])
            ? (int) $data["position"]
            : (int) $existing["position"];

        if ($courseId < 1 || $title === "" || $position < 1) {
            response(
                false,
                "Valid course, title and position are required.",
                [],
                400
            );
        }

        $courseCheck = $pdo->prepare(
            "SELECT id FROM courses WHERE id = ? LIMIT 1"
        );

        $courseCheck->execute([$courseId]);

        if (!$courseCheck->fetch()) {
            response(false, "Selected course not found.", [], 404);
        }

        $stmt = $pdo->prepare(
            "UPDATE lessons
             SET course_id = ?,
                 title = ?,
                 description = ?,
                 drive_file_id = ?,
                 position = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $courseId,
            $title,
            $description,
            $driveFileId !== "" ? $driveFileId : null,
            $position,
            $id
        ]);

        response(
            true,
            "Lesson updated successfully.",
            ["lesson_id" => $id]
        );
    }

    // DELETE LESSON
    if ($method === "DELETE") {

        $id = (int) ($data["id"] ?? 0);

        if ($id < 1) {
            response(false, "Valid lesson ID is required.", [], 400);
        }

        $check = $pdo->prepare(
            "SELECT id FROM lessons WHERE id = ? LIMIT 1"
        );

        $check->execute([$id]);

        if (!$check->fetch()) {
            response(false, "Lesson not found.", [], 404);
        }

        $stmt = $pdo->prepare(
            "DELETE FROM lessons WHERE id = ?"
        );

        $stmt->execute([$id]);

        response(true, "Lesson deleted successfully.");
    }

    response(false, "Method not allowed.", [], 405);

} catch (Throwable $e) {

    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Admin lessons API error: " . $e->getMessage());

    response(
        false,
        "Server error while managing lessons.",
        [],
        500
    );
}
