<?php

namespace Cmd;

require("../vendor/autoload.php");

class GoogleApiKeysConfig extends CmdConfig
{
    private $MAPS_API_KEY;
    private $CAPTCHA_SECRET;
    private $CAPTCHA_PUBLIC_KEY;

    public function __construct($cmdMessage, $outputConfig)
    {
        parent::__construct($cmdMessage, $outputConfig);
    }

    public function usage()
    {
        echo " 
    Script to generate google API keys. 
    Will set environment variables VS_MAPS_API_KEY, VS_CAPTCHA_SECRET and VS_CAPTCHA_PUBLIC_KEY.
       
Usage : google_api_keys.php [options] -m <maps_api_key>
       
    -m <maps_api_key>     maps api key
    -cs <secret_key>      captcha secret key
    -cp <public_key>      captcha public key 
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
                case '-m':
                    $this->MAPS_API_KEY = array_shift($argv);
                    break;
                case '-cs':
                    $this->CAPTCHA_SECRET = array_shift($argv);
                    break;
                case '-cp':
                    $this->CAPTCHA_PUBLIC_KEY = array_shift($argv);
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
        $api_keys = [];
        if (empty($this->MAPS_API_KEY)) {
            $mapApiKey = readline("Enter map api key (default []): ");
            $this->MAPS_API_KEY = ($mapApiKey === "") ? "" : $mapApiKey;
        }
        $api_keys['map'] = $this->MAPS_API_KEY;
        $this->println("map api key: " . $this->MAPS_API_KEY, self::INFO);

        if (empty($this->CAPTCHA_SECRET)) {
            $captchaSecretKey = readline("Enter captcha secret key (default []): ");
            $this->CAPTCHA_SECRET = ($captchaSecretKey === "") ? "" : $captchaSecretKey;
        }
        $api_keys['captcha_secret'] = $this->CAPTCHA_SECRET;
        $this->println("captcha secret key: " . $this->CAPTCHA_SECRET, self::INFO);

        if (empty($this->CAPTCHA_PUBLIC_KEY)) {
            $captchaPublicKey = readline("Enter captcha public key (default []): ");
            $this->CAPTCHA_PUBLIC_KEY = ($captchaPublicKey === "") ? "" : $captchaPublicKey;
        }
        $api_keys['captcha_public'] = $this->CAPTCHA_PUBLIC_KEY;
        $this->println("captcha public key: " . $this->CAPTCHA_PUBLIC_KEY, self::INFO);

        $this->println(self::OUTPUT_OK, self::SUCCESS);
        $this->println($this->CMD_OUTPUT . json_encode($api_keys), self::INFO);
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
            'VS_MAPS_API_KEY' => $this->MAPS_API_KEY,
            'VS_CAPTCHA_SECRET' => $this->CAPTCHA_SECRET,
            'VS_CAPTCHA_PUBLIC_KEY' => $this->CAPTCHA_PUBLIC_KEY
        ));
    }
}
