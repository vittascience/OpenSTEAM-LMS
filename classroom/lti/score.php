<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/bootstrap.php';

use Firebase\JWT\JWK;

use Firebase\JWT\JWT;
use Lti\Controller\ControllerLtiScore;
use Lti\Entity\LtiScore;
use User\Entity\User;
use Classroom\Entity\ActivityLinkUser;

include 'tools-credentials.php';

  $headers = apache_request_headers();
  $jwtToken = explode("Bearer ", $headers['Authorization'])[1];

  $decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $jwtToken)[1]))));
  
  $ltiIssuer = $decodedToken->iss;

  try {
    JWT::$leeway = 60; // $leeway in seconds
    $validatedToken = JWT::decode(
      $jwtToken,
      file_get_contents(__DIR__ . "/keys/public.key"), 
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
  // $lineItemId is the id of the activityLinkUser (sent back from the tool)
  $activityLinkUser = $entityManager->getRepository(ActivityLinkUser::class)->find($activityId);
  $activityLinkUser->setUrl($comment);

  if($gradingProgress == "FullyGraded") {
    $opensteamScore = 0;
    // if score has been recieved from the tool provider (cabri)
    // then convert cabri score (0-100) into opensteam score (0-3)
    if($scoreGiven<0.5)
      $opensteamScore = 0;
    else if($scoreGiven<0.6)
      $opensteamScore = 1;
    else if($scoreGiven<0.8)
      $opensteamScore = 2;
    else if($scoreGiven<=1)
      $opensteamScore = 3;

    $activityLinkUser->setNote((int) $scoreGiven);
    $activityLinkUser->setCorrection(2);
  } 
  else {
    // set correction field to 1 (teacher must manually give score)
    $activityLinkUser->setCorrection(1);
  }

  $entityManager->persist($activityLinkUser);
  $entityManager->flush();

} catch(Exception $e) {
  echo json_encode(['Error:' => $e->getMessage()]);
}