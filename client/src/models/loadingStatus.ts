/**
 * Status of item when loading
 */
enum LoadStatus {
	/**
	 * Loading has not started yet
	 */
	NOT_STARTED,
	/**
	 * Currently loading
	 */
	PENDING,
	/**
	 * Loading has completed
	 */
	COMPLETE,
}

export default LoadStatus;
