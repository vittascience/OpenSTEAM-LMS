/**
 * Track the time passed by a student on a task even if the student close the page or the browser
 */
class ActivityTracker{
	constructor() {
		// Singleton pattern to only have one instantiation of the class
		if (ActivityTracker._instance) {
			return ActivityTracker._instance;
		}
		ActivityTracker._instance = this;
		this._reference = false;
		this._activityStartTime = false;
		this._isTracking = false;
		this._eventListenerCallback = false;
		this._isUpToDate = true;
		this._isCheckingLti = false;
	}

	/**
	 * Start the timer (get the starting time), select the current activity (activityLinkUser) reference, and start the listener that will be triggered if the user close the page/the browser
	 */
	startActivityTracker() {
		this._isTracking = true;
		this._activityStartTime = Date.now();
		this._reference = Activity.reference;
		this._eventListenerCallback = () => { this.saveTimePassed() };
		window.addEventListener('unload', this._eventListenerCallback, false);
	}

	/**
	 * Clear the current tracking values and remove the window unload listener
	 */
	stopActivityTracker() {
		this._isTracking = false;
		this._activityStartTime = false;
		this._reference = false;
		window.removeEventListener('unload', this._eventListenerCallback, false);
		this._eventListenerCallback = false;
	}

	/**
	 * Calculate the time passed from the begining of the current task and send it with the reference to the backend using a sendBeacon (POST request that have low priority but will not be interrupted if the page/browser is closed)
	 */
	saveTimePassed() {
		const timePassed = Math.round((Date.now() - this._activityStartTime)/1000);
		const timeData = new FormData();
		timeData.set('reference', this._reference);
		timeData.set('time_passed', timePassed);
		navigator.sendBeacon("/routing/Routing.php?controller=activity_link_user&action=update_time_passed", timeData);
	}

	getIsTracking() {
		return this._isTracking;
	}

	setIsUpToDate(boolean) {
		if (typeof boolean !== 'boolean') {
			console.error(`The provided argument must be a boolean!`);
			return;
		}
		this._isUpToDate = boolean;
	}

	getIsUpToDate() {
		return this._isUpToDate;
	}

	setIsCheckingLti(boolean) {
		if (typeof boolean !== 'boolean') {
			console.error(`The provided argument must be a boolean!`);
			return;
		}
		this._isCheckingLti = boolean;
	}

	getIsCheckingLti() {
		return this._isCheckingLti;
	}
}