<?php

use Doctrine\ORM\ORMSetup;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;
use Dotenv\Dotenv;

require_once "vendor/autoload.php";

// Doctrine ORM configuration, mapping read from PHP attributes
$isDevMode = true;
$proxyDir = null;
$cache = null;
// Array of all namespaces containing entities.
$config = ORMSetup::createAttributeMetadataConfiguration(
    array(
        __DIR__ . "/vendor/vittascience/vtuser/src/Entity",
        __DIR__ . "/vendor/vittascience/vtclassroom/src/Entity",
        __DIR__ . "/vendor/vittascience/vtinterfaces/src/Entity",
        __DIR__ . "/vendor/vittascience/vtlearn/Entity",
    ),
    $isDevMode,
    $proxyDir,
    $cache
);

// Load env variables 
/* $dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load(); */

$dataLines = file(__DIR__.'/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach($dataLines as $line){
    if(strpos(trim($line),'#') === 0) continue;
    list($key,$value) = explode('=',$line,2);
    $_ENV[trim($key)] = trim($value);
}

// Database configuration parameters
$connectionParams = array(
    'dbname' =>  $_ENV['VS_DB_NAME'],
    'user' => $_ENV['VS_DB_USER'],
    'port' => $_ENV['VS_DB_PORT'],
    'password' => $_ENV['VS_DB_PWD'],
    'host' => $_ENV['VS_DB_HOST'],
    'driver' => 'pdo_mysql',
    'charset' => 'utf8',
);

$conn = DriverManager::getConnection($connectionParams);
// obtaining the entity manager
$entityManager = new EntityManager($conn, $config);
