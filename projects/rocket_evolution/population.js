let populationSize = 1000;

class Population {
    constructor() {
        this.fittest;
        this.recordFitness=0;
        this.rockets = [];
        this.size = populationSize;
        this.matingpool;
        for (let i = 0; i < this.size; i++) {
            this.rockets[i] = new Rocket();
        }
    }

    run() {
        for (let i = 0; i < this.size; i++) {
            this.rockets[i].update();
            if (i <= 2) {
                this.rockets[i].show();
            }
        }
    }

    evaluate() {
        this.matingpool = [];
        let maxFitness = 0;
        for (let i = 0; i < this.size; i++) {
            this.rockets[i].calcFitness();
            let n = this.rockets[i].fitness;
            if (n > maxFitness) {
                maxFitness = n;
                if (maxFitness > this.recordFitness) {
                    this.recordFitness = maxFitness;
                    this.fittest = this.rockets[i];
                }
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (
                let j = 0;
                j < (this.rockets[i].fitness / maxFitness) * 100;
                j++
            ) {
                this.matingpool.push(this.rockets[i]);
            }
        }

        console.log(this.matingpool.length);
    }

    selection() {
        let newRockets = [];
        if (this.fittest) {
            this.fittest.pos = createVector();
            this.fittest.vel = createVector();
            newRockets.push(new Rocket(this.fittest.dna));
        }
        for (let i = 0; i < this.size; i++) {
            let parent1 = random(this.matingpool);
            let parent2 = random(this.matingpool);
            let child = parent1.dna.crossover(parent2.dna);
            newRockets.push(new Rocket(child));
        }
        this.rockets = newRockets;
    }
}
