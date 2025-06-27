<?php

use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;

require_once '../../bootstrap.php';
require_once 'utils.php';
require_once 'users.php';

session_start();

if ($_GET['backurl']) {
    $_SESSION['backurl'] = $_GET['backurl'];
}

$actualUrl = getActualUrl();
$microsoftProvider = new GenericProvider([
    'clientId'                => $_ENV['VS_SSO_MICROSOFT_CLIENT_ID'],
    'clientSecret'            => $_ENV['VS_SSO_MICROSOFT_CLIENT_SECRET'],   
    'redirectUri'             => $actualUrl .'/auth/microsoft.php',
    'urlAuthorize'            => 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
    'urlAccessToken'          => 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
    'urlResourceOwnerDetails' => 'https://graph.microsoft.com/v1.0/me'
]);
$translatorInit = initTranslator();


if (!isset($_GET['code'])) {

    $authUrl = $microsoftProvider->getAuthorizationUrl([
        'scope' => ['openid', 'profile', 'email', 'User.Read']
    ]);
    
    $_SESSION['oauth2state'] = $microsoftProvider->getState();
    header('Location: ' . $authUrl);
    exit;
} else if (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
    unset($_SESSION['oauth2state']);
    showErrorWithCode(6);
} else {
    try {
        $token = $microsoftProvider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);

        $user = $microsoftProvider->getResourceOwner($token);
        $userData = $user->toArray();
        $formatedUserData = formatUserData($userData, 'microsoft');
        manageUserFromSSO($entityManager, $formatedUserData, $actualUrl, 'microsoft');
    } catch (IdentityProviderException $e) {
        exit($e->getMessage());
    }
}
?>
