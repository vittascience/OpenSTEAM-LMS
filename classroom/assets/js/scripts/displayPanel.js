function DisplayPanel() { }

DisplayPanel.prototype.classroom_dashboard_classes_panel_teacher = function () {
    classroomsDisplay();
}

DisplayPanel.prototype.classroom_dashboard_new_activity_panel2 = function (id) {
    $('#new-activity-panel3').attr("onclick", "attributeActivity(" + id + ")")
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_teacher = function () {
    $('#user-name-teacher').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
    Main.getClassroomManager().getTeacherActivity().then(function (data) {
        const ownedActivitiesElement = $('.owned-activities');
        ownedActivitiesElement.html(data.ownedActivities);
        
        ownedActivitiesElement.attr('aria-label', `${data.ownedActivities} activités créées`);
        
        const activitiesButton = $('.activity-panel-link-t');
        activitiesButton.attr('aria-label', `Accéder au panneau des activités - ${data.ownedActivities} activités créées`);
        activitiesButton.attr('title', `Gérer vos activités - ${data.ownedActivities} activités créées`);
        
        if (typeof notifyA11y !== 'undefined') {
            notifyA11y(`Nombre d'activités créées : ${data.ownedActivities}`, "info");
        }

    })
    
    getIntelFromClasses().then(function() {
        const correctionsCount = getRemainingCorrections(Main.getClassroomManager()._myClasses.flatMap(c => c.students));
        const correctionsElement = $('.tocorrect-activities');
        correctionsElement.html(correctionsCount);
        
        const correctionsButton = $('.classroom-panel-link');
        correctionsButton.attr('aria-label', `Accéder au panneau des classes - ${correctionsCount} ${correctionsCount === 1 ? 'correction à faire' : 'corrections à faire'}`);
        correctionsButton.attr('title', `Gérer vos classes - ${correctionsCount} ${correctionsCount === 1 ? 'correction à faire' : 'corrections à faire'}`);
    });
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_groupadmin = function () {
    $('#user-name-groupadmin').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_manager = function () {
    $('#user-name-manager').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
}

DisplayPanel.prototype.classroom_dashboard_profil_panel = function () {
    $('#user-name').html(UserManager.getUser().pseudo)
    Main.getClassroomManager().getStudentActivity().then(function (data) {
        const todoCount = countActivityDoable();
        const doneCount = data.doneActivities;
        
        $('.todo-activities').html(todoCount)
        $('.todo-courses').html(data.todoCourses)
        $('.done-activities').html(doneCount)
        $('.done-courses').html(data.doneCourses)
        
        const todoButton = document.querySelector('#classroom-dashboard-profile-stats .activity-panel-link[style*="grid-column: 1"]');
        const doneButton = document.querySelector('#classroom-dashboard-profile-stats .activity-panel-link[style*="grid-column: 2"]');
        
        if (todoButton) {
            todoButton.setAttribute('aria-label', `Activités à faire, ${todoCount} ${todoCount === 1 ? 'activité à faire' : 'activités à faire'}`);
        }
        
        if (doneButton) {
            doneButton.setAttribute('aria-label', `Activités terminées, ${doneCount} ${doneCount === 1 ? 'activité terminée' : 'activités terminées'}`);
        }
    })
}


DisplayPanel.prototype.classroom_dashboard_ide_panel = function (option) {
    if (option == "python" || option == "microbit" || option == "arduino" || option == "esp32" || option == "quickpi" || option == "adacraft" || option == "wb55" || option == "TI-83") {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/' + option + '/?console=bottom&use=classroom&embed=1&action=new"></iframe>')
    } else if (option == "texas-instruments") {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/microbit/?toolbox=texas-instruments&console=bottom&use=classroom&embed=1&action=new"></iframe>');
    } else {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/' + $_GET('interface') + '/?link=' + option + '&embed=1"></iframe>')
    }


    // Hiding the share option in the interface saving process
    function hideShareOptionArea(iframe) {
        let shareOptAreaElt = iframe.contentWindow.document.getElementById('check_box_div');
        let shareOptDescElt = iframe.contentWindow.document.getElementById('check_box_hint');
        if (shareOptAreaElt) {
            shareOptAreaElt.style.position = 'absolute';
            shareOptAreaElt.style.top = '-9999px';
            shareOptAreaElt.style.left = '-9999px';
            shareOptDescElt.style.position = 'absolute';
            shareOptDescElt.style.top = '-9999px';
            shareOptDescElt.style.left = '-9999px';
        } else {
            setTimeout(() => { hideShareOptionArea(iframe) }, 400);
        }
    }

    document.querySelector('iframe').addEventListener('load', (e) => {
        let iframe = e.target;
        hideShareOptionArea(iframe);
    });
}

DisplayPanel.prototype.classroom_dashboard_activities_panel = function () {
    $('table').localize();
    // Refresh the activities
    Main.getClassroomManager().getStudentActivities(Main.getClassroomManager()).then(() => {
        coursesManager._requestGetMyCourseStudent().then((data) => {
            Main.getClassroomManager()._myCourses = data;
            studentActivitiesDisplay();
        })
    });
}

DisplayPanel.prototype.classroom_dashboard_activities_panel_library_teacher = function () {
    if (!$("#resource-center-classroom").length) {
        $('#classroom-dashboard-activities-panel-library-teacher').html('<iframe id="resource-center-classroom" src="/learn/?use=classroom" frameborder="0" style="height:80vh;width:80vw" title="Centre de ressources - Bibliothèque d\'activités"></iframe>')
    }
}

DisplayPanel.prototype.classroom_dashboard_help_panel = function () {
    if (!Main.getClassroomManager()._myTeachers) {
        Main.getClassroomManager().getTeachers(Main.getClassroomManager()).then(function () {
            teachersList()
        })
    } else {
        teachersList()
    }

    let html = ''
    let index = [3, 2, 4, 4, 3, 2]
    for (let i = 1; i <= index.length; i++) {
        html += "<h4 data-i18n='[html]faqStudentNeutral." + i + ".section_title'></h4>";
        for (let j = 1; j < index[i - 1]; j++) {
            html += `<div class="kit-faq-box">
            <div class="faq-box-header" style="transform: rotate(0deg); transform-origin: 50% 50% 0px;">
                <div class="faq-box-dropdown">
                    <span class="fa fa-chevron-right" style="line-height:40px; font-size:16px;"></span>
                </div>
                <p style="font-size:16px; margin:0; padding:0;">
                    <b data-i18n='[html]faqStudentNeutral.` + i + `.question_list.` + j + `.title'></b>
                </p>
            </div>
            <div class="faq-box-content">
            <p data-i18n='[html]faqStudentNeutral.` + i + `.question_list.` + j + `.answer'></p>
            </div>
        </div>`

        }
    }
    $('#student-faq-container').html(html)
    $("#student-faq-container").localize();

    var headers = document.getElementsByClassName("faq-box-header");
    $(headers).rotate({
        bind: {
            click: function () {
                var drop = $(this).find(".faq-box-dropdown");
                var content = $(this).parent().find(".faq-box-content");
                if (drop.hasClass("dropped")) {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 0
                    });
                    content.fadeOut("slow", function () {
                        drop.removeClass("dropped");
                    });
                } else {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 90
                    });
                    content.fadeIn("slow", function () {
                        drop.addClass("dropped");
                    });
                }
            }
        }
    });
}

DisplayPanel.prototype.classroom_dashboard_help_panel_teacher = function () {
    let html = '';
    let index = [7, 12, 5, 3, 3, 3]; // number of questions+1 per category in faq

    let capitalizedDemoStudentName = `${demoStudentName.charAt(0).toUpperCase()}${demoStudentName.slice(1)}`;

    for (let i = 1; i <= index.length; i++) {
        const sectionTitle = i18next.t(`faqTeacherNeutral.${i}.section_title`);
        html += `<section class="faq-section" aria-label="${sectionTitle}">
            <h2 data-i18n='[html]faqTeacherNeutral.${i}.section_title'></h2>`;

        for (let j = 1; j < index[i - 1]; j++) {
            let id = `faq${i}-${j}`;
            html += `
            <div class="kit-faq-box">
                <div class="faq-box-header" style="cursor: pointer;" role="button" tabindex="0"
                    aria-expanded="false"
                    aria-controls="${id}-panel"
                    id="${id}-button"
                >
                    <div class="faq-box-dropdown">
                        <span class="fa fa-chevron-right" aria-hidden="true" style="line-height:40px; font-size:16px;"></span>
                    </div>
                    <p style="font-size:16px; margin:0; padding:0;">
                        <b data-i18n='[html]faqTeacherNeutral.${i}.question_list.${j}.title'></b>
                    </p>
                </div>
                <div class="faq-box-content" id="${id}-panel" role="region" aria-labelledby="${id}-button" style="display: none;">
                    <p data-i18n='[html]faqTeacherNeutral.${i}.question_list.${j}.answer'
                       data-i18n-options='{"demoStudent":"${capitalizedDemoStudentName}"}'></p>
                </div>
            </div>`;
        }

        html += `</section>`;
    }

    $('#teacher-faq-container').html(html);
    $("#teacher-faq-container").localize();

    $(document).on('click keydown', '.faq-box-header', function (e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            const header = $(this);
            const panelId = header.attr('aria-controls');
            const panel = $('#' + panelId);
            const icon = header.find('.fa');
            const expanded = header.attr('aria-expanded') === 'true';

            header.attr('aria-expanded', String(!expanded));
            icon.toggleClass('fa-chevron-right fa-chevron-down');
            panel.stop(true, true).slideToggle(300);
        }
    });
};


DisplayPanel.prototype.classroom_dashboard_sandbox_panel = function () {
    ClassroomSettings.activity = false
    if (!Main.getClassroomManager()._myProjects) {
        Main.getClassroomManager().getSandboxProject(Main.getClassroomManager()).then(function () {
            sandboxDisplay()
        })
    } else {
        sandboxDisplay()
    }
}

DisplayPanel.prototype.classroom_dashboard_form_classe_panel = function () {
    //document.querySelector('#classroom-form-is-blocked').checked = false;
    $('#classroom-form-name').val('');
    $('#classroom-form-school').val('');
    //$('#add-student-div').html(BASE_STUDENT_FORM);
}

DisplayPanel.prototype.classroom_dashboard_form_classe_panel_update = function () {
    let classroom = getClassroomInListByLink(ClassroomSettings.classroom)[0];
    $('#classroom-form-name-update').val(classroom.classroom.name);
    $('#classroom-form-school-update').val(classroom.classroom.school);
    $('#add-student-div').html(BASE_STUDENT_FORM);
    if (classroom.classroom.isBlocked) {
        document.querySelector('#classroom-form-is-blocked-update').checked = true;
    } else {
        document.querySelector('#classroom-form-is-blocked-update').checked = false;
    }
    $('#table-students-update ul').html("");
    classroom.students.forEach(function (student) {
        $('#table-students-update ul').append(addStudentRow(student.user.pseudo, student.user.id, true));
    })
}

DisplayPanel.prototype.classroom_dashboard_activities_panel_teacher = function () {
    tagManagement();
    ClassroomSettings.activity = false;
    if (foldersManager) {
        if (foldersManager.actualFolder != null) {
            foldersManager.goToFolder(null)
        }
    }
}

async function tagManagement() {

    const tags = await Main.getClassroomManager().getAllTags();
    if (!tags) {
        return;
    }

    if (tags.tags.length > 0) {
        const tagsForActivities = document.getElementById("tags-activities");
        const tagsForPanel = document.getElementById("tags-panel");
        tagsForActivities.classList.remove("d-none");
        tagsForActivities.classList.add("d-flex");
        tagsForPanel.classList.remove("d-none");
    }

    if (Main.getClassroomManager().tagList == tags.tags) {
        return;
    }


    Main.getClassroomManager().tagList = tags.tags;

    let tagDropdown = document.getElementById("dropdown-tags-filter");
    let tagListSelect = document.getElementById("taglist-select");

    if (tagDropdown) {
        tagDropdown.innerHTML = "";
    }

    if (tagListSelect) {
        tagListSelect.innerHTML = "";
    }

    // order by parent tag
    tags.tags.sort((a, b) => {
        if (a.parentTag == null && b.parentTag != null) {
            return -1;
        } else if (a.parentTag != null && b.parentTag == null) {
            return 1;
        } else {
            return 0;
        }
    });


    tags.tags.forEach((tag) => {

        if (tagListSelect) {
            if (tag.parentTag != null) {
                let parentTag = tag.parentTag;
                let parentTagId = parentTag.id;
                let parentTagName = parentTag.name;

                let parentTagElement = document.getElementById(`parent-tag-${parentTagId}`);
                if (parentTagElement) {
                    parentTagElement.innerHTML += `<option value="${tag.id}">${tag.name}</option>`;
                } else {
                    tagListSelect.innerHTML += `<optgroup label="${parentTagName}" id="parent-tag-${parentTagId}">
                            <option value="${tag.id}">${tag.name}</option>
                        </optgroup>`;
                }

            }
        }

        if (tagDropdown) {
            if (tag.parentTag == null) {
                tagDropdown.innerHTML += `<fieldset id="field-${tag.id}" class="my-2">
                    <legend class="mx-2 vitta-modal-title">${tag.name}</legend>
                    </fieldset>`;
            } else {
                let parentDiv = document.getElementById(`field-${tag.parentTag.id}`);
                parentDiv.innerHTML += `<div class="dropdown-item c-checkbox">
                    <input class="form-check-input" data-id="${tag.id}" data-name="${tag.name}" type="checkbox" id="filter-activity-type-${tag.name}">
                    <label class="form-check-label" for="filter-activity-type-${tag.name}" id="filter-${tag.name}">${tag.name}</label>
                    </div>`
            }
        }

    });

    if (tagDropdown) {
        document.querySelectorAll('[id^="filter-activity-type-"]').forEach((checkbox) => {
            // add event listener to each checkbox
            checkbox.addEventListener("change", (event) => {
                processDisplay();
            });
        });
    }
}

DisplayPanel.prototype.classroom_table_panel_teacher = function (link) {
    if (link != 'null') {
        // hide the non relevant elements in gar context
        if (UserManager.getUser().isFromGar) {
            document.getElementById('add-student-container').style.display = 'none';
            document.getElementById('classroom-info').style.display = 'none';
        }
        let realCode = document.getElementById('complete-classroom-link');
        resetDisplayClassroom();
        breadcrumbManager.setSpecificClass(getClassroomInListByLink(ClassroomSettings.classroom)[0].classroom.name, link);
        // restore the add student div to its default content to remove potential changes from the update classroom modal
        $('#classroom-form-name').val(''),
            $('#classroom-form-school').val('')
        $('#add-student-div').html(BASE_STUDENT_FORM);
        if (!Main.getClassroomManager()._myClasses) {
            Main.getClassroomManager().getClasses().then(function () {
                let students = getClassroomInListByLink(link)[0].students
                displayStudentsInClassroom(students, link)
                $('.classroom-link').html(ClassroomSettings.classroom)
                let realCode = document.getElementById('complete-classroom-link');
                realCode.innerHTML = document.location.origin + '/classroom/login.php?link=' + ClassroomSettings.classroom;
            })
        } else {
            if (link == null || link == '') {
                if (ClassroomSettings.classroom != null) {
                    link = ClassroomSettings.classroom;
                } else {
                    navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher');
                    return;
                }
            }

            $('.classroom-link').html(ClassroomSettings.classroom)
            realCode.innerHTML = document.location.origin + '/classroom/login.php?link=' + ClassroomSettings.classroom;
            $('#classroom-code-share-qr-code').html('');
            currentOriginUrl = new URL(window.location.href).origin;
            fullPath = currentOriginUrl + '/classroom/login.php?link=' + ClassroomSettings.classroom;
            QrCreator.render({
                text: fullPath,
                radius: 0.5,
                ecLevel: 'H',
                fill: getComputedStyle(document.documentElement).getPropertyValue('--classroom-primary'),
                background: "white",
                size: 300
            }, document.querySelector('#classroom-code-share-qr-code'));

            // Block classroom feature
            if (getClassroomInListByLink(link)[0].classroom.isBlocked == false) {
                $('#blocking-class-tooltip').removeClass('greyscale')
                $('#blocking-class-tooltip > i.fa').removeClass('fa-lock').addClass('fa-lock-open');
                $('#classroom-info > *:not(#blocking-class-tooltip)').css('opacity', '1');
                $('#blocking-class-tooltip').tooltip("dispose");
                $('#blocking-class-tooltip').attr("title", i18next.t('classroom.classes.classroomUnlockedClickToLock')).tooltip();

            } else {
                $('#blocking-class-tooltip').addClass('greyscale')
                $('#blocking-class-tooltip > i.fa').removeClass('fa-lock-open').addClass('fa-lock');
                $('#classroom-info > *:not(#blocking-class-tooltip)').css('opacity', '0.5');
                $('#blocking-class-tooltip').tooltip("dispose");
                $('#blocking-class-tooltip').attr("title", i18next.t('classroom.classes.classroomLockedClickToUnlock')).tooltip();
            }

            Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                let students = getClassroomInListByLink(link)[0].students
                displayStudentsInClassroom(students, link);
            });
        }
        dashboardAutoRefresh.refreshLater();
    } else {
        navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher', 'WK' + id, '')
        displayNotification('#notif-div', "classroom.login.noClass", "error")
    }
}
DisplayPanel.prototype.classroom_dashboard_new_activity_panel3 = function (ref) {
    document.getElementById('attribute-activity-to-students').setAttribute('disabled', '');
    if (ref != null && ref != 'null') {
        // If the user don't come in this panel from the classroom dashboard and with the ref attribute (using the browser history or a simple refresh), we need to skip this panel
        if (typeof ClassroomSettings.indexRef == 'undefined') {
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
            return;
        }
        let attribution = getAttributionByRef(ref);
        let retroAttributionIsActive = ClassroomSettings.isRetroAttributed === true ? true : false;
        $('#retro-attribution-activity-form').prop('checked', retroAttributionIsActive)
        $('#introduction-activity-form').val(attribution.introduction)
        $('#date-begin-activity-form').val(formatDateInput(new Date(attribution.dateBegin.date)))
        $('#date-end-activity-form').val(formatDateInput(new Date(attribution.dateEnd.date)))
        if (attribution.evaluation == false) {
            $('#isEval-activity-form').attr('checked', 'checked')
        } else {
            $('#isExo-activity-form').attr('checked', 'checked')
        }
        if (attribution.autocorrection == true) {
            ClassroomSettings.willAutocorrect = true;
        }
    } else {
        let now = new Date()
        let future = new Date();
        future.setMonth(future.getMonth() + 1);
        future.setDate(future.getMonth() + 1);
        $('#date-begin-activity-form').val(formatDateInput(now))
        $('#date-end-activity-form').val(formatDateInput(future))
        $('#introduction-activity-form').val('')
        $('#retro-attribution-activity-form').prop('checked', true)
    }
}

//COURSEDISPLAY
DisplayPanel.prototype.classroom_dashboard_activity_panel = function (id) {
    if (id != 'null') {
        if (UserManager.getUser().isRegular) {
            if (id.slice(0, 2) == "WK") {
                ClassroomSettings.activity = id = Number(id.slice(2))
                Activity = getActivity(id);
                getTeacherActivity();
            } else {
                ClassroomSettings.activity = id = Number(id.slice(2))
                Main.getClassroomManager().getOneUserLinkActivity(id).then(function (result) {
                    Activity = result;
                    loadActivityForTeacher();
                });
            }
        } else {
            if ($_GET('option') != "course") {
                if ($_GET('interface') == 'newActivities' || $_GET('interface') == 'savedActivities') {
                    var isDoable = true
                } else {
                    var isDoable = false
                }
                ClassroomSettings.activity = id = Number(id.slice(2))
                Activity = getActivity(id, $_GET('interface'))
                if (typeof Activity == 'undefined') {
                    console.error(`The activity can't be loaded!`);
                    navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities');
                    return;
                }
                // Run the activity tracker if the current activity is doable or exercise
                if (Activity.evaluation != true || Activity.correction == null) {
                    Main.activityTracker = new ActivityTracker();
                    Main.activityTracker.startActivityTracker();
                }
                loadCourseAndActivityForStudents(isDoable);
            }
        }
    }
}

function addZero(number, lenght) {
    number = String(number)

    while (number.length < lenght) {
        number = "0" + number
    }
    return number
}

function formatDateInput(date) {
    return date.getFullYear() + "-" + addZero((Number(date.getMonth()) + 1), 2) + "-" + addZero(date.getDate(), 2)
}

function createSwitchViewForTeacherActivity() {
    const titleDiv = document.getElementById('activity-views-switcher');
    titleDiv.innerHTML = '';

    const switcherDiv = createHtmlElement('div', {
        'class': 'd-flex',
        'role': 'group',
        'aria-labelledby': 'activity-views-label'
    });

    const legend = createHtmlElement('span', {
        'id': 'activity-views-label',
        'class': 'sr-only'
    }, i18next.t("classroom.activities.switch.view.label"));

    const switcher = createHtmlElement('div', {
        'class': 'switcher'
    });

    const doableTrue = createHtmlElement('input', {
        'type': 'radio',
        'class': 'switcher__input switcher__input--left',
        'name': 'option-doable',
        'id': 'option-doable-true',
        'autocomplete': 'off',
        'value': 'to-complete',
        'checked': 'checked'
    });

    const doableTrueLabel = createHtmlElement('label', {
        'class': 'switcher__label',
        'for': 'option-doable-true'
    }, i18next.t("classroom.activities.toComplete"));

    const doableFalse = createHtmlElement('input', {
        'type': 'radio',
        'class': 'switcher__input switcher__input--right',
        'name': 'option-doable',
        'id': 'option-doable-false',
        'autocomplete': 'off',
        'value': 'corrected'
    });

    const doableFalseLabel = createHtmlElement('label', {
        'class': 'switcher__label',
        'for': 'option-doable-false'
    }, i18next.t("classroom.activities.corrected"));

    const toggleSpan = createHtmlElement('span', {
        'class': 'switcher__toggle',
        'aria-hidden': 'true'
    });

    switcher.appendChild(doableTrue);
    switcher.appendChild(doableTrueLabel);
    switcher.appendChild(doableFalse);
    switcher.appendChild(doableFalseLabel);
    switcher.appendChild(toggleSpan);

    switcherDiv.appendChild(legend);
    switcherDiv.appendChild(switcher);
    titleDiv.appendChild(switcherDiv);
}


function getTeacherActivity() {
    resetInputsForActivity();

    const titleContainer = $('#activity-title');
    titleContainer.html(Activity.title);

    if (Activity.isAutocorrect) {
        const disclaimerElt = `
            <img 
                id="activity-auto-disclaimer"
                src="${_PATH}assets/media/auto-icon.svg"
                alt="${i18next.t('classroom.activities.isAutocorrect')}"
                role="img"
                aria-describedby="auto-desc"
                tabindex="0"
            >
            <span id="auto-desc" class="sr-only">
                ${i18next.t('classroom.activities.isAutocorrect')}
            </span>
        `;
        titleContainer.append(disclaimerElt);
    }

    const activityDropdownElt = `
        <div class="dropdown mx-2">
            <button 
                class="btn c-btn-outline-grey"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="activity-options-list"
            >
                ${capitalizeFirstLetter(i18next.t('words.options'))}
                <i class="fas fa-cog" aria-hidden="true"></i>
            </button>
    
            <ul id="activity-options-list" class="dropdown-menu" role="menu" aria-label="${i18next.t('words.options')}">
                <button class="dropdown-item" role="menuitem" tabindex="-1" onclick="attributeActivity(${Activity.id})">
                    ${capitalizeFirstLetter(i18next.t('words.attribute'))}
                </button>
                <button class="dropdown-item" role="menuitem" tabindex="-1" onclick="createActivity(null,${Activity.id})">
                    ${capitalizeFirstLetter(i18next.t('words.duplicate'))}
                </button>
                <button class="dropdown-item" role="menuitem" tabindex="-1" onclick="activityModify(${Activity.id})">
                    ${capitalizeFirstLetter(i18next.t('words.modify'))}
                </button>
                <button class="dropdown-item" role="menuitem" tabindex="-1" onclick="activityModify(${Activity.id}, true)">
                    ${capitalizeFirstLetter(i18next.t('words.rename'))}
                </button>
                <button class="dropdown-item modal-activity-delete" role="menuitem" tabindex="-1">
                    ${capitalizeFirstLetter(i18next.t('words.delete'))}
                </button>
            </ul>
        </div>`;
    titleContainer.append(activityDropdownElt);

    document.querySelectorAll('#activity-options-list .dropdown-item').forEach(item => {
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    const doableActivities = ['fillIn', 'dragAndDrop', 'free', 'quiz'];
    if (doableActivities.includes(Activity.type) && Activity.type !== 'lti') {
        createSwitchViewForTeacherActivity();
        loadActivityContent(true);
    } else {
        $('#activity-views-switcher').html('');
        loadActivityContent(false);
    }

    const switchPreview = document.getElementsByName('option-doable');
    switchPreview.forEach(input => {
        input.addEventListener('click', () => {
            const isDoable = input.id === 'option-doable-true';
            loadActivityContent(isDoable);
        });
    });
}

function getIntelFromClasses() {
    $('#list-classes').html('')
    let classes = Main.getClassroomManager()._myClasses
    if (classes.length == 0) {
        const tocorrectElement = $('.tocorrect-activities');
        tocorrectElement.html('0');
        tocorrectElement.attr('aria-label', '0 activités à corriger');
        
        const classesButton = $('.classroom-panel-link');
        classesButton.attr('aria-label', 'Accéder au panneau des classes - 0 activités à corriger');
        classesButton.attr('title', 'Gérer vos classes - 0 activités à corriger');
        
        if (typeof notifyA11y !== 'undefined') {
            notifyA11y("Aucune activité à corriger", "info");
        }
        
        if (document.querySelector('#mode-student-check').parentElement.querySelector('p.no-classes') === null) {
            $('#mode-student-check').after(NO_CLASS);
        }
        $('#mode-student-check').hide()

    } else {
        let correctionCount = 0
        classes.forEach((element, e) => {
            element.students.forEach(e => {
                e.activities.forEach(a => {
                    if (a.correction == 1) {
                        correctionCount++
                    }
                })
            })
            // Auto select the first class
            if (e == 0) {
                ClassroomSettings.classroom = element.classroom.link;
            }
            $('#list-classes').append(`
            <label class="c-radio mb-3">
                <input type="radio" name="classroom" id="${element.classroom.link}" value="${element.classroom.link}" ${e == 0 ? "checked" : ""} />
                ${element.classroom.name}
            </label>`)
        });
        $('.no-classes').remove()
        $('#mode-student-check').show()
        
        const tocorrectElement = $('.tocorrect-activities');
        tocorrectElement.html(correctionCount);
        tocorrectElement.attr('aria-label', `${correctionCount} activités à corriger`);
        
        const classesButton = $('.classroom-panel-link');
        const correctionText = correctionCount > 0 
            ? `${correctionCount} activité${correctionCount > 1 ? 's' : ''} à corriger`
            : 'aucune activité à corriger';
        classesButton.attr('aria-label', `Accéder au panneau des classes - ${correctionText}`);
        classesButton.attr('title', `Gérer vos classes - ${correctionText}`);
        
        if (typeof notifyA11y !== 'undefined') {
            const message = correctionCount > 0 
                ? `${correctionCount} activité${correctionCount > 1 ? 's' : ''} à corriger`
                : "Aucune activité à corriger";
            notifyA11y(message, "info");
        }
    }
}