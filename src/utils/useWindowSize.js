import React from "react"

/**
 * @returns {[number, number]}
 */
function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState();

    React.useEffect(() => {
        const doc = document.documentElement;

        setWindowSize([doc.clientWidth, doc.clientHeight]);
    }, []);

    return windowSize;
}

export default useWindowSize;