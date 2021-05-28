<?php

namespace Cmd;

require("../vendor/autoload.php");

class CmdConfig extends Cmd
{
    protected function __construct($cmdMessage, $cmdOutput)
    {
        parent::__construct($cmdMessage, $cmdOutput);
    }

    /**
     * Sets environment variables passed as argument in the .env file.
     *
     * @param  mixed $vars array of env variables keys and values.
     *
     * @return TRUE|FALSE
     * Returns TRUE if the environment variables were successfully set, FALSE otherwise.
     */
    protected function setEnvVars($vars)
    {
        $handle = @fopen(__DIR__ . "/../.env", "r");
        if ($handle == false) {
            $this->println("Failed to read .env variable", self::ERROR);
            return false;
        } else {
            $envVars = [];
            while (($line = fgets($handle)) !== false) {
                $linesSplited = explode("=", $line);
                $envVars[$linesSplited[0]] = trim($linesSplited[1]);
            }
            fclose($handle);

            foreach ($vars as $varKey => $varValue) {
                $envVars[$varKey] = $varValue;
            }

            $payload = "";
            $entriesCount = count($envVars);
            $i = 0;
            foreach ($envVars as $varKey => $varValue) {
                if ($i != $entriesCount - 1) {
                    $payload .= $varKey . "=" . $varValue . self::OUTPUT_NEWLINE;
                } else {
                    $payload .= $varKey . "=" . $varValue;
                }
                $i++;
            }
            if (@file_put_contents(__DIR__ . "/../.env", $payload . PHP_EOL, LOCK_EX) == false) {
                $this->println("Failed to write to .env variable", self::ERROR);
                return false;
            }
            return true;
        }
    }

    /**
     * Virtual method reading configuration from terminal, implemented by each child class.
     *
     * @return void
     */
    protected function readConfig()
    {
    }
}
