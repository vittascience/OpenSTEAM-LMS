<?php

namespace Cmd;

require("../vendor/autoload.php");

class DbConfig extends CmdConfig
{
    private $SERVER_VIRTUAL_HOST;
    private $DB_HOST;
    private $DB_PORT;
    private $DB_NAME;
    private $DB_USER;
    private $DB_PASS;

    public function __construct($cmdMessage, $outputConfig)
    {
        parent::__construct($cmdMessage, $outputConfig);
    }

    public function usage()
    {
        echo " 
  Script to generate database configuration. 
  Will set environment variables VS_HOST, VS_DB_HOST, VS_DB_PORT, VS_DB_NAME, VS_DB_USER and VS_DB_PWD.
 
Usage : db.php [options] -h <hostname>
        db.php [options] -h <hostname> -p <port> 
  -v <virtual_host> server virtual host
  -h <host>         database host
  -p <port>         database connection port
  -n <name>         database name
  -u <user>         database user's username
  -pass <pass>      database user's password 
";
    }

    public function readArgs()
    {
        global $argv;
        while (!empty($argv)) {
            $arg = array_shift($argv);
            switch ($arg) {
                case '--help':
                    return false;
                case '-v':
                    $this->SERVER_VIRTUAL_HOST = array_shift($argv);
                    break;
                case '-h':
                    $this->DB_HOST = array_shift($argv);
                    break;
                case '-p':
                    $this->DB_PORT = array_shift($argv);
                    break;
                case '-n':
                    $this->DB_NAME = array_shift($argv);
                    break;
                case '-u':
                    $this->DB_USER = array_shift($argv);
                    break;
                case '-pass':
                    $this->DB_PASS = array_shift($argv);
                    break;
            }
        }
        return true;
    }

    /**
     * Reads database configuration from flags' values if set else terminal input.
     *
     * @return void
     */
    public function readConfig()
    {
        $db = [];
        if (empty($this->SERVER_VIRTUAL_HOST)) {
            $serverVirtualHost = readline("Enter server virtual host (default [https://vittascience.com]): ");
            $this->SERVER_VIRTUAL_HOST = ($serverVirtualHost === "") ? "https://vittascience.com" : $serverVirtualHost;
        }
        $db['server_virtual_host'] = $this->SERVER_VIRTUAL_HOST;
        $this->println("server vritual host: " . $this->SERVER_VIRTUAL_HOST, self::INFO);

        if (empty($this->DB_HOST)) {
            $dataBaseHost = readline("Enter database host (default [localhost]): ");
            $this->DB_HOST = ($dataBaseHost === "") ? "localhost" : $dataBaseHost;
        }
        $db['host'] = $this->DB_HOST;
        $this->println("database host: " . $this->DB_HOST, self::INFO);

        if (empty($this->DB_PORT)) {
            $dataBasePort = readline("Enter database port (default [3306]): ");
            $this->DB_PORT = ($dataBasePort === "") ? "3306" : $dataBasePort;
        }
        $db['port'] = $this->DB_PORT;
        $this->println("database port: " . $this->DB_PORT, self::INFO);

        if (empty($this->DB_NAME)) {
            $dataBaseName = readline("Enter database name (default [vittascience]): ");
            $this->DB_NAME = ($dataBaseName === "") ? "vittascience" : $dataBaseName;
        }
        $db['name'] = $this->DB_NAME;
        $this->println("database name: " . $this->DB_NAME, self::INFO);

        if (empty($this->DB_USER)) {
            $dataBaseUser = readline("Enter database user (default [root]): ");
            $this->DB_USER = ($dataBaseUser === "") ? "root" : $dataBaseUser;
        }
        $db['user'] = $this->DB_USER;
        $this->println("database user: " .  $this->DB_USER, self::INFO);
        if (empty($this->DB_PASS)) {
            $dataBaseUserPassword = readline("Password (default []): ");
            $this->DB_PASS = ($dataBaseUserPassword === "") ? "" : $dataBaseUserPassword;
        }
        $db['password'] = $this->DB_PASS;
        $this->println("database password: " .  $this->DB_PASS, self::INFO);

        $this->println(self::OUTPUT_OK, self::SUCCESS);
        $this->println($this->CMD_OUTPUT . json_encode($db), self::INFO);
    }

    public function run($supportFlags = true)
    {
        if ($supportFlags == true) {
            // If flag mode is activated read flag values first.
            if (!$this->readArgs()) {
                $this->usage();
                return true;
            }
        }
        $this->println($this->CMD_MESSAGE, self::INFO);
        $this->readConfig();
        return $this->setEnvVars(array(
            'VS_HOST' => $this->SERVER_VIRTUAL_HOST,
            'VS_DB_HOST' => $this->DB_HOST,
            'VS_DB_PORT' => $this->DB_PORT,
            'VS_DB_NAME' => $this->DB_NAME,
            'VS_DB_USER' => $this->DB_USER,
            'VS_DB_PWD' => $this->DB_PASS
        ));
    }
}
