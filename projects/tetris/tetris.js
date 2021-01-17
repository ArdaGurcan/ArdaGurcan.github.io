// const cvs = document.getElementById("tetris");
// const ctx = cvs.getContext("2d");
// const scoreElement = document.getElementById("score");

const scale = 2;

const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (squareSize = 16 * scale);
const VACANT = "#14151a"; // color of an empty square

const PIECES = [
    [Z, "hsl(0, 76%, 59%)"],
    [S, "hsl(128, 76%, 59%)"],
    [T, "hsl(286, 76%, 59%)"],
    [O, "hsl(53, 76%, 59%)"],
    [L, "hsl(20, 76%, 59%)"],
    [I, "hsl(186, 76%, 59%)"],
    [J, "hsl(225, 76%, 59%)"],
];

let gameSeed = new Date().getTime();

function drawSquare(x, y, color, context) {
    context.fillStyle = color;
    context.fillRect(x * SQ, y * SQ, SQ, SQ);

    context.strokeStyle = "BLACK";
    context.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// create the board
    player1 = new Player("tetris1", "score1", gameSeed);
    player2 = new Player("tetris2", "score2", gameSeed);
    
    player1.init();
    player2.init();



// fill function

// CONTROL the piece

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        player1.activePiece.moveLeft();
        // dropStart = Date.now();
    }
    if (event.keyCode == 38) {
        player1.activePiece.rotate();
        // dropStart = Date.now();
    }
    if (event.keyCode == 39) {
        player1.activePiece.moveRight();
        // dropStart = Date.now();
    }
    if (event.keyCode == 40) {
        player1.activePiece.moveDown();
    }
}

// drop the piece every 1sec




