<?php

namespace Cmd;

require("../vendor/autoload.php");

class RunConfig extends Cmd
{
    private $allFlag = false;
    private $databaseFlag = false;
    private $mailFlag = false;
    private $googleApiFlag = false;

    public function __construct($cmdMessage, $outputConfig)
    {
        parent::__construct($cmdMessage, $outputConfig);
    }

    public function usage()
    {
        echo " 
  Script to run different configurations. 
  Will set environment variables for called configuration.
  If called with -all will launch all configurations.
 
Usage : RunConfig.php [options] -all
        RunConfig.php [options] -database
  -all          launches all configurations
  -database     launches database's configuration
  -mail         launches mail's configuration.
  -googleapi    launches googleApi's configuration.
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
                case '-all':
                    $this->allFlag = true;
                    return true;
                case '-database':
                    $this->databaseFlag = true;
                    return true;
                case '-mail':
                    $this->mailFlag = true;
                    return true;
                case '-googleapi':
                    $this->googleApiFlag = true;
                    return true;
            }
        }
        return false;
    }

    public function run($supportFlags = true)
    {
        if ($this->readArgs() == true) {
            if ($this->allFlag == true) {
                $globalConfig = new GlobalConfig("Setting up global configuration, in this mode reading from flag values is not supported.", "");
                return $globalConfig->run(false);
            } else if ($this->databaseFlag == true) {
                $dbConf = new DbConfig("Setting up database configuration", "Database configuration:\n");
                return $dbConf->run(true);
            } else if ($this->mailFlag == true) {
                $mailConfig = new MailConfig("Setting up mail configuration", "Mail configuration:\n");
                return $mailConfig->run(true);
            } else if ($this->googleApiFlag == true) {
                $googleApiKeysConfig = new GoogleApiKeysConfig("Setting up google api keys configuration", "Google api keys configuration:\n");
                return $googleApiKeysConfig->run(true);
            }
        } else {
            $this->usage();
            return true;
        }
    }
}

//main
$runConf = new RunConfig("Running config...", "");
$runConf->run();
