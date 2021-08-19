<?php

namespace Superadmin\Controller;

use User\Entity\User;
use User\Entity\Regular;
use User\Entity\Teacher;
use Superadmin\Entity\UsersLinkGroups;


class ControllerGroupAdmin extends Controller
{
    public function __construct($entityManager, $user)
    {
        parent::__construct($entityManager, $user);

        $this->actions = array(
            'get_all_groups_where_user_is_admin' => function () {
                return $this->entityManager->getRepository('Superadmin\Entity\UsersLinkGroups')->groupWhereUserIsAdmin($_SESSION['id']);
            },
            'get_all_users_in_group' => function ($data) {
                if (isset($data['group_id']) &&
                    isset($data['page']) &&
                    isset($data['userspp']) &&
                    isset($data['sort'])) {
                        $groupd_id = $data['group_id'];
                        $page = $data['page'];
                        $userspp = $data['userspp'];
                        $sort = $data['sort'];
                        return $this->entityManager->getRepository('Superadmin\Entity\UsersLinkGroups')->getAllMembersFromGroup($groupd_id, $page, $userspp, $sort);
                    }
            },
            'delete_user' => function ($data) {
                if (isset($data['user_id'])) {
                    $user_id = $data['user_id'];

                    $user = $this->entityManager->getRepository('User\Entity\User')->findOneBy(['id'=>$user_id]);
                    if ($user) {
                        $this->entityManager->remove($user);
                    }

                    $userR = $this->entityManager->getRepository('User\Entity\Regular')->findOneBy(['id' => $user_id]);
                    if ($userR) {
                        $this->entityManager->remove($userR);
                    }

                    $userT = $this->entityManager->getRepository('User\Entity\Teacher')->findOneBy(['id' => $user_id]);
                    if ($userT) {
                        $this->entityManager->remove($userT);
                    }

                    $this->entityManager->flush();

                    return json_encode(['response' => 'User deleted with success!']);
                } else {
                    return json_encode(['response' => 'Missing data']);
                }
            },
            'create_user' => function($data) {
                if (isset($data['firstname']) && $data['firstname'] != null && 
                    isset($data['surname']) && $data['surname'] != null && 
                    isset($data['pseudo']) && $data['pseudo'] != null && 
                    isset($data['groups']) && $data['groups'] != null &&

                    isset($data['phone']) && $data['phone'] != null &&
                    isset($data['mail']) && $data['mail'] != null &&
                    isset($data['bio']) &&
                    isset($data['teacher']) && $data['teacher'] != null &&
                    isset($data['grade']) &&
                    isset($data['subject']) &&
                    isset($data['school']))
                {

                    $groups =  json_decode($data['groups']);
                    $surname = $data['surname'];
                    $firstname = $data['firstname'];
                    $pseudo = $data['pseudo'];

                    $phone = $data['phone'];
                    $bio = $data['bio'];
                    $mail = $data['mail'];
                    $teacher = $data['teacher'] = "true" ? true : false;
                    $school = $data['school'];
                    $grade = (int)$data['grade'];
                    $subject = (int)$data['subject'];

                    
                    $user = new User;
                    $user->setFirstname($firstname);
                    $user->setSurname($surname);
                    $user->setPseudo($pseudo);
                    $objDateTime = new \DateTime('NOW');
                    $user->setInsertDate($objDateTime);

                    $password = "";
                    for ($i = 0; $i < 8; $i++) {
                        $password .= rand(0, 9);
                    }

                    $hash = password_hash($password, PASSWORD_DEFAULT);
                    $user->setPassword($hash);
                    $lastUser = $this->entityManager->getRepository('User\Entity\User')->findOneBy([], ['id' => 'desc']);
                    // J'aime pas trop cette façon de faire, réfléchir à une altérnative
                    $user->setId($lastUser->getId() + 1);
                    $this->entityManager->persist($user);

                    
                    foreach ($groups as $key => $value) {
                        if ($value[1] != -1) {
                            $group = $this->entityManager->getRepository('Superadmin\Entity\Groups')->findOneBy(['id' => $value[1]]);
        
                            $rights = 0;
                            $UsersLinkGroups = new UsersLinkGroups();
                            $UsersLinkGroups->setGroup($group);
                            $UsersLinkGroups->setUser($user);
                            if ($value[0] == true) {
                                $rights = 1;
                            }
                            $UsersLinkGroups->setRights($rights);
                            $this->entityManager->persist($UsersLinkGroups);
                        }
                    }


                    // Create Regular and Teacher entity on need
                    $regular = new Regular($user, $mail, $bio, $phone);
                    $this->entityManager->persist($regular);
                    if ($teacher) {
                        $teacher = new Teacher($user, $subject, $school, $grade);
                        $this->entityManager->persist($teacher);
                    }

                    $this->entityManager->flush();

                    return json_encode(['response' => 'User created with success!']);
                } else {
                    return json_encode(['response' => 'missing data']);
                }
            },
        );
        // Vérifie si l'utilisateur actuel est admin, si il ne l'est pas alors lui refuser toutes actions
/*         $Autorisation = $this->entityManager->getRepository('User\Entity\Regular')->findOneBy(['user' => $_SESSION['id']]);
        if (!$Autorisation || $_SERVER['REQUEST_METHOD'] != 'POST') {
            return false;
        } else {
            
        } */
    }
}


/* function surnameGenerator()
{
    $vittascienceName = "Surname";
    for ($i = 0; $i < 10; $i++) {
       $vittascienceName .= rand(0, 9);
    }
    return $vittascienceName;
}

function pseudoGenerator()
{
    $vittascienceName = "Pseudo";
    for ($i = 0; $i < 10; $i++) {
       $vittascienceName .= rand(0, 9);
    }
    return $vittascienceName;
}

function firstnameGenerator()
{
    $vittascienceName = "Firstname";
    for ($i = 0; $i < 10; $i++) {
       $vittascienceName .= rand(0, 9);
    }
    return $vittascienceName;
} */




/* 'make_fixtures' => function() {
for ($i=0; $i < 300 ; $i++) { 
$randomGroup = rand(2, 10);
$rightsGroup = rand(0, 100) < 98 ? 0 : 1;

$user = new User();
$user->setSurname(surnameGenerator());
$user->setPseudo(pseudoGenerator());
$user->setFirstname(firstnameGenerator());
$user->setInsertDate( new \DateTime('NOW'));
$hash = password_hash("securiteavanttout", PASSWORD_DEFAULT);
$user->setPassword($hash);
$this->entityManager->persist($user);

if ($randomGroup >= 3 && $randomGroup != 6) {
$group = $this->entityManager->getRepository('Superadmin\Entity\Groups')->findOneBy(['id' => $randomGroup]);
$userLinkGroups = new UsersLinkGroups();
$userLinkGroups->setUser($user);
$userLinkGroups->setGroup($group);
$userLinkGroups->setRights($rightsGroup);
$this->entityManager->persist($userLinkGroups);
}

$this->entityManager->flush();
}
} */