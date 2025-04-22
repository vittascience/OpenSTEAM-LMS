<?php

namespace models;

require_once(__DIR__ . '/../vendor/autoload.php');

class User implements \JsonSerializable
{

    private $id;
    private $firstname;
    private $surname;
    private $password;
    private $pseudo;
    private $insertDate;
    private $updateDate;
    private $picture;

    const SURNAME_MIN_LENGTH = 1;
    const SURNAME_MAX_LENGTH = 50;
    const FIRSTNAME_MIN_LENGTH = 1;
    const FIRSTNAME_MAX_LENGTH = 50;
    const BIO_MIN_LENGTH = 1;
    const BIO_MAX_LENGTH = 800;
    const MIN_PHONE_LENGTH = 10;
    const MAX_PHONE_LENGTH = 30;

    const MAX_USER_PIC_SIZE = 10000000;

    public function __construct(
        $id,
        $firstname,
        $surname,
        $password,
        $pseudo,
        $insertDate,
        $updateDate,
        $picture
    ) {
        $this->id = $id;
        $this->firstname = $firstname;
        $this->surname = $surname;
        $this->password = $password;
        $this->pseudo = $pseudo;
        $this->insertDate = $insertDate;
        $this->updateDate = $updateDate;
        $this->picture = $picture;
    }
    public function getId()
    {
        return intval($this->id);
    }
    public function setId($id)
    {
        $this->id = $id;
    }
    public function getFirstname()
    {
        return $this->firstname;
    }
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
    }
    public function getSurname()
    {
        return $this->surname;
    }
    public function setSurname($surname)
    {
        $this->surname = $surname;
    }

    public function getPseudo()
    {
        return $this->pseudo;
    }
    public function setPseudo($pseudo)
    {
        $this->pseudo = $pseudo;
    }

    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }
    public function getInsertDate()
    {
        return $this->insertDate;
    }
    public function setInsertDate($insertDate)
    {
        $this->insertDate = $insertDate;
    }
    public function getUpdateDate()
    {
        return $this->updateDate;
    }
    public function setUpdateDate($updateDate)
    {
        $this->updateDate = $updateDate;
    }
    public function isTeacher()
    {
        if ($this instanceof Teacher)
            return true;
        return false;
    }
    public function isRegular()
    {
        if ($this instanceof Regular)
            return true;
        return false;
    }
    public function isStudent()
    {
        if ($this instanceof Student)
            return true;
        return false;
    }
    // lors de l'envoi JSON, on envoie le nom et prénom que si le private flag est à 0.
    public function jsonSerialize()
    {
        $array = [
            "id" => $this->id,
            "firstname" => $this->firstname,
            "surname" => $this->surname,
            "picture" => $this->picture,
            "picture_thumbnail" => $this->getThumbnailPicture()
        ];

        return $array;
    }
    // vérification de la cohérence du nom/prénom
    public static function checkName($name)
    {
        if (preg_match("#^[a-zA-ZÀ-ÖØ-öø-ÿ\-\'\s]{" . self::SURNAME_MIN_LENGTH . "," . self::SURNAME_MAX_LENGTH . "}$#", $name))
            return true;
        return false;
    }
    //vérification des contraintes de sécurité du mot de passe.
    public static function checkPassword($pwd)
    {
        $isValid = false;
        if (strlen($pwd) >= 8) {
            if (preg_match("#[a-z]+#", $pwd)) {
                if (preg_match("#[A-Z]+#", $pwd)) {
                    if (preg_match("#[0-9]+#", $pwd)) {
                        $isValid = true;
                    }
                }
            }
        }
        return $isValid;
    }
    //vérification de la cohérence de la biographie.
    public static function checkBio($bio)
    {
        if (strlen($bio) < self::BIO_MIN_LENGTH || strlen($bio) > self::BIO_MAX_LENGTH)
            return false;
        return true;
    }
    //vérification de la cohérence du téléphone.
    public static function checkPhone($phone)
    {
        if (strlen($phone) < self::MIN_PHONE_LENGTH || strlen($phone) > self::MAX_PHONE_LENGTH)
            return false;
        return true;
    }
    public function getPicture()
    {
        return $this->picture;
    }
    public function setPicture($picture)
    {
        $this->picture = $picture;
    }
    public function getThumbnailPicture()
    {
        if (!$this->picture)
            return false;
        $array = explode(".", $this->picture);
        $thumbnail = $array[0] . "_thumbnail.jpeg";
        return $thumbnail;
    }
    //vérification  de la photo.
    public static function checkPicture($picture)
    {
        if ($picture["error"] !== 0)
            return false;
        $info = $picture["type"];
        if (
            !preg_match("/image\/png/", $info)
            &&  !preg_match("/image\/jpeg/", $info)
            &&  !preg_match("/image\/jpg/", $info)
        )
            return false;
        if ($picture["size"] > self::MAX_USER_PIC_SIZE)
            return false;
        return true;
    }
}
