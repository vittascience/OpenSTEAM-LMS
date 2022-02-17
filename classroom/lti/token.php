<?php
/**
 * This file is responsible for giving Access_tokens to tool providers
 * Access Token is used when the tool provider want to send the score to platform (score.php)
 */
require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
include 'tools-credentials.php';
//include 'slack.php';

// decode token without validation
$decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $_REQUEST['client_assertion'])[1]))));
//slack(print_r($decodedToken, true), "cloud-debug");

// retrieve the tool name (subject)
$subjectKey = "sub";
$subjectValue = $decodedToken->$subjectKey;

// todo HTTP_HOST is insecure (controlled by the client)
$platform_url = "https://{$_SERVER['HTTP_HOST']}";

// decode jwt token and check signature using jwks public key

// check if toolname is trusted
if(!$lti1p3Tools[$subjectValue]) return;

// validate the jwt token using the tool public key (jwk)
$validatedToken = JWT::decode($_REQUEST['client_assertion'], JWK::parseKeySet(json_decode(file_get_contents($lti1p3Tools[$subjectValue]['public_keyset']), true)), array('RS256'));
//$jwt = JWT::decode($_REQUEST['client_assertion'], file_get_contents(__DIR__ . "/keys/public.key"), array('RS256'));
//slack(print_r($jwt, true), "cloud-debug");


$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
$jwtCreationTime = time();
$jwtExpirationTime = $jwtCreationTime + 86400;

$payload = array(
  "iss" => $platform_url,
  "aud" => $validatedToken->iss,
  "sub" =>  $validatedToken->iss,
  "iat" => $jwtCreationTime,
  "exp" => $jwtExpirationTime
);

$jwt = JWT::encode(
  $payload, 
  file_get_contents(__DIR__ . "/keys/private.key"), 
  'RS256');

$responseData = [
  "access_token" => $jwt,
  "token_type" => "Bearer",
  "expires_in" => $jwtExpirationTime
];

header('Content-type: application/json');
echo json_encode($responseData);

?>