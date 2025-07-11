/**
 * Rough check to see if the screen is small enough to be considered mobile.
 * Not super accurate.
 *
 * @param window Window object provided by tsx file
 * @returns true if a mobile sized screen
 */
export const isMobile = (window: Window) => {
    return window.innerWidth < 700;
};

/**
 * Checks if a cell number is valid.
 *
 * @param cellNumber - The cell number to validate.
 * @returns True if the cell number is valid, false otherwise.
 */
export const isValidCellNumber = (cellNumber = '') => {
    // Remove any spaces from the cell number
    const cell = cellNumber.replace(/ /g, '');

    // Check if the cell number starts with '+'
    if (cell.slice(0, 1) === '+') {
        // Return true if the length of the cell number is 12
        return cell.length === 12;
    }

    // Check if the cell number starts with '0'
    if (cell[0] === '0') {
        // Return true if the length of the cell number is 10
        return cell.length === 10;
    }

    // Return false if the cell number doesn't start with '+' or '0'
    return false;
};
