let populationSize = 3000;

class Population {
    constructor() {
        this.fittest;
        this.recordFitness=0;
        this.paddles = [];
        this.size = populationSize;
        this.matingpool;
        for (let i = 0; i < this.size; i++) {
            this.paddles[i] = new Paddle();
        }
    }

    run() {
        for (let i = 0; i < this.size; i++) {
            this.paddles[i].update();
            if (i < 1) 
            {
                this.paddles[i].show();
            }
        }
    }

    evaluate() {
        this.matingpool = [];
        let maxFitness = 0;
        for (let i = 0; i < this.size; i++) {
            this.paddles[i].calcFitness();
            let n = this.paddles[i].fitness;
            if (n > maxFitness) {
                maxFitness = n;
                if (maxFitness > this.recordFitness) {
                    this.recordFitness = maxFitness;
                    this.fittest = this.paddles[i];
                }
            }
        }
        for (let i = 0; i < 1000; i++) {
            // for (
            //     let j = 0;
            //     j < (this.paddles[i].fitness / maxFitness) * 100;
            //     j++
            // ) 
            {
                // this.matingpool.push(this.paddles[i]);
                this.matingpool.push((this.fittest));
            }
        }
    }

    selection() {
        let newPaddles = [];
        if (this.fittest) {
            
            newPaddles.push(new Paddle(this.fittest.dna));
        }
        for (let i = 0; i < this.size; i++) {
            let parent1 = random(this.matingpool);
            let parent2 = random(this.matingpool);
            let child = parent1.dna.crossover(parent2.dna);
            newPaddles.push(new Paddle(child));
        }
        this.paddles = newPaddles;
    }
}
