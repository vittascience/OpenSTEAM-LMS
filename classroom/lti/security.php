<?php
/**
 * Integrity helpers for the LTI launch flow: the login_hint goes through the browser and the tool,
 * so auth.php only trusts it once signed by ltilaunch.php / contentitem.php.
 */

use User\Entity\Regular;
use User\Entity\ClassroomUser;

const LTI_LOGIN_HINT_TTL = 3600;

function ltiLoginHintSignature(array $hint, $ltiTool) {
	$key = hash_hmac('sha256', 'lti-login-hint', $ltiTool->getPrivateKey());
	return hash_hmac('sha256', json_encode($hint), $key);
}

function signLtiLoginHint(array $hint, $ltiTool) {
	$hint['exp'] = time() + LTI_LOGIN_HINT_TTL;
	$hint['sig'] = ltiLoginHintSignature($hint, $ltiTool);
	return json_encode($hint);
}

// Returns the hint array, or null when it was not issued by this platform for this tool or has expired
function verifyLtiLoginHint($rawHint, $ltiTool) {
	$hint = json_decode((string) $rawHint, true);
	if (!is_array($hint) || !isset($hint['sig'], $hint['exp']) || !is_string($hint['sig'])) return null;

	$sig = $hint['sig'];
	unset($hint['sig']);
	if (!hash_equals(ltiLoginHintSignature($hint, $ltiTool), $sig)) return null;
	if ($hint['exp'] < time()) return null;
	return $hint;
}

// Same rule as isRegular in routing/Routing.php
function isLtiTeacher($entityManager, $userId) {
	$regular = $entityManager->getRepository(Regular::class)->find(intval($userId));
	if ($regular && $regular->getEmail()) return true;

	$classroomUser = $entityManager->getRepository(ClassroomUser::class)->find(intval($userId));
	return $classroomUser && $classroomUser->getGarId() != null && $classroomUser->getIsTeacher() == true;
}

function ltiUrlOrigin($url) {
	$parts = parse_url((string) $url);
	if (empty($parts['scheme']) || empty($parts['host'])) return null;
	return strtolower($parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''));
}

function isLtiToolRedirectUri($redirectUri, $ltiTool) {
	$origin = ltiUrlOrigin($redirectUri);
	if (!$origin) return false;

	$toolUrls = [$ltiTool->getRedirectionUrl(), $ltiTool->getLoginUrl(), $ltiTool->getToolUrl(), $ltiTool->getDeepLinkUrl()];
	return in_array($origin, array_map('ltiUrlOrigin', $toolUrls), true);
}
