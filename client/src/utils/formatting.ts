import moment from "moment";

/**
 * Format JS date to date value that calendar inputs can use
 *
 * @param date Date to format
 * @returns Date formatted in YYYY-MM-DD
 */
export const formatToCalendarDate = (date: Date = new Date()): string => {
    return moment(date).format("YYYY-MM-DD");
};

/**
 * Converts number of minutes to time format (hh:mm)
 *
 * @param min Minutes to be converted to time format
 * @returns Formatted time (80 -> 01:20)
 */
export const formatMin = (min: number): string => {
    const a = [Math.floor(min / 60), Math.floor(min % 60)];
    return a.map(t => `0${t}`.slice(-2)).join(":");
};

/**
 * Converts number of minutes to time format (hh:mm:ss)
 *
 * @param sec Seconds to be converted to time format
 * @returns Formatted time (80 -> 00:01:20)
 */
export const formatSec = (sec: number): string => {
    const a = [Math.floor(sec / 60 / 60), Math.floor((sec / 60) % 60), Math.floor(sec % 60)];
    return a.map(t => `0${t}`.slice(-2)).join(":");
};

/**
 * Format time stamp into numbers.
 *
 * ie. 8:15 -> 495 (minutes)
 *
 * @param stamp Selected time stamp
 * @returns time stamp converted to minutes
 */
export const formatTimestamp = (stamp: string): number => {
    // convert 9:15 string to minutes
    const numbers = stamp.split(":").map((stm, index) => (index === 0 ? Number(stm) * 60 : Number(stm)));
    return numbers.reduce((prev, curr) => prev + curr);
};

/**
 * Format amount to currency format
 *
 * ie. 560 -> "560.00 ZAR"
 *
 * @param amt Amount to format
 * @param currencyCode Currency to format (ie. ZAR)
 * @returns Formatted amount
 */
export const formatMoneyStr = (
    amt: number,
    currencyCode: string = "ZAR",
    includeCurrencyCode: boolean = true,
): string => {
    return amt.toFixed(2) + " " + (includeCurrencyCode ? currencyCode : "");
};

/**
 * Convert the first letter of a piece of text to uppcase
 *
 * ie. "mike" -> "Mike"
 *
 * @param text Text to parse
 * @returns Text with first letter uppercase
 */
export const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * This will format the amount to the currency code passed in
 *
 * ie. 560000.59, ZAR -> "R560 000.59"
 *
 * @param value The amount that needs to be converted
 * @param currency The currency code to convert to
 * @returns Formatted amount
 */
export const currencyFormatter = (value: number, currency: string = "ZAR"): string => {
    // this will format the currency to R00 000
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
    }).format(value ?? 0);
};
