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
use Vittascience\Entity\Vuser\Regular;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// make sure we receive a token from url params else set token to null
$token = isset($_GET['token']) 
            ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['token'])))
            : null;

// exit when $token if does not exists
if(empty($token)){
    setcookie("invalidToken",true, strtotime("+1 minute"));
    $redirect = "{$_ENV['VS_HOST']}/classroom";
}

// get regular user by its token
$regularUser = $entityManager->getRepository(Regular::class)->findOneBy(
    array('confirmToken'=>$token)
);

// no recordffound
if($regularUser == null){
    setcookie("invalidUser",true, strtotime("+1 minute"));
    $redirect = "{$_ENV['VS_HOST']}/classroom";
}
// regular user found
else
{
    // update user data and save the changes
    $regularUser->setEmail($regularUser->getNewMail());
    $regularUser->setNewMail(null);
    $regularUser->setConfirmToken(null);
    $entityManager->flush();

    // set the success cookie and redirect wether the user is logged or not
    setcookie("emailUpdateSucceded",true, strtotime("+1 minute"));
    $redirect = isset($_SESSION['id']) 
                ? "{$_ENV['VS_HOST']}/classroom/home.php"
                : "{$_ENV['VS_HOST']}/classroom/login.php";

    
}
// redirect the user 
return header("Location: $redirect");


