<?php

namespace VittaLogger;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class Log
{
    private static $sharedInstance;
    private $log;
    private $channelName;
    private $logFilePath;
    private $logLevel;

    private $transporter;

    /**
     * Logger constructor, creates a shared instance for Log.
     * 
     * @param  string $channelName a specific channel name.
     * @param  string $filePath path for the file to write in.
     * @param  int $logLevel log level, from this level and above.
     *
     * @return Log
     */
    public static function createSharedInstance($channelName, $filePath, $logLevel)
    {
        if (!isset(self::$sharedInstance)) {
            self::$sharedInstance = new Log($channelName, $filePath, $logLevel);
        }
        return self::$sharedInstance;
    }

    public static function getSharedInstance()
    {
        return self::$sharedInstance;
    }

    private function __construct($channelName, $filePath, $logLevel = Logger::ERROR)
    {
        $this->channelName = $channelName;
        $this->logFilePath = $filePath;
        $this->logLevel = $logLevel;
        $this->log = new Logger($channelName);
        $this->log->pushHandler(new StreamHandler($filePath, $logLevel));
    }

    public function getChannelName()
    {
        return $this->channelName;
    }
    public function getLogFilePath()
    {
        return $this->logFilePath;
    }
    public function getLogLevel()
    {
        return $this->logLevel;
    }

    public function debug($message)
    {
        $this->log->debug($message);
    }
    public function info($action, $message)
    {
        $info_data = array('action' => $action, 'message' => $message);
        $this->log->info("Info details", $info_data);
    }
    public function warning($action, $file, $line, $message)
    {
        $warning_data = array('action' => $action, 'file' => $file, 'line' => $line, 'message' => $message);
        $this->log->warning("Warning details", $warning_data);
    }
    public function error($action, $file, $line, $message)
    {
        $error_data = array('action' => $action, 'file' => $file, 'line' => $line, 'message' => $message);
        $this->log->error("Error details", $error_data);
    }

    // This sends an email
    public function critical($action, $file, $line, $message)
    {
        $critical_data = array('action' => $action, 'file' => $file, 'line' => $line, 'message' => $message);
        $this->log->critical($message, $critical_data);
    }
}
