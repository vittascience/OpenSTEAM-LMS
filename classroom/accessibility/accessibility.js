import "./wysi-editor-accessibility.js";
import {handleSetupAccessibilityDebug} from "./debug.js";
import { initAccessibilityWatcher } from "./activities-accessibility-watcher.js";

document.addEventListener("DOMContentLoaded", () => {
    handleSetupAccessibilityDebug();
    initAccessibilityWatcher();
})