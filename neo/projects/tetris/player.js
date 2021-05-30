class Player {
    constructor(canvas, score, seed) {
        this.board = [];
        this.activePiece;

        this.score = 0;
        this.cvs = document.getElementById(canvas);
        this.ctx = this.cvs.getContext("2d");
        this.scoreElement = document.getElementById(score);
        this.rng = new RNG(seed);
        this.pieceIndex = 7;
        this.pieceArray = [0, 1, 2, 3, 4, 5, 6];
        this.start = Date.now();
        this.gameOver = false;

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

    shufflePieces(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(this.rng.nextFloat() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    randomPiece = () => {
        if (this.pieceIndex >= 7) {
            this.pieceArray = this.shufflePieces(this.pieceArray);
            this.pieceIndex = 0;
        }

        let randomN = this.pieceArray[this.pieceIndex];
        this.pieceIndex++;
        return new Piece(PIECES[randomN][0], PIECES[randomN][1], this);
    };

    drop = () => {
        let now = Date.now();
        let delta = now - this.start;
        if (delta > 1000) {
            this.activePiece.moveDown();
            this.start = Date.now();
        }
        if (!this.gameOver) {
            requestAnimationFrame(this.drop);
        }
    }

    init() {
        this.drawBoard();
        this.activePiece = this.randomPiece();
        this.drop();
    }
}
