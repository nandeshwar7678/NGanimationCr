<?php

date_default_timezone_set('UTC');

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "http://localhost:5173",
    "https://aicloudetools.com"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function sendResponse($success, $message, $status = 200, $extra = [])
{
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Invalid request method.", 405);
}

require_once __DIR__ . "/../config/database.php";

try {
    // PHP aur MySQL dono UTC timezone mein
    $pdo->exec("SET time_zone = '+00:00'");

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        $input = $_POST;
    }

    $email = strtolower(trim($input["email"] ?? ""));
    $otp = trim($input["otp"] ?? "");

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, "Invalid email address.", 422);
    }

    if (!preg_match('/^[0-9]{6}$/', $otp)) {
        sendResponse(false, "Please enter a valid 6-digit OTP.", 422);
    }

    $pdo->beginTransaction();

    // Latest unused and unverified OTP lock karo
    $query = $pdo->prepare("
        SELECT *
        FROM password_reset_otps
        WHERE email = ?
        AND used_at IS NULL
        AND verified_at IS NULL
        ORDER BY id DESC
        LIMIT 1
        FOR UPDATE
    ");

    $query->execute([$email]);
    $record = $query->fetch(PDO::FETCH_ASSOC);

    if (!$record) {
        $pdo->commit();

        sendResponse(
            false,
            "OTP not found. Please request a new OTP.",
            400
        );
    }

    // Expiry time UTC mein compare karo
    $expiryTime = new DateTimeImmutable(
        $record["expires_at"],
        new DateTimeZone("UTC")
    );

    $currentTime = new DateTimeImmutable(
        "now",
        new DateTimeZone("UTC")
    );

    if ($currentTime >= $expiryTime) {
        $expireQuery = $pdo->prepare("
            UPDATE password_reset_otps
            SET used_at = UTC_TIMESTAMP()
            WHERE id = ?
        ");

        $expireQuery->execute([$record["id"]]);

        $pdo->commit();

        sendResponse(
            false,
            "OTP has expired. Please request a new OTP.",
            400
        );
    }

    // Maximum 5 attempts
    if ((int) $record["attempts"] >= 5) {
        $expireQuery = $pdo->prepare("
            UPDATE password_reset_otps
            SET used_at = UTC_TIMESTAMP()
            WHERE id = ?
        ");

        $expireQuery->execute([$record["id"]]);

        $pdo->commit();

        sendResponse(
            false,
            "Maximum OTP attempts reached. Please request a new OTP.",
            400
        );
    }

    // OTP verify
    if (!password_verify($otp, $record["otp_hash"])) {

        $attemptQuery = $pdo->prepare("
            UPDATE password_reset_otps
            SET
                attempts = attempts + 1,
                used_at = CASE
                    WHEN attempts + 1 >= 5
                    THEN UTC_TIMESTAMP()
                    ELSE used_at
                END
            WHERE id = ?
        ");

        $attemptQuery->execute([$record["id"]]);

        $pdo->commit();

        sendResponse(
            false,
            "Incorrect OTP. Please check and try again.",
            400
        );
    }

    // OTP correct: reset token generate karo
    $resetToken = bin2hex(random_bytes(32));

    $resetTokenHash = hash("sha256", $resetToken);

    $updateQuery = $pdo->prepare("
        UPDATE password_reset_otps
        SET
            verified_at = UTC_TIMESTAMP(),
            reset_token_hash = ?
        WHERE id = ?
    ");

    $updateQuery->execute([
        $resetTokenHash,
        $record["id"]
    ]);

    $pdo->commit();

    sendResponse(
        true,
        "OTP verified successfully.",
        200,
        [
            "reset_token" => $resetToken
        ]
    );

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Verify Reset OTP Error: " . $e->getMessage());

    sendResponse(
        false,
        "Something went wrong. Please try again.",
        500
    );
}