// @ts-check
import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import usePanel from './utils/usePanel';
import run from './utils/exec';
import useWindowSize from './utils/useWindowSize';

function App() {

    const [panelW, panelH] = (useWindowSize() ?? [0, 0]);
    const panelHeight = panelH * 7 / 10;
    const panelWidth = panelW * 7 / 10;

    const panel = usePanel();
    const code = React.useRef("");

    // Some key events
    React.useEffect(() => {
        window.navigator.serviceWorker.register("/sw.js");

        // Code
        if (window.location.search)
            code.current = new URLSearchParams(window.location.search).get("code") ?? "";

        /**
         * @type {(this: Document, ev: KeyboardEvent) => any}
         */
        const evListener = e => {
            // Run
            if (e.key === "Enter")
                document.querySelector("button").click();

            // Download the image
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                e.stopPropagation();

                const tempLink = document.createElement("a");
                tempLink.download = "painting.png";
                tempLink.href = panel.toDataURL();
                tempLink.click();
            }
        };

        function update() {
            window.location.reload();
        }

        document.addEventListener("resize", update);
        document.addEventListener("keydown", evListener, false);

        return () => {
            document.removeEventListener("keydown", evListener, false);
            document.removeEventListener("resize", update);
        };
    });

    // Run the code
    function runCode() {
        const ctx = panel.getContext("2d");

        ctx.clearRect(0, 0, panelWidth, panelHeight);

        const state = {
            degree: 0,
            color: 'black',
            bg: 'white',
            posX: 0,
            posY: 0,
            isDrawing: true,
        };

        ctx.beginPath();
        ctx.moveTo(state.posX = panelWidth / 2, state.posY = panelHeight / 2);

        run(code.current, ctx, state);

        ctx.stroke();
        ctx.closePath();
    }

    // Render a canvas as a drawing panel and an input to write code
    return <>
        <canvas width={panelWidth} height={panelHeight}></canvas>
        <nav>
            <Input
                action={<Button onClick={runCode}>Run</Button>}
                placeholder='Type your code here...'
                onChange={e =>
                    code.current = e.currentTarget.value}
                fluid
                style={{ width: "70vw", height: "5vh" }}
                defaultValue={code.current}
            />
        </nav>
    </>;
}

export default App;