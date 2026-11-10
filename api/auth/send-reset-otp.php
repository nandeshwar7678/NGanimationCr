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

function sendResponse($success, $message, $status = 200)
{
    http_response_code($status);
    echo json_encode([
        "success" => $success,
        "message" => $message
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Invalid request method.", 405);
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/secrets.php";

try {
    // PHP aur MySQL dono UTC timezone mein
    $pdo->exec("SET time_zone = '+00:00'");

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        $input = $_POST;
    }

    $email = strtolower(trim($input["email"] ?? ""));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, "Please enter a valid email address.", 422);
    }

    $ip = $_SERVER["REMOTE_ADDR"] ?? null;

    // Email ya IP se 1 minute mein sirf ek OTP request
    $limitQuery = $pdo->prepare("
        SELECT COUNT(*)
        FROM password_reset_otps
        WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 MINUTE)
        AND (
            email = ?
            OR request_ip = ?
        )
    ");

    $limitQuery->execute([$email, $ip]);
    $requestCount = (int) $limitQuery->fetchColumn();

    if ($requestCount > 0) {
        sendResponse(
            false,
            "Please wait 1 minute before requesting another OTP.",
            429
        );
    }

    // User find karo
    $userQuery = $pdo->prepare("
        SELECT id, name, email
        FROM users
        WHERE email = ?
        LIMIT 1
    ");

    $userQuery->execute([$email]);
    $user = $userQuery->fetch(PDO::FETCH_ASSOC);

    // Email exist na ho tab bhi generic response
    if (!$user) {
        sendResponse(
            true,
            "If this email is registered, an OTP will be sent shortly."
        );
    }

    // Purane unused OTP invalidate karo
    $invalidateQuery = $pdo->prepare("
        UPDATE password_reset_otps
        SET used_at = UTC_TIMESTAMP()
        WHERE email = ?
        AND used_at IS NULL
    ");

    $invalidateQuery->execute([$email]);

    // 6 digit OTP generate
    $otp = (string) random_int(100000, 999999);

    // OTP hash
    $otpHash = password_hash($otp, PASSWORD_DEFAULT);

    // OTP 10 minutes mein expire hoga
    $insertQuery = $pdo->prepare("
        INSERT INTO password_reset_otps
        (
            user_id,
            email,
            otp_hash,
            expires_at,
            request_ip
        )
        VALUES
        (
            ?,
            ?,
            ?,
            DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 MINUTE),
            ?
        )
    ");

    $insertQuery->execute([
        $user["id"],
        $email,
        $otpHash,
        $ip
    ]);

    $otpId = $pdo->lastInsertId();

    // Brevo API configuration
    if (
        !defined("BREVO_API_KEY") ||
        !defined("BREVO_SENDER_EMAIL") ||
        !defined("BREVO_SENDER_NAME") ||
        empty(BREVO_API_KEY)
    ) {
        error_log("Brevo configuration missing.");
        $pdo->prepare("
            UPDATE password_reset_otps
            SET used_at = UTC_TIMESTAMP()
            WHERE id = ?
        ")->execute([$otpId]);

        sendResponse(
            true,
            "If this email is registered, an OTP will be sent shortly."
        );
    }

    $emailData = [
        "sender" => [
            "name" => BREVO_SENDER_NAME,
            "email" => BREVO_SENDER_EMAIL
        ],
        "to" => [
            [
                "email" => $email,
                "name" => $user["name"]
            ]
        ],
        "subject" => "Password Reset OTP - NGAnimationCR Academy",
        "htmlContent" => "
            <div style='font-family:Arial,sans-serif;padding:20px;'>
                <h2>NGAnimationCR Academy</h2>
                <p>Hello " . htmlspecialchars($user["name"], ENT_QUOTES, "UTF-8") . ",</p>
                <p>Your password reset OTP is:</p>
                <h1 style='letter-spacing:8px;color:#2563eb;'>" . $otp . "</h1>
                <p>This OTP is valid for <b>10 minutes</b>.</p>
                <p>Do not share this OTP with anyone.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        "
    ];

    $ch = curl_init("https://api.brevo.com/v3/smtp/email");

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($emailData),
        CURLOPT_HTTPHEADER => [
            "accept: application/json",
            "api-key: " . BREVO_API_KEY,
            "content-type: application/json"
        ],
        CURLOPT_TIMEOUT => 20
    ]);

    $brevoResponse = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($brevoResponse === false || $httpCode < 200 || $httpCode >= 300) {
        error_log(
            "Brevo OTP email failed. HTTP: " .
            $httpCode .
            " Error: " .
            $curlError .
            " Response: " .
            $brevoResponse
        );

        $pdo->prepare("
            UPDATE password_reset_otps
            SET used_at = UTC_TIMESTAMP()
            WHERE id = ?
        ")->execute([$otpId]);
    }

    sendResponse(
        true,
        "If this email is registered, an OTP will be sent shortly."
    );

} catch (Throwable $e) {
    error_log("Send Reset OTP Error: " . $e->getMessage());

    sendResponse(
        false,
        "Something went wrong. Please try again later.",
        500
    );
}