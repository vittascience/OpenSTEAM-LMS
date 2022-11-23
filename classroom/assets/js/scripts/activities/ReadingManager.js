class ReadingManager {
    constructor() {
        
    }

    init() {
        console.log("ReadingManager init");

        $('body').on('click', '#free-tolerance-increase', function () {
            let tolerance = parseInt($('#free-tolerance').val());
            if (!isNaN(tolerance)) {
                $(`#free-tolerance`).val(tolerance+1);
            } else {
                $(`#free-tolerance`).val(1);
            }
        })
        
        $('body').on('click', '#free-tolerance-decrease', function () {
            let tolerance = parseInt($('#free-tolerance').val());
            if (tolerance > 0) {
                $(`#free-tolerance`).val(tolerance-1);
            }
        })
    }


    defaultProcessValidateActivity() {
        $("#activity-validate").attr("disabled", "disabled");
        let _interface = tryToParse(Activity.activity.content);
        const vittaIframeRegex = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm;
        _interface = _interface ? vittaIframeRegex.exec(_interface.description) : false;
        if (_interface == undefined || _interface == null) {
            Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, 2, 4).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
    
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else  {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities');
                    actualizeStudentActivities(activity, 2);
                    $("#activity-validate").attr("disabled", false);
                }
            })
            window.localStorage.classroomActivity = null
        } else if (Activity.autocorrection == false) {
            const interfaceName = _interface[2];
            let project = window.localStorage[interfaceName + 'CurrentProject']
            Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interfaceName, Activity.id).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else {
                    actualizeStudentActivities(activity, 1)
                    $("#activity-validate").attr("disabled", false);
                    navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
                }
            })
        } else {
    
            $("#activity-validate").attr("disabled", false);
            window.localStorage.autocorrect = true
        }
    }


    manageUpdateForReading(activity) {
        let contentParsed = "";
        if (IsJsonString(activity.content)) {
            contentParsed = bbcodeToHtml(JSON.parse(activity.content).description);
        } else {
            contentParsed = activity.content;
        }
        $("#reading-content").htmlcode((contentParsed));
        $("#activity-reading").show();
    
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }


    showTeacherReadingActivity(contentParsed, Activity) {
        if (contentParsed.hasOwnProperty('description')) {
            $('#activity-content').html(bbcodeToHtml(contentParsed.description));
            $('#activity-content-container').show();
        } 
    }


    manageDisplayReading(correction, content, correction_div, isFromCourse) {
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
}

const readingManager = new ReadingManager();
readingManager.init();

