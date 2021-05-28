<?php

namespace models;

require_once(__DIR__ . '/../vendor/autoload.php');

class Student extends User implements \JsonSerializable
{

    private $id;
    private $firstname;
    private $surname;
    private $password;
    private $insertDate;
    private $updateDate;
    private $garNumber;

    const SURNAME_MIN_LENGTH = 2;
    const SURNAME_MAX_LENGTH = 50;
    const FIRSTNAME_MIN_LENGTH = 2;
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
        $garNumber
    ) {
        parent::__construct(
            $id,
            $firstname,
            $surname,
            $password,
            $pseudo,
            $insertDate,
            $updateDate,
        );
        $this->garNumber = $garNumber;
    }
    public function getGarNumber()
    {
        return $this->garNumber;
    }
    public function setGarNumber($garNumber)
    {
        $this->garNumber = $garNumber;
    }
    public function jsonSerialize()
    {
        $array = [
            "id" => $this->id,
            "firstname" => $this->firstname,
            "surname" => $this->surname
        ];

        return $array;
    }
    // vérification de la cohérence du numéro gar
    public static function checkGarNumber($name)
    {
    }
}
