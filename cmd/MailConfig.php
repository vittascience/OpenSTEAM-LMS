<?php

namespace Cmd;

require("../vendor/autoload.php");

class MailConfig extends CmdConfig
{
    private $MAIL_SERVER;
    private $MAIL_PORT;
    private $MAIL_TYPE;
    private $MAIL_ADDRESS;
    private $MAIL_PASSWORD;

    public function __construct($cmdMessage, $outputConfig)
    {
        parent::__construct($cmdMessage, $outputConfig);
    }

    public function usage()
    {
        echo " 
    Script to generate mail configuration. 
    Will set environment variables VS_MAIL_SERVER, VS_MAIL_PORT, VS_MAIL_TYPE, VS_MAIL_ADDRESS and VS_MAIL_PASSWORD.

Usage : mail.php [options] -s <server>
        mail.php [options] -a <address> -pass <password> 

    -s <server>     mail server
    -p <port>       mail port
    -t <type>       mail type 
    -a <address>    mail address
    -pass <pass>    mail address password
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
                case '-s':
                    $this->MAIL_SERVER = array_shift($argv);
                    break;
                case '-p':
                    $this->MAIL_PORT = array_shift($argv);
                    break;
                case '-t':
                    $this->MAIL_TYPE = array_shift($argv);
                    break;
                case '-a':
                    $this->MAIL_ADDRESS = array_shift($argv);
                    break;
                case '-pass':
                    $this->MAIL_PASSWORD = array_shift($argv);
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
        $mail = [];
        if (empty($this->MAIL_SERVER)) {
            $mailServer = readline("Enter mail server (default [smtp.gmail.com]): ");
            $this->MAIL_SERVER = ($mailServer === "") ? "smtp.gmail.com" : $mailServer;
        }
        $mail['server'] = $this->MAIL_SERVER;
        $this->println("mail server: " . $this->MAIL_SERVER, self::INFO);

        if (empty($this->MAIL_PORT)) {
            $mailPort = readline("Enter mail port (default [465]): ");
            $this->MAIL_PORT = ($mailPort === "") ? "465" : $mailPort;
        }
        $mail['port'] = $this->MAIL_PORT;
        $this->println("mail port: " . $this->MAIL_PORT, self::INFO);

        if (empty($this->MAIL_TYPE)) {
            $mailType = readline("Enter mail type (default [ssl]): ");
            $this->MAIL_TYPE = ($mailType === "") ? "ssl" : $mailType;
        }
        $mail['type'] = $this->MAIL_TYPE;
        $this->println("mail type: " . $this->MAIL_TYPE, self::INFO);

        if (empty($this->MAIL_ADDRESS)) {
            $mailAddress = readline("Enter mail address (default [support@vittascience.com]): ");
            $this->MAIL_ADDRESS = ($mailAddress === "") ? "support@vittascience.com" : $mailAddress;
        }
        $mail['address'] = $this->MAIL_ADDRESS;
        $this->println("mail address: " .  $this->MAIL_ADDRESS, self::INFO);

        if (empty($this->MAIL_PASSWORD)) {
            $mailPassword = readline("Password (default []): ");
            $this->MAIL_PASSWORD = ($mailPassword === "") ? "" : $mailPassword;
        }
        $mail['password'] = $this->MAIL_PASSWORD;
        $this->println("mail password: " .  $this->MAIL_PASSWORD, self::INFO);

        $this->println(self::OUTPUT_OK, self::SUCCESS);
        $this->println($this->CMD_OUTPUT . json_encode($mail), self::INFO);
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
            'VS_MAIL_SERVER' => $this->MAIL_SERVER,
            'VS_MAIL_PORT' => $this->MAIL_PORT,
            'VS_MAIL_TYPE' => $this->MAIL_TYPE,
            'VS_MAIL_ADDRESS' => $this->MAIL_ADDRESS,
            'VS_MAIL_PASSWORD' => $this->MAIL_PASSWORD
        ));
    }
}
