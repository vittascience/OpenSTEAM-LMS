<?php

/**
 * SimpleSAMLphp configuration — template for LMS GAR deployment
 *
 * Variables to substitute before use:
 *   __BASE_URL__     → e.g. https://vittascience.com/
 *   __SECRET_SALT__  → generate with: openssl rand -base64 32
 *   __COOKIE_DOMAIN__ → e.g. .vittascience.com
 *   __CERTDIR__      → absolute path to simplesaml/cert/ directory
 *   __METADATADIR__  → absolute path to simplesaml/metadata/ directory
 *   __LOGDIR__       → absolute path for SSP logs (must be writable)
 *   __TMPDIR__       → absolute path for SSP tmp storage (must be writable)
 */

$config = [
    /*
     * The base URL for this SSP instance.
     * Must match the URL configured in nginx for /simplesaml/
     * Example: 'https://vittascience.com/simplesaml/'
     */
    'baseurlpath' => 'http://localhost:90/simplesaml/',

    /*
     * Cryptographic salt used to generate fingerprints.
     * Must be unique per deployment and kept secret.
     * Generate: openssl rand -base64 32
     */
    'secretsalt' => '3oFVljHgG2G89Xa2qTu3YkyKkYHQBRiooZ87s1GxcVA=',

    /*
     * Admin password (sha256 hash). Set a strong password.
     * Generate: echo -n "yourpassword" | sha256sum
     */
    'auth.adminpassword' => 'disabled',

    /*
     * Enable or disable the admin interface.
     * Should be false in production unless needed for diagnostics.
     */
    'admin.checkforupdates' => false,

    'technicalcontact_name'  => 'Vittascience Tech',
    'technicalcontact_email' => 'tech@vittascience.com',

    'timezone' => 'Europe/Paris',

    'enable.http_post' => false,

    /*
     * Logging
     */
    'logging.level'   => \SimpleSAML\Logger::NOTICE,
    'logging.handler' => 'file',
    'loggingdir'      => '/var/www/html/simplesaml/log/',
    'logging.logfile' => 'simplesamlphp.log',

    /*
     * Metadata storage
     */
    'metadata.sources' => [
        ['type' => 'flatfile'],
    ],
    'metadatadir' => '/var/www/html/simplesaml/metadata/',

    /*
     * Certificates directory (contains saml.pem / saml.crt for each auth source)
     */
    'certdir' => '/var/www/html/simplesaml/cert/',

    /*
     * Session / cookie
     */
    'session.duration'            => 8 * 60 * 60,   // 8 hours
    'session.cookie.name'         => 'SimpleSAMLSessionID',
    'session.cookie.lifetime'     => 0,
    'session.cookie.path'         => '/',
    'session.cookie.domain'       => 'localhost',
    'session.cookie.secure'       => false,
    'session.cookie.httponly'     => true,
    'session.cookie.samesite'     => 'None',
    'session.phpsession.cookiename' => 'SimpleSAML',
    'session.phpsession.savepath'   => null,
    'session.phpsession.httponly'   => true,

    /*
     * Storage backend for sessions.
     * Use 'phpsession' for single-server deployments.
     */
    'store.type' => 'phpsession',

    /*
     * Enable the following modules.
     *
     * LOCAL TESTING : passer 'exampleauth' à true et activer 'saml20-idp' pour
     * utiliser l'IdP SSP local simulant le GAR (voir saml20-idp-hosted.php.dist).
     * Repasser à false avant tout déploiement PFPART/PFPROD.
     */
    'module.enable' => [
        'saml'        => true,
        'core'        => true,
        'admin'       => false,
        'exampleauth' => true,  // ← passer à true en local uniquement
    ],

    /*
     * Activer le module IdP hébergé.
     * false en PFPART/PFPROD (le LMS est SP uniquement).
     * true en local pour simuler le GAR avec exampleauth:Static.
     */
    'enable.saml20-idp' => true,  // ← passer à true en local uniquement

    /*
     * Security settings — aligned with RTFS v8.2
     */
    'metadata.sign.enable'      => false,
    'metadata.sign.algorithm'   => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

    'debug' => [
        'saml'    => false,
        'backtraces' => false,
        'validatexml' => false,
    ],
];
