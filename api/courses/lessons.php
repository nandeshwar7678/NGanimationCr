
<?php
$allowedOrigins = [
    "http://localhost:5173",
    "https://aicloudetools.com"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

header("Content-Type: application/json; charset=utf-8");
header("Vary: Origin");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
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

$slug = trim($_GET["slug"] ?? "");

if ($slug === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Course slug is required."
    ]);
    exit;
}

try {
    $sql = "
        SELECT
            l.id,
            l.title,
            l.description,
            l.position
        FROM lessons l
        INNER JOIN courses c ON c.id = l.course_id
        WHERE c.slug = :slug
          AND c.published = 1
        ORDER BY l.position ASC, l.id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(["slug" => $slug]);

    echo json_encode([
        "success" => true,
        "lessons" => $stmt->fetchAll()
    ]);

} catch (PDOException $e) {
    error_log("Lessons API error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load lessons."
    ]);
}
