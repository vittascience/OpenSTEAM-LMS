<?php
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
// Initialize phpCAS
phpCAS::client(CAS_VERSION_3_0, $cas_host, $cas_port, $cas_context);
// For production use set the CA certificate that is the issuer of the cert
// on the CAS server and uncomment the line below
//phpCAS::setCasServerCACert($cas_server_ca_cert_path, false);

// For quick testing you can disable SSL validation of the CAS server.
// THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
// VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
phpCAS::setNoCasServerValidation();

// force CAS authentication
phpCAS::forceAuthentication();

// at this step, the user has been authenticated by the CAS server
// and the user's login name can be read with phpCAS::getUser().
if (phpCAS::getUser()) {
    phpCAS::log('lala');
    $pre = phpCAS::getAttributes()['PRE'];
    $nom = phpCAS::getAttributes()['NOM'];
    $ido = phpCAS::getAttributes()['IDO'];
    $uai = phpCAS::getAttributes()['UAI'];
    $_SESSION['garAttributes'] = phpCAS::getAttributes();
    $div = urlencode(json_encode(phpCAS::getAttributes()["DIV"]));
    if (isset(phpCAS::getAttributes()['P_MEL'])) {
        $pmel = phpCAS::getAttributes()['P_MEL'];
    } else {
        $pmel = '';
    }
    header('location:https://fr.vittascience.com/user/Routing.php?controller=user&action=garSystem&pre=' . $pre . '&nom=' . $nom . '&ido=' . $ido . '&uai=' . $uai . '&div=' . $div . '&pmel=' . $pmel);
}
if (isset($_REQUEST['logout'])) {
    phpCAS::logout();
}
// for this test, simply print that the authentication was successfull
