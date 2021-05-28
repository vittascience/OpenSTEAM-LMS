<?php

namespace Cmd;

require("../vendor/autoload.php");

class GlobalConfig extends CmdConfig
{
    private const TERMINATED_MESSAGE = "TERMINATED";
    public function __construct($cmdMessage, $outputConfig)
    {
        parent::__construct($cmdMessage, $outputConfig);
    }

    public function run($supportFlag = true)
    {
        $this->println($this->CMD_MESSAGE, self::INFO);
        $dbConf = new DbConfig("Setting up database configuration", "Database configuration:\n");
        if ($dbConf->run(false) == false) {
            $this->println(self::TERMINATED_MESSAGE, self::ERROR);
            return false;
        }
        $googleApiKeysConfig = new GoogleApiKeysConfig("Setting up google api keys configuration", "Google api keys configuration:\n");
        if ($googleApiKeysConfig->run(false) == false) {
            $this->println(self::TERMINATED_MESSAGE, self::ERROR);
            return false;
        }
        $mailConfig = new MailConfig("Setting up mail configuration", "Mail configuration:\n");
        if ($mailConfig->run(false) == false) {
            $this->println(self::TERMINATED_MESSAGE, self::ERROR);
            return false;
        }
        return true;
    }
}
