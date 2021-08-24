<?php

namespace Superadmin\Controller;

use Utils\Mailer;
use User\Entity\User;
use User\Entity\Regular;
use User\Entity\Teacher;
use Aiken\i18next\i18next;
use Superadmin\Entity\Groups;
use Superadmin\Entity\UsersLinkGroups;
use Doctrine\ORM\EntityManager;


class ControllerGroupAdmin extends Controller
{
    public function __construct($entityManager, $user)
    {
        parent::__construct($entityManager, $user);

        $this->actions = array(
            'get_all_groups_where_user_is_admin' => function () {
                return $this->entityManager->getRepository(UsersLinkGroups::class)->groupWhereUserIsAdmin($_SESSION['id']);
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
                        return $this->entityManager->getRepository(UsersLinkGroups::class)->getAllMembersFromGroup($groupd_id, $page, $userspp, $sort);
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
                    isset($data['grade']) &&
                    isset($data['subject']) &&
                    isset($data['school']))
                {
                    $admin = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $_SESSION['id']]);

                    $groups =  json_decode($data['groups']);
                    $surname = htmlspecialchars(strip_tags(trim($data['surname'])));
                    $firstname = htmlspecialchars(strip_tags(trim($data['firstname'])));
                    $pseudo = htmlspecialchars(strip_tags(trim($data['pseudo'])));

                    $phone = htmlspecialchars(strip_tags(trim($data['phone'])));
                    $bio = htmlspecialchars(strip_tags(trim($data['bio'])));
                    $mail = htmlspecialchars(strip_tags(trim($data['mail'])));
                    $school = htmlspecialchars(strip_tags(trim($data['school'])));
                    $grade = (int)htmlspecialchars(strip_tags(trim($data['grade'])));
                    $subject = (int)htmlspecialchars(strip_tags(trim($data['subject'])));

                    //isset($_POST['user_id']) ? htmlspecialchars(strip_tags(trim($_POST['user_id']))) : null;
                    
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
                    $lastUser = $this->entityManager->getRepository(User::class)->findOneBy([], ['id' => 'desc']);
                    // J'aime pas trop cette façon de faire, réfléchir à une altérnative
                    $user->setId($lastUser->getId() + 1);
                    $this->entityManager->persist($user);

                    // link the user to the group with his right
                    if ($groups[1] != -1) {
                        $group = $this->entityManager->getRepository(Groups::class)->findOneBy(['id' => $groups[1]]);
                        // Vérifie si l'utilisateur qui demande la liaison a un group est bien admin de celui-ci
                        $adminOfTheGroups = $this->entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $admin, 'group' => $group]);
                        $rightsOfRequester = $adminOfTheGroups ? $adminOfTheGroups->getRights() : 0;

                        if ($rightsOfRequester == 1) {
                            $rights = 0;
                            $UsersLinkGroups = new UsersLinkGroups();
                            $UsersLinkGroups->setGroup($group);
                            $UsersLinkGroups->setUser($user);
                            if ($groups[0] == true) {
                                $rights = 1;
                            }
                            $UsersLinkGroups->setRights($rights);
                            $this->entityManager->persist($UsersLinkGroups); 
                        } else {
                            return ['message' => 'noadmin'];
                        }
                    }

                    // Create Regular and Teacher entity on need
                    $regular = new Regular($user, $mail, $bio, $phone);
                    $this->entityManager->persist($regular);
                    $teacher = new Teacher($user, $subject, $school, $grade);
                    $this->entityManager->persist($teacher);
                    $this->entityManager->flush();



                    return ['response' => 'User created with success!'];
                } else {
                    return ['response' => 'missing data'];
                }
            },
            'registerTeacher' => function(){

                // return error if the request is not a POST request
                if($_SERVER['REQUEST_METHOD'] !== 'POST') return ["error"=> "Method not Allowed"];

                // bind incoming data to the value provided or null
                $firstname = isset($_POST['firstname']) ? htmlspecialchars(strip_tags(trim($_POST['firstname']))) : null;
                $surname = isset($_POST['surname']) ? htmlspecialchars(strip_tags(trim($_POST['surname']))) : null;
                $pseudo = isset($_POST['pseudo']) ? htmlspecialchars(strip_tags(trim($_POST['pseudo']))) : null;
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
                if(empty($pseudo)) $errors['pseudoMissing'] = true;
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
                $user->setPseudo($pseudo);
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
                $regularUser->setTelephone($phone);
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
                $userLang = isset($_COOKIE['lng']) ? htmlspecialchars(strip_tags(trim($_COOKIE['lng']))) : 'fr';

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
            },
            'linkTeacherToGroup' => function() {

                 // return error if the request is not a POST request
                 // probably unnecessary while we already check it in the routing
                if($_SERVER['REQUEST_METHOD'] !== 'POST') return ["error"=> "Method not Allowed"];

                // bind incoming data to the value provided or null
                $user_id = isset($_POST['user_id']) ? htmlspecialchars(strip_tags(trim($_POST['user_id']))) : null;
                $group_id = isset($_POST['group_id']) ? htmlspecialchars(strip_tags(trim($_POST['group_id']))) : null;

                $group = $this->entityManager->getRepository(Groups::class)->findOneBy(['id' => $group_id]);
                $userR = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
                $user =  $this->entityManager->getRepository(User::class)->findOneBy(['id' => $user_id]);
                $userMail = $userR->getEmail();
                $groupName = $group->getName();


                $admins = $this->entityManager->getRepository(UsersLinkGroups::class)->findBy(['group' => $group_id, 'rights' => 1]);
                $adminMail = [];
                foreach($admins as $value) { 
                    $admin = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $value->getUser()]);
                    $adminMail[] = $admin->getEmail();
                }
                
                if ($userR && $group) {
                    $alreadyLinked = $this->entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $user_id, 'group' => $group_id]);
                    if ($alreadyLinked) {
                        return ['message' => 'alreadylinked'];
                    } else {
                        $UserLinkGroup = new UsersLinkGroups();
                        $UserLinkGroup->setGroup($group);
                        $UserLinkGroup->setUser($user);
                        $UserLinkGroup->setRights(0);
                        $this->entityManager->persist($UserLinkGroup);
                        $this->entityManager->flush();

                        // if there is admin in the group, we send a notification 
                        if ($admins) {
                            $userLang = isset($_COOKIE['lng']) ? htmlspecialchars(strip_tags(trim($_COOKIE['lng']))) : 'fr';
                            // create the confirmation account link and set the email template to be used      
                            $emailTtemplateBody = $userLang."_confirm_account";

                            if(is_dir(__DIR__."/../../../../../openClassroom")){
                                i18next::init($userLang,__DIR__."/../../../../../openClassroom/classroom/assets/lang/__lng__/ns.json");
                            }else {
                                i18next::init($userLang,__DIR__."/../../../../../classroom/assets/lang/__lng__/ns.json");
                            }

                            $emailSubject = i18next::getTranslation('superadmin.group.join.mail.emailSubject');
                            $textBeforeName = i18next::getTranslation('superadmin.group.join.mail.textBeforeName');
                            $textAfterName = i18next::getTranslation('superadmin.group.join.mail.textAfterName');
                            $body = "
                                <br>
                                <br>
                                <p>$textBeforeName $userMail $textAfterName $groupName.
                            ";
                            foreach($adminMail as $value) { 
                                $emailSent = Mailer::sendMail($value, $emailSubject, $body, strip_tags($body), $emailTtemplateBody, "remi.cointe@vittascience.com", "Rémi"); 
                            }
                        }
                        return ['message' => 'success'];
                    }
                } else {
                    return ['message' => 'noteacher'];
                }
            },
            'send_request_reset_user_password' => function($data) {
                if (isset($data['user_id']) && $data['user_id'] != null) {
                    $user_id = $data['user_id'];

                    // Check if the requester is related to the user and if the user is not an admin
                    $Authorization = $this->getAuthorization($this->entityManager, $user_id);
                    if ($Authorization['message'] == "not_allowed")
                        return ['message' => 'not_allowed'];

                    $user = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
                    // create token for this user
                    $token = bin2hex(random_bytes(16));
                    $user->setRecoveryToken($token);
                    $mail = $user->getEmail();
                    $this->entityManager->persist($user);
                    

                    /////////////////////////////////////
                    // PREPARE EMAIL TO BE SENT
                    // received lang param
                    $userLang = isset($_COOKIE['lng']) ? htmlspecialchars(strip_tags(trim($_COOKIE['lng']))) : 'fr';

                    // create the confirmation account link and set the email template to be used      
                    $accountConfirmationLink = $_ENV['VS_HOST']."/classroom/change_password.php?mail=$mail&token=$token";
                    
                    $emailTtemplateBody = $userLang."_reset_password";

                    // init i18next instance
                    if(is_dir(__DIR__."/../../../../../openClassroom")){
                        i18next::init($userLang,__DIR__."/../../../../../openClassroom/classroom/assets/lang/__lng__/ns.json");
                    }else {
                        i18next::init($userLang,__DIR__."/../../../../../classroom/assets/lang/__lng__/ns.json");
                    }

                    $emailSubject = i18next::getTranslation('superadmin.users.mail.resetPassword.subject');
                    $bodyTitle = i18next::getTranslation('superadmin.users.mail.resetPassword.bodyTitle');
                    $textBeforeLink = i18next::getTranslation('superadmin.users.mail.resetPassword.textBeforeLink');
                    $body = "
                        <a href='$accountConfirmationLink' style='text-decoration: none;padding: 10px;background: #27b88e;color: white;margin: 1rem auto;width: 50%;display: block;'>
                            $bodyTitle
                        </a>
                        <br>
                        <br>
                        <p>$textBeforeLink $accountConfirmationLink
                    ";

                    // send email
                    $emailSent = Mailer::sendMail($mail,  $emailSubject, $body, strip_tags($body),$emailTtemplateBody);

                    if ($emailSent) {
                        $this->entityManager->flush();
                    }
                    /////////////////////////////////////
                    return ['mail' => $mail, 'token' => $token, 'isSent' => $emailSent, 'link' => $accountConfirmationLink];
                    // send him a link to create a new password
                } else {
                    return ['response' => 'missing data'];
                }
            },
            'get_user_info_with_his_groups' => function($data) {
                if (isset($data['id']) && $data['id'] != null) 
                {
                    $user_id = (int)$data['id'];
                    $Authorization = $this->getAuthorization($this->entityManager, $user_id);
                    if ($Authorization['message'] == "not_allowed")
                        return ['message' => 'not_allowed'];
                    else
                        return $this->entityManager->getRepository(UsersLinkGroups::class)->getUsersWithHisGroupsGA($user_id);
                }
            },
            'disable_user' => function($data) {
                if (isset($data['user_id']) && $data['user_id'] != null) {
                    $user_id = $data['user_id'];

                    // Check if the requester is related to the user and if the user is not an admin
                    $Authorization = $this->getAuthorization($this->entityManager, $user_id);
                    if ($Authorization['message'] == "not_allowed")
                        return ['message' => 'not_allowed'];

                    $userR = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
                    if ($userR) {
                        $userR->setActive(0);
                        $this->entityManager->persist($userR);
                    }
                    $this->entityManager->flush();
                    return ['response' => 'success'];
                } else {
                    return ['response' => 'missing data'];
                }
            },
            'update_user' => function($data) {
                if (isset($data['user_id']) && $data['user_id'] != null && 
                    isset($data['firstname']) && $data['firstname'] != null && 
                    isset($data['surname']) && $data['surname'] != null && 
                    isset($data['pseudo']) && $data['pseudo'] != null && 
                    isset($data['groups']) && $data['groups'] != null &&
                    isset($data['phone']) &&
                    isset($data['mail']) && $data['mail'] != null &&
                    isset($data['bio']) &&
                    isset($data['grade']) &&
                    isset($data['subject']))
                {
                    $user_id = $data['user_id'];
                    $groups =  json_decode($data['groups']);
                    $surname = $data['surname'];
                    $firstname = $data['firstname'];
                    $pseudo = $data['pseudo'];

                    $phone = $data['phone'];
                    $bio = strval($data['bio']);
                    $mail = $data['mail'];
                    
                    $school = $data['school'];
                    $grade = (int)$data['grade'];
                    $subject = (int)$data['subject'];

                    // Check if the requester is related to the user and if the user is not an admin
                    $Authorization = $this->getAuthorization($this->entityManager, $user_id);
                    if ($Authorization['message'] == "not_allowed")
                        return ['message' => 'not_allowed'];

                    $user = $this->entityManager->getRepository(User::class)->findOneBy(['id' => $user_id]);
                    $user->setFirstname($firstname);
                    $user->setSurname($surname);
                    $user->setPseudo($pseudo);
                    $this->entityManager->persist($user);

                    $regular = $this->entityManager->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
                    if($regular) {
                        $regular->setEmail($mail);
                        $regular->setBio($bio);
                        $regular->setTelephone($phone);
                        $this->entityManager->persist($regular);
                    } else if (!$regular) {
                        $regular = new Regular($user, $mail, $bio, $phone, false);
                        $this->entityManager->persist($regular);
                    }

                    // Si l'utilisateur est déjà référencé en tant que Teacher
                    $teacher = $this->entityManager->getRepository(Teacher::class)->findOneBy(['user' => $user_id]);
                    // Si l'utilisateur existe dans la bade de données en tant que teacher et que l'update le determine aussi en teacher alors on modifie les champs selon la requête
                    $teacher->setSubject($subject);
                    $teacher->setSchool($school);
                    $teacher->setGrade($grade);
                    $this->entityManager->persist($teacher);     

                    // Obtient la totalité des groupes de l'utilisateur
                    $AllGroupsFromUser = $this->entityManager->getRepository(UsersLinkGroups::class)->findBy(['user' => $user_id]);
                    foreach ($groups as $key => $value) {
                        if ($value[1] != -1) {
                            $group = $this->entityManager->getRepository(Groups::class)->findOneBy(['id' => $value[1]]);
                            $AlreadyLinked = $this->entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $user_id, 'group' => $value[1]]);
                            $rights = $value[0] == true ? 1 : 0;
                            if (!$AlreadyLinked && $group) {
                                $UsersLinkGroups = new UsersLinkGroups();
                                $UsersLinkGroups->setGroup($group);
                                $UsersLinkGroups->setUser($user);
                                $UsersLinkGroups->setRights($rights);
                                $this->entityManager->persist($UsersLinkGroups);
                            } else if ($group) {
                                $AlreadyLinked->setRights($rights);
                                $this->entityManager->persist($AlreadyLinked);
                            }
                        }
                        foreach ($AllGroupsFromUser as $key1 => $value1) {
                            if ($value1->getGroup() == $value[1]) {
                                unset($AllGroupsFromUser[$key1]);
                            }
                        }
                    }
                    // Retire les groupes qui ne lui sont plus attribués
                    foreach ($AllGroupsFromUser as $key2 => $value2) {
                        $AlreadyLinked = $this->entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $user_id, 'group' => $value2->getGroup()]);
                        if ($AlreadyLinked) {
                            $this->entityManager->remove($AlreadyLinked);
                        }
                    }
                    $this->entityManager->flush();
                    return ['response' => 'User updated with success!'];
                } else {
                    return ['response' => 'missing data'];
                }
            },
            'global_search_user_by_name' => function($data) {
                if (isset($data['name']) && $data['name'] != null &&
                isset($data['userspp']) && $data['userspp'] != null &&
                isset($data['page']) && $data['page'] != null) {
                    $page = $data['page'];
                    $userspp = $data['userspp'];
                    $name = $data['name'];
                    $GroupsRequesterAdmin = $this->entityManager->getRepository(UsersLinkGroups::class)->findBy(['user' => $_SESSION['id'], 'rights' => 1]);

                    return $this->entityManager->getRepository(UsersLinkGroups::class)->globalSearchUserGA($name, $page, $userspp, $GroupsRequesterAdmin);
                } else {
                    return ['response' => 'missing data'];
                }
            },
        );

    } 

    /**
     * @var EntityManger $em
     * @var Int $user_id
     * @return Array 
     */
    protected function getAuthorization(EntityManager $em, Int $user_id) {
        $user = $em->getRepository(Regular::class)->findOneBy(['user' => $user_id]);
        $GroupsRequesterAdmin = $em->getRepository(UsersLinkGroups::class)->findBy(['user' => $_SESSION['id'], 'rights' => 1]);
        $GroupsOfUser = $em->getRepository(UsersLinkGroups::class)->findBy(['user' => $user_id]);

        $isRelated = false;
        foreach ($GroupsRequesterAdmin as $key => $value) {
            foreach ($GroupsOfUser as $key2 => $value2) {
                if ($value->getGroup() == $value2->getGroup()) {
                    $isRelated = true;
                }
            }
        }
        // Si le requester n'est pas lié par au moins un groupe à l'utilisateur ou si l'utilisateur est admin alors nous retournons une erreur
        if (!$isRelated || $user->getIsAdmin()) {
            return ['message' => 'not_allowed', 'isRelated' => $isRelated];
        } else {
            return ['message' => 'allowed'];
        }
    }
}