import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getWindowDimensions } from ".";

/**
 * Allows us to get url query parameters. best used with `queryURLBuilder`
 *
 * @example {
 *  const query = useQuery();
 *  const success = query.get("success");
 * }
 */
export const useQuery = () => new URLSearchParams(useLocation().search);

/**
 * Will return the window current width and height, and will return a new value whenever the window is resized
 *
 * @returns Window width and height
 */
export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}

// below is only so the auto formatter does not remove React from imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _donNotUseMe = (x: React.ReactNode) => {};
