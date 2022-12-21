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

    readingPreview(activity) {
        $('#preview-activity-content').html(bbcodeToHtml(activity.content.description));
        $('#preview-content').show();
        $('#activity-preview-div').show();
    }
}

const readingManager = new ReadingManager();

