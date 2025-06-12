<?php
$domain = $_SERVER['HTTP_HOST'];
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => $domain,
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
    session_start();
}

require_once '../../bootstrap.php';
require_once 'utils.php';
require_once 'users.php';
require 'jwt.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Aiken\i18next\i18next;

$translatorInit = initTranslator();
$actualUrl = getActualUrl();

if (!isset($_POST['code']) || !isset($_POST['state'])) {
    showErrorWithCode(1);
}

$stateRaw = $_POST['state'] ?? $_GET['state'];
$code = $_POST['code'] ?? $_GET['code'];
$stateDecoded = null;
try {
    $stateDecoded = json_decode(base64_decode($stateRaw), true);
} catch (Exception $e) {
    showErrorWithCode(11);
}

if (!$stateDecoded) {
    showErrorWithCode(12);
}

if (array_key_exists('backurl', $stateDecoded) && !empty($stateDecoded['backurl'])) {
    $_SESSION['backurl'] = $stateDecoded['backurl'];
}

if ($stateDecoded['csrf'] !== $_SESSION['apple_sign_in_state']) {
    showErrorWithCode(2);
}

$postData = [
    'client_id'     => $_ENV['VS_SSO_APPLE_CLIENT_ID'],
    'client_secret' => $clientSecret,
    'code'          => $code,
    'grant_type'    => 'authorization_code',
    'redirect_uri'  => $actualUrl . '/auth/apple.php',
];


$postFields = http_build_query($postData);


$ch = curl_init('https://appleid.apple.com/auth/token');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    die('Erreur cURL: ' . curl_error($ch));
}
curl_close($ch);


$data = json_decode($response, true);

if (isset($data['error'])) {
    showErrorWithCode(3);
}


$idToken     = $data['id_token'];
$accessToken = $data['access_token']; 


$jwtParts = explode('.', $idToken);
$header = json_decode(base64_decode($jwtParts[0]), true);
$kid = $header['kid'];
if (empty($kid)) {
    showErrorWithCode(4);
}

$publicKeyPEM = getApplePublicKeyPEM($kid);

if ($publicKeyPEM === false) {
    showErrorWithCode(5);
}


$decodedPayload = JWT::decode($idToken, new Key($publicKeyPEM, 'RS256'));
$decodedPayloadArray = (array)$decodedPayload;

$formatedUserData = formatUserData($decodedPayloadArray, 'apple');

if ($decodedPayloadArray['email_verified'] !== true) {
    echo i18next::getTranslation("sso.messages.emailNotVerified");
    header("refresh:3;url=$actualUrl");
}

manageUserFromSSO($entityManager, $formatedUserData, $actualUrl, 'apple');






