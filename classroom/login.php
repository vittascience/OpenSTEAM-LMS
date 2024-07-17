<?php
if(!empty($_COOKIE["isFromGar"]) && empty($_SESSION['phpCAS']['user'])){
    setcookie("isFromGar","",time()-1);
    return header("Location:https://maclasseti.fr/classroom/gar_user_disconnected.php"); 
}
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Dotenv\Dotenv;
use DAO\RegularDAO;
use models\Regular;
use DAO\SettingsDAO;
use Utils\ConnectionManager;
use Database\DatabaseManager;

// load data from .env file
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['VS_DEMOSTUDENT'])
                ? htmlspecialchars(strip_tags(trim($_ENV['VS_DEMOSTUDENT'])))
                : 'demoStudent';

$user = ConnectionManager::getSharedInstance()->checkConnected();

if ($user) {
    header("Location: /classroom/home.php");
    die();
}

include_once(__DIR__ . "/../public/header.php");?>
<script src="assets/js/utils/listener.js"></script>
<script src="/path.js"></script>
<?php require_once(__DIR__ . "/header.html"); ?>
<script>
document.querySelector("#bs4-css-import").disabled = true;
document.querySelector(`link[href="assets/css/main.css"]`).disabled = true;
document.querySelector(`link[href="assets/css/login.css"]`).disabled = true;
</script>

<link rel="stylesheet" href="assets/css/theme-import.css">
<script src="assets/js/import/theme-import.js"></script>

<title>MaClasseTI - Texas Instruments | Classe</title>
<meta property="og:title" content="MaClasseTI.fr, classe" />

<!-- schema markup -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MaClasseTI.fr",
    "url": "https://www.maclasseti.fr/classroom",
    "description": "Gérez vos classes avec MaClasseTI.fr",
}
</script>

<style>
input.placeholder-update::placeholder {
    opacity: 0.5;
}
</style>

</head>

<body class="theme-light">
    <?php include_once(__DIR__ . "/../public/nav.php"); ?>
    <section id="login-banner-container">
        <img src="/public/images/classroom/banner.png" alt="">
    </section>
    <section class="p-5 text-start ti-cross-bg">

        <section class="container pt-3 mb-5 border-0" role="main">
            <h2 class="display-5 mt-0">Gérez vos classes avec MaClasseTI.fr</h2>
            <h3 class="fs-4 mb-5 fw-light">Découvrir — Apprendre — Partager</h3>

            <div id="classroom-login-container" class="row mb-5" style="display:none;">
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 text-center no-hover">
                        <div class="card-body" id="classroom-login-code">
                            <img src="/public/images/icons/icon-softwar.png" class="img-fluid py-3" alt="Image d'un ordinateur avec un écran affichant plusieurs personnes">
                            <h5 class="card-title">Élève</h5>
                            <p class="card-text">Rentrez ici votre code classe</p>

                            <div class="mb-3">
                                <input type="text" class="form-control mx-auto" id="class-code" placeholder="123ABC" style="max-width: 14ch;">
                                <input id="class-connexion" type="submit" class="btn btn-red mt-3" value="Confirmer »">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 text-center no-hover">
                        <div class="card-body">
                            <img src="/public/images/icons/icon-teacher.png" class="img-fluid py-3" alt="Image d'une personne avec un tableau, enseignant à des élèves">
                            <h5 class="card-title">Enseignant</h5>
                            <p class="card-text">Vous avez déja un compte ?</p>

                            <div class="d-flex flex-column mx-auto" style="max-width: 15ch;">
                                <button type="button" class="btn btn-red mb-3" data-bs-toggle="modal" data-bs-target="#loginTeacherModal">Se connecter »</button>
                                <button type="button" class="btn btn-red" data-bs-toggle="modal" data-bs-target="#signUpTeacherModal">S'inscrire »</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 text-center no-hover">
                        <div class="card-body">
                            <img src="/public/images/icons/icon-w2b-sch.png" alt="Image d'une école" class="img-fluid py-3">
                            <h5 class="card-title">GAR</h5>
                            <p class="card-text">Profitez du module classe en toute simplicité à l'aide du GAR.</p>
                            <a href="/gar" type="button" class="btn btn-red">Demander un accès GAR »</a>

                        </div>
                    </div>
                </div>
            </div>

            <div id="classroom-login-container-bis" style="display:none;">
                <div class="inner-login-container row">

                <a href="/classroom/login.php" class="btn c-btn-outline-grey" style="--classroom-grey: white;margin-bottom: 1em;">« Retour à la page de connexion</a>
                    <div class="col-12 mb-4">
                        <div class="card h-100 text-center no-hover">
                            <p id="classroom-desc" class="my-3 h5"></p>
                        </div>
                    </div>

                    <div class="col-md-6 mb-4">
                        <div class="card h-100 text-center no-hover">
                            <div class="card-body" id="classroom-create-account">
                                <h5 class="card-title">Se connecter</h5>
                                <p class="card-text">Première visite ? Veuillez choisir un identifiant.</p>

                                <span id="warning-pseudo-used" style="display:none;">Ce pseudo est déja utilisé, veuillez en choisir un autre</span>

                                <div class="mb-3">
                                    <label for="username">Pseudonyme</label><br>
                                    <input type="text" placeholder="Ex: Emma B." name="username" id="new-user-pseudo-form" class="form-control mx-auto placeholder-update" required="">
                                    <button class="btn btn-red mt-3" id="create-user" type="submit">Confirmer »</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 mb-4">
                        <div class="card h-100 text-center no-hover">
                            <div class="card-body" id="classroom-login-account">
                                <h5 class="card-title">Se connecter</h5>
                                <p class="card-text">De retour dans cette classe ?</p>

                                <span id="warning-pseudo-used" style="display:none;">Ce pseudo est déja utilisé, veuillez en choisir un autre</span>

                                <div class="mb-3">
                                    <div>
                                        <label for="username">Pseudonyme</label><br>
                                        <input type="text" placeholder="Ex: Emma B." name="username" id="user-pseudo-form" class="form-control mx-auto placeholder-update" name="secret_code" required="">
                                    </div>

                                    <div>
                                        <label for="username" data-i18n="words.password">Mot de passe</label><br>
                                        <input type="password" placeholder="••••••••••" name="secret_code" class="form-control mx-auto placeholder-update" id="user-password-form" required=""><br>
                                        <span class="form-text text-primary mismatched-login" style="display:none;">Votre pseudo ou mot de passe est erroné.</span>

                                        <a href="#" class="mt-2 visually-hidden">J'ai oublié mon mot de passe</a><br>
                                    </div>

                                    <button class="btn btn-red mt-3" id="connect-nongar-user">Confirmer »</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>
    <div class="modal fade" id="loginTeacherModal" tabindex="-1" aria-labelledby="loginTeacherModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="loginTeacherModalLabel">Connexion</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="login-form">
                    <div id="info-div"></div>
                    <div class="mb-3">
                        <label for="login-mail-input">
                            Adresse mail
                        </label>
                        <input name="mail" class="form-control" type="email" id="login-mail-input" placeholder="exemple@domaine.com">
                    </div>

                    <div class="mb-3">
                        <label for="login-pwd-input">
                            Mot de passe
                        </label>
                        <input name="password" data-i18n="[placeholder]login_popup.form.password_placeholder" class="form-control" type="password" id="login-pwd-input" placeholder="Votre mot de passe.">
                        <div class="form-text">
                            <a href="/classroom/password_manager.php">J'ai oublié mon mot de passe.</a>
                        </div>
                    </div>

                    <div class="visually-hidden">
                        <input type="text" name="za78e-username" autocomplete="off" value="" id="za78e-username" class="za78e-field" placeholder="za78e username">
                        <input type="number" name="za78e-number" autocomplete="off" max="10" min="0" id="za78e-number" class="za78e-field" placeholder="za78e number">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-red" onclick="checkLogin();" id="login-button">Se connecter</button>
                <button type="button" style="display:none;" onclick="getNewValidationMail();" class="btn btn-secondary" id="btn-activate-account-classroom">Activer mon compte</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="signUpTeacherModal" tabindex="-1" aria-labelledby="signUpTeacherModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="signUpTeacherModalLabel">Inscription</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="#" id="create-teacher-account-form">
                <div class="modal-body">

                    <div class="row">

                        <div class="col mb-3">
                            <label for="profile-form-last-name">
                                Nom <span class="text-primary">*</span>
                            </label>
                            <input type="text" name="last-name" id="profile-form-last-name" class="form-control">
                        </div>

                        <div class="col mb-3">
                            <label for="profile-form-first-name" class="tutorial-label">
                                Prénom <span class="text-primary">*</span>
                            </label>
                            <input type="text" name="first-name" id="profile-form-first-name" class="form-control">
                        </div>
                    </div>



                    <div class="mb-3">
                        <label for="profile-form-email">
                            E-mail <span class="text-primary">*</span>
                        </label>
                        <input type="email" name="email" id="profile-form-email" class="form-control">
                    </div>


                    <div class="mb-3">
                        <label for="profile-form-password">
                            Mot de passe <span class="text-primary">*</span>
                        </label>
                        <input type="password" name="password" id="profile-form-password" class="form-control">
                        <p class="form-text"></p>
                    </div>

                    <div class="mb-3">
                        <label for="profile-form-confirm-password">
                            Confirmer le mot de passe <span class="text-primary">*</span>
                        </label>
                        <input type="password" name="confirm-password" id="profile-form-confirm-password" class="form-control">
                    </div>

                    <p>Les champs marqués par un <span class="text-primary">*</span> sont obligatoires.</p>
                    <p>En validant ce formulaire, vous acceptez les <a target="_blank" href="/classroom/cgu.php">conditions générales d'utilisation</a>.</p>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cb_adult" required="">
                        <label class="form-check-label" for="cb_adult">
                            Je confirme avoir plus de 18 ans (article 1124 du code civil)
                            <span class="text-primary">*</span>
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cb_newsletter">
                        <label class="form-check-label" for="cb_newsletter" data-bs-toggle="modal" data-bs-target="#newsletterModal">
                            <a href="#newsletterModal" data-bs-toggle="modal" data-bs-target="#newsletterModal">
                                Je souhaite recevoir des informations sur les produits, offres et services Texas Instruments.
                            </a>
                        </label>
                    </div>
                </div>


                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <input class="btn btn-red" type="submit" value="S'inscrire">
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="newsletterModal" aria-hidden="true" aria-labelledby="newsletterModalLabel" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="newsletterModalLabel">Informations sur les produits, offres et services Texas Instruments</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Consentement général à l'utilisation de mes données à des fins marketing.</p>

                <p>Je consens à l’utilisation de mes données fournies ci-dessus à des fins marketing comme indiqué ci-après : Texas Instruments France SAS, Texas Instruments Incorporated ainsi que ses filiales (« TI ») pourront utiliser les données personnelles fournies ci-dessus à des fins marketing pour,</p>

                <ul>
                    <li>m’informer par téléphone, courrier ou via e-mail des produits et services de TI,</li>
                    <li>m’informer sur les évènements en relation avec les produits et services TI,</li>
                    <li>m’envoyer des bulletins d’information TI et des brochures via e-mail, ou</li>
                    <li>analyser ces données afin de mieux cibler les efforts marketing TI selon mes intérêts.</li>
                </ul>

                <p>À ces fins, TI peut également partager mes données personnelles avec des sous-traitants, et mes données peuvent être transférées et traitées dans ou hors de l'UE. TI traitera mes données conformément à la politique de confidentialité de TI.</p>

                <p>Ce consentement n’est pas une obligation pour l’achat de produits ou de services auprès de TI, ni pour la participation à des concours ou à des tirages de TI. Je donne mon consentement volontairement et je peux le retirer à tout moment en envoyant un courrier électronique à <a href="https://ti-cares.freshdesk.com/nl/support/tickets/new">ti-cares.freshdesk.com/nl/support/tickets/new</a> ou en adressant une demande écrite à: Texas Instruments France SAS, 185-187 quai de la bataille de Stalingrad, 92130 Issy-les-Moulineaux</p>

            </div>
            <div class="modal-footer">
                <button class="btn btn-red" data-bs-target="#signUpTeacherModal" data-bs-toggle="modal">D'accord</button>
            </div>
        </div>
    </div>
</div>

    <script src="assets/js/lib/popper-1.16.0/popper.min.js"></script>
    <script src="assets/js/lib/bootstrap-4.4.1/bootstrap.min.js"></script>
    <script src="assets/js/lib/i18next.js"></script>
    <script src="assets/js/lib/jquery-i18next.min.js"></script>
    <script src="assets/js/lib/i18nextXHRBackend.min.js"></script>
    <script src="assets/js/lib/i18nextBrowserLanguageDetector.min.js"></script>
    <script type="text/javascript" src="assets/js/lib/slick-1.8.1/slick/slick.min.js"></script>
    <script src="assets/js/utils/translate.js"></script>
    <script src="assets/js/utils/get.js"></script>
    <script src="assets/js/scripts/dashboardActivities.js"></script>
    <script src="assets/js/scripts/displayPanel.js"></script>
    <script src="assets/js/lib/EasyAutocomplete-1.3.5/jquery.easy-autocomplete.min.js"></script>
    <script src="assets/js/main/Loader.js"></script>
    <script src="assets/js/main/UIManager.js"></script>
    <script src="assets/js/main/User.js"></script>
    <script src="assets/js/main/ClassroomManager.js"></script>
    <script src="assets/js/main/Main.js"></script>
    <script src="assets/js/scripts/main-login.js"></script>
    <script src="assets/js/utils/registrationTemplate.js"></script>
    <script src="assets/js/scripts/buttons.js"></script>
    <script src="assets/js/scripts/login.js"></script>
    <script src="assets/js/lib/popper-1.12.9.min.js"></script>
    <script src="assets/js/lib/i18next.js"></script>
    <script src="assets/js/lib/jquery-i18next.min.js"></script>
    <script src="assets/js/lib/i18nextXHRBackend.min.js"></script>
    <script src="assets/js/lib/i18nextBrowserLanguageDetector.min.js"></script>
    <script src="assets/js/utils/translate.js"></script>
    <script>
    UIManager.init().then((resolve) => {
        UserManager.init().then((resolve) => {
                Main.init().then((resolve) => {
                    if ($_GET('link') && firstRequestClass) {
                        firstRequestClass = false;
                        navigateLight($_GET('link'), 2)
                    }
                    // Set the variable to false to indicate that the registration template is already set up
                    firstRegisterLoad = false;
                })
            },
            (reason) => {
                console.error("UserManager failed to load: " + reason);
                failedToLoad();
            }
        );
    })
    </script>
    <script>
    // If the actual page is not "home.php", add a notif div at the top of the body
    $(() => {
        const pageName = location.href.split("/").slice(-1);
        if (pageName != "home.php") {
            $('body').prepend('<div id="notif-div"></div>');
        }

        // show the #classroom-login-container div
        $('#classroom-login-container').show();
    })
    </script>
    <?php include_once(__DIR__ . '/../public/footer.php'); ?>
</body>
</html>