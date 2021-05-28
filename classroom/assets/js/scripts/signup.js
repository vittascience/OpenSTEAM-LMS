'use strict';

var autoCompleteSchoolOptions = {
    url: function (phrase) {
        return "/routing/Routing.php?controller=user&action=get_schools";
    },
    getValue: function (element) {
        return element.name;
    },
    ajaxSettings: {
        dataType: "json",
        method: "GET",
        data: {
            dataType: "json"
        }
    },
    preparePostData: function (data) {
        data.phrase = $("#teacher-school-input").val();
        data.grade = $("#teacher-grade-input").val();
        return data;
    },
    requestDelay: 400
};

function displaySignupClass() {
    if ($("#nav-login-div").is(":visible"))
        closeLogin();
    if ($("#nav-flags-div").is(":visible"))
        closeLang();
    $("html, body").animate({
        scrollTop: 0
    }, "slow");
    $("#secondDropdown").click();
    $('#signupin-div p').hide()
    $('#signupin-div h1').hide()
    if ($("#navbar-toggle-button").is(":visible"))
        $("#navbar-toggle-button").click();
    var form = document.createElement("div");
    var div = document.getElementById("signupin-div");
    var signup = document.getElementById("login-form");
    if (div.childNodes.length > 0)
        div.removeChild(div.firstChild);
    signup.style.display = "none";
    div.className = "main-signup";
    form.className = "signup-form";
    form.id = "signup-form-id";
    form.innerHTML =
        "<div id='first-form'>" +
        "<button class='btn vitta-button quit-button' type='button' onclick='closeSignup();'><span class='fa fa-times-circle'></span></button>" +
        "<h1><span class='fa fa-user-plus'></span> Inscription</h1>" +
        "<div style='display:none;' id='mail-error'></div>" +
        "<p> Merci de compléter les champs suivants pour créer votre compte Vittascience. </p>" +
        '<div class="form-row">' +
        '<div class="form-group col-md-6">' +
        "<label for='firstname-input'><span class='fa fa-user'></span> Prénom  <span class='mandatory'>*  </span><span class='show-error alert alert-warning'></span></label>" +
        "<input class='form-control' placeholder='votre prénom' type='text' id='firstname-input' >" +
        "</div>" +
        '<div class="form-group col-md-6">' +
        "<label for='surname-input'><span class='fa fa-user'></span> Nom de famille <span class='mandatory'>*  </span><span class='show-error alert alert-warning'></span></label>" +
        "<input class='form-control' placeholder='Votre nom de famille' type='text' id='surname-input'>" +
        "</div>" +
        '</div>' +
        "<div><label style='margin-top:5px;' for='email-input'><span class='fa fa-at'></span> Email <span class='mandatory'>*  </span><span class='show-error alert alert-warning'></span></label>" +
        "<input class='form-control' placeholder='Votre email' type='email' id='email-input'></div>" +
        "<div><label style='margin-top:5px;' for='phone-input'><span class='fa fa-mobile-alt'></span> Téléphone  <span class='show-error alert alert-warning'></span></label>" +
        "<input style='margin-bottom:5px;' id='phone-input' placeholder='Votre téléphone' class='form-control'></div>" +
        '<div class="form-row">' +
        '<div class="form-group col-md-6">' +
        "<label for='pwd-input'><span class='fa fa-key'></span> Mot de passe <span class='mandatory'>*  </span><span class='show-error alert alert-warning'></span></label>" +
        "<input class='form-control' type='password' placeholder='votre mot de passe' id='pwd-input'>" +
        "</div>" +
        '<div class="form-group col-md-6">' +
        "<label for='pwd-conf-input'><span class='fa fa-key'></span> Confirmation du mot de passe <span class='mandatory'>*  </span><span class='show-error alert alert-warning'></span></label>" +
        "<input class='form-control' type='password' placeholder='même mot de passe' id='pwd-conf-input'>" +
        "</div>" +
        '</div>' +
        "<p class='hint'>Les champs marqués par un * sont obligatoires.</p>" +
        "<button id='conf-btn' type='button'  class='btn vitta-button center-btn'>Valider</button>" +
        "</div>" +
        "<div id='second-form' style='display:none;'>" +
        "<button type='button' class='btn vitta-button' id='signup-back-button'>Retour</button>" +
        "<button class='btn vitta-button quit-button' style='float:right;' type='button' onclick='closeSignup();'><span class='fa fa-times-circle'></span></button>" +
        "<h4>Merci de nous fournir quelques informations supplémentaires</h4>" +
        "<div>Êtes-vous...<span class='mandatory'>*</span></div>" +
        '<div class="form-row">' +
        '<div class="form-check form-check-inline">' +
        '<input checked="checked" class="form-check-input" type="radio" name="inlineRadio" id="normal-radio" value="normal">' +
        '<label class="form-check-label" for="inlineRadio1"><span class="fa fa-user"></span> un particulier</label>' +
        '</div>' +
        '<div class="form-check form-check-inline">' +
        '<input class="form-check-input" type="radio" name="inlineRadio" id="teacher-radio" value="teacher">' +
        '<label class="form-check-label" for="inlineRadio2"><span class="fa fa-graduation-cap"></span> un professeur</label>' +
        '</div>' +
        '</div>' +
        '<div id="teacher-form" style="display:none;"></div>' +
        '<label style="margin-top:13px;"><span class="fa fa-pencil-alt"></span> Bio<span class=\'mandatory\'>*  </span><span class="show-error alert alert-warning"></span></label>' +
        '<textarea style="margin-bottom:13px; min-height:100px;" class="form-control" id="bio-input" placeholder="votre biographie"></textarea>' +
        '<label for="pic-input"><span class="fa fa-file-image"></span> Image de profil</label></br>' +
        '<input class="form-control-file" id="pic-input" type="file" style="margin-bottom:5px;">' +
        '<p class="hint">Formats acceptés: jpeg, jpg, png. Max. 10Mo</p>' +
        '<div class="form-check">' +
        '<input type="checkbox" checked="checked" class="form-check-input" id="private-input">' +
        '<label for="private-input" class="form-check-label">Acceptez-vous que votre nom et prénom soient publics sur le site ?</label>' +
        '</div>' +
        '<div class="form-check">' +
        '<input type="checkbox" checked="checked" class="form-check-input" id="newsletter-input">' +
        '<label for="newsletter-input" class="form-check-label">Souhaitez-vous recevoir notre newsletter par mail ?</label>' +
        '</div>' +
        '<div class="form-check">' +
        '<input type="checkbox" checked="checked" class="form-check-input" id="mail-messages-input">' +
        '<label for="mail-messages-input" class="form-check-label">Souhaitez-vous recevoir des alertes par mail lors de la réception de nouveaux messages sur le site ?</label>' +
        '</div>' +
        '<div class="form-check">' +
        '<input type="checkbox" checked="checked" class="form-check-input" id="contact-input">' +
        '<label for="contact-input" class="form-check-label">Souhaitez-vous pouvoir être contacté par les autres utilisateurs du site ?</label>' +
        '</div>' +
        '<p class="hint" style="margin-top:10px;">En validant ce formulaire, vous acceptez les conditions générales d\'utilisation.</p>' +
        '<div style="display:none;" id="signup-progress-bar">' +
        '<div id="signup-progress-bar-completed">' +
        '<div id="signup-progress-bar-status"></div>' +
        '</div>' +
        '</div>' +
        "<div id='server-error'></div>" +
        '<button  disabled="disabled" onclick="submitSignup();" style="cursor:not-allowed; margin-bottom:15px;" id="submit-btn" class="btn  vitta-button center-btn">Valider</button>' +
        '</div>';
    div.appendChild(form);
    var confButton = document.getElementById("conf-btn");
    confButton.style.cursor = "not-allowed";
    confButton.setAttribute("disabled", "disabled");
    confButton.onclick = function (e) {
        var mail = document.getElementById("email-input").value.trim();
        e.preventDefault();
        checkMailExists(mail, mailSignupCallback);
    };

    var surnameInput = document.getElementById("surname-input");
    surnameInput.onkeyup = function () {
        checkName(this, SURNAME_MIN_LENGTH, SURNAME_MAX_LENGTH);
        checkSignupFirst();
    };

    var firstnameInput = document.getElementById("firstname-input");
    firstnameInput.onkeyup = function () {
        checkName(this, FIRSTNAME_MIN_LENGTH, FIRSTNAME_MAX_LENGTH);
        checkSignupFirst();
    };

    var emailInput = document.getElementById("email-input");
    emailInput.onkeyup = function () {
        checkMail(this);
        checkSignupFirst();
    };

    var phoneInput = document.getElementById("phone-input");
    phoneInput.onkeyup = function () {
        checkPhone(this);
        checkSignupFirst();
    };


    var passwordInput = document.getElementById("pwd-input");
    passwordInput.onkeyup = function () {
        checkPasswords(this, document.getElementById("pwd-conf-input"));
        checkSignupFirst();
    };

    var passwordConfInput = document.getElementById("pwd-conf-input");
    passwordConfInput.onkeyup = function () {
        checkPasswords(document.getElementById("pwd-input"), this);
        checkSignupFirst();
    };

    var bioInput = document.getElementById("bio-input");
    bioInput.onkeyup = function () {
        checkText(this, BIO_MIN_LENGTH, BIO_MAX_LENGTH);
        checkSignupSecond();
    };

    $("#signup-div").show("slow");
}

function checkSignupFirst() {
    var confButton = document.getElementById("conf-btn");

    var surnameInput = document.getElementById("surname-input");
    var firstnameInput = document.getElementById("firstname-input");
    var emailInput = document.getElementById("email-input");
    var telephoneInput = document.getElementById("phone-input");
    var passwordInput = document.getElementById("pwd-input");
    var passwordConfInput = document.getElementById("pwd-conf-input");

    var error = true;

    if (surnameInput.className === "form-control is-valid" &&
        firstnameInput.className === "form-control is-valid" &&
        emailInput.className === "form-control is-valid" &&
        passwordInput.className === "form-control is-valid" &&
        passwordConfInput.className === "form-control is-valid") {
        error = false;
    }

    if (telephoneInput.className === "form-control is-invalid") {
        error = true;
    }

    if (error) {
        confButton.style.cursor = "not-allowed";
        confButton.setAttribute("disabled", "disabled");
    } else {
        confButton.style.cursor = "pointer";
        confButton.removeAttribute("disabled");
    }
}

function closeSignup() {
    $("#signup-div").hide(1000);
}

function showSecondSignupForm() {
    $("#first-form").fadeOut("slow", function () {
        $("#second-form").fadeIn("slow");
        document.getElementById("signup-back-button").onclick = function () {
            $("#second-form").fadeOut("slow", function () {
                $("#first-form").fadeIn("slow");
            });
            checkSignupSecond();
        };

        document.getElementById("normal-radio").onclick = function () {
            $("#teacher-form").fadeOut("slow", function () {
                var teacherForm = document.getElementById("teacher-form");
                for (var i = teacherForm.childNodes.length - 1; i >= 0; i--) {
                    teacherForm.removeChild(teacherForm.childNodes[i]);
                }
                checkSignupSecond();
            });
        };

        document.getElementById("teacher-radio").onclick = function () {
            var teacherForm = document.getElementById("teacher-form");
            teacherForm.innerHTML =
                "<div class='form-row' style='margin-top:13px;'>" +
                "<label for='teacher-grade-input'>" + i18next.t('signup-popup.teacher-grade') + "<span class='mandatory'>*</span></label>" +
                "<select id='teacher-grade-input' class='form-control'>" +
                "<option value='1'>" + i18next.t('signup-popup.grades.primary') + "</option>" +
                "<option value='2'>" + i18next.t('signup-popup.grades.middle') + "</option>" +
                "<option value='3'>" + i18next.t('signup-popup.grades.high') + "</option>" +
                "<option value='4'>" + i18next.t('signup-popup.grades.higher') + "</option>" +
                "</select>" +
                '</div>' +
                "<div class='form-row' style='margin-top:13px;'>" +
                '<div class="form-group col-md-6">' +
                "<label for='teacher-school-input'>" + i18next.t('signup-popup.establishement') + "<span class='mandatory'>*</span></label>" +
                "<input placeholder=\"" + i18next.t('signup-popup.establishementPlaceholder') + "\" class='form-control' id='teacher-school-input'>" +
                '</div>' +
                '<div class="form-group col-md-6">' +
                "<label for='teacher-school-input'>" + i18next.t('signup-popup.subject') + "<span class='mandatory'>*</span></label>" +
                "<select class='form-control' id='teacher-subject-input'>" +
                "</select>" +
                '</div>' +
                "</div>";

            document.getElementById("teacher-grade-input").onchange = function () {
                var grade = parseInt(this.value);
                fillSubjects(grade);
            };

            fillSubjects(1);

            var schoolInput = document.getElementById("teacher-school-input");
            schoolInput.onkeyup = function () {
                checkText(this, TEACHER_SCHOOL_MIN_LENGTH, TEACHER_SCHOOL_MAX_LENGTH);
                checkSignupSecond();
            };
            schoolInput.onchange = function () {
                checkText(this, TEACHER_SCHOOL_MIN_LENGTH, TEACHER_SCHOOL_MAX_LENGTH);
                checkSignupSecond();
            };


            $("#teacher-form").fadeIn("slow");
            $("#teacher-school-input").easyAutocomplete(autoCompleteSchoolOptions);
            checkSignupSecond();
        };
    });
}

function checkSignupSecond() {
    var bioInput = document.getElementById("bio-input");
    var schoolInput = document.getElementById("teacher-school-input");
    var submit = document.getElementById("submit-btn");

    var error = true;

    if (bioInput.className === "form-control is-valid") {
        error = false;
    }

    if (schoolInput !== null) {
        if (schoolInput.className !== "form-control is-valid") {
            error = true;
        }
    }
    if (error) {
        submit.style.cursor = "not-allowed";
        submit.setAttribute("disabled", "disabled");
    } else {
        submit.style.cursor = "pointer";
        submit.removeAttribute("disabled");
    }
}

function mailSignupCallback(exists) {
    var emailInput = document.getElementById("email-input");
    var errorBox = document.getElementById("mail-error");
    if (exists === false) {
        errorBox.innerHTML = "";
        errorBox.className = "";
        showSecondSignupForm();
    } else {
        emailInput.className = "form-control is-invalid";
        errorBox.className = "alert alert-danger";
        errorBox.innerHTML = i18next.t('signup-popup.errors.mailUsed', {
            'mail': emailInput.value.trim()
        });
        $("#mail-error").fadeIn("slow");
        checkSignupFirst();
    }
}

function submitSignup() {

    var button = document.getElementById("submit-btn");
    disableButton(button);

    var surname = document.getElementById("surname-input").value.trim();
    var firstname = document.getElementById("firstname-input").value.trim();
    var email = document.getElementById("email-input").value.trim();
    var phone = document.getElementById("phone-input").value.trim();
    var password = document.getElementById("pwd-input").value;
    var bio = document.getElementById("bio-input").value.trim();

    var picture = document.getElementById("pic-input").files[0];

    var teacher = false;

    if (document.getElementById("teacher-radio").checked)
        teacher = true;

    var newsletter = "0";
    var privateFlag = "1";
    var mailMessages = "0";
    var contact = "0";

    if (document.getElementById("newsletter-input").checked)
        newsletter = "1";
    if (document.getElementById("private-input").checked)
        privateFlag = "0";
    if (document.getElementById("mail-messages-input").checked)
        mailMessages = "1";
    if (document.getElementById('contact-input').checked)
        contact = "1";

    if (teacher) {
        var school = document.getElementById("teacher-school-input").value.trim();
        var subject = document.getElementById("teacher-subject-input").value;
        var grade = document.getElementById("teacher-grade-input").value;
    }

    var formData = new FormData();

    formData.append("surname", surname);
    formData.append("firstname", firstname);
    formData.append("email", email);
    formData.append("newsletter", newsletter);
    formData.append("private", privateFlag);
    formData.append("contact", contact);
    formData.append("mailMessages", mailMessages);
    if (phone.length > 0)
        formData.append("phone", phone);
    formData.append("password", password);
    formData.append("bio", bio);
    if (teacher) {
        formData.append("school", school);
        formData.append("subject", subject);
        formData.append("grade", grade);
    }

    if (picture !== null && picture !== undefined)
        formData.append("picture", picture);

    var request = getAjaxRequest();

    if ($("#signup-progress-bar").is(":visible")) {
        $("#signup-progress-bar").css("display", "none");
        $("#signup-progress-bar-status").val("");
        $("#signup-progress-bar-completed").css("width", "0");
    }

    request.upload.onprogress = function (ev) {
        if (ev.lengthComputable) {
            var percentComplete = Math.floor((ev.loaded / ev.total) * 100);
            var bar = document.getElementById("signup-progress-bar-completed");
            bar.style.width = percentComplete + "%";
            document.getElementById("signup-progress-bar-status").innerHTML =
                percentComplete.toString() + "%";
        }
    };

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                enableButton(button);
                var response = JSON.parse(request.responseText);
                if (response.success === true) {
                    var signupDiv = document.getElementById("signup-div");
                    signupDiv.innerHTML =
                        "<div class='alert alert-success'>" +
                        "<button class='btn vitta-button quit-button' type='button' onclick='closeSignup();'><span class='fa fa-times-circle'></span></button>" +
                        "<p>" + i18next.t('signup-popup.success.main', {
                            'mail': email
                        }) + "</p>" +
                        "<p>" + i18next.t('signup-popup.success.notice') + "</p></div>";
                } else {
                    enableButton(button);
                    var errorDiv = document.getElementById("server-error");
                    errorDiv.className = "alert alert-danger";
                    errorDiv.innerHTML = "";
                    var errorList = document.createElement("ul");
                    errorDiv.appendChild(errorList);
                    for (var i = 0; i < response.errors.length; i++) {
                        var error = document.createElement("li");
                        error.innerHTML = response.errors[i];
                        errorList.appendChild(error);
                    }
                }
            } else {
                enableButton(button);
                console.log("Request failed: " + status);
            }
        }
    };
    $("#signup-progress-bar").fadeIn("slow", function () {
        request.open("POST", "/routing/Routing.php?controller=user&action=signup");
        request.send(formData);
    });
}

function checkPhone(element) {
    var value = element.value.trim();
    if (value.length === 0)
        element.className = 'form-control';
    else if (value.length >= MIN_PHONE_LENGTH && value.length < MAX_PHONE_LENGTH)
        element.className = 'form-control is-valid';
    else
        element.className = 'form-control is-invalid';
}

function fillSubjects(grade) {
    document.getElementById("teacher-subject-input").innerHTML = "";
    grade--;
    for (var i = 0; i < resource_GradeSubjects[grade].length; i++) {
        var subject = document.createElement("option");
        subject.value = (i + 1).toString();
        subject.innerHTML = resource_GradeSubjects[grade][i];
        document.getElementById("teacher-subject-input").appendChild(subject);
    }

}


$('body').on("focusout", '.form-control', function () {
    let el = $(this)
    switch (el.attr('id')) {
        case "phone-input":
            signunError(el, "phone-input")
            break;
        case "surname-input":
            signunError(el, 'surname-input')
            break;
        case "firstname-input":
            signunError(el, 'firstname-input')
            break;
        case "email-input":
            signunError(el, 'email-input')
            break;
        case "pwd-input":
            signunError(el, 'pwd-input')
            break;
        case "pwd-conf-input":
            signunError(el, 'pwd-conf-input')
            break;
        case "bio-input":
            signunError(el, 'bio-input')
            break;
    }

})

function signunError(el, id) {
    if (el.hasClass('is-invalid')) {
        el.parent().find('.show-error').html(i18next.t('signup.' + id))
        el.parent().find('.show-error').attr('style', 'display:inline;')
    } else {
        el.parent().find('.show-error').html('')
        el.parent().find('.show-error').attr('display', 'none')
    }
}