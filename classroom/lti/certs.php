<?php
/* 
* Copyright (C) 2022 Seif-Eddine Benomar - Cabrilog
* Contribution to OpenSTEAM Project
*/

require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use phpseclib3\Crypt\PublicKeyLoader;
use Classroom\Entity\LtiTool;

$ltiTools = $entityManager->getRepository(LtiTool::class)->findAll();

$privateKeysArr = [];
foreach($ltiTools as $ltiTool){
    $privateKeysArr[$ltiTool->getKid()] = $ltiTool->getPrivateKey();
}

function create_public_jwks($privateKeysArr) {
	$jwks = [];

	foreach ($privateKeysArr as $kid => $private_key) {
                try {
                        $privateKey = PublicKeyLoader::load($private_key);
                        $publicKey  = $privateKey->getPublicKey();
                        // toString('JWK') retourne un JSON avec kty, n, e déjà en base64url
                        $components = json_decode($publicKey->toString('JWK'), true);
                        $components['alg'] = 'RS256';
                        $components['use'] = 'sig';
                        $components['kid'] = $kid;
                        $jwks[] = $components;
                } catch (\Exception $e) {
                        continue;
                }
	}
	echo json_encode(['keys' => $jwks]);
}

create_public_jwks($privateKeysArr);