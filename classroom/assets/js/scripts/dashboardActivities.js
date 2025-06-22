function activityItem(activity, state) {
    // Add class to activity card depending on activity type
    let activityType = "activity-card-" + activity.activity.type;
    if (activity.activity.type == null || activity.activity.type == "") {
        activityType = "";
    }

    let activityStatus = "",
        activityStatusTitle = "";
    if (state == "doneActivities") {
        if (activity.note == 4) {
            activityStatus = "ribbon ribbon_no_grade";
            activityStatusTitle = i18next.t('classroom.activities.noProficiency')
        } else if (activity.note == 3) {
            activityStatus = "ribbon ribbon_accept"
            activityStatusTitle = i18next.t('classroom.activities.veryGoodProficiency')
        } else if (activity.note == 2) {
            activityStatus = "ribbon ribbon_vgood"
            activityStatusTitle = i18next.t('classroom.activities.goodProficiency')
        } else if (activity.note == 1) {
            activityStatus = "ribbon ribbon_good"
            activityStatusTitle = i18next.t('classroom.activities.weakProficiency')
        } else if (activity.note == 0) {
            activityStatus = "ribbon ribbon_refuse"
            activityStatusTitle = i18next.t('classroom.activities.insufficientProficiency')
        } else {
            activityStatus = ""
            activityStatusTitle = "?"
        }
    }

    let dateEndNotif = activity.activity.isLti ? "style='display:none'" : "";
    let html = `
      <div class="activity-item" 
           role="button" 
           tabindex="0" 
           aria-label="Activité ${activity.activity.title}"
           onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities', 'WK${activity.activity.id}', '${state}'); }">
        <div>
          <div class="activity-card ${activityType} ">                
            <div class="${activityStatus}" data-bs-toggle="tooltip" title="${activityStatusTitle}">
              <div class="ribbon__content"></div>
            </div>
            <div class="activity-card-top">
              ${activity.activity.isAutocorrect ? `<img src='${_PATH}assets/media/auto-icon.svg' title='Auto' alt='Activité auto-corrigée'>` : "" }
            </div>
            <div class="activity-card-mid"></div>
            <div class="activity-card-bot">
            <div class="info-tutorials" ${dateEndNotif} data-id="${activity.activity.id}"  data-state="${state}">
        `

    if (activity.dateEnd != undefined) {
        html += `<span> ` + i18next.t('classroom.activities.dateBefore') + ` ${formatDay(activity.dateEnd)} <i class="fas fa-stopwatch"></i></span>`
    }

    html += `</div></div></div>`
    html += `<h3 data-bs-toggle="tooltip" title="${activity.activity.title}" class="activity-item-title">${activity.activity.title}</h3>`
    html += `</div></div>`

    return html;
}

function courseItem(course, state) {
    let activityStatus = "";
    //let dateEndNotif = activity.activity.isLti ? "style='display:none'" : "";
    let html = `<div class="course-item" 
                     role="button" 
                     tabindex="0" 
                     aria-label="Parcours ${course.course.title}"
                     onclick="coursesManager.${course.course.format == 1 ? "readCourseOnePage" : "readCourseFromStudent"}('${course.course.id}', '${course.id}')"
                     onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); coursesManager.${course.course.format == 1 ? "readCourseOnePage" : "readCourseFromStudent"}('${course.course.id}', '${course.id}'); }">
                <div>
                    <div class="course-card">        
                        <div class="${activityStatus}" data-bs-toggle="tooltip" title="${course.course.title}"><div class="ribbon__content"></div></div>
                        <img src="${_PATH}assets/media/cards/card-course.png" class="course-card-img" alt="Icône de parcours">
                        <div class="course-card-info">
                            <div class="course-card-top">
                                
                            </div>
                            <div class="course-card-mid">
                                <span class="course-card-activities-count" aria-label="${course.activities ? course.activities.length : 0} activités">${course.activities ? course.activities.length : 0}</span>
                            </div>
                            <div class="course-card-bot">
                                <div class="info-tutorials" data-id="${course.course.id}"  data-state="${state}">`

    if (course.dateEnd != undefined) {
        html += `<span> ` + i18next.t('classroom.activities.dateBefore') + ` ${formatDay(course.dateEnd)} <i class="fas fa-stopwatch"></i></span>`
    }

    html += `</div></div></div></div>`
    html += `<h3 data-bs-toggle="tooltip" title="${course.course.title}" class="activity-item-title">${course.course.title}</h3>`
    html += `</div></div>`

    return html;
}

function teacherSandboxItem(json) {
    let html = `<div class="sandbox-item sandbox-teacher" 
                     role="button" 
                     tabindex="0" 
                     aria-label="Projet ${decodeURI(json.name)}"
                     onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.open('/${json.interface}/?link=${json.link}&embed=1', '_blank'); }">
                    <div class="sandbox-card sandbox-card-` + json.interface + `" data-id="${json.id}" data-href="/` + json.interface + `/?link=` + json.link + `&embed=1">
                        <div class="sandbox-card-top">
                        <i class="fas fa-share fa-2x" style="grid-column-start: 1; grid-column-end: 1;" data-link="${json.link}" aria-label="Partager" role="button" tabindex="0"></i>      
                            <div class="dropdown"><i class="fas fa-cog fa-2x" style="grid-column-start: 3; grid-column-end: 3;" type="button" id="dropdown-teacherSandboxItem-${json.id}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Options" role="button" tabindex="0"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-teacherSandboxItem-${json.id}">`
    if (UserManager.getUser().isRegular) {
        html += `<li class="classroom-clickable col-12 dropdown-item" onclick="integrateProject('${location.origin}/${json.interface}/?link=${json.link}&embed=1')" href="#">` + i18next.t('classroom.activities.integrate') + `</li>`
    }
    html += `<li class="modal-teacherSandbox-duplicate classroom-clickable col-12 dropdown-item" href="#">` + capitalizeFirstLetter(i18next.t('words.duplicate')) + `</li>
                <li class="dropdown-item modal-teacherSandbox-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
                </div>
                </div>
                        </div>
                        <div class="sandbox-card-mid"></div>
                        <div class="sandbox-card-bot"></div>
                    </div>
                    <h5 class="sandbox-item-title">` + decodeURI(json.name) + `</h5>
                </div> `
    return html
}

function teacherActivityItem(activity, displayStyle) {
    let activityType = "activity-card-" + activity.type;
    if (activity.type == null || activity.type == "") {
        activityType = "";
    }
    let content = "";
    if (displayStyle == "card") {
        content = `
        <div class="activity-item activity-teacher" data-id="${activity.id}" role="article">
            <div style="position: relative;">
                <div class="activity-card ${activityType}" 
                    role="button"
                    tabindex="0"
                    aria-label="${activity.title}"
                    onclick="if(!event.target.closest('.dropdown')) { this.click(); }"
                    onkeydown="if((event.key==='Enter'||event.key===' ') && !event.target.closest('.dropdown')) { event.preventDefault(); this.click(); }"
                >
                    <div class="activity-card-top">
                        ${activity.isAutocorrect ? `<img src='${_PATH}assets/media/auto-icon.svg' title='${i18next.t('words.autocorrect')}' alt='${i18next.t('words.autocorrect')}' style="padding-right: 35px;">` : ""}
                    </div>
                    <div class="activity-card-mid"></div>
                    <div class="activity-card-bot">
                        <div class="info-tutorials" data-id="${activity.id}"></div>
                    </div>
                </div>
                <div class="dropdown" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                    <button
                        type="button"
                        id="dropdown-activityItem-${activity.id}"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-label="${i18next.t('words.options')} ${activity.title}"
                        onclick="event.stopPropagation()"
                        style="padding: 0; border: none; background: transparent; box-shadow: none; outline: none;">
                        <i class="fas fa-cog fa-2x"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdown-activityItem-${activity.id}" role="menu">
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="attributeActivity(${activity.id})">${capitalizeFirstLetter(i18next.t('words.attribute'))}</button>
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="createActivity(null,${activity.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</button>
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="activityModify(${activity.id})">${capitalizeFirstLetter(i18next.t('words.modify'))}</button>
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="activityModify(${activity.id}, true)">${capitalizeFirstLetter(i18next.t('words.rename'))}</button>
                        <button class="dropdown-item modal-activity-delete classroom-clickable col-12" role="menuitem">${capitalizeFirstLetter(i18next.t('words.delete'))}</button>
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="exportActivityToJSON(${activity.id})">${capitalizeFirstLetter(i18next.t('newActivities.export'))}</button>
                        <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="foldersManager.moveToFolderModal(${activity.id}, 'activity')">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</button>
                    </ul>
                </div>
                <h3 class="activity-item-title" data-bs-toggle="tooltip" title="${activity.title}" aria-label="${activity.title}">${activity.title}</h3>
            </div>
        </div>
                  `
    } else if (displayStyle == "list") {
        let activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? 
            `<img class="list-item-img" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : 
            "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";

        content = `<div class="row activity-item-list" 
                    data-id="${activity.id}"
                    role="article"
                    aria-label="${i18next.t('words.activity')} ${activity.title}">
        <div class="container-draggable">
            <div class="activity-list">
                <div class="activity-list-icon" role="img" aria-label="${activity.type || i18next.t('words.activity')}">
                    ${activityImg}
                </div>

                <div class="activity-list-center">
                    <div class="activity-list-title" role="heading" aria-level="3">
                        ${activity.title}
                    </div>
                    <div class="activity-list-info">
                            ${activity.isAutocorrect ? `<div class="activity-list-auto">
                                <img src='${_PATH}assets/media/auto-icon-grey.svg' 
                                    title='${i18next.t('words.autocorrect')}' 
                                    alt='${i18next.t('words.autocorrect')}'
                                    style="padding-right: 35px;"
                                    onload="SVGInject(this)">
                            </div>` 
                            : "" }
                    </div>
                </div>

                <div class="activity-list-options">
                    <div class="activity-list-options dropdown" role="menu">
                        <i class="fas fa-cog fa-2x" 
                            role="button"
                            aria-label="${i18next.t('words.options')} ${activity.title}"
                            type="button" 
                            id="dropdown-list-activityItem-${activity.id}" 
                            data-bs-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                            onkeydown="if(event.key === 'Enter'){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                            tabindex="0">
                        </i>
                        <div class="dropdown-menu" 
                            role="menu"
                            aria-labelledby="dropdown-list-activityItem-${activity.id}" 
                            data-id="${activity.id}">
                            <button class="classroom-clickable col-12 dropdown-item" 
                                role="menuitem"
                                onclick="event.stopPropagation(); attributeActivity(${activity.id})" 
                                style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</button>
                            <button class="dropdown-item classroom-clickable col-12" 
                                role="menuitem"
                                onclick="event.stopPropagation(); createActivity(null,${activity.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</button>
                            <button class="classroom-clickable col-12 dropdown-item" 
                                role="menuitem"
                                onclick="event.stopPropagation(); activityModify(${activity.id})">${capitalizeFirstLetter(i18next.t('words.modify'))}</button>
                            <button class="dropdown-item modal-activity-delete classroom-clickable col-12" 
                                role="menuitem">${capitalizeFirstLetter(i18next.t('words.delete'))}</button>
                            <button class="classroom-clickable col-12 dropdown-item" 
                                role="menuitem"
                                onclick="event.stopPropagation(); exportActivityToJSON(${activity.id})">${capitalizeFirstLetter(i18next.t('newActivities.export'))}</button>
                            <button class="classroom-clickable col-12 dropdown-item" 
                                role="menuitem"
                                onclick="event.stopPropagation(); foldersManager.moveToFolderModal(${activity.id}, 'activity')">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</button>
                        </div>
                    </div> 
                </div>
                <div class="info-tutorials d-none" data-id="${activity.id}"></div>
            </div>
        </div>
    </div>`
    }
    return content;
}

function teacherFolder(folder, displayStyle) {
  let content = "";
  if (displayStyle == "card") {
      content = `
      <div class="folder-item" data-id="${folder.id}" aria-label="Dossier ${folder.name}" tabindex="-1">
          <div style="position: relative;">
              <div class="folder-card" role="button" data-id="${folder.id}" tabindex="0"
                  aria-label="${i18next.t('classroom.activities.seekFolder')} ${folder.name}"
                  onclick="if(!event.target.closest('.dropdown')) { this.click(); }"
                  onkeydown="if((event.key==='Enter'||event.key===' ') && !event.target.closest('.dropdown')) { event.preventDefault(); this.click(); }"
              >
                  <img class="folder-close-icon" src="${_PATH}assets/media/folders/folder_close_icon.svg" onload="SVGInject(this)">
                  <img class="folder-open-icon" src="${_PATH}assets/media/folders/folder_open_icon.svg" onload="SVGInject(this)">
                  <div class="folder-card-top">
                  </div>
                  <div class="folder-card-mid"></div>
                  <div class="folder-card-bot">
                      <div class="info-tutorials" data-id="${folder.id}"></div>
                  </div>
              </div>
              <div class="dropdown" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                  <button
                    class="btn btn-link p-0"
                    type="button"
                    id="dropdown-folder-${folder.id}"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-label="${i18next.t('words.options')} ${folder.name}"
                    onclick="event.stopPropagation()"
                    style="border: none; background: none; color: inherit;">
                    <i class="fas fa-cog fa-2x" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdown-folder-${folder.id}" role="menu">
                      <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="event.stopPropagation(); foldersManager.updateFolder(${folder.id})">${capitalizeFirstLetter(i18next.t('manager.buttons.update'))}</button>
                      <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="event.stopPropagation(); foldersManager.moveToFolderModal(${folder.id}, 'folder')">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</button>
                      <button class="dropdown-item classroom-clickable col-12" role="menuitem" onclick="event.stopPropagation(); foldersManager.deleteFolder(${folder.id})">${capitalizeFirstLetter(i18next.t('manager.buttons.delete'))}</button>
                  </ul>
              </div>
              <h3 data-bs-toggle="tooltip" title="${folder.name}" class="activity-item-title">${folder.name}</h3>
          </div>
      </div>
      `
    } else if (displayStyle == "list") {
        content = `<div class="row folder-item-list" 
                        data-id="${folder.id}" 
                        role="button" 
                        tabindex="0" 
                        aria-label="Dossier ${folder.name}"
                        onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); foldersManager.seekFolder(${folder.id}); }">
                        <div class="container-draggable">
                            <div class="folder-list" data-id="${folder.id}">
                                <div class="folder-list-icon">
                                    <img class="list-item-img list-folder-img-manager" src="${_PATH}assets/media/folders/folder_close_icon.svg" alt="Icône de dossier" class="folder-icons" onload="SVGInject(this)">
                                </div>
                                
                                <div class="folder-list-title" role="heading" aria-level="3">
                                    ${folder.name}
                                </div>

                                <div class="folder-list-options dropdown">
                                    <button class="btn btn-link p-0" 
                                        type="button" 
                                        id="dropdown-list-folder-${folder.id}" 
                                        data-bs-toggle="dropdown" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                        aria-label="${i18next.t('words.options')} ${folder.name}"
                                        style="border: none; background: none; color: inherit;">
                                        <i class="fas fa-cog fa-2x" aria-hidden="true"></i>
                                    </button>
                                    <div class="dropdown-menu" 
                                        role="menu" 
                                        aria-labelledby="dropdown-list-folder-${folder.id}" 
                                        data-id="${folder.id}">
                                        <button class="classroom-clickable col-12 dropdown-item" 
                                            role="menuitem" 
                                            onclick="event.stopPropagation(); foldersManager.updateFolder(${folder.id})">${capitalizeFirstLetter(i18next.t('manager.buttons.update'))}</button>
                                        <button class="classroom-clickable col-12 dropdown-item" 
                                            role="menuitem" 
                                            onclick="event.stopPropagation(); foldersManager.moveToFolderModal(${folder.id}, 'folder')">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</button>
                                        <button class="classroom-clickable col-12 dropdown-item" 
                                            role="menuitem" 
                                            onclick="event.stopPropagation(); foldersManager.deleteFolder(${folder.id})">${capitalizeFirstLetter(i18next.t('manager.buttons.delete'))}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
    }
    return content;
}


function classeItem(classe, nbStudents, students) {
    function maxLength(array) {
        let count = 0
        for (let i = 0; i < array.length; i++) {
            if (array[i].activities.length > count) {
                count = array[i].activities.length
            }
        }
        return count
    }
    
    let maxAct = maxLength(students)
    let remainingCorrections = getRemainingCorrections(students);

    let remainingCorrectionsSpanElt = remainingCorrections ? `<span class="results-correcting c-text-secondary" role="status" aria-label="${remainingCorrections} corrections en attente"><i class="fas fa-pen" aria-hidden="true"></i> ${remainingCorrections}</span>` : '';
    let html = `<div class="class-item" role="listitem">
      <div class="class-card" style="position: relative;">
        <div 
            role="button"
            tabindex="0"
            aria-label="Classe ${classe.name} avec ${nbStudents} élèves"
            onclick="if(!event.target.closest('.dropdown')) { this.click(); }"
            onkeydown="if(event.key==='Enter'||event.key===' ') { if(!event.target.closest('.dropdown')) { event.preventDefault(); this.click(); } }">
          <div class="class-card-top" data-id="${classe.id}" data-link="${classe.link}">
            <span role="status" aria-label="${nbStudents} élèves"><i class="fas fa-user fa-2x" aria-hidden="true"></i> ${nbStudents}</span>
            ${remainingCorrectionsSpanElt}
          </div>`

    html += `<div class="class-card-mid">
                <h3 class="activity-item-title">${classe.name}</h3>
            </div>`

    html += `<div class="class-card-bot">
                <span role="status" aria-label="${i18next.t('classroom.activities.nbActivities', {'nbActi': maxAct})}">
                    ${i18next.t('classroom.activities.nbActivities', {'nbActi': maxAct})}
                </span>
            </div>
        </div>
        <div class="dropdown class-card-dropdown" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
          <button class="btn btn-link p-0" 
              type="button"
              id="dropdown-classeItem-${classe.id}" 
              data-bs-toggle="dropdown" 
              aria-haspopup="true" 
              aria-expanded="false"
              aria-label="Options de la classe"
              onclick="event.stopPropagation();"
              style="border: none; background: none; color: inherit;">
            <i class="fas fa-cog fa-2x" aria-hidden="true"></i>
          </button>
          <div class="dropdown-menu" 
              role="menu" 
              aria-labelledby="dropdown-classeItem-${classe.id}">
              <button class="modal-classroom-modify classroom-clickable col-12 dropdown-item" 
                  role="menuitem" 
                  tabindex="0"
                  onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">${capitalizeFirstLetter(i18next.t('words.modify'))}</button>
              <button class="dropdown-item modal-classroom-delete classroom-clickable col-12" 
                  role="menuitem" 
                  tabindex="0"
                  onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">${capitalizeFirstLetter(i18next.t('words.delete'))}</button>
          </div>
        </div>
      </div>
    </div>`

    return html;
}

function getRemainingCorrections(students) {
    let remainingCorrectionCount = 0;
    for (let student of students) {
        for (let activity of student.activities) {
            if (activity.correction == 1) {
                remainingCorrectionCount++;
            }
        }
    }

    return remainingCorrectionCount;
}

function hasAttribution(student, ref) {
    let attribution = student.activities.filter(x => x.reference == ref)
    let attributionCourse = student.courses.filter(x => x.reference == ref)
    if (attribution.length > 0 || attributionCourse.length > 0) {
        return true;
    }
    return false;
}

function fullClassHasAttribution(classe, ref) {
    for (let i = 0; i < classe.students.length; i++) {
        if (!hasAttribution(classe.students[i], ref)) {
            return false;
        }
    }
    return true;
}

function classeList(classe, ref = null) {
    let checkedClass = ""
    ClassroomSettings.studentCount = Number($('.student-number').html())
    if (fullClassHasAttribution(classe, ref) == true) {
        checkedClass = "checked"
    }
    let html = `<div class="col-10 student-list-row">
            <div class="c-checkbox">
                <input type="checkbox" id="class-${classe.classroom.id}" value="${classe.classroom.id}" ${checkedClass} class="list-students-classroom">
                <label for="class-${classe.classroom.id}" 
                    tabindex="0" 
                    aria-describedby="class-status-${classe.classroom.id}"
                    onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); document.getElementById('class-${classe.classroom.id}').click(); }">${classe.classroom.name}</label>
                <span id="class-status-${classe.classroom.id}" class="sr-only">${checkedClass ? i18next.t('words.selected') : i18next.t('words.notSelected')}</span>
            </div>

            <button class="student-list-button" 
                data-id="${classe.classroom.id}"
                aria-label="${i18next.t('words.show')} ${i18next.t('words.students')} ${classe.classroom.name}"
                aria-expanded="false"
                tabindex="0"
                onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); $(this).click(); }">
                <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>`
    html += `<div class="student-list" id="student-list-${classe.classroom.id}" style="display:none;">`

    classe.students.forEach(student => {
        let checked = ""
        if (ref && hasAttribution(student, ref)) {
            checked = "checked"
            ClassroomSettings.studentCount++
        }

        html += `<div class="c-checkbox ms-3 student-attribute-form-row">
            <input type="checkbox" id="student-${student.user.id}" value="${student.user.id}" class="student-id" ${checked}>
            <label class="mb-0" for="student-${student.user.id}"
                tabindex="0" 
                aria-describedby="student-status-${student.user.id}"
                onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); document.getElementById('student-${student.user.id}').click(); }">
                <img class="ms-1" src="${_PATH}assets/media/alphabet/${getFirstLetterOfPseudo(student.user.pseudo)}.png" alt="Photo de profil"></img>
                <span>${student.user.pseudo}</span>
            </label>
            <span id="student-status-${student.user.id}" class="sr-only">${checked ? i18next.t('words.selected') : i18next.t('words.notSelected')}</span>
        </div>`
    });
    html += `</div></div>`
    $('.student-number').html(ClassroomSettings.studentCount)
    $("#assign-total-student-number-course").text(ClassroomSettings.studentCount)

    return html;
}

//filter activity
$('body').on('click', '#filter-activity', function () {
    processDisplay();
})

$('body').on('change', '#filter-activity-select', function () {
    processDisplay();
})

$(document).on('keyup', function (e) {
    if ($("#filter-activity-input").is(":focus") || $("#filter-activity").is(":focus") || $("#filter-activity-select").is(":focus")) {
        processDisplay();
    }
});

function processDisplay() {
    const excludedType = Main.getClassroomManager().excludedActivityType;
    const excludedObject = Main.getClassroomManager().excludedObjectFromDashboard;
    const tags = getTagsSelected();

    let arrayKeywords = $('#filter-activity-input').val().split(' ')
    if ($('#filter-activity-select').val() == 'asc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false, excludedType, tags), arrayKeywords, false, excludedObject)
    } else {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true, excludedType, tags), arrayKeywords, true, excludedObject)
    }
}

function getTagsSelected() {
    let selectedTags = [];

    // get checked elements filter-activity-type-
    const checkedTags = document.querySelectorAll('[id^="filter-activity-type-"]:checked');
    checkedTags.forEach(element => {
        selectedTags.push(parseInt(element.dataset.id));
    });

    return selectedTags;
}

//filter sandbox
$('body').on('click', '#filter-sandbox', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }
})

$('body').on('change', '#filter-sandbox-select', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }

})

$(document).on('keyup', function (e) {
    if ($("#filter-sandbox-input").is(":focus") || $("#filter-sandbox").is(":focus") || $("#filter-sandbox-select").is(":focus")) {
        let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
        if ($('#filter-sandbox-select').val() == 'asc') {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
        } else {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
        }
    }
});

$('body').on('click change', '.list-students-classroom', function () {
    let isChecked = $(this).is(':checked');
    let classId = $(this).attr('id').replace('class-', '');
    let $statusSpan = $(`#class-status-${classId}`);
    
    $statusSpan.text(isChecked ? i18next.t('words.selected') : i18next.t('words.notSelected'));
    
    let studentCheckbox = $(this).parent().parent().find('.student-list input')
    studentCheckbox.each(function () {
        if (isChecked) {
            $(this).prop('checked', true).change();
        } else {
            $(this).prop('checked', false).change();
        }
    });
})

$('body').on('click change', '.student-id', function () {
    let isChecked = $(this).is(':checked');
    let studentId = $(this).attr('id').replace('student-', '');
    let $statusSpan = $(`#student-status-${studentId}`);
    
    $statusSpan.text(isChecked ? i18next.t('words.selected') : i18next.t('words.notSelected'));
})

$('body').on('click', '.activity-list, .activity-list-item, .activity-card, .activity-item .activity-item-title', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        let id, state, navigation;
        if (this.classList.contains('activity-item-title')) {
            id = this.parentElement.querySelector('.info-tutorials').getAttribute("data-id");
            state = this.parentElement.querySelector('.info-tutorials').getAttribute("data-state") ? this.parentElement.querySelector('.info-tutorials').getAttribute("data-state") : '';
        } else {
            id = parseInt($(this).find(".info-tutorials").attr("data-id"));
            state = $(this).find(".info-tutorials").attr("data-state");
        }

        // add !this.parentElement.parentElement.id for the teacher dashboard
        if (this.parentElement.parentElement.id == 'list-activities-teacher' || !this.parentElement.parentElement.id) {
            navigation = 'dashboard-activities-teacher';
        } else {
            navigation = 'dashboard-activities';
        }
        navigatePanel('classroom-dashboard-activity-panel', navigation, 'WK' + id, state);   
    }
})

$('body').on('click', '.course-item, .course-item-list', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        let id = this.dataset.id;
        if (UserManager.getUser().isRegular) {
            coursesManager.courseOverview(id);
        }
    }
})


function activityWatch(id) {
    navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities-teacher', 'WK' + id, '')
}

//ouvre une activité depuis un dashboard
$('body').on('click', '.bilan-cell', function () {
    let self = $(this)
    if (!self.hasClass('no-activity')) {
        breadcrumbManager.setClassroomOpening();
        navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities-teacher', 'AC' + parseInt(self.attr('data-id')), self.attr("data-state"))
    }
})

$('body').on('click', '#activity-instruction', function () {
    $('#side-div').toggle()
})

function searchActivity(id, users) {
    users.forEach(user => {
        map2 = map1.filter(x => x.id_tutorial_part);
        if (map2 != []) {
            return true;
        }
    });
    return false;
}

function getActivity(id, state = "") {
    if (state == "") {
        return Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0]
    }
    return Main.getClassroomManager()._myActivities[state].filter(x => x.activity.id == id)[0]
}

function statusActivityForStudent(id, activityList) {
    let activity = activityList.filter(x => x.id_tutorial_part);
    if (activity != []) {
        if (activity.note > 0) {
            return "success";
        } else if (activity.tries > 10) {
            return "failed";
        } else {
            return "in process";
        }

    } else {
        return false
    }
}

function statusActivity(activity, state = true, formatedTimePast = '') {
    if (activity.correction == 0 || activity.correction == null) {
        if (state == true){
            if (formatedTimePast == '') {
                return "stopwatch"
            } else {
                return "startwatch"
            }
            
        }
        if (state == "csv") {
            switch (activity.correction) {
                case 0:
                    return "Pas encore réalisé"
                    break;

                case null:
                    return "Pas encore réalisé"
                    break;

                case undefined:
                    return "Pas attribué"
                    break;

                default:
                    break;
            }
        }
        return "new-activity"
    }
    if (activity.correction == 1) {
        if (state == true)
            return "fas fa-pen";
        if (state == "csv")
            return "à corriger"
        return "todo-activity"
    }
    if (activity.note == 4) {
        if (state == true)
            return "bilan-4";
        if (state == "csv")
            return "Non noté"
        return "done-activity"
    } else if (activity.note == 3) {
        if (state == true)
            return "bilan-3";
        if (state == "csv")
            return "très bien"
        return "done-activity"
    } else if (activity.note == 2) {
        if (state == true)
            return "bilan-2";
        if (state == "csv")
            return "bien"
        return "done-activity"
    } else if (activity.note == 1) {
        if (state == true)
            return "bilan-1";
        if (state == "csv")
            return "correct"
        return "done-activity"
    } else {
        if (state == true)
            return "bilan-0";
        if (state == "csv")
            return "à revoir"
        return "done-activity"
    }

}



function loadActivityForTeacher() {
    $('#activity-views-switcher').html('');
    breadcrumbManager.setActivityTitle(Activity.activity.title);

    let isDoable = Activity.correction == null ? true : false;
    // Reset the inputs
    resetInputsForActivity()

    /**
     * Content title management
     */
    if (UserManager.getUser().isRegular && Activity.correction > 1) {
        $('#label-activity-content').text(i18next.t("newActivities.correction"));
    } else {
        $('#label-activity-content').text(i18next.t("newActivities.contentTitle"));
    }

    // Activity details section
    const activityDetails = document.querySelector('#activity-details');
    activityDetails.setAttribute('role', 'region');
    activityDetails.setAttribute('aria-label', i18next.t("classroom.activities.activityDetails"));

    if (Activity.correction >= 1) {
        activityDetails.innerHTML = `
            <div role="status">
                ${i18next.t("classroom.activities.activityOfUser")} 
                <span class="student-name">${Activity.user.pseudo}</span> 
                ${i18next.t("classroom.activities.userSentOn")} 
                <time datetime="${Activity.dateSend}">${formatHour(Activity.dateSend)}</time>
            </div>
            <div role="status">
                <img class="chrono-icon" src="${_PATH}assets/media/icon_time_spent.svg" alt="" aria-hidden="true">
                ${i18next.t('classroom.activities.timePassed')} 
                <time datetime="${Activity.timePassed}">${formatDuration(Activity.timePassed)}</time>, 
                ${i18next.t("classroom.activities.numberOfTries")} 
                <span class="tries-count">${Activity.tries}</span>
            </div>`;

        if (Activity.autocorrection) {
            $("#activity-auto-corrected-disclaimer")
                .show()
                .attr('role', 'alert')
                .attr('aria-live', 'polite');
        }
    } else {
        activityDetails.innerHTML = `<div role="status">${i18next.t("classroom.activities.noSend")}</div>`;
    }

    let content = manageContentForActivity();

    let correction = ''
    correction += `<h4 class="c-text-primary text-center font-weight-bold" role="heading" aria-level="2">${i18next.t('classroom.activities.bilan.results')}</h4>`
    
    if (Activity.activity.isAutocorrect) {
        correction += `<h6 class="c-text-secondary text-center" role="heading" aria-level="3">${i18next.t('classroom.activities.isAutocorrected')}</h6>`
    }

    if (UserManager.getUser().isRegular && Activity.correction > 0) {
        correction += `<div class="giveNote-container" role="radiogroup" aria-label="${i18next.t('classroom.activities.gradeSelection')}">`
        
        // Radio buttons for grading
        const grades = [
            { value: 3, label: 'classroom.activities.accept' },
            { value: 2, label: 'classroom.activities.vgood' },
            { value: 1, label: 'classroom.activities.good' },
            { value: 0, label: 'classroom.activities.refuse' },
            { value: 4, label: 'classroom.activities.nnoted' }
        ];

        grades.forEach(grade => {
            correction += `
                <label for="givenote-${grade.value}" class="grade-option">
                    <input type="radio" 
                           id="givenote-${grade.value}" 
                           name="giveNote" 
                           value="${grade.value}"
                           ${Activity.note == grade.value ? "checked" : ""}
                           aria-label="${i18next.t(grade.label)}"
                           onclick="setNote(${grade.value})">
                    <span>${i18next.t(grade.label)}</span>
                </label>`;
        });

        correction += `</div>`;

        // Commentary section
        correction += `
            <div id="commentary-panel" class="c-primary-form" role="region" aria-label="${i18next.t('classroom.activities.comments')}">
                <label for="commentary-textarea">${i18next.t("classroom.activities.comments")}</label>
                <textarea id="commentary-textarea" 
                          style="width:100%" 
                          rows="8"
                          aria-label="${i18next.t('classroom.activities.comments')}"
                          aria-required="true">${Activity.commentary}</textarea>
            </div>`;

        // Submit button
        correction += `
            <button onclick="giveNote()" 
                    class="btn c-btn-primary btn-sm text-wrap w-100"
                    role="button"
                    aria-label="${i18next.t('classroom.activities.sendResults')}">
                <span class="text-wrap">
                    ${i18next.t('classroom.activities.sendResults')}
                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                </span>
            </button>`;
    }

    injectContentForActivity(content, Activity.correction, Activity.activity.type, correction, isDoable);
    isTheActivityIsDoable(false);
}

function injectContentForActivity(content, correction, type = null, correction_div, isDoable, isFromCourse = false)
{
    const activityValidationButtonElt = document.getElementById('activity-validate');
    activityValidationButtonElt.style.display = 'block';
    let course = isFromCourse ? "-course" : "";
    // Inject the content to the target div
    if (type == null) {
        $('#activity-content').html(bbcodeToHtml(content));
        if (typeof correction == 'string') {
            $('#activity-correction'+course).html(bbcodeToHtml(correction));
        } else {
            $('#activity-correction'+course).html(correction);
        }
    }


    // Things to do for every activity
    setTextArea();
    $('#activity-title'+course).html(Activity.activity.title);
    const funct = customActivity.manageDisplayCustom.filter(activityValidate => activityValidate[0] == type)[0];
    if (funct) {
        funct[1](correction, content, correction_div, isFromCourse);
    } else {
        if (Activity.activity.isLti) {
            manageDisplayLti(correction, content, correction_div, isDoable, activityValidationButtonElt, isFromCourse);
        } else {
            manageDisplayOldActivities(correction, content, correction_div, isDoable, isFromCourse);
        };
    }
}



function manageDisplayCustom(correction, content, correction_div, isFromCourse) {
    let course = isFromCourse ? "-course" : "";
    const wbbptions = Main.getClassroomManager().wbbOpt;
    $('#activity-content'+course).html(bbcodeToHtml(content));
    $('#activity-content-container'+course).show();
    if (correction == 0) {
        $('#activity-input'+course).wysibb(wbbptions);
        $('#activity-input-container'+course).show();
    } else if (correction > 0) {
        $('#activity-correction'+course).html(correction_div);
        $('#activity-correction-container'+course).show(); 
    }
}



function manageDisplayLti(correction, content, correction_div, isDoable, activityValidationButtonElt, isFromCourse = false) {
    let course = isFromCourse ? "-course" : "";
    document.querySelector('#activity-content-container' + course).style.display = 'block';
    if (isDoable) {
        activityValidationButtonElt.style.display = 'none';
        launchLtiResource(Activity.id, Activity.activity.type, content, !UserManager.getUser().isRegular, false, "#activity-content", isFromCourse);
    } else {
        document.querySelector('#activity-content'+course).innerHTML = `
        <iframe src="${Activity.url}" width="100%" style="height: 60vh;" allowfullscreen=""></iframe>`;
        if (!UserManager.getUser().isRegular) {
            if (!Activity.evaluation && correction < 2) {
                document.querySelector('#activity-content'+course).innerHTML += `
                <button onclick="launchLtiResource(${Activity.id}, '${Activity.activity.type}', '${content}', true, '${Activity.url}')">Modifier le travail</button>`;
            }
        }
        
        if (correction != 1 || UserManager.getUser().isRegular) {
            document.querySelector('#activity-correction-container'+course).style.display = 'block';
            document.querySelector('#activity-correction'+course).innerHTML = correction_div;
        }
    }
}

function manageDisplayOldActivities(correction, content, correction_div, isDoable, isFromCourse) {
    let course = isFromCourse ? "-course" : "";

    document.querySelector('#activity-content'  + course).innerHTML = bbcodeToHtml(content);
    document.querySelector('#activity-content-container'  + course).style.display = 'block';
    if (!isDoable) {
        if (correction != 1 || UserManager.getUser().isRegular) {
            document.querySelector('#activity-correction-container' + course).style.display = 'block';
            document.querySelector('#activity-correction'  + course).innerHTML = correction_div;
        }
    }
}




function shuffleArray(array) {
    const arrayClone = [...array];
    for (let i = arrayClone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayClone[i], arrayClone[j]] = [arrayClone[j], arrayClone[i]];
    }
    return arrayClone;
}

function manageDragAndDropText(studentContentString, preview = false, solution = null, activityId = false) {
    let studentResponses = null;
    if (solution == null) {
        studentResponses = preview ? Main.getClassroomManager()._createActivity.solution : JSON.parse(Activity.activity.solution);
    } else {
        studentResponses = solution;
    }

    let previewString = preview ? "-preview" : "";
    let id = activityId ? "-"+activityId : "";
    
    for (let i = 0; i < studentResponses.length; i++) {
        let input = `<span class="droppable-items dropzone${id}${previewString}" id="dz${id}-${i}${previewString}"></span>`;
        // [answer]replace[/answer]
        // get the answer
        let answer = studentContentString.match(/\[answer\](.*?)\[\/answer\]/g)[0];
        // replace the answer with the input
        studentContentString = studentContentString.replace(answer, input);
    }
    return studentContentString;
}

function manageCorrectionDiv(correction_div, correction, isFromCourse) {
    let course = isFromCourse ? "-course" : "";
    manageLabelForActivity(isFromCourse);
    if (correction > 1 || (UserManager.getUser().isRegular && correction >= 1)) {
        $('#activity-correction'+course).html(correction_div);
        $('#activity-correction-container'+course).show(); 
    }
}

function returnCorrectionContent(correction_div, correction) {
    let label = "",
        correctionContent = "";

    if (correction > 1 || (UserManager.getUser().isRegular && correction >= 1)) {
        correctionContent = correction_div;
    }

    if (UserManager.getUser().isRegular && ($_GET('panel') == "classroom-dashboard-activity-panel-teacher")) {
        label = i18next.t("classroom.activities.studentAnswer");
    } else {
        label = i18next.t("classroom.activities.yourAnswer");
    }

    const correctionData = {
        label: label,
        correction: correctionContent
    }

    return correctionData;
}

function manageLabelForActivity(isFromCourse = false) {
    let course = isFromCourse ? "-course" : "";
    if (UserManager.getUser().isRegular && ($_GET('panel') == "classroom-dashboard-activity-panel-teacher" || $_GET('panel') == "classroom-dashboard-activity-panel")) {
        $('#label-activity-student-response'+course).text(i18next.t("classroom.activities.studentAnswer"));
    } else {
        $('#label-activity-student-response'+course).text(i18next.t("classroom.activities.yourAnswer"));
    }
}

function isTheActivityIsDoable(doable, hideValidationButton = false) {
    if (doable == false || UserManager.getUser().isRegular) {
        $('#activity-validate').hide();
        $('#activity-save').hide();
    } else {
        let interface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)
        if (!hideValidationButton) {
            if (!Activity.activity.isLti) {
                $('#activity-validate').show();
            }
        }
        
        if (interface != undefined && interface != null) {
            $('#activity-save').show()
        }

        if (!Activity.activity.isLti) { 
            $('#activity-validate').show();
            if (Activity.activity.type != 'reading') {
                $('#activity-save').show();
            }
        }
    }
}

function manageContentForActivity() {
    let content = "";
    if (IsJsonString(Activity.activity.content)) {
        const contentParsed = JSON.parse(Activity.activity.content);
        if (Activity.activity.type != "fillIn" && Activity.activity.type != "quiz" && Activity.activity.type != "dragAndDrop") {
            if (contentParsed.hasOwnProperty('description')) {
                content = contentParsed.description;
                if (Activity.project != null) {
                    if (LINK_REGEX.test(Activity.activity.content)) {
                        content = content.replace(LINK_REGEX, '$1' + Activity.project.link)
                    }
                }
            }
        } else {
            content = contentParsed;
        }
    } else {
        content = Activity.activity.content.replace(/(\[iframe\].*?link=[a-f0-9]{13})/gm, '$1&use=classroom')
        if (Activity.project != null) {
            if (LINK_REGEX.test(Activity.activity.content)) {
                content = content.replace(LINK_REGEX, '$1' + Activity.project.link)
            }
        } else {
            content = content
        }
    }
    return content;
}


function setPluriel(number) {
    if (number > 1) {
        return 's'
    } else return ''
}


function loadCourseAndActivityForStudents(isDoable, currentCourse = null, progressBar = false, isFromCourse = false) {
    // Reset the inputs
    resetInputsForActivity(isFromCourse);
    breadcrumbManager.setActivityTitle(Activity.activity.title);
    let courseIndicator = isFromCourse ? "-course" : "";

    // Check if the activity has an introduction
    if (Activity.introduction != null && Activity.introduction != "") {
        $(`#text-introduction${courseIndicator}`).html(bbcodeToHtml(Activity.introduction))
        $(`#activity-introduction${courseIndicator}`).show()
    }

    let activityType = [
        "reading",
        "dragAndDrop",
        "fillIn",
        "quiz"
    ]

    /* Course only */
    document.getElementById("course-progress-bar").style.display = progressBar ? "flex" : "none";
    if (progressBar) {
        // Add the current course indicator on top of the given activity
        let nbOfExercices = currentCourse.activities.length;
        let currentActivityIndex = currentCourse.activities.findIndex(activity => activity.id == Activity.id);

        // add green cells to .course-state until the current activity, then add grey cells
        let courseState = "";
        for (let i = 0; i < nbOfExercices; i++) {
            if (i <= currentActivityIndex) {
                courseState += `<div class="course-state-item course-state-done"></div>`;
            } else {
                courseState += `<div class="course-state-item course-state-todo"></div>`;
            }
        }
        $('.course-state').html(courseState);
    }

    if (!isFromCourse)
    {
        // Disclaimer for eval
        if (Activity.correction < 2 && (activityType.includes(Activity.activity.type))) {
            $('#warning-icon-container').show();
            $('#warning-icon-container > i').hide();
            Activity.evaluation ? $('#warning-icon-evaluation').show().tooltip() : $("#warning-icon-no-evaluation").show().tooltip();
        }
    }

    // Check if the correction if available
    if (Activity.correction >= 1) {
        $(`#activity-details${courseIndicator}`).html(i18next.t("classroom.activities.sentOn") + formatHour(Activity.dateSend), i18next.t("classroom.activities.numberOfTries") + Activity.tries)
    } else {
        if (Activity.dateEnd != null) { 
            $(`#activity-details${courseIndicator}`).html(i18next.t("classroom.activities.toSend") + formatDay(Activity.dateEnd))
        }
    }

    // Content management
    let content = manageContentForActivity();
    let correction = '';

    if (!UserManager.getUser().isRegular && Activity.correction > 1) {
        document.querySelector(`#activity-correction${courseIndicator}`).style.display = 'block';
        let activityResultString, activityResultColor;
        switch (Activity.note) {
            case 4:
                activityResultString = i18next.t('classroom.activities.noProficiency')
                activityResultColor = 'var(--classroom-text-2)'
                break;
            case 3:
                activityResultString = i18next.t('classroom.activities.veryGoodProficiency')
                activityResultColor = 'var(--correction-3)'
                break;
            case 2:
                activityResultString = i18next.t('classroom.activities.goodProficiency')
                activityResultColor = 'var(--correction-2)'
                break;
            case 1:
                activityResultString = i18next.t('classroom.activities.weakProficiency')
                activityResultColor = 'var(--correction-1)'
                break;
            case 0:
                activityResultString = i18next.t('classroom.activities.insufficientProficiency')
                activityResultColor = 'var(--correction-0)'
                break;
            default:
                break;
        }

        correction += `<div class="results-string" style="background-color:${activityResultColor}">${activityResultString}</div>`

        if (Activity.commentary != null && Activity.commentary != "") {
            correction += `<div id="commentary-panel${courseIndicator}"> `+ Activity.commentary + '</div>'
        } else {
            correction += `<div id="commentary-panel${courseIndicator}">` + i18next.t("classroom.activities.bilan.noComment") + '</div>'
        }

    } else {
        document.querySelector(`#activity-correction${courseIndicator}`).style.display = 'none';
    }

    injectContentForActivity(content, Activity.correction, Activity.activity.type, correction, isDoable, isFromCourse);

    if (!Activity.evaluation && correction < 2 && !isDoable) {
        let allKnownActivity = [...activityType, "free"];
        if (!allKnownActivity.includes(Activity.activity.type)) {
            isDoable = false;
        } else {
            isDoable = true;
        }
    }


    isTheActivityOrCourseIsDoable(isDoable, false, isFromCourse);
}


function isTheActivityOrCourseIsDoable(doable, hideValidationButton = false, isFromCourse = false) {
    let courseIndicator = isFromCourse ? "-course" : "";
    if (doable == false || UserManager.getUser().isRegular) {
        $(`#activity-validate${courseIndicator}`).hide();
        $(`#activity-save${courseIndicator}`).hide();
    } else {
        let getInterface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)
        if (!hideValidationButton) {
            if (!Activity.activity.isLti) {
                $(`#activity-validate${courseIndicator}`).show();
            }
        }
        
         if (getInterface != undefined && getInterface != null) {
            $(`#activity-save${courseIndicator}`).show()
        }

        if (!Activity.activity.isLti) { 
            $(`#activity-validate${courseIndicator}`).show();
            if (Activity.activity.type != 'reading') {
                $(`#activity-save${courseIndicator}`).show();
            }
        }
    }
}

