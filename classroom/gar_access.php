<?php session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Utils\ConnectionManager;

require_once(__DIR__ . "/CAS.php");
$user = ConnectionManager::getSharedInstance()->checkConnected(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Vittascience</title>
    <link rel="stylesheet" href="/assets/js/lib/bootstrap-4.4.1/bootstrap.min.css">
    <link rel='stylesheet' type='text/css' href='/classroom/assets/css/main.css' />
    <script src="assets/js/lib/marked.min.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
</head>

<body>
</body>
