<?php
/*
* Copyright (C) 2022 Seif-Eddine Benomar - Cabrilog
* Contribution to OpenSTEAM Project
*/

require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Lti\Controller\ControllerLtiScore;
use Lti\Entity\LtiScore;
use User\Entity\Regular;
use Classroom\Entity\ActivityLinkUser;
use Classroom\Entity\LtiTool;
use Learn\Entity\Activity;
use phpseclib\Crypt\RSA;

$headers = apache_request_headers();
$jwtToken = explode("Bearer ", $headers['Authorization'])[1];


  $decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $jwtToken)[1]))));

  $ltiIssuer = $decodedToken->sub;

  $ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($ltiIssuer);

  try {
    // TODO: IT SHOULD BE BETTER TO GENERATE THE PUBLIC KEY HERE INSTEAD OF GETTING IT FROM THE JWKS ENDPOINT
    //$platform_url = isset($_SERVER['HTTPS']) ? 'https://' : 'http://' . $_SERVER['HTTP_HOST'];
    //$platform_url = getenv('VS_HOST');
    $platform_url = getenv('VS_HOST');
    $jwks = json_decode(file_get_contents($platform_url."/classroom/lti/certs.php"), true);

    JWT::$leeway = 60; // $leeway in seconds

    $validatedToken = JWT::decode(
      $jwtToken,
      JWK::parseKeySet($jwks),
      array('RS256')
    );
  } catch (\Exception $e) {
    echo json_encode(['Error:' => $e->getMessage()]);
    exit;
  }

// Read the input stream
$body = file_get_contents("php://input");
// Decode the JSON object
$grade = json_decode($body);

$activityId = $_REQUEST['activity_id'];
$scoreGiven = $grade->scoreGiven ?? null;
$scoreMaximum = $grade->scoreMaximum ?? null;
$activityProgress = $grade->activityProgress;
$gradingProgress = $grade->gradingProgress;
$timestamp = $grade->timestamp;
$userId = $grade->userId;
$comment = $grade->comment;

try {
  // TODO :
  // si teacher alors 
  // insèrer le score dans la table `learn_activity`
  $user = null;
  try {
    $user = $entityManager->getRepository(Regular::class)->find($userId);
  }
  catch(Exception $e) {
    echo json_encode(['Error:' => $e->getMessage()]);
  }
  // is teacher
  if(isset($user)) {
    //$activity = $entityManager->getRepository(Activity::class)->find($activityId);
    // Create query
    //$query = $entityManager->createQuery('UPDATE Learn\Entity\Activity la SET la.previewNote = :previewNote WHERE la.id = :id');
    //$query->setParameter('previewNote', 1);
    //$query->setParameter('id', $activityId);
    //$query->execute();
    $queryBuilder = $entityManager->createQueryBuilder();
$queryBuilder->update('Learn\Entity\Activity', 'la')
             ->set('la.previewNote', ':previewNote')
             ->where('la.id = :id')
             ->setParameter('previewNote', 2)
             ->setParameter('id', $activityId);

$query = $queryBuilder->getQuery();

$sql = $query->getSQL();

echo $sql;
  }
  

  //error_log("print_r: ".print_r($userData->getEmail(), true));


  // $lineItemId is the id of the activityLinkUser (sent back from the tool)
  $activityLinkUser = $entityManager->getRepository(ActivityLinkUser::class)->find($activityId);
  $activityLinkUser->setUrl($comment);

  if($gradingProgress == "FullyGraded") {
    $convertedScore = 3 / $scoreMaximum * $scoreGiven;
    $activityLinkUser->setNote((int) $convertedScore);
    $activityLinkUser->setCorrection(2);
  }
  else {
    // set correction field to 1 (teacher must manually give score)
    $activityLinkUser->setCorrection(1);
  }

  $entityManager->flush();

} catch(Exception $e) {
  echo json_encode(['Error:' => $e->getMessage()]);
}
