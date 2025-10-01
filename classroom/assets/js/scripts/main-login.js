'use strict';
/**
 * login a user
 * @param {FormData}  
 * @return {Classroom} 
 */
function loginUser(payload) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=user&action=login",
            data: payload,
            success: function (response) {
                resolve(JSON.parse(response))

            },
            error: function () {
                reject();
            }
        });
    })
}

function checkLogin() {
    var button = document.getElementById("login-button");
    if ($('#za78e-username').val() == '') {
        $('#za78e-username').val($('#homepage').val())
    }
    let honeyNumber = $('#za78e-number').val();
    let honeyUsername = $('#za78e-username').val();

    button.setAttribute("disabled", "disabled");
    button.style.cursor = "not-allowed";

    var formData = new FormData(document.getElementById("login-form"));
    formData.append("za78e-username", honeyUsername)
    let form = {
        'mail': $('#login-mail-input').val(),
        'password': $('#login-pwd-input').val(),
        'za78e-username': honeyUsername,
    }
    loginUser(form).then(function (response) {
        if (response.success === true) {
            var infoBox = document.getElementById("info-box");
            if (infoBox === undefined || infoBox === null) {
                infoBox = document.createElement("div");
                infoBox.className = "alert alert-success";
                infoBox.innerHTML = i18next.t('login_popup.success');
                document.getElementById("info-div").innerHTML = "";
                document.getElementById("info-div").style.display = "none";
                document.getElementById("info-div").appendChild(infoBox);
                $("#info-div").fadeIn("slow");
            } else {
                document.getElementById("info-div").style.display = "none";
                infoBox.className = "alert alert-success";
                infoBox.innerHTML = i18next.t('login_popup.success');
                $("#info-div").fadeIn("slow");
            }
            setTimeout(() => {
                var redirect = $_GET("redirect");
                if (redirect == null) {
                    if (/classroom/.test(window.location.pathname)) {
                        document.location = "/classroom/home.php";
                    }
                } else {
                    document.location = decodeURIComponent(redirect);
                }
            }, 1500);
        } else {
            button.removeAttribute("disabled");
            button.style.cursor = "pointer";
            if (typeof response.canNotLoginBefore != 'undefined' ) {
                const diffInMinutes = (response.canNotLoginBefore  - (new Date().getTime() /1000) )/ 60
                const timeToWait = Math.ceil(diffInMinutes)
                return setUpInfoDivNav("danger", "login_popup.canNotLoginBefore", { failedLoginAttempts: response.failedLoginAttempts, timeToWait: timeToWait }, false, "navbarLoginFailedWrongCredentials");               
            } else if (response.error === "badInput") {
                return setUpInfoDivNav("danger", "login_popup.badInput", false, "navbarLoginFailedBadInput");
            } 
            else if (response.error === "wrong_credentials") {
                return setUpInfoDivNav("danger", "login_popup.error", false, "navbarLoginFailedWrongCredentials");
            } 
            else if (response.error === "user_not_found") {
                return setUpInfoDivNav("danger", "login_popup.userNotFound", false, "navbarLoginFailedNoUserFound");
            } 
            else if (response.error === "user_not_active") {
                let linkWorkd = i18next.t("words.link");
                let opt = {"link": `<span class='font-weight-bold text-decoration-underline pe-auto' style='cursor: pointer;' onclick='getNewValidationMail()'>${linkWorkd}</span>`};;
                return setUpInfoDivNav("danger", "login_popup.inactiveAccount", opt, "loginFailedUserNotActive");
            } else if (response.error === "totp_code_required") {
                clearDivErrorNav();
                showTotpState();
                return;
            } else if (response.error === "wrong_totp_code") {
                return setUpInfoDivNav("danger", "login_popup.wrongTotpCode", false, "navbarLoginFailedWrongTotpCode");
            }
        }
    })
}

function getNewValidationMail() {
    let mail = $('#login-mail-input').val();
    // Disable the button for 45s 
    $('#btn-activate-account-classroom').attr("disabled", true);
    setTimeout(() => {
        $('#btn-activate-account-classroom').attr("disabled", false);
    }, 45000);
    $.ajax({
        type: "POST",
        url: "/routing/Routing.php?controller=groupadmin&action=get_new_validation_mail",
        data: {
            email: mail,
        },
        success: function (res) {
            let response = JSON.parse(res);
            if (response.success === true) {
                setUpInfoDivNav("success", "login_popup.mailSuccess", {});
            } else if (response.message === "mail_not_sent") {
                setUpInfoDivNav("error", "login_popup.mailError", {});
            } else if (response.message === "no_token") {
                setUpInfoDivNav("error", "login_popup.accountDeactivated", {});
            } else if (response.message === "user_not_found") {
                setUpInfoDivNav("error", "login_popup.userNotFound", {});
            }
        },
        error: function () {
            setUpInfoDivNav("error", "login_popup.mailError", {});
        }
    });
}

function clearDivErrorNav() {
    let infoBox = returnInfoDiv() 
    infoBox.innerHTML = "";
    infoBox.className = "";
}

function returnInfoDiv() {
    return document.getElementById("info-div");
}

/**
 * Show the TOTP state according to the page
 */
function showTotpState() {
    const loginMainDiv = document.getElementById("login-main-div-login-page");
    const loginTotpDiv = document.getElementById("login-totp-div-login-page");
    const loginDivClassroom = document.getElementById("login-div-classroom");
    const loginTotpDivClassroom = document.getElementById("login-totp-div-classroom");

    if (loginMainDiv) loginMainDiv.classList.add("d-none");
    if (loginTotpDiv) loginTotpDiv.classList.remove("d-none");
    if (loginDivClassroom) loginDivClassroom.classList.add("d-none");
    if (loginTotpDivClassroom) loginTotpDivClassroom.classList.remove("d-none");
}

/**
 * @param {HTMLElement} button 
 * @returns {string}
 */
function decodeHtml(stringEncoded) {
    const txt = document.createElement("textarea");
    txt.innerHTML = stringEncoded;
    return txt.value;
}

/**
 * @param {string} type 
 * @param {string} messageID 
 * @param {?object} options 
 * @param {?string} dataTestId 
 * @param {boolean} fromLoginPage 
 */
function setUpInfoDivNav(type, messageID, options = false, dataTestId = null) {
    let infoBox = returnInfoDiv();
    // Create the info box and the message with the right class
    infoBox.className = "alert alert-" + type;
    if (dataTestId) infoBox.setAttribute('data-testid', dataTestId)

    const messageText = options ? i18next.t(messageID, options) : i18next.t(messageID);
    infoBox.innerHTML = decodeHtml(messageText);
}
