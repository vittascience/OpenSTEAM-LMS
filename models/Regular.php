<?php

namespace models;

require_once(__DIR__ . '/../vendor/autoload.php');

use DAO\RegularDAO;

class Regular extends User implements \JsonSerializable
{

    private $confirmToken;
    private $privateFlag;
    private $contactFlag;
    private $newsletter;
    private $mailMessages;
    private $recoveryToken;
    private $newMail;
    private $isActive;
    private $bio;
    private $telephone;
    private $from_sso;

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
        $from_sso = null
    ) {
        parent::__construct(
            $id,
            $firstname,
            $surname,
            $password,
            $pseudo,
            $insertDate,
            $updateDate,
            $picture
        );
        $this->confirmToken = $confirmToken;
        $this->email = $email;
        $this->bio = $bio;
        $this->telephone = $telephone;
        $this->password = $password;
        $this->privateFlag = $privateFlag;
        $this->contactFlag = $contactFlag;
        $this->newsletter = $newsletter;
        $this->mailMessages = $mailMessages;
        $this->recoveryToken = $recoveryToken;
        $this->newMail = $newMail;
        $this->isActive = $isActive;
        $this->from_sso = $from_sso;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public function setEmail($email)
    {
        $this->email = $email;
    }
    public function getBio()
    {
        return $this->bio;
    }
    public function setBio($bio)
    {
        $this->bio = $bio;
    }
    public function getTelephone()
    {
        return $this->telephone;
    }
    public function setTelephone($telephone)
    {
        $this->telephone = $telephone;
    }
    public function getPseudo()
    {
        return $this->pseudo;
    }
    public function setPseudo($pseudo)
    {
        $this->pseudo = $pseudo;
    }

    public function getConfirmToken()
    {
        return $this->confirmToken;
    }

    public function setConfirmToken($confirmToken)
    {
        $this->confirmToken = $confirmToken;
    }

    public function getPrivateFlag()
    {
        return intval($this->privateFlag);
    }

    public function setPrivateFlag($privateFlag)
    {
        $this->privateFlag = $privateFlag;
    }

    public function getContactFlag()
    {
        return intval($this->contactFlag);
    }

    public function setContactFlag($contactFlag)
    {
        $this->contactFlag = $contactFlag;
    }

    public function getNewsletter()
    {
        return intval($this->newsletter);
    }

    public function setNewsletter($newsletter)
    {
        $this->newsletter = $newsletter;
    }

    public function getMailMessages()
    {
        return intval($this->mailMessages);
    }

    public function setMailMessages($mailMessages)
    {
        $this->mailMessages = $mailMessages;
    }

    public function getRecoveryToken()
    {
        return $this->recoveryToken;
    }

    public function setRecoveryToken($recoveryToken)
    {
        $this->recoveryToken = $recoveryToken;
    }

    public function setNewMail($newMail)
    {
        $this->newMail = $newMail;
    }

    public function setActive($active)
    {
        $this->isActive = $active;
    }

    public function getNewMail()
    {
        return $this->newMail;
    }

    public function getIsActive()
    {
        return $this->isActive;
    }

    // est ce que l'utilisateur est un professeur ?
    public function isTeacher()
    {
        if ($this instanceof Teacher)
            return true;
        return false;
    }

    public function isFromSSO()
    {
        return $this->from_sso;
    }

    public function setFromSSO($from_sso)
    {
        $this->from_sso = $from_sso;
    }

    public function jsonSerialize()
    {
        if ($this->getPrivateFlag() === 0) {
            $array = [
                "id" => $this->id,
                "firstname" => $this->firstname,
                "surname" => $this->surname,
                "bio" => $this->bio,
                "picture" => $this->picture,
                "picture_thumbnail" => $this->getThumbnailPicture(),
                "from_sso" => $this->from_sso,
            ];
        } else {
            $array = [
                "id" => $this->id,
                "firstname" => $this->pseudo,
                "surname" => null,
                "bio" => $this->bio,
                "picture" => $this->picture,
                "picture_thumbnail" => $this->getThumbnailPicture(),
                "from_sso" => $this->from_sso,
            ];
        }
        return $array;
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
}
