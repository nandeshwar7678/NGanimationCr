
<?php

header("Content-Type: application/json; charset=utf-8");

// Allow only logged-in users
session_start();

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

// Automatically locate private credentials folder
$homeDir = dirname(__DIR__, 3);

$credentialsPath = $homeDir .
    "/private/nganimationcr-academy-keys.json";

if (!file_exists($credentialsPath)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Google credentials file not found."
    ]);
    exit;
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
    echo json_encode([
        "success" => false,
        "message" => "Invalid Google credentials."
    ]);
    exit;
}

function base64UrlEncode($data) {
    return rtrim(
        strtr(base64_encode($data), "+/", "-_"),
        "="
    );
}

try {

    // Create Google JWT
    $now = time();

    $header = [
        "alg" => "RS256",
        "typ" => "JWT"
    ];

    $claims = [
        "iss" => $credentials["client_email"],
        "scope" => "https://www.googleapis.com/auth/drive.readonly",
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now,
        "exp" => $now + 3600
    ];

    $jwtUnsigned =
        base64UrlEncode(json_encode($header)) . "." .
        base64UrlEncode(json_encode($claims));

    $privateKey = openssl_pkey_get_private(
        $credentials["private_key"]
    );

    if (!$privateKey) {
        throw new Exception("Unable to load private key.");
    }

    $signature = "";

    if (!openssl_sign(
        $jwtUnsigned,
        $signature,
        $privateKey,
        OPENSSL_ALGO_SHA256
    )) {
        throw new Exception("JWT signing failed.");
    }

    $jwt = $jwtUnsigned . "." .
        base64UrlEncode($signature);

    // Request Google access token
    $ch = curl_init(
        "https://oauth2.googleapis.com/token"
    );

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            "grant_type" =>
                "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion" => $jwt
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30
    ]);

    $tokenResponse = curl_exec($ch);
    $tokenStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($tokenResponse === false) {
        throw new Exception("Google token request failed.");
    }

    curl_close($ch);

    $tokenData = json_decode($tokenResponse, true);

    if (
        $tokenStatus !== 200 ||
        empty($tokenData["access_token"])
    ) {
        error_log("Google token error: " . $tokenResponse);

        throw new Exception(
            "Google authentication failed. Check API and credentials."
        );
    }

    // Test access to demo video
    $fileId = "1ZuBZ41lzHfNXxQZz5tppJYTaS6vWpht4";

    $url = "https://www.googleapis.com/drive/v3/files/" .
        rawurlencode($fileId) .
        "?fields=id,name,mimeType,size";

    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer " .
                $tokenData["access_token"]
        ]
    ]);

    $fileResponse = curl_exec($ch);
    $fileStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($fileResponse === false) {
        throw new Exception("Google Drive request failed.");
    }

    curl_close($ch);

    $fileData = json_decode($fileResponse, true);

    if ($fileStatus !== 200) {
        error_log("Google Drive error: " . $fileResponse);

        throw new Exception(
            "Google Drive could not access the demo video."
        );
    }

    echo json_encode([
        "success" => true,
        "message" => "Google Drive connection successful.",
        "file" => [
            "id" => $fileData["id"] ?? null,
            "name" => $fileData["name"] ?? null,
            "mimeType" => $fileData["mimeType"] ?? null,
            "size" => $fileData["size"] ?? null
        ]
    ]);

} catch (Throwable $e) {

    error_log("Drive test error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
