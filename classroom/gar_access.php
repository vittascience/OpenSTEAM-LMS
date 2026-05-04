<?php session_start();
if (!defined('LMS_ROOT')) {
    $_d = __DIR__; $_i = 0;
    while ($_i++ < 8 && !file_exists($_d . '/vendor/autoload.php')) $_d = dirname($_d);
    define('LMS_ROOT', $_d); unset($_d, $_i);
}
require_once LMS_ROOT . '/vendor/autoload.php';

use Utils\ConnectionManager;


$user = ConnectionManager::getSharedInstance()->checkConnected(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Vittascience</title>
    <script src="/openClassroom/path.js"></script>
    <link rel='stylesheet' type='text/css' href='/openClassroom/classroom/assets/css/elements.css' />
    <link rel='stylesheet' type='text/css' href='/openClassroom/classroom/assets/plugins/css/vittascience.theme.css' />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel='stylesheet' type='text/css' href='/openClassroom/classroom/assets/css/main.css' />

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.8.2/marked.min.js"></script> -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
   <!--  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script> -->
</head>

<body>
    <header>
        <div class="container-fluid mb-5 shadow">
            <div class="row">
                <div class="col-12 d-flex justify-content-center">
                    <figure style="width:131.54px;height:61.54px;" class="h-100 my-0 d-flex justify-content-center align-items-center">
                    <img src="https://vittascience.com/openClassroom/classroom/assets/media/Certified-H-CharteConfiance-GAR-RVB-01.png" alt="" class="" style="height:75px;">
                    </figure>
                    <figure style="width:131.54px;height:61.54px;" class="h-100 my-0">
                        <img src="https://vittascience.com/public/content/img/gros_logo_carre.png" alt="" class="w-100" >
                    </figure>
                </div>
            </div>
        </div>
    </header>
    <?php require_once(__DIR__ . "/CAS.php"); ?>

    <footer style="background:#333; height:285px;" class="d-flex flex-column justify-content-center">
        <div class="d-flex flex-column justify-content-between mx-auto text-center text-white" style="height:185px;">
            <a href="/classroom/privacy.php" class="text-white" style="text-decoration:none;">POLITIQUE DE CONFIDENTIALITÉ</a>
            <a href="/classroom/cgu.php" class="text-white" style="text-decoration:none;">CONDITION GÉNÉRALES D'UTILISATION</a>
            <a href="/classroom/legal.php" class="text-white" style="text-decoration:none;">MENTIONS LÉGALES</a>
            <p>Copyright &copy; 2020 Vittascience</p>
        </div>
    </footer>
</body>