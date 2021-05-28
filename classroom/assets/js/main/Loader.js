var Loader = (function () {
    const LOADED_LIBRARIES = [];

    function registerLibraryLoaded(id) {
        // record the libs only if the array doesn't contain the same already
        if (LOADED_LIBRARIES.indexOf(id) === -1) {
            LOADED_LIBRARIES.push(id)
        }
    }

    /**
     * Check if the script.id exist already on the page to add a listener because the library you asked to load
     * might be on the loading process and after is loaded register the lib to avid this process twice
     *
     * @param {string} script
     * @param {*} next
     */
    function appendUnique(script, next) {
        const appendedScript = document.getElementById(script.id)
        if (appendedScript) {
            appendedScript.addEventListener('load', function onLoadScript() {
                appendedScript.removeEventListener('load', onLoadScript);
                registerLibraryLoaded(script.id);
                next();
            });
            return;
        }

        // this will only add a new script tag if the lib is not already on the DOM
        // the above part of this function will handle the scenario where
        // even tho is already on the DOM might be still loading
        document.head.appendChild(script)
    }

    function getScriptLoadingPromise({ id, src }) {
        var script = document.createElement('script')
        var p = new Promise((resolve, reject) => {
            // once the lib is registered you can resolve immediatelly
            // because it means that is fully loaded
            if (LOADED_LIBRARIES.indexOf(id) != -1) {
                resolve(`${id} was loaded before`)
            }

            script.addEventListener('load', function onLoadScript() {
                script.removeEventListener('load', onLoadScript)
                registerLibraryLoaded(id)
                resolve(id)
            })

            script.onerror = function onErrorLoadingScript() {
                reject()
            }

            script.id = id
            script.src = src
            appendUnique(script, resolve)
        });
        return p;
    }

    function loadScript({ id, src }) {
        return getScriptLoadingPromise({ id, src });
    }

    function loadScripts(scripts) {
        let chain = Promise.resolve();
        for (let script of scripts) {
            chain = chain.then(() => getScriptLoadingPromise(script))
        }
        return chain;
    }

    return {
        /**
         * Load a script
         * @public
         * @param {{integer, string}} { id, src }
         * @returns {Pormise}
         */
        loadScript: function ({ id, src }) {
            return loadScript({ id, src });
        },
        /**
         * Load scripts
         * @param {Array[{integer, string}]} scripts
         * @returns {Pormise}
         */
        loadScripts: function (scripts) {
            return loadScripts(scripts);
        }
    }
}());