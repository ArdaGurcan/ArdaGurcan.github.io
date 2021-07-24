let populationSize = 2000;

class Population {
    constructor(_target) {
        this.fittest;
        this.recordFitness = 0;
        this.words = [];
        this.size = populationSize;
        this.matingpool;
        this.target = _target;
        for (let i = 0; i < this.size; i++) {
            this.words[i] = new Word(null, _target);
        }
    }

    evaluate() {
        this.matingpool = [];
        let maxFitness = 0;
        for (let i = 0; i < this.size; i++) {
            this.words[i].calcFitness();
            let n = this.words[i].fitness;
            if (n > maxFitness) {
                maxFitness = n;
                if (maxFitness > this.recordFitness) {
                    this.recordFitness = maxFitness;
                    this.fittest = this.words[i];
                }
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (
                let j = 0;
                j < (this.words[i].fitness / maxFitness) * 100;
                j++
            ) {
                this.matingpool.push(this.words[i]);
            }
        }
    }

    selection() {
        let newWords = [];
        if (this.fittest) {
            newWords.push(new Word(this.fittest.dna, this.target));
        }
        for (let i = 0; i < this.size; i++) {
            let parent1 = random(this.matingpool);
            let parent2 = random(this.matingpool);
            let child = parent1.dna.crossover(parent2.dna);
            newWords.push(new Word(child, this.target));
        }
        this.words = newWords;
    }
}

function strDistance(a, b) {
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] != b[i]) {
                distance++;
            }
        }
    }

    return distance;
}
class Word {
    constructor(dna, target) {
        if (dna) {
            this.dna = dna;
        } else {
            this.dna = new DNA(null, target);
        }
        if (target) {
            this.dna.target = target;
        }
        this.fitness;
    }

    calcFitness() {
        this.fitness = Math.pow(
            1 /
                (strDistance(this.dna.genes.join(""), this.dna.target) /
                    this.dna.target.length +
                    1),
            5
        );
        totalFitness += this.fitness;
    }
}
let mutationRate = 0.01;
let totalGenerations = 0;

class DNA {
    constructor(genes, target) {
        if (target) {
            this.target = target;
        }
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (let i = 0; i < this.target.length; i++) {
                this.genes[i] = random(
                    "ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZabcçdegğhijklmnoöprqsştuüvyxz,. ".split(
                        ""
                    )
                );
            }
        }
    }

    crossover(partner) {
        let newGenes = [];
        for (let i = 0; i < this.target.length; i++) {
            if (random() > mutationRate) {
                if (random() > 0.5) {
                    newGenes.push(partner.genes[i]);
                } else {
                    newGenes.push(this.genes[i]);
                }
            } else {
                newGenes.push(random("gprdaücnmesojtiul".split("")));
            }
        }

        return new DNA(newGenes);
    }
}
let population;
let time = 0;
let totalFitness = 0;
let generation = 0;
let populations = [];
let firstStart;
const s = (p) => {
    p.setup = function () {
        firstStart = new Date();
        populations = [];
        time = 0;
        totalFitness = 0;
        generation = 0;
        populations.push(
            new Population("Arda GürcanGames, Projects, Simulations...")
        );
        console.groupCollapsed("Generations");
        // populations.push(new Population("Gürcan"));
        // populations.push(new Population("Games"));
        // populations.push(new Population("Projects"));
        // populations.push(new Population("Simulations"));
    };

    p.draw = function () {
        let startTime = new Date();
        let complete = true;
        for (let i = 0; i < populations.length; i++) {
            if (
                !populations[i].fittest ||
                populations[i].fittest.dna.genes.join("") !=
                    populations[i].target
            ) {
                totalFitness = 0;

                time++;

                populations[i].evaluate();
                populations[i].selection();
                time = 0;
                if (
                    populations[i].fittest.dna.genes.join("") !=
                    populations[i].target
                ) {
                    complete = false;
                }
            }
        }
        generation++;

        totalGenerations++;
        let endTime = new Date();
        console.groupCollapsed("Gen #" + generation + ":\n");
        console.log("Duration: " + (endTime - startTime) + " ms");
        console.log(
            "Fittest: " +
                populations[0].fittest.dna.genes.join("").slice(0, 11) +
                "\n" +
                populations[0].fittest.dna.genes.join("").slice(11)
        );
        console.log(
            "Max Fitness: " + (populations[0].recordFitness * Math.pow(10, 7)).toFixed(2)
        );
        console.log(
            "Average Fitness: " +
                ((totalFitness / populationSize) * Math.pow(10, 7)).toFixed(2)
        );
        console.log("Population Size: " + populationSize);
        console.log("Mutation Chance: " + mutationRate * 100 + "%");
        console.groupEnd();
        $(".name").text(populations[0].fittest.dna.genes.join("").slice(0, 11));
        $(".detail").text(populations[0].fittest.dna.genes.join("").slice(11));
        if (complete) {
            $(".name").attr("title", "Typed by " + (populationSize * (totalGenerations-1)+populations[0].matingpool.indexOf(populations[0].fittest)) + " selectively bred monkies.");
            $(".detail").attr("title", "Typed by " + (populationSize * (totalGenerations-1)+populations[0].matingpool.indexOf(populations[0].fittest)) + " selectively bred monkies.");
            p.noLoop();
            console.log("Found right string in " + (endTime - firstStart) + " ms");
            console.groupEnd();
        } else if (generation > 80) {
            console.log("Failed in " + (endTime - firstStart) + " ms");
            // console.groupEnd();
            myp5 = new p5(s);
        }
    };
};
let myp5 = new p5(s);
