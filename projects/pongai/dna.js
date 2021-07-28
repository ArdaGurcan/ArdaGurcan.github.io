let mutationRate = 1;

class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (let i = 0; i < lifespan; i++) {
                this.genes[i] = random(0, height-100)
                // this.genes[i] = p5.Vector.random2D();
                // this.genes[i].limit(maxSpeed);
            }
        }
    }

    crossover(partner) {
        let newGenes = [];
        for (let i = 0; i < lifespan; i++) {
            

            if (i <= fittest){//random() > mutationRate) {
                // console.log(i,population.maxFitness)
                if (random() > 0.5) {
                    newGenes.push(partner.genes[i]);
                } else {
                    newGenes.push(this.genes[i]);
                }
            } else {
                newGenes.push(random(0, height-100))
                // newGenes.push(p5.Vector.random2D());
                // newGenes[i].setMag;
            }
        }

        return new DNA(newGenes);
    }
}
