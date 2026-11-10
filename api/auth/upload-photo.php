
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

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

session_start();

require_once __DIR__ . "/../config/database.php";

// Check login
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

// Only POST allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Check uploaded file
if (!isset($_FILES["photo"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please select a photo."
    ]);
    exit;
}

$file = $_FILES["photo"];

// Check upload errors
if ($file["error"] !== UPLOAD_ERR_OK) {
    $uploadMessages = [
        UPLOAD_ERR_INI_SIZE => "Photo exceeds the server upload limit.",
        UPLOAD_ERR_FORM_SIZE => "Photo is too large.",
        UPLOAD_ERR_PARTIAL => "Photo was only partially uploaded.",
        UPLOAD_ERR_NO_FILE => "Please select a photo.",
        UPLOAD_ERR_NO_TMP_DIR => "Server temporary folder is missing.",
        UPLOAD_ERR_CANT_WRITE => "Server could not save the photo.",
        UPLOAD_ERR_EXTENSION => "Photo upload was stopped by the server."
    ];

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $uploadMessages[$file["error"]] ?? "Photo upload failed."
    ]);
    exit;
}

// Maximum size: 5 MB
$maxSize = 5 * 1024 * 1024;

if ($file["size"] > $maxSize) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Photo must be under 5 MB."
    ]);
    exit;
}

// Validate actual image MIME type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file["tmp_name"]);

$allowedTypes = [
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp"
];

if (!isset($allowedTypes[$mime])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Only JPG, PNG and WEBP photos are allowed."
    ]);
    exit;
}

// Verify that uploaded file is a valid image
if (@getimagesize($file["tmp_name"]) === false) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid image file."
    ]);
    exit;
}

// Create upload directory
$uploadDir = __DIR__ . "/../../uploads/profiles/";

if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Could not create upload directory."
        ]);
        exit;
    }
}

// Generate unique filename
$userId = (int) $_SESSION["user_id"];

$filename = "profile_" . $userId . "_" . bin2hex(random_bytes(8)) . "." . $allowedTypes[$mime];

$target = $uploadDir . $filename;

// Move uploaded file
if (!move_uploaded_file($file["tmp_name"], $target)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Photo upload failed."
    ]);
    exit;
}

// Save photo path in database
$photoUrl = "/uploads/profiles/" . $filename;

try {
    $stmt = $pdo->prepare(
        "UPDATE users SET profile_photo = ? WHERE id = ?"
    );

    $stmt->execute([$photoUrl, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Profile photo updated successfully.",
        "profile_photo" => $photoUrl
    ]);

} catch (Exception $e) {

    // Remove uploaded file if database update fails
    if (file_exists($target)) {
        unlink($target);
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Could not update profile photo."
    ]);
}
