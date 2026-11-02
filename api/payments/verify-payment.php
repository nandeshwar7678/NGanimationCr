
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

$input = json_decode(file_get_contents("php://input"), true);

$orderId = trim($input["razorpay_order_id"] ?? "");
$paymentId = trim($input["razorpay_payment_id"] ?? "");
$signature = trim($input["razorpay_signature"] ?? "");

if (
    $orderId === "" ||
    $paymentId === "" ||
    $signature === ""
) {
    sendResponse(400, [
        "success" => false,
        "message" => "Payment verification details are missing."
    ]);
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/secrets.php";

if (
    !defined("RAZORPAY_KEY_SECRET") ||
    !RAZORPAY_KEY_SECRET
) {
    sendResponse(500, [
        "success" => false,
        "message" => "Payment configuration is incomplete."
    ]);
}

try {

    // Step 1: Verify Razorpay signature
    $expectedSignature = hash_hmac(
        "sha256",
        $orderId . "|" . $paymentId,
        RAZORPAY_KEY_SECRET
    );

    if (!hash_equals($expectedSignature, $signature)) {
        sendResponse(400, [
            "success" => false,
            "message" => "Invalid payment signature."
        ]);
    }

    // Step 2: Find this user's pending order
    $stmt = $pdo->prepare(
        "SELECT id, user_id, course_id, razorpay_order_id,
                amount_paise, status
         FROM orders
         WHERE razorpay_order_id = ?
           AND user_id = ?
         LIMIT 1"
    );

    $stmt->execute([$orderId, $userId]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(404, [
            "success" => false,
            "message" => "Payment order not found."
        ]);
    }

    // Step 3: Fetch payment directly from Razorpay
    $ch = curl_init(
        "https://api.razorpay.com/v1/payments/" .
        rawurlencode($paymentId)
    );

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPGET => true,
        CURLOPT_USERPWD => RAZORPAY_KEY_ID . ":" . RAZORPAY_KEY_SECRET,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    curl_close($ch);

    if ($response === false || $httpCode !== 200) {
        error_log("Razorpay payment fetch error: " . $curlError);

        sendResponse(502, [
            "success" => false,
            "message" => "Unable to verify payment with Razorpay."
        ]);
    }

    $payment = json_decode($response, true);

    // Step 4: Match payment with our order
    if (
        !is_array($payment) ||
        ($payment["order_id"] ?? "") !== $orderId ||
        (int) ($payment["amount"] ?? 0) !== (int) $order["amount_paise"] ||
        ($payment["currency"] ?? "") !== "INR"
    ) {
        sendResponse(400, [
            "success" => false,
            "message" => "Payment details do not match the order."
        ]);
    }

    // Grant access only after Razorpay confirms capture
    if (($payment["status"] ?? "") !== "captured") {
        sendResponse(409, [
            "success" => false,
            "message" => "Payment is not captured yet. Course access is not activated."
        ]);
    }

    // Step 5: Update order and create enrollment atomically
    $pdo->beginTransaction();

    $lockStmt = $pdo->prepare(
        "SELECT id, status
         FROM orders
         WHERE id = ? AND user_id = ?
         FOR UPDATE"
    );

    $lockStmt->execute([(int) $order["id"], $userId]);
    $lockedOrder = $lockStmt->fetch(PDO::FETCH_ASSOC);

    if (!$lockedOrder) {
        throw new Exception("Order could not be locked.");
    }

    if ($lockedOrder["status"] === "failed") {
        throw new Exception("This order has failed.");
    }

    if ($lockedOrder["status"] !== "paid") {
        $updateStmt = $pdo->prepare(
            "UPDATE orders
             SET status = 'paid',
                 razorpay_payment_id = ?
             WHERE id = ? AND user_id = ?"
        );

        $updateStmt->execute([
            $paymentId,
            (int) $order["id"],
            $userId
        ]);
    }

    // Check whether enrollment already exists
    $checkEnrollment = $pdo->prepare(
        "SELECT id FROM enrollments
         WHERE user_id = ? AND course_id = ?
         LIMIT 1"
    );

    $checkEnrollment->execute([
        $userId,
        (int) $order["course_id"]
    ]);

    if (!$checkEnrollment->fetch()) {
        $insertEnrollment = $pdo->prepare(
            "INSERT INTO enrollments
             (user_id, course_id, order_id)
             VALUES (?, ?, ?)"
        );

        $insertEnrollment->execute([
            $userId,
            (int) $order["course_id"],
            (int) $order["id"]
        ]);
    }

    $pdo->commit();

    sendResponse(200, [
        "success" => true,
        "message" => "Payment verified and enrollment activated.",
        "course_id" => (int) $order["course_id"]
    ]);

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Payment verification error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Payment verification failed. Please contact support."
    ]);
}
