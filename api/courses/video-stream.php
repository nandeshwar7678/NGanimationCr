
<?php

// Secure Google Drive video streaming
// Supports HTTP Range Requests for seeking.

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
header("Access-Control-Allow-Headers: Content-Type, Range");
header("Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    exit;
}

// Start student session
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
    exit("Please login first.");
}

$userId = (int) $_SESSION["user_id"];

$lessonId = filter_input(
    INPUT_GET,
    "lesson_id",
    FILTER_VALIDATE_INT
);

if (!$lessonId || $lessonId < 1) {
    http_response_code(400);
    exit("Invalid lesson ID.");
}

// Verify paid enrollment
require_once __DIR__ . "/../config/database.php";

try {

    $sql = "
        SELECT l.drive_file_id

        FROM lessons l

        INNER JOIN courses c
            ON c.id = l.course_id

        INNER JOIN enrollments e
            ON e.course_id = c.id

        INNER JOIN orders o
            ON o.id = e.order_id
            AND o.user_id = e.user_id
            AND o.course_id = e.course_id

        WHERE
            l.id = :lesson_id
            AND e.user_id = :user_id
            AND o.status = 'paid'
            AND c.published = 1

        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":lesson_id" => $lessonId,
        ":user_id" => $userId
    ]);

    $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lesson) {
        http_response_code(403);
        exit("Course access denied.");
    }

    $fileId = trim((string) $lesson["drive_file_id"]);

    if (
        $fileId === "" ||
        strpos($fileId, "PENDING_UPLOAD_") === 0
    ) {
        http_response_code(404);
        exit("Video not available.");
    }

} catch (Throwable $e) {

    error_log("Video authorization error: " . $e->getMessage());

    http_response_code(500);
    exit("Unable to verify video access.");
}

// Close session lock before long streaming request
session_write_close();

// Locate private credentials
$homeDir = dirname(__DIR__, 3);

$credentialsPath = $homeDir .
    "/private/nganimationcr-academy-keys.json";

if (!is_file($credentialsPath) || !is_readable($credentialsPath)) {
    http_response_code(500);
    exit("Google credentials unavailable.");
}

$credentials = json_decode(
    file_get_contents($credentialsPath),
    true
);

if (
    !$credentials ||
    empty($credentials["client_email"]) ||
    empty($credentials["private_key"])
) {
    http_response_code(500);
    exit("Invalid Google credentials.");
}

function base64UrlEncode($data) {
    return rtrim(
        strtr(base64_encode($data), "+/", "-_"),
        "="
    );
}

// Generate Google JWT
$now = time();

$jwtHeader = [
    "alg" => "RS256",
    "typ" => "JWT"
];

$jwtClaims = [
    "iss" => $credentials["client_email"],
    "scope" => "https://www.googleapis.com/auth/drive.readonly",
    "aud" => "https://oauth2.googleapis.com/token",
    "iat" => $now,
    "exp" => $now + 3600
];

$unsignedJwt =
    base64UrlEncode(json_encode($jwtHeader)) . "." .
    base64UrlEncode(json_encode($jwtClaims));

$privateKey = openssl_pkey_get_private(
    $credentials["private_key"]
);

if (!$privateKey) {
    http_response_code(500);
    exit("Unable to load Google private key.");
}

$signature = "";

if (!openssl_sign(
    $unsignedJwt,
    $signature,
    $privateKey,
    OPENSSL_ALGO_SHA256
)) {
    http_response_code(500);
    exit("Google authentication failed.");
}

$jwt = $unsignedJwt . "." . base64UrlEncode($signature);

// Get Google access token
$tokenCurl = curl_init(
    "https://oauth2.googleapis.com/token"
);

curl_setopt_array($tokenCurl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        "grant_type" =>
            "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion" => $jwt
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30
]);

$tokenResponse = curl_exec($tokenCurl);
$tokenStatus = curl_getinfo($tokenCurl, CURLINFO_HTTP_CODE);
$tokenError = curl_error($tokenCurl);

curl_close($tokenCurl);

$tokenData = json_decode($tokenResponse ?: "", true);

if (
    $tokenResponse === false ||
    $tokenStatus !== 200 ||
    empty($tokenData["access_token"])
) {
    error_log("Google token error: " . $tokenError . " " . $tokenResponse);

    http_response_code(502);
    exit("Unable to authenticate with Google Drive.");
}

// Validate browser Range header
$range = $_SERVER["HTTP_RANGE"] ?? "";

if (
    $range !== "" &&
    !preg_match('/^bytes=\d*-\d*$/', $range)
) {
    http_response_code(416);
    header("Content-Range: bytes */*");
    exit;
}

// Google Drive media URL
$driveUrl =
    "https://www.googleapis.com/drive/v3/files/" .
    rawurlencode($fileId) .
    "?alt=media";

$upstreamStatus = 0;
$upstreamHeaders = [];
$headersSent = false;

// Forward only necessary response headers
$headerCallback = function ($curl, $headerLine) use (
    &$upstreamStatus,
    &$upstreamHeaders,
    &$headersSent
) {
    $length = strlen($headerLine);

    if (preg_match('/^HTTP\/\S+\s+(\d+)/i', $headerLine, $matches)) {
        $upstreamStatus = (int) $matches[1];
        $upstreamHeaders = [];
        return $length;
    }

    if (trim($headerLine) === "") {

        // Ignore redirect response headers.
        if ($upstreamStatus >= 200 && $upstreamStatus < 400) {

            http_response_code($upstreamStatus);

            foreach ([
                "Content-Type",
                "Content-Length",
                "Content-Range",
                "Accept-Ranges",
                "Last-Modified",
                "ETag"
            ] as $name) {

                if (isset($upstreamHeaders[strtolower($name)])) {
                    header(
                        $name . ": " .
                        $upstreamHeaders[strtolower($name)]
                    );
                }
            }

            if ($upstreamStatus === 200 || $upstreamStatus === 206) {
                header("Cache-Control: private, no-store");
                header('Content-Disposition: inline; filename="lesson-video.mp4"');
            }

            $headersSent = true;
        }

        return $length;
    }

    if (strpos($headerLine, ":") !== false) {

        [$name, $value] = explode(":", $headerLine, 2);

        $upstreamHeaders[strtolower(trim($name))] = trim($value);
    }

    return $length;
};

// Stream video chunks directly to browser
$writeCallback = function ($curl, $chunk) use (&$headersSent) {

    if (!$headersSent) {
        return 0;
    }

    echo $chunk;

    if (function_exists("ob_flush")) {
        @ob_flush();
    }

    flush();

    return strlen($chunk);
};

// Disable output buffering
while (ob_get_level() > 0) {
    ob_end_clean();
}

set_time_limit(0);

$driveCurl = curl_init($driveUrl);

$requestHeaders = [
    "Authorization: Bearer " . $tokenData["access_token"]
];

if ($range !== "") {
    $requestHeaders[] = "Range: " . $range;
}

curl_setopt_array($driveCurl, [
    CURLOPT_HTTPHEADER => $requestHeaders,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HEADER => false,
    CURLOPT_HEADERFUNCTION => $headerCallback,
    CURLOPT_WRITEFUNCTION => $writeCallback,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_BUFFERSIZE => 262144
]);

$result = curl_exec($driveCurl);

$curlError = curl_error($driveCurl);
$finalStatus = curl_getinfo($driveCurl, CURLINFO_HTTP_CODE);

curl_close($driveCurl);

if ($result === false) {
    error_log("Google video stream error: " . $curlError);
}

if ($finalStatus < 200 || $finalStatus >= 300) {
    error_log("Google video stream returned HTTP " . $finalStatus);
}
