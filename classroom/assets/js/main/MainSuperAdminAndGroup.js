const MSA = (function () {
    /**
     * This object contains all the superadmin application's functionalities.
     * @private
     */
    const S = {};
    S.superadminManager = null;
    S.init = function () {
        S.superadminManager = new SuperAdminManager()
        if (UserManager.getUser()) {
            S.superadminManager.getAllGroups();
        } else {
            return new Promise(function (resolve) {
                resolve("loaded");
            })
        }
    };

    return {
        init: function () {
            return S.init();
        },
        /**
         * Export the superadmin manager
         * @public
         */
        getSuperAdminManager: function () {
            return S.superadminManager;
        },

    }
}());

const MGA = (function () {
    /**
     * This object contains all the superadmin application's functionalities.
     * @private
     */
    const G = {};
    G.groupadminmanager = null;
    G.init = function () {
        G.groupadminmanager = new GroupAdminManager()
        if (UserManager.getUser()) {
            return new Promise(function () {
                //
            })
        } else {
            return new Promise(function (resolve) {
                resolve("loaded");
            })
        }
    };

    return {
        init: function () {
            return G.init();
        },
        /**
         * Export the groupadmin manager
         * @public
         */
        getGroupAdminManager: function () {
            return G.groupadminmanager;
        },

    }
}());