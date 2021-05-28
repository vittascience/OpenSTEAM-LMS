<?php

namespace DAO;

use Database\DataBaseManager;
use models\Teacher;

class TeacherDAO
{

    private static $sharedInstance;

    private $firstGrades;
    private $secondGrades;
    private $thirdGrades;
    private $fourthGrades;

    private $allGrades;
    private $mainGrades;

    private $firstGradeSubjects;
    private $secondGradeSubjects;
    private $thirdGradeSubjects;
    private $thirdGradeSubjectsBis;
    private $fourthGradeSubjects;

    private function __construct()
    {
        $lang = 'fr';
        $this->firstGrades = require(__DIR__ . "/../resources/firstGrades_" . $lang . ".php");
        $this->secondGrades = require(__DIR__ . "/../resources/secondGrades_" . $lang . ".php");
        $this->thirdGrades = require(__DIR__ . "/../resources/thirdGrades_" . $lang . ".php");
        $this->fourthGrades = require(__DIR__ . "/../resources/fourthGrades_" . $lang . ".php");

        $this->allGrades = require(__DIR__ . "/../resources/allGrades_" . $lang . ".php");
        $this->mainGrades = require(__DIR__ . "/../resources/mainGrades_" . $lang . ".php");

        $this->firstGradeSubjects = require(__DIR__ . "/../resources/firstGradeSubjects_" . $lang . ".php");
        $this->secondGradeSubjects = require(__DIR__ . "/../resources/secondGradeSubjects_" . $lang . ".php");
        $this->thirdGradeSubjects = require(__DIR__ . "/../resources/thirdGradeSubjects_" . $lang . ".php");
        $this->thirdGradeSubjectsBis = require(__DIR__ . "/../resources/thirdGradeSubjectsBis_" . $lang . ".php");
        $this->fourthGradeSubjects = require(__DIR__ . "/../resources/fourthGradeSubjects_" . $lang . ".php");
    }

    public static function getSharedInstance()
    {
        if (!isset(self::$sharedInstance)) {
            self::$sharedInstance = new TeacherDAO();
        }
        return self::$sharedInstance;
    }

    public function getFirstGrades()
    {
        return $this->firstGrades;
    }

    public function getSecondGrades()
    {
        return $this->secondGrades;
    }

    public function getThirdGrades()
    {
        return $this->thirdGrades;
    }

    public function getFourthGrades()
    {
        return $this->fourthGrades;
    }

    public function getAllGrades()
    {
        return $this->allGrades;
    }

    public function getMainGrades()
    {
        return $this->mainGrades;
    }

    public function getFirstGradeSubjects()
    {
        return $this->firstGradeSubjects;
    }

    public function getSecondGradeSubjects()
    {
        return $this->secondGradeSubjects;
    }

    public function getThirdGradeSubjects()
    {
        return $this->thirdGradeSubjects;
    }

    public function getThirdGradeSubjectsBis()
    {
        return $this->thirdGradeSubjectsBis;
    }

    public function getFourthGradeSubjects()
    {
        return $this->fourthGradeSubjects;
    }

    // Méthode pour récupérer toutes les informations d'un informations d'un professeur sous la forme d'un tableau associatif.
    // Cette méthode est déclenchée lors de l'instanciation d'un objet User dans DAO/UserDAO_".$lang.".php pour vérifier si il est
    // professeur et récupérer les données correspondantes.
    public function getTeacherInfo($id)
    {
        $res = DatabaseManager::getSharedInstance()->get("SELECT * FROM user_teachers WHERE id = ?", [$id]);
        if (empty($res))
            return false;
        return $res;
    }
    // Méthode pour ajouter un professeur en base de données.
    public function addTeacher($userRef, $school, $subject, $grade)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("INSERT INTO user_teachers 
            (id,
            school,
            subject,
            grade) VALUES (?,?,?,?)", [$userRef, $school, $subject, $grade]);
    }

    public function updateTeacher($teacher)
    {
        if (!$teacher instanceof Teacher)
            return false;

        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_teachers 
            SET
            school = ?,
            subject = ?,
            grade = ? WHERE id = ?", [
                $teacher->getSchool(),
                $teacher->getSubject(),
                $teacher->getGrade(),
                $teacher->getId()
            ]);
    }

    public function getGradesFromTeacherGrade($teacherGrade)
    {
        switch ($teacherGrade) {
            case 1:
                return $this->getFirstGrades();
                break;
            case 2:
                return $this->getSecondGrades();
                break;
            case 3:
                return $this->getThirdGrades();
                break;
            case 4:
                return $this->getFourthGrades();
                break;
            default:
                return false;
                break;
        }
    }
    public function getSubjectsFromTeacherGrade($teacherGrade)
    {
        switch ($teacherGrade) {
            case 1:
                return $this->getFirstGradeSubjects();
                break;
            case 2:
                return $this->getSecondGradeSubjects();
                break;
            case 3:
                return $this->getThirdGradeSubjects();
                break;
            case 4:
                return $this->getThirdGradeSubjectsBis();
                break;
            case 5:
                return $this->getFourthGradeSubjects();
                break;
            default:
                return false;
                break;
        }
    }

    public function removeTeacher($id)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("DELETE FROM user_teachers WHERE id = ?", [$id]);
    }

    public function getTeachers()
    {
        return DatabaseManager::getSharedInstance()
            ->getAll("SELECT * FROM user_teachers");
    }
}
