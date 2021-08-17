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
use User\Entity\Regular;
use Classroom\Entity\Groups;
use Classroom\Entity\UsersLinkGroups;
use User\Entity\User;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// make sure we receive a token from url params else set token to null
$groupCode = isset($_GET['gc']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['gc']))) : null;
if (strlen($groupCode) != 5 || !preg_match("/^[a-zA-Z0-9]+$/", $groupCode)) {
    echo 'code invalide';
    return false;
}

$group = $entityManager->getRepository(Groups::class)->findOneBy(['link' => $groupCode]);
if (!$group) {
    echo("Ce groupe n'existe pas.");
    return false;
}

$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

if (!isset($_SESSION['id'])) {
    require_once(__DIR__ . "/header.html");
?>
    <script>
    const urlWithCode = "<?php echo($url);?>";
    const groupName = "<?php echo($group->getName());?>";
    </script>

    <link rel="stylesheet" href="/classroom/assets/css/main.css">

    <script src="./assets/js/lib/rotate.js"></script>
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
    </head>
    
    <body>
    <?php

    require_once(__DIR__ . "/group_invitation.html");
    require_once(__DIR__ . "/footer.html");
} else {
    $user_id = $_SESSION['id'];
    $userR = $entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
    $user =  $entityManager->getRepository(User::class)->findOneBy(['id' => $user_id]);
    
    if ($userR) {
        $alreadyLinked = $entityManager->getRepository('Classroom\Entity\UsersLinkGroups')->findOneBy(['user' => $user_id, 'group' => $group->getId()]);
        if ($alreadyLinked) {
            echo ("Vous faites déjà partie de ce groupe");
            header("Location: /classroom/home.php");
        } else {
            $UserLinkGroup = new UsersLinkGroups();
            $UserLinkGroup->setGroup($group);
            $UserLinkGroup->setUser($user);
            $UserLinkGroup->setRights(0);
            $entityManager->persist($UserLinkGroup);
            $entityManager->flush();
            echo ("Vous avez rejoint le groupe ".$group->getName());
            header("Location: /classroom/home.php");
        }
    }
}

?>