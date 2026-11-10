
<?php
header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = ["http://localhost:5173", "https://aicloudetools.com"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
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
    echo json_encode(["success" => false, "message" => "Please login first."]);
    exit;
}

try {
    require_once __DIR__ . "/../config/database.php";

    $check = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $check->execute([(int)$_SESSION["user_id"]]);
    $admin = $check->fetch(PDO::FETCH_ASSOC);

    if (!$admin || $admin["role"] !== "admin") {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $studentId = filter_var($data["student_id"] ?? null, FILTER_VALIDATE_INT);
    $status = $data["account_status"] ?? "";

    if (!$studentId || !in_array($status, ["active", "inactive"], true)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid student or status."]);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET account_status = ?
        WHERE id = ? AND role = 'student'
    ");
    $stmt->execute([$status, $studentId]);

    if ($stmt->rowCount() === 0) {
        $verify = $pdo->prepare("
            SELECT id FROM users
            WHERE id = ? AND role = 'student' AND account_status = ?
        ");
        $verify->execute([$studentId, $status]);

        if (!$verify->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Student not found."]);
            exit;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Student status updated.",
        "account_status" => $status
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update student status."
    ]);
}
