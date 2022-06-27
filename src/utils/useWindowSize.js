import React from "react"

/**
 * @returns {[number, number]}
 */
function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState();

    React.useEffect(() => {
        setWindowSize([window.screen.width, window.screen.height]);
    }, []);

    return windowSize;
}

export default useWindowSize;