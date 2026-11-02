
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
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);
}

// Start login session
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (!isset($_SESSION["user_id"])) {
    sendResponse(401, [
        "success" => false,
        "message" => "Please login first."
    ]);
}

$userId = (int) $_SESSION["user_id"];

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

$courseId = filter_var(
    $input["course_id"] ?? null,
    FILTER_VALIDATE_INT
);

if (!$courseId || $courseId < 1) {
    sendResponse(400, [
        "success" => false,
        "message" => "Valid course ID is required."
    ]);
}

// Database and Razorpay credentials
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/secrets.php";

if (
    !defined("RAZORPAY_KEY_ID") ||
    !defined("RAZORPAY_KEY_SECRET") ||
    !RAZORPAY_KEY_ID ||
    !RAZORPAY_KEY_SECRET
) {
    sendResponse(500, [
        "success" => false,
        "message" => "Payment configuration is incomplete."
    ]);
}

try {

    // Get actual course price from database
    $stmt = $pdo->prepare(
        "SELECT id, title, price_paise
         FROM courses
         WHERE id = ? AND published = 1
         LIMIT 1"
    );

    $stmt->execute([$courseId]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, [
            "success" => false,
            "message" => "Course not found."
        ]);
    }

    $amount = (int) $course["price_paise"];

    if ($amount < 100) {
        sendResponse(400, [
            "success" => false,
            "message" => "Invalid course amount."
        ]);
    }

    // Check existing enrollment
    $enrollStmt = $pdo->prepare(
        "SELECT id FROM enrollments
         WHERE user_id = ? AND course_id = ?
         LIMIT 1"
    );

    $enrollStmt->execute([$userId, $courseId]);

    if ($enrollStmt->fetch()) {
        sendResponse(409, [
            "success" => false,
            "message" => "You are already enrolled in this course."
        ]);
    }

    // Create Razorpay order
    $receipt = "course_" . $courseId . "_user_" . $userId . "_" . bin2hex(random_bytes(6));

    $payload = [
        "amount" => $amount,
        "currency" => "INR",
        "receipt" => $receipt,
        "notes" => [
            "user_id" => (string) $userId,
            "course_id" => (string) $courseId
        ]
    ];

    $ch = curl_init("https://api.razorpay.com/v1/orders");

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_USERPWD => RAZORPAY_KEY_ID . ":" . RAZORPAY_KEY_SECRET,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($response === false) {
        error_log("Razorpay connection error: " . $curlError);

        sendResponse(502, [
            "success" => false,
            "message" => "Unable to connect to payment gateway."
        ]);
    }

    $razorpayOrder = json_decode($response, true);

    if (
        $httpCode !== 200 ||
        empty($razorpayOrder["id"])
    ) {
        error_log("Razorpay order error: " . $response);

        sendResponse(502, [
            "success" => false,
            "message" => "Unable to create payment order."
        ]);
    }

    // Save pending order in database
    $insertStmt = $pdo->prepare(
        "INSERT INTO orders
        (user_id, course_id, razorpay_order_id, amount_paise, status)
        VALUES (?, ?, ?, ?, 'pending')"
    );

    $insertStmt->execute([
        $userId,
        $courseId,
        $razorpayOrder["id"],
        $amount
    ]);

    sendResponse(200, [
        "success" => true,
        "message" => "Payment order created successfully.",
        "key_id" => RAZORPAY_KEY_ID,
        "order_id" => $razorpayOrder["id"],
        "amount" => $amount,
        "currency" => "INR",
        "course_title" => $course["title"]
    ]);

} catch (PDOException $e) {

    error_log("Create order database error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Unable to save payment order."
    ]);
}
[]