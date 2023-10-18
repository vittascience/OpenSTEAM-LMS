class ReadingManager {

    manageUpdateForReading(activity) {
        let contentParsed = "";
        if (IsJsonString(activity.content)) {
            contentParsed = JSON.parse(activity.content).description;
        } else {
            contentParsed = activity.content;
        }

        if ($("#reading-content").forceInsertBbcode((contentParsed)) == true) {
            $("#activity-reading").show();
            navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
        } else {
            console.error("Error while inserting bbcode");
        }
    }


    showTeacherReadingActivity(contentParsed, Activity) {
        if (contentParsed.hasOwnProperty('description')) {
            $('#activity-content').html(bbcodeContentIncludingMathLive(contentParsed.description));
            $('#activity-content-container').show();
        } 
    }


    manageDisplayReading(correction, content, correction_div, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        const wbbptions = Main.getClassroomManager().wbbOpt;
        $('#activity-content'+course).html(bbcodeContentIncludingMathLive(content));
        $('#activity-content'+course).removeClass('d-flex');
        $('#activity-content'+course).addClass('d-block');
        
        $('#activity-content-container'+course).show();
        if (correction == 0) {
            $('#activity-input'+course).wysibb(wbbptions);
            $('#activity-input-container'+course).show();
        } else if (correction > 0) {
            $('#activity-correction'+course).html(correction_div);
            $('#activity-correction-container'+course).show(); 
        }
    }

    renderReadingActivity(activityData, htmlContainer, idActivity) {
        const contentDiv = document.createElement('div');
        contentDiv.id = 'activity-content' + idActivity;
        contentDiv.innerHTML = activityData.content;
        htmlContainer.appendChild(contentDiv);

        
        if (activityData.doable) {
            coursesManager.manageValidateBtnForOnePageCourse(idActivity, htmlContainer, activityData, true);
        }
    }

    getManageDisplayReading(content, activity, correction_div) {
        
        const activityData = {
            states: null,
            content: null,
            correction: null,
            doable: false,
            studentAnswer: null,
            type: 'reading',
            link: activity.id,
            id: activity.activity.id,
        }

        activityData.doable = activity.correction <= 1 || activity.correction == null;
        activityData.content = bbcodeContentIncludingMathLive(content);
        return activityData;
    }

    readingPreview(activity) {
        $('#preview-activity-content').html(bbcodeContentIncludingMathLive(activity.content.description));
        $('#preview-content').show();
        $('#activity-preview-div').show();
    }
}

const readingManager = new ReadingManager();

