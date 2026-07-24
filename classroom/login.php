<?php
if (!empty($_COOKIE["isFromGar"])) {
    $casAuthenticated = !empty($_SESSION['phpCAS']['user']);

    $samlAuthenticated = false;
    if (!$casAuthenticated) {
        require_once __DIR__ . '/../vendor/autoload.php';
        \SimpleSAML\Configuration::setConfigDir(__DIR__ . '/../simplesaml/config');

        $garAuthSource = !empty($_COOKIE['isGarTest']) ? 'gar-dev' : 'gar-prod';
        $samlAuthenticated = (new \SimpleSAML\Auth\Simple($garAuthSource))->isAuthenticated();

        // SimpleSAMLphp's phpsession backend hijacks the active PHP session name/cookie
        // Release it and restore the LMS's own session name before this script's session_start().
        if (class_exists('\SimpleSAML\Session')) {
            try {
                $ssp = \SimpleSAML\Session::getSessionFromRequest();
                if ($ssp !== null) {
                    $ssp->cleanup();
                }
            } catch (\Throwable $e) {
                error_log('SSP cleanup error: ' . $e->getMessage());
            }
        }
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_write_close();
        }
        session_name('PHPSESSID');
    }

    if (!$casAuthenticated && !$samlAuthenticated) {
        setcookie("isFromGar", "", time() - 1);
        setcookie("isGarTest", "", time() - 1);
        return header("Location:/classroom/gar_user_disconnected.php");
    }
}
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Dotenv\Dotenv;
use Utils\ConnectionManager;

// load data from .env file
$dir  = is_file('/run/secrets/app_env') ? '/run/secrets' : __DIR__ . '/../';
$file = is_file('/run/secrets/app_env') ? 'app_env'      : '.env';
Dotenv::createImmutable($dir, $file)->safeLoad();

// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['VS_DEMOSTUDENT']) ? $_ENV['VS_DEMOSTUDENT'] : 'demostudent';
// Optional client-wide display name override (frontend-only, does not change DB pseudo)
$demoStudentDisplay = !empty($_ENV['DEMOSTUDENT_DISPLAY']) ? $_ENV['DEMOSTUDENT_DISPLAY'] : '';

$user = ConnectionManager::getSharedInstance()->checkConnected();

if ($user) {
    header("Location: /classroom/home.php");
    die();
}

require_once(__DIR__ . "/header.html");
?>

<link rel="stylesheet" href="/classroom/assets/css/main.css">

<script src="./assets/js/lib/rotate.js"></script>
<link rel="stylesheet" type="text/css" href="assets/js/lib/slick-1.8.1/slick/slick.css" />
</head>

<body>
    <?php
    // add script tag with demoStudent name to make it available on the whole site
    $demoStudent = str_replace('"', '', $demoStudent);
    $demoStudentDisplay = str_replace('"', '', $demoStudentDisplay);
    echo "<script>const demoStudentName = `{$demoStudent}`; const demoStudentDisplayDefault = `{$demoStudentDisplay}`;</script>";
    require_once(__DIR__ . "/login.html");
    ?>

    <?php
    require_once(__DIR__ . "/footer.html");
    ?>