<?php

namespace Superadmin\Controller;

use Utils\Mailer;
use User\Entity\User;
use User\Entity\Regular;
use User\Entity\Teacher;
use Aiken\i18next\i18next;
use Superadmin\Entity\Groups;
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
            'registerTeacher' => function(){

                // return error if the request is not a POST request
                if($_SERVER['REQUEST_METHOD'] !== 'POST') return ["error"=> "Method not Allowed"];

                // bind incoming data to the value provided or null
                $firstname = isset($_POST['firstname']) ? htmlspecialchars(strip_tags(trim($_POST['firstname']))) : null;
                $surname = isset($_POST['surname']) ? htmlspecialchars(strip_tags(trim($_POST['surname']))) : null;
                /* $pseudo = isset($_POST['pseudo']) ? htmlspecialchars(strip_tags(trim($_POST['pseudo']))) : null; */
                $email = isset($_POST['email'])  ? htmlspecialchars(strip_tags(trim($_POST['email']))) : null;
                $password = isset($_POST['password'])  ? htmlspecialchars(strip_tags(trim($_POST['password']))) : null;
                $password_confirm = isset($_POST['password_confirm'])  ? htmlspecialchars(strip_tags(trim($_POST['password_confirm']))) : null;
                
                $bio = isset($_POST['bio']) ? htmlspecialchars(strip_tags(trim($_POST['bio']))) : null;
                $school = isset($_POST['school']) ? htmlspecialchars(strip_tags(trim($_POST['school']))) : null;
                $phone = isset($_POST['phone']) ? htmlspecialchars(strip_tags(trim($_POST['phone']))) : null;
                $grade = isset($_POST['grade']) ? htmlspecialchars(strip_tags(trim($_POST['grade']))) : null;
                $subject = isset($_POST['subject']) ? htmlspecialchars(strip_tags(trim($_POST['subject']))) : null;

                $groupCode = isset($_POST['gcode']) ? htmlspecialchars(strip_tags(trim($_POST['gcode']))) : null;

                $grade = (int)$grade;
                $subject = (int)$subject;

                $newsletter = $_POST['newsletter'] == "true" ? true : false;
                $private = $_POST['private'] == "true" ? true : false;
                $mailmessage = $_POST['mailmessage'] == "true" ? true : false;
                $contact = $_POST['contact'] == "true" ? true : false;

                // create empty $errors and fill it with errors if any
                $errors = [];
                if(empty($firstname)) $errors['firstnameMissing'] = true;
                if(empty($surname)) $errors['surnameMissing'] = true;
                /* if(empty($pseudo)) $errors['pseudoMissing'] = true; */
                if(empty($email)) $errors['emailMissing'] = true;
                elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)) $errors['emailInvalid'] = true;
                if(empty($password)) $errors['passwordMissing'] = true;
                elseif(strlen($password) < 7) $errors['invalidPassword'] = true;
                if(empty($password_confirm)) $errors['passwordConfirmMissing'] = true;
                elseif($password !== $password_confirm) $errors['passwordsMismatch'] = true;

                if(empty($bio)) $errors['bioMissing'] = true;
                if(empty($school)) $errors['schoolMissing'] = true;
                if(empty($phone)) $errors['phoneMissing'] = true;
                if(empty($grade)) $errors['gradeMissing'] = true;
                if(empty($subject)) $errors['subjectMissing'] = true;
                
                // check if the email is already listed in db
                $emailAlreadyExists = $this->entityManager
                                        ->getRepository('User\Entity\Regular')
                                        ->findOneBy(array('email'=> $email));
                
                // the email already exists in db,set emailExists error 
                if($emailAlreadyExists) $errors['emailExists'] = true;
                
                // some errors were found, return them to the user
                if(!empty($errors)){
                    return array(
                        'isUserAdded'=>false,
                        "errors" => $errors
                    );                    
                }

                // no errors found, we can process the data
                // hash the password and set $emailSent default value
                $passwordHash = password_hash($password,PASSWORD_BCRYPT);
                $emailSent = null;
                // create user and persists it in memory
                $user = new User;
                $user->setFirstname($firstname);
                $user->setSurname($surname);
                $user->setPseudo("Tartitoto");
                $user->setPassword($passwordHash);
                $user->setInsertDate( new \DateTime());
                $user->setUpdateDate(new \DateTime());
                $this->entityManager->persist($user);
                $this->entityManager->flush();
                // retrieve the lastInsertId to use for the next query 
                // this value is only available after a flush()
                $user->setId($user->getId());
                
                // create record in user_regulars table and persists it in memory
                $regularUser = new Regular($user,$email);
                $regularUser->setActive(false);
                $regularUser->setContactFlag($contact);
                $regularUser->setNewsletter($newsletter);
                $regularUser->setPrivateFlag(!$private);
                $regularUser->setMailMessages($mailmessage);

                // create record in user_etachers table and persists it in memory
                $teacherUser = new Teacher($user);
                $teacherUser->setGrade($grade);
                $teacherUser->setSchool($school);
                $teacherUser->setSubject($subject);
                $this->entityManager->persist($teacherUser);
                
                // create the confirm token and set user confirm token
                $confirmationToken = time()."-".bin2hex($email);
                $regularUser->setConfirmToken($confirmationToken);
                $this->entityManager->persist($regularUser);
                $this->entityManager->flush();  

                /////////////////////////////////////
                // PREPARE EMAIL TO BE SENT
                // received lang param
                $userLang = isset($_COOKIE['lng']) 
                                ? htmlspecialchars(strip_tags(trim($_COOKIE['lng'])))  
                                : 'fr';

                // create the confirmation account link and set the email template to be used      
                $accountConfirmationLink = $_ENV['VS_HOST']."/classroom/group_invitation.php?gc=$groupCode&token=$confirmationToken";
                $emailTtemplateBody = $userLang."_confirm_account";

                // init i18next instance
                if(is_dir(__DIR__."/../../../../../openClassroom")){
                    i18next::init($userLang,__DIR__."/../../../../../openClassroom/classroom/assets/lang/__lng__/ns.json");
                }else {
                    i18next::init($userLang,__DIR__."/../../../../../classroom/assets/lang/__lng__/ns.json");
                }

                $emailSubject = i18next::getTranslation('classroom.register.accountConfirmationEmail.emailSubject');
                $bodyTitle = i18next::getTranslation('classroom.register.accountConfirmationEmail.bodyTitle');
                $textBeforeLink = i18next::getTranslation('classroom.register.accountConfirmationEmail.textBeforeLink');
                $body = "
                    <a href='$accountConfirmationLink' style='text-decoration: none;padding: 10px;background: #27b88e;color: white;margin: 1rem auto;width: 50%;display: block;'>
                        $bodyTitle
                    </a>
                    <br>
                    <br>
                    <p>$textBeforeLink $accountConfirmationLink
                ";
                
                $emailSent = Mailer::sendMail($email, $emailSubject, $body, strip_tags($body), $emailTtemplateBody, "remi.cointe@vittascience.com", "Rémi"); 
                /////////////////////////////////////
                return array(
                    'isUserAdded'=>true,
                    "id" => $user->getId(),
                    "emailSent" => $emailSent,
                    "link" => $accountConfirmationLink
                );   
            },'linkTeacherToGroup' => function() {
                 // return error if the request is not a POST request

                 // probably unnecessary while we already check in the routing, need to be double check
                 if($_SERVER['REQUEST_METHOD'] !== 'POST') return ["error"=> "Method not Allowed"];

                 // bind incoming data to the value provided or null
                 $user_id = isset($_POST['user_id']) ? htmlspecialchars(strip_tags(trim($_POST['user_id']))) : null;
                 $group_id = isset($_POST['group_id']) ? htmlspecialchars(strip_tags(trim($_POST['group_id']))) : null;

                 $group = $this->entityManager->getRepository(Groups::class)->findOneBy(['id' => $group_id]);
                 $userR = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
                 $user =  $this->entityManager->getRepository(User::class)->findOneBy(['id' => $user_id]);
                 
                 if ($userR && $group) {
                     $alreadyLinked = $this->entityManager->getRepository('Classroom\Entity\UsersLinkGroups')->findOneBy(['user' => $user_id, 'group' => $group_id]);
                     if ($alreadyLinked) {
                        return ['message' => 'alreadylinked'];
                     } else {
                         $UserLinkGroup = new UsersLinkGroups();
                         $UserLinkGroup->setGroup($group);
                         $UserLinkGroup->setUser($user);
                         $UserLinkGroup->setRights(0);
                         $this->entityManager->persist($UserLinkGroup);
                         $this->entityManager->flush();
                         return ['message' => 'success'];
                     }
                 } else {
                     return ['message' => 'noteacher'];
                 }
            }
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