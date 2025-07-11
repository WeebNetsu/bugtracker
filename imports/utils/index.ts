import { Random } from 'meteor/random';
import React from 'react';

/**
 * Check if a string is safe for a regex search
 *
 * @param text text to check
 * @returns true if string is safe to use for searching
 */
export const checkStringSafeForSearch = (text: string): boolean => {
    return !(
        text.includes('\\') ||
        text.includes('(') ||
        text.includes(')') ||
        text.includes('[') ||
        text.includes(']')
    );
};

/**
 * Extracts the time from the given date and returns it as a string
 *
 * @param {Date} date - The date from which to extract the time
 * @return {string} The extracted time as a string
 * @example
 * extractTime(new Date()) // 2:13pm
 */
export const extractTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};

/**
 * Check if all useRef elements passed in contains a value
 *
 * @param ...refs useRef elements
 * @returns boolean, true if all useRef elements contains a value
 */
export const checkAllRefs = (...args: React.RefObject<HTMLInputElement | HTMLTextAreaElement>[]) => {
    const exists: boolean[] = args.map((arg) => !!arg.current);

    // if 'exists' includes a false value, then there is a current that does not exist
    return !exists.includes(false);
};

/**
 * Format a price to be in rand and 2 decimal places
 *
 * @param price in cents
 * @returns price formatter in rands (div 100) and fixed to 2 decimal places
 */
export const priceFormatter = (price: number) => {
    return (price / 100).toFixed(2);
};

/**
 * This will convert an image into a buffer.
 *
 * @param file File object to encode
 * @returns string buffer
 */
export const encodeImageFileAsURL = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Take a size in KB and generate a string with a simplified value. Can return in KB, MB and GB
 *
 * @param sizeKb size in KB to calculate with
 * @returns a string with the size rounded down to 2 decimals
 *
 * @example
 * displaySize(3072) // 3 MB
 * displaySize(3200) // 3.11 MB
 * displaySize(20) // 20 KB
 */
export const displaySize = (sizeKb: number): string => {
    const sizeMb = sizeKb / 1024;

    if (sizeMb < 1) {
        return `${sizeKb.toFixed(2)} KB`;
    }

    if (sizeMb > 1000) {
        return `${(sizeMb / 1000).toFixed(2)} GB`;
    }

    return `${sizeMb.toFixed(2)} MB`;
};

/**
 * Take a size in grams and generate a string with a simplified value. Can return in grams (g) or kilograms (kg)
 *
 * @param sizeG size in grams to calculate with
 * @returns a string with the size rounded down to 2 decimals
 *
 * @example
 * displayWeight(1500) // 1.50 kg
 * displayWeight(2000) // 2.00 kg
 * displayWeight(500) // 500.00 g
 */
export const displayWeight = (sizeG: number): string => {
    const sizeKg = sizeG / 1000;

    if (sizeKg < 1) {
        return `${sizeG.toFixed(2)}g`;
    }

    return `${sizeKg.toFixed(2)}kg`;
};

/**
 * Converts megabytes into kilobytes
 *
 * @param mb number to convert to kb
 */
export const mbToKb = (mb: number): number => {
    const kb: number = mb * 1024;
    return kb;
};

/**
 * Converts megabytes into kilobytes
 *
 * @param byte number to convert to kb
 */
export const byteToKb = (byte: number): number => {
    const kb: number = byte / 1024;
    return kb;
};

/**
 * Reads a file as a buffer
 *
 * ## NOTE: this only works on the client!
 *
 * @param file File to process
 * @returns File buffer
 *
 * @example
 * readFileAsBinary(file)
 * .then((arrayBuffer) => {
 *   // Use the binary data (ArrayBuffer)
 *   console.log('Binary content:', arrayBuffer);
 * })
 * .catch((error) => {
 *   // Handle any errors that occur during the read operation
 *   console.error('Error reading file:', error);
 * });
 */
export const readFileAsBinary = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as string;
            // const buffer = Buffer.from(arrayBuffer);
            resolve(arrayBuffer);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file as buffer.'));
        };

        reader.readAsBinaryString(file);
    });
};

/**
 * Checks if an email is valid
 *
 * @param email a string that will be or is user's email used for login
 * @returns true if the email is valid
 */
export const isValidEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    // return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email.toLowerCase(),
    // );
};

/**
 * Will generate a 29 character string for a voucher code
 *
 * @returns Voucher code
 */
export const generateVoucherCode = () => {
    return `${Random.id(5)}-${Random.id(5)}-${Random.id(5)}-${Random.id(5)}-${Random.id(5)}`;
};
