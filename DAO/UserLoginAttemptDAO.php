<?php

namespace DAO;

use Database\DataBaseManager;
use Google\Service\SQLAdmin\Database;

class UserLoginAttemptDAO
{
    private static $sharedInstance;

    /**
     * instantiate a new instance if not already created
     *
     * @return  object 
     */
    public static function getSharedInstance()
    {
        if (!isset(self::$sharedInstance)) {
            self::$sharedInstance = new UserLoginAttemptDAO();
        }
        return self::$sharedInstance;
    }

    /**
     * get all rows from db
     *
     * @return  array  
     */
    public function getAll()
    {
        $res = DataBaseManager::getSharedInstance()
            ->getAll("SELECT * FROM users_login_attempts", []);

        return $res;
    }

    /**
     * insert a new row in users_login_attempts table
     *
     * @param   object  $params  
     *
     * @return  bool    
     */
    public function insert($params)
    {
        return DataBaseManager::getSharedInstance()
            ->exec(
                "INSERT INTO users_login_attempts
                    SET email = ?, 
                        registration_time = ?, can_not_login_before = ?
                ",
                [
                    $params->email,
                    $params->registrationTime,
                    $params->canNotLoginBefore
                ]
            );
    }

    /**
     * return the last login attempts along with the count of failed attempts
     *
     * @param   string  $email  
     *
     * @return  array   return one associative array of data
     */
    public function getLoginAttemptsDataByEmail($email)
    {
        return DataBaseManager::getSharedInstance()
            ->get(
                "
                    SELECT can_not_login_before,email,
                        (
                            SELECT COUNT(id) 
                            FROM users_login_attempts 
                            WHERE email = ?
                        ) AS count
                    FROM users_login_attempts
                    WHERE email = ?
                    ORDER BY id DESC
            ",
                [$email, $email]
            );
    }

    /**
     * delete all rows matching 1 email
     *
     * @param   string  $email  
     *
     * @return  bool
     */
    public function resetLoginAttemptsByEmail($email)
    {
        return DataBaseManager::getSharedInstance()
            ->exec("DELETE FROM users_login_attempts WHERE email = ?", [$email]);
    }
}
