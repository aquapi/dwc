import React from "react";

/**
 * @returns {HTMLCanvasElement}
 */
function usePanel() {
    const [panel, setPanel] = React.useState();

    React.useEffect(() => {
        setPanel(document.querySelector("canvas"))
    }, []);

    return panel;
}

export default usePanel;