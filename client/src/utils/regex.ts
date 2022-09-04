/* eslint-disable no-useless-escape */

export const digitRegex = /^-?[\d.]+(?:e-?\d+)?$/;

/**
 * Check if email is valid
 */
export const emailRegex =
	/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
