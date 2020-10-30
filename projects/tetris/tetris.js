// const cvs = document.getElementById("tetris");
// const ctx = cvs.getContext("2d");
// const scoreElement = document.getElementById("score");

const scale = 2;


const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 16 * scale;
const VACANT = "#14151a"; // color of an empty square

// draw a square
function drawSquare(x,y,color,context){
    context.fillStyle = color;
    context.fillRect(x*SQ,y*SQ,SQ,SQ);

    context.strokeStyle = "BLACK";
    context.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// create the board


player1 = new Player("tetris1","score1");
player2 = new Player("tetris2","score2");

// draw the board


player1.drawBoard();
player2.drawBoard();

// the pieces and their colors

const PIECES = [
    [Z,"hsl(0, 76%, 59%)"],
    [S,"hsl(128, 76%, 59%)"],
    [T,"hsl(286, 76%, 59%)"],
    [O,"hsl(53, 76%, 59%)"],
    [L,"hsl(20, 76%, 59%)"],
    [I,"hsl(186, 76%, 59%)"],
    [J,"hsl(225, 76%, 59%)"]
];

// generate random pieces


player1.activePiece = player1.randomPiece();
player2.activePiece = player2.randomPiece();

// The Object Piece



// fill function



let score = 0;



// CONTROL the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        player1.activePiece.moveLeft();
        // dropStart = Date.now();
    }
    if(event.keyCode == 38){
        player1.activePiece.rotate();
        // dropStart = Date.now();
    }
    if(event.keyCode == 39){
        player1.activePiece.moveRight();
        // dropStart = Date.now();
    }
    if(event.keyCode == 40){
        player1.activePiece.moveDown();
    }



    if(event.keyCode == 65){
        player2.activePiece.moveLeft();
        // dropStart = Date.now();
    }
    if(event.keyCode == 87){
        player2.activePiece.rotate();
        // dropStart = Date.now();
    }
    if(event.keyCode == 68){
        player2.activePiece.moveRight();
        // dropStart = Date.now();
    }
    if(event.keyCode == 83){
        player2.activePiece.moveDown();
    }
}


// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        player1.activePiece.moveDown();
        player2.activePiece.moveDown();

        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();



















