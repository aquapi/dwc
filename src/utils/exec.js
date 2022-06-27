// @ts-check

/**
 * @param {string} str 
 */
const splitStatement = (str) => {
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
        })
}

/**
 * Parse the code
 * @param {string} code 
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ degree: number, color: string, bg: string, posX: number, posY: number, isDrawing: boolean }} state
 */
function run(code, ctx, state) {
    // TODO: repeat 4 (move 90 then rotate 90) then move 20 -> [repeat 4 (move 90 then rotate 90), move 20] -> use parse() to run the statement inside the ()
    splitStatement(code).map(st => runStatement(st, ctx, state));
}

/**
 * @param {string} st 
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ degree: number, color: string, bg: string, posX: number, posY: number, isDrawing: boolean }} o
 */
function runStatement(st, ctx, o) {
    // move <distance>
    if (st.startsWith("move")) {
        const distance = Number(st.substring(5));

        // Convert deg to rad
        const convertToRadian = Math.PI / 180;

        const newX = o.posX +
            distance * Math.cos(o.degree * convertToRadian);
        const newY = o.posY +
            distance * Math.sin(o.degree * convertToRadian);

        // Draw and set values at the same time
        ctx[o.isDrawing ? "lineTo" : "moveTo"](o.posX = newX, o.posY = newY);
    }

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
            splitStatement(statement.substring(1, statement.length - 1)).map(stm => runStatement(stm, ctx, o));
    }
}

export default run;