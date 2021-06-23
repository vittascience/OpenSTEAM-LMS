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
use User\Entity\Regular;
use User\Entity\User;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// bind and sanitize incoming token
$confirmToken = isset($_GET['token']) 
                ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['token'])))
                : null;

// no token found, return an error
if($confirmToken === null){
    setcookie("invalidToken",true, strtotime("+1 minute"));
    $redirect = "{$_ENV['VS_HOST']}/classroom";
}

// check if the user exists in db
$regularUserToActivate = $entityManager->getRepository(Regular::class)
                                ->findOneBy(array('confirmToken'=> $confirmToken));

// user not found in db, return error
if($regularUserToActivate == null){
    setcookie("invalidUser",true, strtotime("+1 minute"));
    $redirect = "{$_ENV['VS_HOST']}/classroom";
}
else{
    // get user data from users table
    $userData = $entityManager->getRepository(User::class)
    ->findOneBy(array('id'=> $regularUserToActivate->getUser()));

    // no $userData found, return an error
    if(!$userData){
        setcookie("invalidUserData",true, strtotime("+1 minute"));
        $redirect = "{$_ENV['VS_HOST']}/classroom";
    }
    // update user data in user_regulars and users tables
    $regularUserToActivate->setConfirmToken(null);
    $regularUserToActivate->setActive(true);
    $userData->setUpdateDate(new \DateTime());
    $entityManager->flush();

    // set the success cookie and redirect wether the user is logged or not
    setcookie("accountActivationSucceded",true, strtotime("+1 minute"));
    $redirect = "{$_ENV['VS_HOST']}/classroom/login.php";

   
}
 // redirect the user 
    return header("Location: $redirect");
