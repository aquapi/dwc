# DWC
Drawing with code.

## Statements
Some code stuff.

### Then statement

- Usage: Connect two statement
- Syntax: `<statement> then <statement>`

### Move statement

- Usage: Move the pen (will draw a line if the pen status is down)
- Syntax: `move <distance>`

### Rotate statement

- Usage: Rotate the pen
- Syntax: `rotate <degree>`

### Pen statement

- Usage: Set pen status
- Syntax: `pen <up or down>`

### Goto statement

- Usage: go to a position without drawing a line 
- Syntax `goto <x> <y>`

### Repeat statement

- Usage: Repeat a statement
- Syntax: `repeat <time> (<statement>)`

## Code examples

- [Draw a circle](https://dwc-six.vercel.app/?code=repeat%20360%20(move%201%20then%20rotate%201)): `repeat 360 (move 1 then rotate 1)`
- [Draw a square](https://dwc-six.vercel.app/?code=repeat%204%20(move%2090%20then%20rotate%2090)): `repeat 4 (move 90 then rotate 90)`