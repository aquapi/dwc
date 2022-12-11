// @ts-check
/**
 * @param {string} str 
 */
const splitStatement = str => {
    const paren = str.match(/\((.+?)\)/g);
    let index = 0;
    return str.replace(/\((.+?)\)/g, '(tmp)')
        .replaceAll(/then/g, ',')
        .split(',')
        .map(str => {
            str = str.trim();
            if (paren && str.includes("repeat")) {
                str = str.replace('(tmp)', paren[index++]);
                if (index > paren.length)
                    index = paren.length;
            }
            return str;
        });
}

/**
 * Parse the code
 * @param {string} code 
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ degree: number, background?: string, posX: number, posY: number, isDrawing: boolean }} state
 */
function run(code, ctx, state) {
    // TODO: repeat 4 (move 90 then rotate 90) then move 20 -> [repeat 4 (move 90 then rotate 90), move 20] -> use parse() to run the statement inside the ()
    splitStatement(code).map(st => runStatement(st, ctx, state));
}

/**
 * @param {string} st 
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ degree: number, background?: string, posX: number, posY: number, isDrawing: boolean }} o
 */
function runStatement(st, ctx, o) {
    // move <distance>
    if (st.startsWith("move")) {
        const distance = Number(st.split(" ")[1]);

        // Convert deg to rad
        const rad = o.degree * Math.PI / 180;
        o.posX += distance * Math.cos(rad);
        o.posY += distance * Math.sin(rad);

        // Draw and set values at the same time
        if (o.isDrawing) {
            ctx.lineTo(o.posX, o.posY);
            ctx.stroke();
            ctx.beginPath();
        }

        ctx.moveTo(o.posX, o.posY);
    }

    // color <color>
    else if (st.startsWith("color"))
        ctx.strokeStyle = st.split(" ")[1];

    // rotate <deg>
    else if (st.startsWith("rotate"))
        o.degree += Number(st.substring(7));

    // goto <x> <y>
    else if (st.startsWith("goto")) {
        const splitted = st.split(" ");

        // Go to a new position and set position values at the same time
        ctx.moveTo(
            o.posX = Number(splitted[1]),
            o.posY = Number(splitted[2])
        );
    }

    // pen <up | down>
    else if (st.startsWith("pen")) {
        const penState = st.substring(4);

        if (penState === "up")
            o.isDrawing = false;

        else if (penState === "down")
            o.isDrawing = true;
    }

    // repeat <time> (<statement>)
    else if (st.startsWith("repeat")) {
        const stuff = st.split(" ");
        const repeatTime = Number(stuff[1]);
        stuff.splice(0, 2);
        const statement = stuff.reduce((prev, current) =>
            prev + " " + current
        );

        for (let i = 0; i < repeatTime; i++)
            run(statement.substring(1, statement.length - 1), ctx, o);
    }
}

// Run the code
/**
 * @param {string} code
 * @param {HTMLCanvasElement} canvas
 */
export default function runCode(code, canvas) {
    if (!canvas)
        return;

    const ctx = canvas.getContext("2d");
    const panelWidth = canvas.width, panelHeight = canvas.height;

    ctx.clearRect(0, 0, panelWidth, panelHeight);

    const state = {
        degree: 0,
        posX: panelWidth / 2,
        posY: panelHeight / 2,
        background: undefined,
        isDrawing: true,
    };

    ctx.beginPath();
    ctx.moveTo(state.posX, state.posY);
    run(code, ctx, state);
    ctx.strokeStyle = "black";
}