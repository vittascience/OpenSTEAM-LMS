<?php
/**
 * This file is responsible for recieving deeplink data sent by the tool provider
 */
require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
include 'tools-credentials.php';

$decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $_REQUEST['JWT'])[1]))));

$clientId = $decodedToken->iss;
// decode jwt token and check signature using jwks public key
$validatedToken = JWT::decode($_REQUEST['JWT'], JWK::parseKeySet(json_decode(file_get_contents($lti1p3Tools[$clientId]['public_keyset']), true)), array('RS256'));
$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
// here save activity url in db
?>

<script>
  window.onload = function() {
    // send deeplink url to parent window
    const msg = {type: 'end-lti-deeplink', content: '<?php echo $validatedToken->$contentItemsLabel[0]->url; ?>'};
    window.parent.postMessage(JSON.stringify(msg), '*')
  }
</script>


