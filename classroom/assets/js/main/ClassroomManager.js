/**
 * ClassroomManager
 * Copyright 2020 Vittascience.
 * https://vittascience.com
 *
 *
 * This class purpose to manage the resources.
 */

/**
 * @class ClassroomManager
 * @author: Clemenard (Clément Menard)
 */
class ClassroomManager {
    /**
     * Creates an instance of ClassroomManager.
     * @public
     */
    constructor() {
        this._myActivities = []
        this._myClasses = []
        this._myTeacherActivities = []
    }

    /**
     * Get activities linked to an user
     * Access with Main.getClassroomManager()._myActivities
     * @public
     * @returns {Array}
     */
    getStudentActivities(container) {
        return new Promise(function (resolve, reject) {
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myActivities = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_student_activities",
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            });
        })
    };

    /**
     * Get classrooms from the user
     * Access with Main.getClassroomManager()._myClasses
     * @public
     * @returns {Array}
     */
    getClasses(container) {
        return new Promise(function (resolve, reject) {
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myClasses = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_by_user",
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            });
        })
    };

    /**
     * Get teachers from the classroom
     * Access with Main.getClassroomManager()._myTeachers
     * @public
     * @returns {Array}
     */
    getTeachers(container) {
        return new Promise(function (resolve, reject) {
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myTeachers = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_teachers_by_classroom",
                data: {
                    'classroom': ClassroomSettings.classroom
                },
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            });
        })
    };

    /**
     * Get activities created by the user
     * Access with Main.ClassroomManager()._myTeacherActivities;
     * @public
     * @returns {Array}
     */
    getTeacherActivities(container) {
        return new Promise(function (resolve, reject) {
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myTeacherActivities = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get_mine_for_classroom",
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            });
        })
    };


    /**
     * create a new classroom
     * @param {FormData}  
     * @return {Classroom} 
     */
    addClassroom(payload) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=add",
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

    /**
     * update a  classroom
     * @param {FormData}  
     * @return {Classroom} 
     */
    updateClassroom(payload) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=update",
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

    /**
     * get a classroom by his link
     * @param {FormData}  
     * @return {Classroom} 
     */
    getClassroom(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_by_link",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * get a classroom by his student
     * @param {FormData}  
     * @return {Classroom} 
     */
    getMyClassroom(idStudent) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_by_user",
                data: {
                    "user": idStudent
                },
                success: function (response) {
                    resolve(JSON.parse(response).classroom)

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * add a non-gar student
     */
    createAccount(pseudo, classroomLink) {
        console.log(pseudo)
        console.log(classroomLink)
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=linkSystem",
                data: {
                    "pseudo": pseudo,
                    "classroomLink": classroomLink
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * connect a non-gar student
     */
    connectAccount(pseudo, password, classroomLink) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=get_one_by_pseudo_and_password",
                data: {
                    "pseudo": pseudo,
                    "password": password,
                    "classroomLink": classroomLink
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function (error) {
                    reject(error);
                }
            });
        })
    }

    /**
     * connect to the vittademo account
     */
    getVittaDemo(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_vittademo_account",
                data: {
                    "link": link,
                },
                success: function () {

                    window.location.href = "?panel=classroom-dashboard-profil-panel&nav=dashboard-profil";
                    resolve();

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * connect to the teacher account
     */
    getTeacherAccount(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_teacher_account",
                data: {
                    "link": link,
                },
                success: function () {
                    window.location.href = "?panel=classroom-dashboard-profil-panel-teacher&nav=dashboard-profil-teacher";
                    resolve();

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Add students to the classroom
     * @public
     * @returns {Array}
     */
    addUsersToGroup(arrayUsers, arrayExistingUsers, classroom) {
        return new Promise(function (resolve, reject) {
            if (arrayUsers.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=classroom_link_user&action=add_users",
                    data: {
                        "users": arrayUsers,
                        "existingUsers": arrayExistingUsers,
                        "classroom": classroom
                    },
                    success: function (response) {
                        resolve(JSON.parse(response))

                    },
                    error: function () {
                        reject();
                    }
                });
            } else {
                resolve({ "noUser": true });
            }
        })
    }

    isActivityAutocorrected() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get",
                data: {
                    "id": ClassroomSettings.activity
                },
                success: function (response) {
                    let content = JSON.parse(response).content
                    let link = content.replace(/\n/, '');
                    link = content.replace(/.*(\[iframe\].*python\/\?link=)([a-f0-9]{13}).*/, "$2")
                    if (/^[a-f0-9]{13}/.test(link)) {
                        $.ajax({
                            type: "POST",
                            url: "/routing/Routing.php?controller=project&action=is_autocorrected",
                            data: {
                                "link": link
                            },
                            success: function (response) {
                                resolve(JSON.parse(response))

                            },
                            error: function () {
                                reject();
                            }
                        });

                    } else {
                        resolve(false)
                    }
                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Get students list in the classroom
     * @public
     * @returns {Array}
     */
    getUsersInClassroom(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_by_classroom",
                data: {
                    "classroom": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get general data about the user (activities to do, activities done, courses todo, courses done)
     * @public
     * @returns {Array}
     */
    getStudentActivity() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_student_data",
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get general data about the teacher (activities to do, activities done, courses todo, courses done)
     * @public
     * @returns {Array}
     */
    getTeacherActivity() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_teacher_data",
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Delete a student
     * @public
     * @returns {Array}
     */
    deleteStudent(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=delete",
                data: {
                    "id": parseInt(id)
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Delete a project
     * @public
     * @returns {Array}
     */
    deleteProject(link) {
        return new Promise(function (resolve, reject) {
            link = link.replace(/.+link=([0-9a-f]{13}).+/, '$1')
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project&action=delete_project",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Share a project
     * @public
     * @returns {Array}
     */
    shareProject(linkProject, idUsers) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project_link_user&action=add",
                data: {
                    "linkProject": linkProject,
                    "idUsers": idUsers
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * 
     * @public
     * @returns {Array}
     */
    undoAttributeActivity(ref) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=remove_by_reference",
                data: {
                    "reference": ref
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Generate a new password for a classroom user
     * @public
     * @returns {Array}
     */
    generatePassword(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=generate_classroom_user_password",
                data: {
                    "id": parseInt(id)
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Generate a new password for a classroom user
     * @public
     * @returns {Array}
     */
    changePseudo(id, pseudo) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=change_pseudo_classroom_user",
                data: {
                    "id": parseInt(id),
                    "pseudo": pseudo
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get one activity of the user by his id
     * @public
     * @returns {Array}
     */
    getOneUserLinkActivity(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_one",
                data: {
                    'id': id
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Create an activity
     * */
    addActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=add",
                data: activity,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Create several activities
     * */
    addActivities(activities) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=add_several",
                data: activities,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Update an activity
     * */
    editActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=update",
                data: activity,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Delete an activity
     * */
    deleteActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=delete",
                data: {
                    "id": activity
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Duplicate a project
     * */
    duplicateProject(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project&action=duplicate",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Delete a classroom
     * */
    deleteClassroom(classroom) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=delete",
                data: {
                    "link": classroom
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Get an activity by his id
     * */
    getActivity(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get",
                data: {
                    id: id
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Associate activity to users
     * @public
     * @returns {Array}
     */
    attributeActivity(data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=add_users",
                data: data,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Update a student's exercise with his project
     * */
    saveStudentActivity(project, interfac, activity, correction = 1, note = 0) {
        if (project) {
            return new Promise(function (resolve, reject) {
                let currentCode = JSON.parse(window.localStorage.currentExercise)
                if (currentCode.manuallyModified == null)
                    currentCode.manuallyModified = true
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=project&action=add",
                    data: {
                        'name': project.name,
                        'description': "Copie d'un apprenant",
                        'code': currentCode.code,
                        'dateUpdated': new Date(),
                        'codeText': currentCode.codeText,
                        'codeManuallyModified': currentCode.manuallyModified,
                        'public': false,
                        'mode': project.mode,
                        'interface': interfac,
                        'activity': true

                    },
                    dataType: "JSON",
                    success: function (response) {
                        let chrono = parseInt((Date.now() - ClassroomSettings.chrono) / 1000)
                        $.ajax({
                            type: "POST",
                            url: "/routing/Routing.php?controller=activity_link_user&action=update",
                            data: {
                                'project': response.id,
                                'id': activity,
                                'correction': correction,
                                'timePassed': chrono,
                                'classroomLink': ClassroomSettings.classroom,
                                'note': note

                            },
                            success: function (r) {
                                resolve(JSON.parse(r))
                                ClassroomSettings.chrono = Date.now()
                            }
                        });

                    },
                    error: function () {
                        reject();
                    }
                });
            })
        } else {
            let chrono = parseInt((Date.now() - ClassroomSettings.chrono) / 1000)
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=activity_link_user&action=update",
                    data: {
                        'id': activity,
                        'correction': correction,
                        'timePassed': chrono,
                        'classroomLink': ClassroomSettings.classroom,
                        'note': note

                    },
                    success: function (r) {
                        resolve(JSON.parse(r))
                        ClassroomSettings.chrono = Date.now()
                    }
                });
            });
        }
    }


    /**
     * Get class users and their activities
     * @public
     * @returns {Array}
     */
    setActivityCorrection(activity, correction, note, comment) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=update",
                data: {
                    'project': activity.project,
                    'id': activity.id,
                    'correction': correction,
                    'timePassed': activity.timePassed,
                    "commentary": comment,
                    'classroomLink': ClassroomSettings.classroom,
                    'note': note

                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get class users and their activities
     * @public
     * @returns {Array}
     */
    getChangesForTeacher() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_changes_for_teacher",
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
    * Add students to the classroom
    * @public
    * @returns {Array}
    */
    addUsersToGroupByCsv(arrayUsers, classroom) {
        return new Promise(function (resolve, reject) {
            if (arrayUsers.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=classroom_link_user&action=add_users_by_csv",
                    data: {
                        "users": arrayUsers,
                        "classroom": classroom
                    },
                    success: function (response) {
                        resolve(JSON.parse(response))

                    },
                    error: function () {
                        reject();
                    }
                });
            } else {
                resolve([])

            }
        })
    }

}