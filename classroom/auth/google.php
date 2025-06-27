<?php

use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Aiken\i18next\i18next;

require_once '../../bootstrap.php';
require_once 'utils.php';
require_once 'users.php';

session_start();

if ($_GET['backurl']) {
    $_SESSION['backurl'] = $_GET['backurl'];
}

$actualUrl = getActualUrl();
$googleProvider = new Google([
    'clientId'     => $_ENV['VS_SSO_GOOGLE_CLIENT_ID'],
    'clientSecret' => $_ENV['VS_SSO_GOOGLE_CLIENT_SECRET'],
    'redirectUri'  => $actualUrl . '/auth/google.php',
]);
$translatorInit = initTranslator();


if (!isset($_GET['code'])) {
    // Get authorization url
    $authUrl = $googleProvider->getAuthorizationUrl();
    // CSRF protection
    $_SESSION['oauth2state'] = $googleProvider->getState();
    header('Location: ' . $authUrl);
    exit;
} else if (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
    unset($_SESSION['oauth2state']);
    showErrorWithCode(7);
} else {
    try {
        $token = $googleProvider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);

        $user = $googleProvider->getResourceOwner($token);
        $userData = $user->toArray();
        $formatedUserData = formatUserData($userData, 'google');

        if ($userData['email_verified'] !== true) {
            echo i18next::getTranslation("sso.messages.emailNotVerified");
            header("refresh:3;url=$actualUrl");
        }

        manageUserFromSSO($entityManager, $formatedUserData, $actualUrl, 'google');
        die();
    } catch (IdentityProviderException $e) {
        exit($e->getMessage());
    }
}