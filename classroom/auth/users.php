<?php

use User\Entity\Regular;
use Aiken\i18next\i18next;
use User\Entity\User;
use Database\DataBaseManager; 

function formatUserData($userData, $sso)
{
    switch ($sso) {
        case 'google':
            return [
                'email' => $userData['email'],
                'given_name' => $userData['given_name'],
                'family_name' => $userData['family_name'],
                'name' => $userData['name'],
                'picture' => $userData['picture'],
            ];
        case 'microsoft':
            return [
                'email' => $userData['mail'] ?? null,
                'given_name' => $userData['givenName'] ?? null,
                'family_name' => $userData['surname'] ?? null,
                'name' => $userData['displayName'] ?? null,
                'picture' => null,
            ];
        case 'apple':
            return [
                'email' => $userData['email'] ?? null,
                'given_name' => $userData['name']['firstName'] ?? null,
                'family_name' => $userData['name']['lastName'] ?? null,
                'name' => ($userData['name']['firstName'] ?? '') . ' ' . ($userData['name']['lastName'] ?? null),
                'picture' => null,
            ];
        default:
            return null;
    }
}


function createUserFromSSO($userData, $entityManager)
{
    $anonymousTranslation = i18next::getTranslation("sso.words.anonymous");
    $userTranslation = i18next::getTranslation("sso.words.user");
    //$userData = applyEncodeOfIncomingData($userData);

    $user = new User();
    $substituteIcon = getRandomIcon();
    $user->setFirstname(!empty($userData['given_name']) ? $userData['given_name'] : $userTranslation);
    $user->setSurname(!empty($userData['family_name']) ? $userData['family_name'] : $anonymousTranslation);
    $user->setPseudo(!empty($userData['name']) ? $userData['name'] : $anonymousTranslation . " " . $userTranslation);
    $user->setPicture(!empty($userData['picture']) ? $userData['picture'] : $substituteIcon);
    $randomPassword = bin2hex(random_bytes(10));
    $passwordHash = password_hash($randomPassword, PASSWORD_BCRYPT);
    $user->setPassword($passwordHash);
    $entityManager->persist($user);
    $entityManager->flush();

    return $user;
}

function createRegularFromSSO($legacyUser, $userData, $entityManager, $sso = null)
{
    $confirmationToken = bin2hex(random_bytes(16));
    $userRegular = new Regular($legacyUser, $userData['email'], null, null, false, false, null, null, true, false, false, false, $confirmationToken);
    $userRegular->setUser($legacyUser);
    $userRegular->setEmail($userData['email']);
    $userRegular->setFromSso($sso);
    $entityManager->persist($userRegular);
    $entityManager->flush();

    return [
        'isUserAdded' => true,
        "userRegular" => $userRegular,
    ];
}

function createToken($id)
{
    try {
        $successDeletion = DataBaseManager::getSharedInstance()->exec("DELETE FROM connection_tokens WHERE user_ref = ?", [$id]);
        if (!$successDeletion) {
            return false;
        }

        $token = bin2hex(random_bytes(32));
        $res = DataBaseManager::getSharedInstance()->exec("INSERT INTO connection_tokens (token,user_ref) VALUES (?, ?)", [$token, $id]);
        if ($res) {
            return $token;
        }
    } catch (\Exception $e) {
        return false;
    }

    return false;
}


function manageUserFromSSO($entityManager, $formatedUserData, $actualUrl, $sso)
{
    $userExist = $entityManager->getRepository(Regular::class)->findOneBy(['email' => $formatedUserData['email']]);
    if (!$userExist) {
        try {
            $acceptedSSO = ['google', 'microsoft', 'apple'];
            if (!in_array($sso, $acceptedSSO)) {
                echo i18next::getTranslation("sso.messages.unknownSSO");
                redirectTo($actualUrl);
                exit;
            }
            $legacyUser = createUserFromSSO($formatedUserData, $entityManager);
            $userRegular = createRegularFromSSO($legacyUser, $formatedUserData, $entityManager, $sso);
            // the user will choose if he wants to receive the newsletter or not after the first connection
            $_SESSION["id"] = $legacyUser->getId();
            $_SESSION["token"] = createToken($legacyUser->getId());
            echo i18next::getTranslation("sso.messages.success");
            redirectTo($actualUrl, true);
            exit;
        } catch (Exception $e) {
            manageErrorReportToSupport($e->getMessage(), $formatedUserData['email']);
            echo i18next::getTranslation("sso.messages.success") . "code 9";
            redirectTo($actualUrl);
            exit;
        }
    } else {
        if ($userExist->isFromSSO() != $sso) {
            echo i18next::getTranslation("sso.messages.accountWithEmailAlreadyExists");
            redirectTo($actualUrl);
            exit;
        }
        $userRegular = $userExist;
        $_SESSION["id"] = $userRegular->getUser()->getId();
        $_SESSION["token"] = createToken($userRegular->getUser()->getId());
        echo i18next::getTranslation("sso.messages.success");
        redirectTo($actualUrl);
        exit;
    }
}


function redirectTo($actualUrl, $firstConnect = false) {
    $welcomeParam = $firstConnect ? (strpos($actualUrl, '?') !== false ? '&welcome=1' : '?welcome=1') : '';
    if (!empty($_SESSION['backurl'])) {
        header("refresh:3;url=$actualUrl" . $_SESSION['backurl'] . $welcomeParam);
    } else {
        header("refresh:3;url=$actualUrl/" . $welcomeParam);
    }
}

function applyEncodeOfIncomingData($dataArray)
{   
    $valueToCheck = ['given_name', 'family_name', 'name'];

    foreach ($dataArray as $key => $value) {
        if (is_array($value)) {
            $dataArray[$key] = applyEncodeOfIncomingData($value);
        } else {
            if (in_array($key, $valueToCheck)) {
                $dataArray[$key] = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
            }
        }
    }

    return $dataArray;
}
