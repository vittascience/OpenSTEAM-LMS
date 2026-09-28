<?php
session_start();

$openClassroomDir = __DIR__."/../../openClassroom";
if(is_dir($openClassroomDir)){
    require __DIR__."/../../vendor/autoload.php";
    require __DIR__."/../../bootstrap.php";
} else {
    require __DIR__."/../vendor/autoload.php";
    require __DIR__."/../bootstrap.php";
}

use Dotenv\Dotenv;
use User\Entity\User;
use User\Entity\Regular;
use Classroom\Entity\Groups;
use Classroom\Entity\UsersLinkGroups;

$dir  = is_file('/run/secrets/app_env') ? '/run/secrets' : __DIR__ . '/../';
$file = is_file('/run/secrets/app_env') ? 'app_env'      : '.env';
Dotenv::createImmutable($dir, $file)->safeLoad();

// Support page reached from the group admin request mail; the decision itself is POSTed to the super admin controller
$userId = isset($_GET['user']) ? intval($_GET['user']) : 0;
$groupId = isset($_GET['group']) ? intval($_GET['group']) : 0;

$viewer = !empty($_SESSION['id']) ? $entityManager->getRepository(Regular::class)->findOneBy(['user' => intval($_SESSION['id'])]) : null;
$isSuperAdmin = $viewer && $viewer->getIsAdmin();

$user = $entityManager->getRepository(User::class)->find($userId);
$regular = $entityManager->getRepository(Regular::class)->findOneBy(['user' => $userId]);
$group = $entityManager->getRepository(Groups::class)->find($groupId);
$link = $entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $userId, 'group' => $groupId]);

require_once(__DIR__ . "/header.html");
?>
    <link rel="stylesheet" href="/classroom/assets/css/main.css">
    </head>

    <body>
        <div class="container my-5 text-center" style="max-width: 720px;">
            <h1 class="h3 mb-4">Demande d'administration de groupe</h1>
            <?php if (!$isSuperAdmin): ?>
                <p>Connectez-vous avec un compte super admin, puis cliquez à nouveau sur le lien du mail.</p>
                <a class="btn c-btn-primary" href="/classroom/login.php">Se connecter</a>
            <?php elseif (!$user || !$regular || !$group || !$link): ?>
                <p>Demande introuvable : l'utilisateur ne fait plus partie de ce groupe, ou le lien est incorrect.</p>
            <?php elseif ($link->getRights() == 1): ?>
                <p><?= htmlspecialchars($user->getFirstname() . ' ' . $user->getSurname()) ?> est déjà administrateur du groupe <b><?= htmlspecialchars($group->getName()) ?></b>.</p>
            <?php else: ?>
                <p>
                    <?= htmlspecialchars($user->getFirstname() . ' ' . $user->getSurname()) ?>
                    (<?= htmlspecialchars($regular->getEmail()) ?>) demande à devenir administrateur du groupe
                    <b><?= htmlspecialchars($group->getName()) ?></b>.
                </p>
                <div id="group-admin-answer" class="d-flex justify-content-center gap-3 mt-4">
                    <button class="btn c-btn-outline-primary" data-decision="decline">Refuser</button>
                    <button class="btn c-btn-primary" data-decision="accept">Accepter</button>
                </div>
                <p id="group-admin-answer-result" class="mt-4"></p>
                <script>
                    document.querySelectorAll('#group-admin-answer button').forEach((button) => {
                        button.addEventListener('click', async () => {
                            const result = document.getElementById('group-admin-answer-result');
                            document.querySelectorAll('#group-admin-answer button').forEach((b) => b.disabled = true);
                            let response;
                            try {
                                response = await (await fetch('/routing/Routing.php?controller=superadmin&action=answer_group_admin_request', {
                                    method: 'POST',
                                    body: new URLSearchParams({ user_id: <?= $userId ?>, group_id: <?= $groupId ?>, decision: button.dataset.decision })
                                })).json();
                            } catch (e) {
                                response = { success: false };
                            }
                            if (!response.success) {
                                result.textContent = "Erreur lors de l'enregistrement de la réponse.";
                                document.querySelectorAll('#group-admin-answer button').forEach((b) => b.disabled = false);
                                return;
                            }
                            document.getElementById('group-admin-answer').remove();
                            const outcome = response.decision === 'accept' ? 'Demande acceptée.' : 'Demande refusée.';
                            result.textContent = outcome + (response.mail ? " L'enseignant a été prévenu par mail." : " Le mail à l'enseignant n'a pas pu être envoyé.");
                        });
                    });
                </script>
            <?php endif; ?>
        </div>
<?php
require_once(__DIR__ . "/footer.html");
