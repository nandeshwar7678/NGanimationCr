
<?php

header("Content-Type: application/json; charset=utf-8");

$allowedOrigins = [
    "http://localhost:5173",
    "https://aicloudetools.com"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
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

require_once __DIR__ . "/../config/database.php";

try {
    $sql = "
        SELECT
            id,
            title,
            slug,
            description,
            price_paise,
            thumbnail_url,
            level,
            duration
        FROM courses
        WHERE published = 1
        ORDER BY id DESC
    ";

    $stmt = $pdo->query($sql);
    $courses = $stmt->fetchAll();

    foreach ($courses as &$course) {
        $course["id"] = (int) $course["id"];
        $course["price_paise"] = (int) $course["price_paise"];

        // Convert paise to rupees for frontend display.
        $course["price"] = $course["price_paise"] / 100;
    }

    unset($course);

    echo json_encode([
        "success" => true,
        "courses" => $courses
    ]);

} catch (PDOException $e) {
    error_log("Courses API error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to fetch courses."
    ]);
}
