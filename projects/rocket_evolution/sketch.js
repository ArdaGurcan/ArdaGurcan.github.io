let population;
let lifespan = 300;
let time = 0;
let totalFitness = 0;
let generation = 0;
let allDone = false;
let obstacles;
function setup() {
    createCanvas(800, 600);
    population = new Population();
    target = createVector(width / 2, 50);
    obstacles = [
        createVector(340, 300),
        createVector(390,300),
        createVector(440,300),
        createVector(530,300),
        createVector(250,300),

        // createVector(540,300),
        // createVector(620,300),
        // createVector(620,220),
        // createVector(620,140),
        // createVector(500, 40),
        // createVector(500, 120),
        // createVector(500, 200),
        // createVector(300, 40),
        // createVector(300, 120),
        // createVector(300, 200),
        // createVector(220, 40),
        // createVector(220, 120),
        // createVector(220, 200),

    ];
}

function draw() {
    allDone = true;
    totalFitness = 0;
    background(50);
    population.run();
    noStroke();
    fill(255, 200);
    for (let i = 0; i < obstacles.length; i++) {
        ellipse(obstacles[i].x, obstacles[i].y, 80, 80);
    }
    fill(0, 255, 0, 200);
    ellipse(target.x, target.y, 40, 40);

    time++;
    if (time >= lifespan || allDone) {
        population.evaluate();
        population.selection();
        time = 0;
        generation++;
        console.log(
            "Average Fitness: " +
                totalFitness / populationSize / Math.pow(10, 1)
        );
        console.log("Max Fitness: " + population.recordFitness)
        console.log("Population Size: " + populationSize);
        console.log("Generation: " + generation);
        console.log("Life Span: " + lifespan);
        console.log("Mutation Chance: " + mutationRate * 100 + "%");
    }
}

function mouseClicked()
{
    obstacles.push(createVector(mouseX, mouseY))
}
