<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once(__DIR__ . "/../vendor/jasig/phpcas/CAS.php");
$cas_host = 'idp-auth.partenaire.test-gar.education.fr';
// contexte cas
$cas_context = '';

// Port server cas
$cas_port = 443;
// Enable debugging
phpCAS::setDebug();

// Enable verbose error messages. Disable in production!
phpCAS::setVerbose(true);
phpCAS::log('lao');
/* if (isset($_SERVER["CONTENT_TYPE"])) {
    phpCAS::log('Content-Type: ' . $_SERVER["CONTENT_TYPE"]);
}
phpCAS::log('HTTP Raw Post data: ' . file_get_contents("php://input"));
// force le contenu du logoutRequest
if ($_SERVER["CONTENT_TYPE"] = 'text/xml') {
    $_POST['logoutRequest'] = substr(file_get_contents("php://input"), 14);
}
foreach ($_POST as $key => $value) {
    phpCAS::log($key . " = " . urldecode($value));
} */

// Initialize phpCAS
phpCAS::client(CAS_VERSION_3_0, $cas_host, $cas_port, $cas_context);

// For production use set the CA certificate that is the issuer of the cert
// on the CAS server and uncomment the line below
// phpCAS::setCasServerCACert($cas_server_ca_cert_path);

// For quick testing you can disable SSL validation of the CAS server.
// THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
// VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
phpCAS::setNoCasServerValidation();

// handle incoming logout requests
phpCAS::handleLogoutRequests(false);

// Or as an advanced featue handle SAML logout requests that emanate from the
// CAS host exclusively.
// Failure to restrict SAML logout requests to authorized hosts could
// allow denial of service attacks where at the least the server is
// tied up parsing bogus XML messages.
// phpCAS::handleLogoutRequests(true, $cas_real_hosts);

// force CAS authentication
phpCAS::forceAuthentication();

// for this test, simply print that the authentication was successfull
phpCAS::logout();
if (isset($_REQUEST['logout'])) {
    phpCAS::logout();
}
/* header('location:https://vgamma.vittascience.com/services/delete/deleteToken.php?redirect=classroom'); */
