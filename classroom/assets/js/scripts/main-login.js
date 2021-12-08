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
            setTimeout(function () {
                var redirect = $_GET("redirect");
                if (redirect == null) {
                    if (/classroom/.test(window.location.pathname)) {
                        document.location = "/classroom/home.php?link=aaaaa";
                    }
                } else {
                    document.location = decodeURIComponent(redirect);
                }
            });
        } else {
            button.removeAttribute("disabled");
            button.style.cursor = "pointer";

            // handle differents errors
            if (response.error === "wrong_credentials") {
                setUpInfoDivNav("danger", "login_popup.error");
            } else if (response.error === "user_not_found") {
                setUpInfoDivNav("danger", "login_popup.userNotFound");
            } else if (response.error === "user_not_active") {
                setUpInfoDivNav("danger", "login_popup.inactiveAccount");
                $('#btn-activate-account-classroom').show();
            }

        }
    })
}

function setUpInfoDivNav(type, messageID) {
    let infoBox = "";
    if (document.getElementById("info-div") === undefined || document.getElementById("info-div") === null) {
        infoBox = document.createElement("div");
    } else {
        infoBox = document.getElementById("info-div");
    }
    // Create the info box and the message with the right class
    infoBox.className = `alert alert-${type}`;
    infoBox.innerHTML = i18next.t(messageID);
    // Fade in the info div
    $("#info-div").fadeIn("slow");
}

function sendNewActivationMail() {
    let mail = $('#login-mail-input').val();
    // Disable the button for 45s 
    $('#btn-activate-account-classroom').attr("disabled", true);
    setTimeout(() => {
        $('#btn-activate-account-classroom').attr("disabled", false);
    }, 45000);
    $.ajax({
    type: "POST",
        url: "/services/post/postNewValidationMail.php",
        data: {
            email: mail,
        },
        success: function () {
            setUpInfoDivNav("success", "login_popup.mailSuccess");
        },
        error: function () {
            setUpInfoDivNav("danger", "login_popup.mailError");
        }
    });
}

/* if(response.success == false && response.error == 'badInput'){
    infoBox.innerHTML = i18next.t('login_popup.error');
}
if(response.success == false) {
    infoBox.innerHTML = i18next.t('login_popup.error');
}
else {
    infoBox.innerHTML = i18next.t('login_popup.errorBeta');
} */

/*             document.getElementById("info-div").innerHTML = "";
            document.getElementById("info-div").style.display = "none";
            document.getElementById("info-div").appendChild(infoBox);
            $("#info-div").fadeIn("slow");
            setTimeout(() => {
                $("#info-div").fadeOut("slow");
            }, 5000); */