var UserManager = (function () {
    var Manager = {};
    Manager.user = null;

    function init() {
        var promiseToGetUser = new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: "/routing/Routing.php?controller=session",
                success: async function (response) {
                    if (response != "null") {
                        try {
                            Manager.user = JSON.parse(response);
                            Manager.user.restrictions = await getUserRestrictions();
                        } catch (e) {
                            Manager.user = null
                        }
                    }
                    resolve("done");
                },
                error: function (response) {
                    reject(response.status);
                }
            });
        });
        return promiseToGetUser;
    }

    async function getUserRestrictions() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                dataType: "JSON",
                url: '/routing/Routing.php?controller=user&action=get_user_restriction',
                success: function (response) {
                    resolve(response);
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    return {
        /**
         * Init the user manager.
         * @returns {Promise}
         */
        init: function () {
            return init();
        },
        /**
         * Gets the signed in user.
         * @returns {User}
         */
        getUser: function () {
            return Manager.user;
        }
    }

}());