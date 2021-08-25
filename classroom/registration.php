<?php
session_start();

require __DIR__."/../vendor/autoload.php";
require __DIR__."/../bootstrap.php";

use Dotenv\Dotenv;
use User\Entity\Regular;
use Classroom\Entity\Groups;
use Classroom\Entity\UsersLinkGroups;
use User\Entity\User;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();


$token = isset($_GET['token']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['token']))) : null;

setcookie("token", $token, time()+3600);

if ($token) {
    $regularUserToActivate = $entityManager->getRepository(Regular::class)->findOneBy(array('confirmToken'=> $token));
    if ($regularUserToActivate && $regularUserToActivate->isActive() == 0) {
        showRegistration();
    }
}

function showRegistration() {
    require_once(__DIR__ . "/header.html");
    ?>
        <link rel="stylesheet" href="/classroom/assets/css/main.css">
        <script src="./assets/js/lib/rotate.js"></script>
        <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
        </head>
        <body>
    <?php
    require_once(__DIR__ . "/registration.html");
    require_once(__DIR__ . "/footer.html");
}