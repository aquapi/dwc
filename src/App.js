// @ts-check
import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import usePanel from './utils/usePanel';
import run from './utils/exec';
import useWindowSize from './utils/useWindowSize';

function App() {
    const [panelWidth, panelHeight] = (useWindowSize() ?? [0, 0]).map(v => v * 7 / 10);

    const panel = usePanel();
    const code = React.useRef("");

    // Some key events
    React.useEffect(() => {
        const evListener = e => {
            e.preventDefault();

            // Run
            if (e.key === "Enter")
                document.querySelector("button").click();

            // Download the image
            if (e.ctrlKey && e.key === "s") {
                const tempLink = document.createElement("a");
                tempLink.download = "painting.png";
                tempLink.href = panel.toDataURL();
                tempLink.click();
            }
        };
        document.addEventListener("keyup", evListener);

        return () => document.removeEventListener("keyup", evListener);
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
            />
        </nav>
    </>;
}

export default App;