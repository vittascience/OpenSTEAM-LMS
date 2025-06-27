<?php

use Utils\Mailer;
use Aiken\i18next\i18next; 
use CoderCat\JWKToPEM\JWKConverter;

function getActualUrl(): string 
{
    $host = $_SERVER['HTTP_HOST'];
    return "https://" . $host;
}

function getRandomIcon(): string
{
    $icons = [];
    for ($i = 1; $i <= 26; $i++) {
        $icons[] = "Icon-$i.svg";
    }

    $randomIndex = array_rand($icons);
    return $icons[$randomIndex];
}

function initTranslator() {
    $userLang = isset($_COOKIE['lng']) ? htmlspecialchars(strip_tags(trim($_COOKIE['lng']))) : 'fr';
    i18next::init($userLang, "../../classroom/assets/lang/__lng__/ns.json");
}

function manageErrorReportToSupport($message, $mail) {
    $emailTtemplateBody = "fr_defaultMailerTemplate";
    $emailSubject = "Un utilisateur a rencontré une erreur lors de la connexion SSO";
    $body = "L'utilisateur : $mail , a rencontré une erreur lors de la connexion SSO : $message";

    try {
        $emailSent = Mailer::sendMail("logs@vittascience.com", $emailSubject, $body, strip_tags($body), $emailTtemplateBody);
        if (!$emailSent) {
            exit("Une erreur est survenue, si le problème persiste, contactez le support technique. code A");
        }
    } catch (Exception $e) {
        exit("Une erreur est survenue, si le problème persiste, contactez le support technique. code B");
    }

    exit("Une erreur est survenue, si le problème persiste, contactez le support technique. code C");
}

function getApplePublicKeyPEM($kid): string {
    $jwksJson = file_get_contents('https://appleid.apple.com/auth/keys');
    $jwks = json_decode($jwksJson, true);

    if (!empty($jwks['keys'])) {
        foreach ($jwks['keys'] as $key) {
            if (isset($key['kid']) && $key['kid'] === $kid) {
                $jwkConverter = new JWKConverter();
                $publicKeyPEM = $jwkConverter->toPEM($key);
                return $publicKeyPEM;
            }
        }
    }
    showErrorWithCode(8);
}

function showErrorWithCode($code) {
    $actualUrl = getActualUrl();
    echo i18next::getTranslation("sso.messages.error");
    echo "code $code";
    header("refresh:3;url=$actualUrl");
    exit;
}


