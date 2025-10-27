<?php
if(!empty($_COOKIE["isFromGar"]) && empty($_SESSION['phpCAS']['user'])){
    setcookie("isFromGar","",time()-1);
    setcookie("isGarTest","",time()-1);
    return header("Location:/classroom/gar_user_disconnect.php");
}
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Dotenv\Dotenv;
use DAO\RegularDAO;
use models\Regular;
use DAO\SettingsDAO;
use Utils\ConnectionManager;
use Database\DatabaseManager;

// load data from .env file
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['VS_DEMOSTUDENT']) ? $_ENV['VS_DEMOSTUDENT'] : 'demostudent';

$user = ConnectionManager::getSharedInstance()->checkConnected();

if ($user) {
    header("Location: /classroom/home.php");
    die();
}

require_once(__DIR__ . "/header.html");
?>

<link rel="stylesheet" href="/classroom/assets/css/main.css">

<script src="./assets/js/lib/rotate.js"></script>
<link rel="stylesheet" type="text/css" href="assets/js/lib/slick-1.8.1/slick/slick.css" />
</head>

<body>
    <?php
    // add script tag with demoStudent name to make it available on the whole site
    $demoStudent = str_replace('"', '', $demoStudent);
    echo "<script>const demoStudentName = `{$demoStudent}`</script>";
    require_once(__DIR__ . "/login.html");
    ?>

    <?php
    require_once(__DIR__ . "/footer.html");
    ?>