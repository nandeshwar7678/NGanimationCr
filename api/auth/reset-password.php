
<?php

header("Content-Type: application/json; charset=UTF-8");

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

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

function respond($success, $message, $status = 200) {
    http_response_code($status);
    echo json_encode([
        "success" => $success,
        "message" => $message
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data["email"] ?? ""));
$resetToken = trim($data["reset_token"] ?? "");
$newPassword = $data["new_password"] ?? "";
$confirmPassword = $data["confirm_password"] ?? "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Invalid email address.", 422);
}

if (!preg_match('/^[a-f0-9]{64}$/', $resetToken)) {
    respond(false, "Invalid or expired reset session.", 400);
}

if (strlen($newPassword) < 8) {
    respond(false, "Password must be at least 8 characters.", 422);
}

if ($newPassword !== $confirmPassword) {
    respond(false, "Passwords do not match.", 422);
}

try {

    $pdo->beginTransaction();

    $tokenHash = hash("sha256", $resetToken);

    $stmt = $pdo->prepare("
        SELECT id, user_id, reset_token_hash, expires_at
        FROM password_reset_otps
        WHERE email = ?
          AND verified_at IS NOT NULL
          AND used_at IS NULL
        ORDER BY id DESC
        LIMIT 1
        FOR UPDATE
    ");

    $stmt->execute([$email]);

    $record = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$record || !hash_equals($record["reset_token_hash"], $tokenHash)) {
        $pdo->rollBack();
        respond(false, "Invalid or expired reset session.", 400);
    }

    if (strtotime($record["expires_at"]) <= time()) {
        $expire = $pdo->prepare("
            UPDATE password_reset_otps
            SET used_at = NOW()
            WHERE id = ?
        ");

        $expire->execute([$record["id"]]);

        $pdo->commit();

        respond(false, "Reset session expired. Please request a new OTP.", 400);
    }

    $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $updateUser = $pdo->prepare("
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
    ");

    $updateUser->execute([
        $passwordHash,
        $record["user_id"]
    ]);

    if ($updateUser->rowCount() !== 1) {
        throw new Exception("Password update failed.");
    }

    // Mark reset token as used
    $markUsed = $pdo->prepare("
        UPDATE password_reset_otps
        SET used_at = NOW(),
            reset_token_hash = NULL
        WHERE id = ?
    ");

    $markUsed->execute([$record["id"]]);

    // Invalidate any other unused reset requests for this user
    $invalidate = $pdo->prepare("
        UPDATE password_reset_otps
        SET used_at = NOW(),
            reset_token_hash = NULL
        WHERE user_id = ?
          AND used_at IS NULL
    ");

    $invalidate->execute([$record["user_id"]]);

    $pdo->commit();

    respond(true, "Password reset successfully. You can now log in.");

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Reset password error: " . $e->getMessage());

    respond(false, "Unable to reset password right now.", 500);
}
