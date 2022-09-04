/**
 * Will generate a url with the given parameters
 *
 * ie. /path?param1=value1&param2=value2
 *
 *  NOTE: Try to keep keys camelCase
 *
 * @param url Base URL that we want to append to
 * @param data key value pairs to append to the url
 * @returns url with appended data
 */
export const queryURLBuilder = (
	url: string,
	data: { key: string; value: string | number }[]
) => {
	let queryURL = url;
	data.forEach(({ key, value }, index) => {
		if (index === 0) {
			queryURL += `?${key}=${value}`;
		} else {
			queryURL += `&${key}=${value}`;
		}
	});
	return queryURL;
};

/**
 * Search for query, this will ignore casing.
 *
 * @param search Query to search for
 * @param args Values to search through
 * @returns boolean - true if query was found
 */
export const includeSearch = (
	search: string,
	...args: (string | undefined)[]
): boolean => {
	const res = args.map((arg) =>
		arg?.toLowerCase().includes(search.toLowerCase())
	);

	return res.indexOf(true) !== -1;
};
