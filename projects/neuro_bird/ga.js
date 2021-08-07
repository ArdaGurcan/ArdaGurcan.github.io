function NextGeneration() {
    calculateFitness();
    let newGen = []
    let record = 0;
    let fittest = null;
    for (let i = 0; i < flockSize; i++) {
        if (birds[i].score >= record) {
            fittest = birds[i];
            record = birds[i].score;
        }
    }
    newGen[0] = (new Bird(fittest.brain))

    for (let i = 1; i < flockSize; i++) {
        newGen[i] = pickOne();
    }
    birds = newGen
    gen++;
    console.log("Generation #" + gen);
}

function calculateFitness() {
    let sum = 0;
    for (let i = 0; i < flockSize; i++) {
        sum += Math.pow(birds[i].score, 100);
    }

    for (let i = 0; i < flockSize; i++) {
        birds[i].fitness = Math.pow(birds[i].score, 100) / sum;
    }
}

function pickOne() {
    let index = 0;
    
    let r = Math.random()//random();
    while (r > 0) {
        try {
            r = r - birds[index].fitness;
            index++;
            
        } catch (error) {
            console.log(index)
            console.log(error)
            index = floor(random(flockSize))
        }
    }
    index--;

    let brain = birds[index].brain;
    let newBird = new Bird(brain);
    newBird.brain.mutate(mutationRate);
    return newBird;
}
