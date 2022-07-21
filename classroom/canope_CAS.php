<?php

use GuzzleHttp\Client;
/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); */
// error_reporting(E_ALL);
if(session_status() === PHP_SESSION_NONE){
    session_start();
}


require_once(__DIR__ . "/../vendor/jasig/phpcas/CAS.php");
$cas_host = 'val.reseau-canope.fr/cas-usagers';

// contexte cas
$cas_context = '';

// Port server cas
$cas_port = 443;
// Enable debugging
phpCAS::setDebug();
// Enable verbose error messages. Disable in production!
// phpCAS::setVerbose(true);
// Initialize phpCAS
phpCAS::client(CAS_VERSION_3_0, $cas_host, $cas_port, $cas_context);
// uncomment the 2 lines below to set a fixed url to redirect to
// $cas_serveur_url_login_service = "https://fr.vittascience.com/classroom/gar_access.php"; 
//phpCAS::setFixedServiceURL($cas_serveur_url_login_service);

// For production use set the CA certificate that is the issuer of the cert
// on the CAS server and uncomment the line below
//phpCAS::setCasServerCACert($cas_server_ca_cert_path, false);
$cas_server_ca_cert_path = __DIR__ . "/cacert.pem";
phpCAS::setCasServerCACert($cas_server_ca_cert_path, true);

// For quick testing you can disable SSL validation of the CAS server.
// THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
// VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
//phpCAS::setNoCasServerValidation();

// force CAS authentication
phpCAS::forceAuthentication();

// at this step, the user has been authenticated by the CAS server
// and the user's login name can be read with phpCAS::getUser().
if (phpCAS::getUser()) {
    // echo "<pre>".print_r(phpCAS::getAttributes(),true);
    // echo "<pre>".print_r($_SESSION,true);

    // bind incoming data
    $role = phpCAS::getAttributes()["roleCode"];
    $email = phpCAS::getAttributes()["emailUser"];
    $prenom = phpCAS::getAttributes()["prenomUser"];
    $nom = phpCAS::getAttributes()["nomUser"];
    $uai = phpCAS::getAttributes()["codeUAI"];
    $id = phpCAS::getAttributes()["idAbonne"];

    // instanciate a client to be used for all future requests
    $client = new Client();
    // save the teacher if not already registered
    try {
        $response = $client->request(
            'POST',
            'https://vmoodle.vittascience.com/routing/Routing.php?controller=canope&action=save_canope_teacher',
            array(
                'form_params' => array(
                    'id'=> $id,
                    'prenom' => $prenom,
                    'nom' => $nom,
                    'uai' => $uai,
                    'role' => $role,
                    'email' => $email
                )
            )
        );
    } catch (Exception $e) {
        echo $e->getResponse()->getBody()->getContents();
    }
    $decodeResponse = json_decode($response->getBody()->getContents());
    if($decodeResponse->userId){
        $userId = intval($decodeResponse->userId);
        $_SESSION['id'] = $userId;

        
        try {
            $response = $client->request(
                'POST',
                'https://vmoodle.vittascience.com/routing/Routing.php?controller=canope&action=create_and_get_canope_teacher_classroom',
                array(
                    'form_params' => array(
                        'teacherId'=> $decodeResponse->userId,
                        'uai' => $uai
                    )
                )
            );
           
        } catch (Exception $e) {
            echo $e->getResponse()->getBody()->getContents();
        }

        $decodeResponse = json_decode($response->getBody()->getContents());
        if($decodeResponse->classroom)
        //  echo "<pre>".print_r($decodeResponse->classroom,true);
         ?>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 text-center">
                    <h1 class="font-weight-bold" style="color: #1B6DA9;">Bienvenue dans OpenSteamLms !</h1>
                    <div class="text-center my-4 text-center p-2 mx-auto font-weight-bold" style="max-width:313px; background:#FF931E;color:white;border-radius:15px;">
                        <a href="https://vmoodle.vittascience.com/classroom/home.php?panel=classroom-dashboard-classes-panel-teacher&nav=dashboard-classes-teacher" style="text-decoration:none;" class="text-white">Accéder à mon tableau de bord</a>
                        <i class="fas fa-chevron-right text-white"></i>
                    </div>
                </div>
            </div>
            
            <div class="row my-3">
                <?php display_support_and_personal_infos();?>
            </div>
           
           
        </div>

       
    <?php
        }
}
if (isset($_REQUEST['logout'])) {
    phpCAS::logout();
}
?>
<?php
function display_support_and_personal_infos(){
//    echo "<pre>".print_r(phpCAS::getAttributes(), true);
    $role = phpCAS::getAttributes()["role"];
    $roleCode = phpCAS::getAttributes()["roleCode"];
    $email = phpCAS::getAttributes()["emailUser"];
    $authenticationDate = phpCAS::getAttributes()["authenticationDate"];
    $prenom = phpCAS::getAttributes()["prenomUser"];
    $nom = phpCAS::getAttributes()["nomUser"];
    $uai = phpCAS::getAttributes()["codeUAI"];
    $id = phpCAS::getAttributes()["idAbonne"];
?>
    <details>
        <summary class="text-muted font-weight-bold">Informations personnelles/support</summary>
        <ul class="list-group list-unstyled">
            <li class="list-group-item pl-5">
                <p>Prénom Nom : <?php echo "$prenom $nom";?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>Identifiant (idAbonne) : <?php echo "$id";?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>Email : <?php echo !empty($email) ? $email : "non renseigné";?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>UAI : <?php echo $uai;?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>Rôle : <?php echo "$role (code : $roleCode)";?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>Date d'authentification : <?php echo $authenticationDate;?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>appli Concernée : <?php echo phpCAS::getAttributes()["appliConcerne"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>loginSCEREN : <?php echo phpCAS::getAttributes()["loginSCEREN"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>fonctionUri : <?php echo phpCAS::getAttributes()["fonctionUri"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>isFromNewLogin : <?php echo phpCAS::getAttributes()["isFromNewLogin"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>credentialType : <?php echo phpCAS::getAttributes()["credentialType"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>emailValide : <?php echo phpCAS::getAttributes()["emailValide"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>compteValide : <?php echo phpCAS::getAttributes()["compteValide"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>successfulAuthenticationHandlers : <?php echo phpCAS::getAttributes()["successfulAuthenticationHandlers"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>authenticationMethod : <?php echo phpCAS::getAttributes()["authenticationMethod"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>longTermAuthenticationRequestTokenUsed : <?php echo phpCAS::getAttributes()["longTermAuthenticationRequestTokenUsed"];?></p>
            </li>
            <li class="list-group-item pl-5">
                <p>Heure du serveur : <?php echo (new \DateTime("now"))->format("H:i");?></p>
            </li>
        </ul>
    </details>
<?php
}
