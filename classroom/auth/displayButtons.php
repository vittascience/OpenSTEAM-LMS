<?php

require_once __DIR__ . '/../../bootstrap.php';

$enabledSSO = isset($_ENV['SSO_ENABLED']) ? array_map('strtolower', array_map('trim', explode(',', $_ENV['SSO_ENABLED']))) : [];
$backurl = urlencode($_SERVER['REQUEST_URI']);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$randomValueForCSRF = bin2hex(random_bytes(16));

if (array_key_exists('apple_sign_in_state', $_SESSION)) {
    $timeElapsed = time() - $_SESSION['apple_sign_in_state_time'];
    if ($timeElapsed > 43200) {
        unset($_SESSION['apple_sign_in_state']);
        unset($_SESSION['apple_sign_in_state_time']);
    }
}

if (!array_key_exists('apple_sign_in_state', $_SESSION) && !isset($_SESSION['apple_sign_in_state'])) {
    $_SESSION['apple_sign_in_state'] = $randomValueForCSRF;
    $_SESSION['apple_sign_in_state_time'] = time();
}

$customData = [
    'csrf' => $_SESSION['apple_sign_in_state'],
    'backurl' => $_SERVER['REQUEST_URI'],
];
$appleSignInState = base64_encode(json_encode($customData));

if (in_array('google', $enabledSSO)) {
    echo <<<HTML
    <a href="./auth/google.php" class="btn-sso fw-bold">
        <img src="./auth/svg/google.svg" alt="google svg logo" class="w-auto">
        <span data-i18n="sso.google">Se connecter avec Google</span>
    </a>
    HTML;
}

if (in_array('microsoft', $enabledSSO)) {
    echo <<<HTML
    <a href="./auth/microsoft.php?backurl={$backurl}" class="btn-sso fw-bold">
        <img src="./auth/svg/microsoft.svg" alt="microsoft svg logo" class="w-auto">
        <span data-i18n="sso.microsoft">Se connecter avec Microsoft</span>
    </a>
    HTML;
}

if (in_array('apple', $enabledSSO)) {
    $redirectUri = urlencode('https://' . $_SERVER['HTTP_HOST'] . '/public/sso/apple.php');
    echo <<<HTML
    <a href="https://appleid.apple.com/auth/authorize?response_type=code%20id_token&client_id=com.vittascience.sso&redirect_uri={$redirectUri}&response_mode=form_post&scope=name%20email&state={$appleSignInState}" class="btn-sso fw-bold">
        <img src="./auth/svg/apple.svg" alt="apple svg logo" class="w-auto">
        <span data-i18n="sso.apple">Se connecter avec Apple</span>
    </a>
    HTML;
}