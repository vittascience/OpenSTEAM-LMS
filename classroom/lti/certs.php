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
use phpseclib3\Crypt\RSA\PublicKey;
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
			$key = PublicKeyLoader::load($private_key)->getPublicKey();
		} catch (\Throwable $e) {
			continue;
		}
		if (!$key instanceof PublicKey) {
			continue;
		}
		$jwk = json_decode($key->toString('JWK'), true)['keys'][0];
		$components = array(
			'kty' => 'RSA',
			'alg' => 'RS256',
			'use' => 'sig',
			'e' => $jwk['e'],
			'n' => $jwk['n'],
			'kid' => $kid,
		);
		$jwks[] = $components;
	}
	echo json_encode(['keys' => $jwks]);
}

create_public_jwks($privateKeysArr);