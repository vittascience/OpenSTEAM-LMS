<?php

namespace DAO;

use Database\DataBaseManager;
use models\Regular;
use DAO\UserDAO;
use Vittascience\ImageManager;

class RegularDAO
{

    private static $sharedInstance;

    private function __construct()
    {
    }

    public static function getSharedInstance()
    {
        if (!isset(self::$sharedInstance)) {
            self::$sharedInstance = new RegularDAO();
        }
        return self::$sharedInstance;
    }

    // Méthode pour récupérer toutes les informations d'un informations d'un professeur sous la forme d'un tableau associatif.
    // Cette méthode est déclenchée lors de l'instanciation d'un objet User dans DAO/UserDAO_".$lang.".php pour vérifier si il est
    // professeur et récupérer les données correspondantes.
    public function getRegularInfo($id)
    {
        $res = DatabaseManager::getSharedInstance()->get("SELECT * FROM user_regulars WHERE id = ?", [$id]);
        if (empty($res))
            return false;
        return $res;
    }
    // ajouter un utilisateur en base de données.
    public function addRegular($id, $mail, $bio, $newsletter, $private, $contact, $mailMessages, $confirmToken, $phone = null)
    {
        $res = DatabaseManager::getSharedInstance()
            ->exec(
                "INSERT INTO user_regulars
            (
                id,
            email,
            bio,
            telephone,
            confirm_token,
            private_flag,
            contact_flag,
            newsletter,
            mail_messages) VALUE (?,?,?,?,?,?,?,?,?)",
                [
                    $id,
                    $mail,
                    $bio,
                    $phone,
                    $confirmToken,
                    $private,
                    $contact,
                    $newsletter,
                    $mailMessages
                ]
            );
        return $res;
    }
    public function deletePicture($user)
    {
        if (!$user instanceof Regular)
            return false;
        if (!unlink(__DIR__ . "/../public/content/user_data/user_img/" . $user->getPicture()))
            return false;
        if (!unlink(__DIR__ . "/../public/content/user_data/user_img/" . $user->getThumbnailPicture()))
            return false;
        return true;
    }
    public function updateRegular($regular)
    {

        if (!$regular instanceof Regular)
            return false;
        return DatabaseManager::getSharedInstance()
            ->exec(
                "UPDATE user_regulars SET
                  email = ?,
                  bio = ?,
                  telephone = ?,
                  picture = ?,
                  private_flag = ?,
                  contact_flag = ?,
                  newsletter = ?,
                  mail_messages = ?,
                  is_active = ?
                  WHERE id = ?",
                [
                    $regular->getEmail(),
                    $regular->getBio(),
                    $regular->getTelephone(),
                    $regular->getPicture(),
                    $regular->getPrivateFlag(),
                    $regular->getContactFlag(),
                    $regular->getNewsletter(),
                    $regular->getMailMessages(),
                    $regular->getIsActive(),
                    $regular->getId()
                ]
            );
    }


    public function removeRegular($id)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("DELETE FROM user_regulars WHERE id = ?", [$id]);
    }

    public function getRegulars()
    {
        return DatabaseManager::getSharedInstance()
            ->getAll("SELECT * FROM user_regulars");
    }
    // activer un utilisateur après confirmation du mail.
    public function activateUser($token, $email)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET is_active = 1 WHERE confirm_token = ? AND email = ?", [$token, $email]);
    }
    // récupérer un utilisateur via son mail sous la forme d'un objet User/Teacher/Regular.
    public function getUserByMail($mail)
    {
        $reg = DatabaseManager::getSharedInstance()->get('SELECT * FROM user_regulars WHERE  email = ?', [$mail]);
        $res = DatabaseManager::getSharedInstance()->get('SELECT * FROM users WHERE id= ?', [$reg['id']]);
        if ($res == false)
            return false;
        return UserDAO::getSharedInstance()->getUserFromRow($res);
    }
    public function addAdmin($id)
    {
        $req = DatabaseManager::getSharedInstance()->exec("UPDATE user_regulars SET is_admin=1 WHERE id= ?", [$id]);
        return $req;
    }

    public function removeAdmin($id)
    {
        $req = DatabaseManager::getSharedInstance()->exec("UPDATE user_regulars SET is_admin=0 WHERE id= ?", [$id]);
        return $req;
    }
    // vérifier si un utilisateur possède un mail en base de données.
    public function mailExists($mail)
    {
        $mail = DatabaseManager::getSharedInstance()
            ->get('SELECT * FROM user_regulars WHERE  email = ?', [$mail]);
        if (empty($mail)) {
            return false;
        }
        return true;
    }
    public function deleteConfirmToken($token, $email)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET confirm_token = NULL, new_mail = NULL WHERE confirm_token = ? AND email = ? ", [$token, $email]);
    }

    public function processPicture($picture)
    {
        $extension = explode("/", $picture["type"])[1];
        $fileId = md5(uniqid());
        $fileName = $fileId . "." . $extension;
        $finalFileName = $fileId . ".jpeg";
        $finalThumbnailName = $fileId . "_thumbnail.jpeg";

        $imgManager = ImageManager::getSharedInstance();
        $finalPath = __DIR__ . "/../public/content/user_data/user_img/" . $finalFileName;
        $finalThumbnailPath = __DIR__ . "/../public/content/user_data/user_img/" . $finalThumbnailName;

        if (!$imgManager->resizeToDimension(
            100,
            $picture["tmp_name"],
            $extension,
            $finalPath
        )) {
            return false;
        }
        if (!$imgManager->makeThumbnail($finalPath, $finalThumbnailPath, 400)) {
            return false;
        }

        if (!unlink($picture["tmp_name"]))
            return false;

        return $finalFileName;
    }

    public function checkRecoveryToken($id, $token)
    {
        $res = DatabaseManager::getSharedInstance()
            ->get("SELECT * FROM user_regulars WHERE id = ? AND recovery_token = ?", [$id, $token]);
        if (!$res)
            return false;
        return true;
    }

    public function createRecoveryToken($id)
    {

        $token = bin2hex(random_bytes(32));

        if (!DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET recovery_token = ? WHERE id = ?", [$token, $id]))
            return false;
        return $token;
    }

    public function deleteToken($id)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET recovery_token = NULL WHERE id = ?", [$id]);
    }

    public function setMailRenewalToken($id, $mail)
    {
        try {
            $token = bin2hex(random_bytes(64));
        } catch (Exception $e) {
            return false;
        }
        if (!DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET confirm_token = ?, new_mail = ? WHERE id = ?", [$token, $mail, $id]))
            return false;
        return $token;
    }

    public function checkMailRenewalToken($token, $mail)
    {
        return UserDAO::getSharedInstance()->getUserFromRow(DatabaseManager::getSharedInstance()
            ->get("SELECT * FROM user_regulars WHERE confirm_token = ? AND new_mail = ?", [$token, $mail]));
    }

    public function setNewMail($mail, $id)
    {
        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_regulars SET email = ?, confirm_token = NULL , new_mail = NULL WHERE id = ?", [$mail, $id]);
    }

    public function setAPIKey($id, $renew, $apiKey)
    {
        if ($renew) {
            return DatabaseManager::getSharedInstance()
                ->exec("UPDATE api_keys SET APIKey = ? WHERE userRef = ?", [$apiKey, $id]);
        } else {
            return DatabaseManager::getSharedInstance()
                ->exec("INSERT INTO api_keys (userRef, APIKey) VALUE (?, ?)", [$id, $apiKey]);
        }
    }

    public function getAPIKey($id)
    {
        return DatabaseManager::getSharedInstance()
            ->get("SELECT * FROM api_keys WHERE userRef = ?", [$id]);
    }

    public function updateAPIData($userRef, $data, $projectId)
    {
        //check if first use so we need to create the row in the table
        if (!DatabaseManager::getSharedInstance()->get("SELECT * FROM api_data WHERE userRef = ?", [$userRef])) {
            return DatabaseManager::getSharedInstance()->exec("INSERT INTO api_data (userRef, data) VALUE (?, ?)", [$userRef, $data]);
        } else {
            //just update data
            return DatabaseManager::getSharedInstance()->exec("UPDATE api_data SET projectID =  ?, data = ?, lastupdate = NOW(), remove = ? WHERE userRef = ?", [$projectId, $data, 0, $userRef]);
        }
    }

    public function isAdmin($userRef)
    {
        if (!DatabaseManager::getSharedInstance()->get("SELECT * FROM user_regulars WHERE id = ? AND is_admin=1", [$userRef])) {
            return false;
        }
        return true;
    }

    public function isTester($userRef)
    {
        if (!DatabaseManager::getSharedInstance()->get("SELECT * FROM user_premium WHERE id_user = ? AND (date_end IS NULL OR date_end>NOW()) AND (date_begin IS NULL OR date_begin<NOW())", [$userRef])) {
            return false;
        }
        return true;
    }

    public function getPremium($userRef)
    {
        if (!DatabaseManager::getSharedInstance()->get("SELECT * FROM user_premium WHERE id_user = ?", [$userRef])) {
            return false;
        }

        return DatabaseManager::getSharedInstance()->get("SELECT * FROM user_premium WHERE id_user = ?", [$userRef]);
    }

    public function addPremium(
        $id,
        $dateBegin,
        $dateEnd
    ) {
        return DatabaseManager::getSharedInstance()
            ->exec("INSERT INTO user_premium 
            (id_user,
            date_begin,
            date_end) VALUES (?,?,?)", [$id, $dateBegin, $dateEnd]);
    }

    public function updatePremium(
        $id,
        $dateBegin,
        $dateEnd
    ) {
        return DatabaseManager::getSharedInstance()
            ->exec("UPDATE user_premium 
            SET
            date_begin = ?,
            date_end = ? WHERE id_user = ?", [
                $dateBegin,
                $dateEnd,
                $id
            ]);
    }
}
