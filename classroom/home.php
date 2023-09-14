<?php
session_start();

$openClassroomDir = __DIR__."/../../openClassroom";
if(is_dir($openClassroomDir)){
    require __DIR__."/../../vendor/autoload.php";
    require __DIR__."/../../bootstrap.php";
} else {
    require __DIR__."/../vendor/autoload.php";
    require __DIR__."/../bootstrap.php";
}
use Dotenv\Dotenv;
use Vittascience\Entity\Vuser\User;
// load data from .env file
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();



// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['VS_DEMOSTUDENT']) ? $_ENV['VS_DEMOSTUDENT'] : 'demostudent';

if (isset($_SESSION['idProf'])) {
    $user = $entityManager->getRepository(User::class)->find($_SESSION['idProf']);
} else if (isset($_SESSION['id'])) {
    $user = $entityManager->getRepository(User::class)->find($_SESSION['id']);
}
if (empty($user)) {
   header("Location: /classroom/login.php");
}

require_once(__DIR__ . "/header.html");

// add script tag with demoStudent name to make it available on the whole site
$demoStudent = str_replace('"', '', $demoStudent);
echo "<script>const demoStudentName = `{$demoStudent}`</script>";

require_once(__DIR__ . "/home.html");

