<?php

namespace models;

require_once(__DIR__ . '/../vendor/autoload.php');

use DAO\TeacherDAO;

class Teacher extends Regular implements \JsonSerializable
{

    private $subject;
    private $school;
    private $grade;

    const MAX_CLASS_NAME_SIZE = 30;
    const MIN_CLASS_NAME_SIZE = 2;
    const TEACHER_SCHOOL_MIN_LENGTH = 10;
    const TEACHER_SCHOOL_MAX_LENGTH = 150;
    const TEACHER_SUBJECT_MIN_LENGTH = 3;
    const TEACHER_SUBJECT_MAX_LENGTH = 100;

    public function __construct(
        $id,
        $firstname,
        $surname,
        $password,
        $pseudo,
        $insertDate,
        $updateDate,
        $picture,
        $email,
        $bio,
        $telephone,
        $confirmToken,
        $privateFlag,
        $contactFlag,
        $newsletter,
        $mailMessages,
        $recoveryToken,
        $newMail,
        $isActive,
        $subject,
        $school,
        $grade
    ) {
        parent::__construct(
            $id,
            $firstname,
            $surname,
            $password,
            $pseudo,
            $insertDate,
            $updateDate,
            $picture,
            $email,
            $bio,
            $telephone,
            $confirmToken,
            $privateFlag,
            $contactFlag,
            $newsletter,
            $mailMessages,
            $recoveryToken,
            $newMail,
            $isActive
        );
        $this->subject = $subject;
        $this->school = $school;
        $this->grade = $grade;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    public function getStringSubject()
    {
        $subjects = TeacherDAO::getSharedInstance()->getSubjectsFromTeacherGrade($this->grade);
        $subjectString = $subjects[$this->subject];
        return $subjectString;
    }

    public function getSchool()
    {
        return $this->school;
    }

    public function setSchool($school)
    {
        $this->school = $school;
    }

    public function getGrade()
    {
        return $this->grade;
    }

    public function setGrade($grade)
    {
        $this->grade = $grade;
    }

    public function getStringGrade()
    {
        $grades = TeacherDAO::getSharedInstance()->getMainGrades();
        $gradeString = $grades[$this->grade];
        return $gradeString;
    }

    public function jsonSerialize()
    {
        $json = parent::jsonSerialize();
        $json["teacherData"] = get_object_vars($this);
        if ($this->getPrivateFlag()) {
            $json["teacherData"]["subject"] = false;
        }
        return $json;
    }

    // vérification de la cohérence du nom de l'établissement.
    public static function checkSchool($school)
    {
        if (strlen($school) < self::TEACHER_SCHOOL_MIN_LENGTH || strlen($school) > self::TEACHER_SCHOOL_MAX_LENGTH)
            return false;
        return true;
    }

    // vérification de la cohérence de la matière enseignée.
    public static function checkSubject($grade, $subject)
    {
        switch ($grade) {
            case 1:
                $array = TeacherDAO::getSharedInstance()->getFirstGradeSubjects();
                break;
            case 2:
                $array = TeacherDAO::getSharedInstance()->getSecondGradeSubjects();
                break;
            case 3:
                $array = TeacherDAO::getSharedInstance()->getThirdGradeSubjects();
                break;
            case 4:
                $array = TeacherDAO::getSharedInstance()->getThirdGradeSubjectsBis();
                break;
            case 5:
                $array = TeacherDAO::getSharedInstance()->getFourthGradeSubjects();
                break;
            default:
                return false;
        }

        if (array_key_exists($subject, $array))
            return true;
        return false;
    }
    //vérification de la cohérence du niveau d'enseignement.
    public static function checkGrade($grade)
    {
        if (array_key_exists($grade, TeacherDAO::getSharedInstance()->getMainGrades()))
            return true;
        return false;
    }
}
