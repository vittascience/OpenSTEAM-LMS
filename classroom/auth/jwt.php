<?php

require_once '../../bootstrap.php';

use Firebase\JWT\JWT;

$teamId = $_ENV['VS_SSO_APPLE_TEAM_ID'];
$clientId = $_ENV['VS_SSO_APPLE_CLIENT_ID'];
$keyId = $_ENV['VS_SSO_APPLE_KEY_ID'];
$keyPath = __DIR__ . '/key/' . $_ENV['VS_SSO_APPLE_PRIVATE_KEY_PATH'];

if (!file_exists($keyPath)) {
    die("Key file not found");
}

$privateKey = file_get_contents($keyPath);

$now = time();
$expiration = $now + (86400 * 180);

$claims = [
    'iss' => $teamId,
    'iat' => $now,
    'exp' => $expiration,
    'aud' => 'https://appleid.apple.com',
    'sub' => $clientId
];

$clientSecret = JWT::encode($claims, $privateKey, 'ES256', $keyId);