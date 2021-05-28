<?php

namespace models;

class Mail
{
    const MIN_NAME_SIZE = 3;
    const MAX_NAME_SIZE = 75;
    const MAX_MAIL_SIZE = 100;
    const MIN_MESSAGE_SIZE = 0;
    const MAX_MESSAGE_SIZE = 3000;
    const MIN_SUBJECT_SIZE = 5;
    const MAX_SUBJECT_SIZE = 80;

    public static function checkName($name)
    {
        if (strlen($name) >= self::MIN_NAME_SIZE && strlen($name) <= self::MAX_NAME_SIZE)
            return true;
        return false;
    }

    public static function checkMail($mail)
    {
        if (strlen($mail) <= self::MAX_MAIL_SIZE) {
            if (filter_var($mail, FILTER_VALIDATE_EMAIL))
                return true;
        }
        return false;
    }

    public static function checkMessage($message)
    {
        if (strlen($message) >= self::MIN_MESSAGE_SIZE && strlen($message) <= self::MAX_MESSAGE_SIZE)
            return true;
        return false;
    }

    public static function checkSubject($subject)
    {
        if (strlen($subject) >= self::MIN_SUBJECT_SIZE && strlen($subject) <= self::MAX_SUBJECT_SIZE)
            return true;
        return false;
    }
}
