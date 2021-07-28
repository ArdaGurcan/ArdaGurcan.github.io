class Paddle {
    constructor(_dna) {
        if (_dna) {
            this.dna = _dna;
        } else {
            this.dna = new DNA();
        }
        this.position = height/2
        this.target = height/2
        this.score = 0
        this.fitness;
        this.failed = false
    }

    update() {
        if(!this.failed)
        {

            this.target =  this.dna.genes[time]
            if(this.target > this.position +1)
            {
                this.position += 1;
            }
            else if(this.target < this.position -1)
            {
                this.position -= 1;
            }
        }
    }

    show() {
        if(!this.failed)
            rect(width-40, this.position, 20, 100)
    }

    calcFitness() {
        this.fitness = this.score // Math.pow(this.score,10)
        totalFitness += this.fitness
    }
}
