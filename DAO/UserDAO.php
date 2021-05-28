<?php

namespace DAO;
/*
User is for basic information (firstname, surname, password... )
Regular is an addition for vittascience account owners, with email & all additional informations
Teacher is another addition for vittascience account owners who are also teachers
Student is exclusive from Regular & Teacher, its for classroom account who don't have access to main site features
*/

require_once(__DIR__ . "/../vendor/autoload.php");

use Database\DataBaseManager;
use DAO\TeacherDAO;
use models\User;
use models\Teacher;
use models\Regular;
use models\Student;

class UserDAO
{
    private static $sharedInstance;
    private function __construct()
    {
    }
    public static function getSharedInstance()
    {
        if (!isset(self::$sharedInstance)) {
            self::$sharedInstance = new UserDAO();
        }
        return self::$sharedInstance;
    }
    /* Récupérer un utilisateur à partir d'un ligne de la base de donnée, si celui-ci est un professeur, on instanciera
    alors un objet Teacher, sinon on instanciera un objet User.*/
    public function getUserFromRow($row)
    {
        if (empty($row["id"]))
            return false;
        $teacherInfo = TeacherDAO::getSharedInstance()->getTeacherInfo($row["id"]);
        $regularInfo = RegularDAO::getSharedInstance()->getRegularInfo($row["id"]);
        if (!empty($teacherInfo)) {
            $user = new Teacher(
                $row["id"],
                $row["firstname"],
                $row["surname"],
                $row["password"],
                $row["pseudo"],
                $row["insert_date"],
                $row["update_date"],
                $row["picture"],
                $regularInfo["email"],
                $regularInfo["bio"],
                $regularInfo["telephone"],
                $regularInfo["confirm_token"],
                $regularInfo["private_flag"],
                $regularInfo["contact_flag"],
                $regularInfo["newsletter"],
                $regularInfo["mail_messages"],
                $regularInfo["recovery_token"],
                $regularInfo["new_mail"],
                $regularInfo["is_active"],
                $teacherInfo["subject"],
                $teacherInfo["school"],
                $teacherInfo["grade"]
            );
        } else if (!empty($regularInfo)) {
            $user = new Regular(
                $row["id"],
                $row["firstname"],
                $row["surname"],
                $row["password"],
                $row["pseudo"],
                $row["insert_date"],
                $row["update_date"],
                $row["picture"],
                $regularInfo["email"],
                $regularInfo["bio"],
                $regularInfo["telephone"],
                $regularInfo["confirm_token"],
                $regularInfo["private_flag"],
                $regularInfo["contact_flag"],
                $regularInfo["newsletter"],
                $regularInfo["mail_messages"],
                $regularInfo["recovery_token"],
                $regularInfo["new_mail"],
                $regularInfo["is_active"]
            );
        } else {
            $user = new User(
                $row["id"],
                $row["firstname"],
                $row["surname"],
                $row["password"],
                $row["pseudo"],
                $row["insert_date"],
                $row["update_date"],
                $row["picture"]
            );
        }
        return $user;
    }
    // récupérer des objets User à partir de lignes de la base de données.
    public function getUsersFromRows($rows)
    {
        $experiments = [];
        foreach ($rows as $row) {
            $experiments[] = $this->getUserFromRow($row);
        }
        return $experiments;
    }
    // récupérer tous les utilisateurs sous la forme d'objets User/Teacher.
    public function getUsers()
    {
        $res = DatabaseManager::getSharedInstance()->getAll('SELECT * FROM users');
        return $this->getUsersFromRows($res);
    }
    // récupérer un utilisateur via son ID sous la forme d'un objet User/Teacher.
    public function getUser($id)
    {
        $res = DatabaseManager::getSharedInstance()->get('SELECT * FROM users WHERE id = ?', [$id]);
        if ($res == false)
            return false;
        return $this->getUserFromRow($res);
    }
    // ajouter un utilisateur en base de données.
    public function addUser($firstname, $surname, $password, $pseudo, $picture = null)
    {
        $res = DatabaseManager::getSharedInstance()
            ->exec(
                "INSERT INTO users
            (surname,
            firstname,
            password,
            pseudo,picture) VALUE (?,?,?,?,?)",
                [
                    $surname,
                    $firstname,
                    $password,
                    $pseudo, $picture
                ]
            );
        return $res;
    }

    public function updateUser($user)
    {
        if (!$user instanceof User)
            return false;
        return DatabaseManager::getSharedInstance()
            ->exec(
                "UPDATE users SET
              firstname = ?,
              surname = ?,
              password = ?
              WHERE id = ?",
                [
                    $user->getFirstname(),
                    $user->getSurname(),
                    $user->getPassword(),
                    $user->getId()
                ]
            );
    }
    public function updatePassword($id, $password)
    {
        return DatabaseManager::getSharedInstance()
            ->exec(
                "UPDATE users SET
              password = ?
              WHERE id = ?",
                [
                    $password,
                    $id
                ]
            );
    }
    public function getMultipleUsers($array)
    {
        return (DatabaseManager::getSharedInstance()->getAll("SELECT * FROM users WHERE id IN(" . implode(', ', $array) . ")", []));
    }
    public function getAPIKey($id)
    {
        return DatabaseManager::getSharedInstance()
            ->get("SELECT * FROM api_keys WHERE userRef = ?", [$id]);
    }
}
