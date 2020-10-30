class Player {
    constructor(canvas, score) {
        this.board = [];
        this.activePiece;

        this.score = 0;
        this.cvs = document.getElementById(canvas);
        this.ctx = this.cvs.getContext("2d");
        this.scoreElement = document.getElementById(score);

        for (let r = 0; r < ROW; r++) {
            this.board[r] = [];
            for (let c = 0; c < COL; c++) {
                this.board[r][c] = VACANT;
            }
        }
    }

    drawBoard() {
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                drawSquare(c, r, this.board[r][c], this.ctx);
            }
        }
    }

    randomPiece(){
        let randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
        return new Piece( PIECES[randomN][0],PIECES[randomN][1], this);
    }
    
}
