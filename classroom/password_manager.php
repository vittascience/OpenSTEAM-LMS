<?php

$openClassroomDir = __DIR__."/../../openClassroom";
if(is_dir($openClassroomDir)){
    require __DIR__."/../../vendor/autoload.php";
    require __DIR__."/../../bootstrap.php";
} else {
    require __DIR__."/../vendor/autoload.php";
    require __DIR__."/../bootstrap.php";
}

use Dotenv\Dotenv;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();


$token = isset($_GET['token']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['token']))) : null;
$urlhome = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]"."/classroom/home.php";
setcookie("token", $token, time()+300);

if (isset($_SESSION['id'])) {
    return header("Location: $urlhome");
}

showPasswordPage();

function showPasswordPage() {
    require_once(__DIR__ . "/header.html");
    ?>
        <link rel="stylesheet" href="/classroom/assets/css/main.css">
        <script src="./assets/js/lib/rotate.js"></script>
        <link rel="stylesheet" type="text/css" href="assets/js/lib/slick-1.8.1/slick/slick.css"/>
        </head>
        <body>
    <?php
    require_once(__DIR__ . "/password_manager.html");
    require_once(__DIR__ . "/footer.html");
}