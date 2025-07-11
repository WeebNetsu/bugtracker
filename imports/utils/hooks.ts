/* eslint-disable import/prefer-default-export */
import React, { useEffect } from 'react';

/**
 * Allows us to get url query parameters. best used with `queryURLBuilder`
 *
 * @example {
 *  const query = useQuery();
 *  const success = query.get("success");
 * }
 */
// export const useQuery = () => new URLSearchParams(useLocation().search);

/**
 * Get the browser window inner width and inner height.
 *
 * @returns Window width and height
 */
const getWindowDimensions = () => {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return {
        windowWidth,
        windowHeight,
    };
};

/**
 * Will return the window current width and height,
 * and will return a new value whenever the window
 * is resized
 *
 * @returns Window width and height
 *
 * @example
 * const { windowHeight, windowWidth } = useWindowDimensions();
 */
export const useWindowDimensions = () => {
    // we use 'React'.useState here to make sure that React
    // stays imported, it is important
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};
