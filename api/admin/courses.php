
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

function sendResponse($success, $message, $extra = [], $status = 200) {
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if (!isset($_SESSION["user_id"])) {
    sendResponse(false, "Please login first.", [], 401);
}

require_once __DIR__ . "/../config/database.php";

try {

    // ADMIN CHECK
    $auth = $pdo->prepare(
        "SELECT role FROM users WHERE id = ? LIMIT 1"
    );

    $auth->execute([$_SESSION["user_id"]]);
    $user = $auth->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user["role"] !== "admin") {
        sendResponse(false, "Admin access denied.", [], 403);
    }

    $method = $_SERVER["REQUEST_METHOD"];

    // GET COURSES
    if ($method === "GET") {

        $stmt = $pdo->query(
            "SELECT id, title, slug, description, price_paise,
                    level, duration, thumbnail_url, published
             FROM courses
             ORDER BY id DESC"
        );

        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($courses as &$course) {
            $course["price_paise"] = (int) $course["price_paise"];
            $course["price"] = $course["price_paise"] / 100;
            $course["published"] = (int) $course["published"];
        }

        unset($course);

        echo json_encode([
            "success" => true,
            "courses" => $courses
        ]);

        exit;
    }

    // READ JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        sendResponse(false, "Invalid JSON data.", [], 400);
    }

    // CREATE COURSE
    if ($method === "POST") {

        $title = trim($data["title"] ?? "");
        $description = trim($data["description"] ?? "");
        $price = $data["price"] ?? null;
        $level = trim($data["level"] ?? "Beginner");
        $duration = trim($data["duration"] ?? "");
        $thumbnail = trim($data["thumbnail_url"] ?? "");
        $published = isset($data["published"])
            ? (int) $data["published"]
            : 0;

        if (
            $title === "" ||
            !is_numeric($price) ||
            (float) $price < 0
        ) {
            sendResponse(
                false,
                "Valid course title and price are required.",
                [],
                400
            );
        }

        $slug = strtolower($title);
        $slug = preg_replace("/[^a-z0-9]+/", "-", $slug);
        $slug = trim($slug, "-");

        if ($slug === "") {
            sendResponse(false, "Could not generate course URL.", [], 400);
        }

        $check = $pdo->prepare(
            "SELECT id FROM courses WHERE slug = ? LIMIT 1"
        );

        $check->execute([$slug]);

        if ($check->fetch()) {
            sendResponse(
                false,
                "A course with this title/URL already exists.",
                [],
                409
            );
        }

        $stmt = $pdo->prepare(
            "INSERT INTO courses
            (title, slug, description, price_paise, level,
             duration, thumbnail_url, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $title,
            $slug,
            $description,
            (int) round((float) $price * 100),
            $level,
            $duration,
            $thumbnail !== "" ? $thumbnail : null,
            $published ? 1 : 0
        ]);

        sendResponse(
            true,
            "Course created successfully.",
            [
                "course_id" => (int) $pdo->lastInsertId(),
                "slug" => $slug
            ]
        );
    }

    // UPDATE COURSE / PUBLISH / UNPUBLISH
    if ($method === "PUT") {

        $id = (int) ($data["id"] ?? 0);

        if ($id < 1) {
            sendResponse(false, "Valid course ID is required.", [], 400);
        }

        // Check course exists
        $check = $pdo->prepare(
            "SELECT * FROM courses WHERE id = ? LIMIT 1"
        );

        $check->execute([$id]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            sendResponse(false, "Course not found.", [], 404);
        }

        $title = trim($data["title"] ?? $existing["title"]);
        $description = trim(
            $data["description"] ?? $existing["description"]
        );

        $level = trim($data["level"] ?? $existing["level"]);
        $duration = trim($data["duration"] ?? $existing["duration"]);

        $thumbnail = trim(
            $data["thumbnail_url"] ?? ($existing["thumbnail_url"] ?? "")
        );

        $published = isset($data["published"])
            ? (int) $data["published"]
            : (int) $existing["published"];

        // IMPORTANT:
        // Accept both price and price_paise
        if (array_key_exists("price_paise", $data)) {

            $priceInput = $data["price_paise"];

            if (!is_numeric($priceInput) || (float) $priceInput < 0) {
                sendResponse(false, "Invalid course price.", [], 400);
            }

            $pricePaise = (int) round((float) $priceInput);

        } elseif (array_key_exists("price", $data)) {

            $priceInput = $data["price"];

            if (!is_numeric($priceInput) || (float) $priceInput < 0) {
                sendResponse(false, "Invalid course price.", [], 400);
            }

            $pricePaise = (int) round((float) $priceInput * 100);

        } else {

            $pricePaise = (int) $existing["price_paise"];
        }

        if ($title === "") {
            sendResponse(false, "Course title is required.", [], 400);
        }

        $stmt = $pdo->prepare(
            "UPDATE courses
             SET title = ?,
                 description = ?,
                 price_paise = ?,
                 level = ?,
                 duration = ?,
                 thumbnail_url = ?,
                 published = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $title,
            $description,
            $pricePaise,
            $level,
            $duration,
            $thumbnail !== "" ? $thumbnail : null,
            $published ? 1 : 0,
            $id
        ]);

        sendResponse(
            true,
            "Course updated successfully.",
            [
                "course_id" => $id,
                "price_paise" => $pricePaise,
                "published" => $published ? 1 : 0
            ]
        );
    }

    // DELETE OR ARCHIVE COURSE
    if ($method === "DELETE") {

        $id = (int) ($data["id"] ?? 0);

        if ($id < 1) {
            sendResponse(false, "Valid course ID is required.", [], 400);
        }

        $check = $pdo->prepare(
            "SELECT
                (SELECT COUNT(*) FROM orders WHERE course_id = ?) AS order_count,
                (SELECT COUNT(*) FROM enrollments WHERE course_id = ?) AS enrollment_count"
        );

        $check->execute([$id, $id]);
        $history = $check->fetch(PDO::FETCH_ASSOC);

        $exists = $pdo->prepare(
            "SELECT id FROM courses WHERE id = ? LIMIT 1"
        );

        $exists->execute([$id]);

        if (!$exists->fetch()) {
            sendResponse(false, "Course not found.", [], 404);
        }

        if (
            (int) $history["order_count"] > 0 ||
            (int) $history["enrollment_count"] > 0
        ) {

            $archive = $pdo->prepare(
                "UPDATE courses SET published = 0 WHERE id = ?"
            );

            $archive->execute([$id]);

            sendResponse(
                true,
                "Course has payment history, so it was unpublished instead of deleted.",
                ["archived" => true]
            );
        }

        $pdo->beginTransaction();

        $deleteLessons = $pdo->prepare(
            "DELETE FROM lessons WHERE course_id = ?"
        );

        $deleteLessons->execute([$id]);

        $deleteCourse = $pdo->prepare(
            "DELETE FROM courses WHERE id = ?"
        );

        $deleteCourse->execute([$id]);

        $pdo->commit();

        sendResponse(
            true,
            "Course deleted successfully.",
            ["archived" => false]
        );
    }

    sendResponse(false, "Method not allowed.", [], 405);

} catch (Throwable $e) {

    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Admin courses API error: " . $e->getMessage());

    sendResponse(
        false,
        "Server error while managing courses.",
        [],
        500
    );
}
