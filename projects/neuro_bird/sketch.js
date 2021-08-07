// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY
/*

"{\"input_nodes\":5,\"hidden_nodes\":5,\"output_nodes\":1,\"weights_ih\":{\"rows\":5,\"cols\":5,\"data\":[[-0.3084761425458081,0.7390169710896597,0.9483762207456197,-1.1940682102508817,-0.6438726527176728],[2.2118390622478525,-0.5573236540766879,-0.5525344238656618,1.2057861123980014,1.3036054450943537],[1.1188573781890425,-0.8984323917347106,0.30021814256081303,0.5091093576322385,-0.3625494923317749],[-1.4164327550900881,-0.5444982418654698,-0.015674651499585926,-0.2458672581151801,-1.5363055410552033],[-1.4849314705999421,0.8426322805518529,-0.7880482705094874,0.10411405755216929,0.44549565257843354]]},\"weights_ho\":{\"rows\":1,\"cols\":5,\"data\":[[-0.622666250110643,0.2130421128090152,0.830606759851563,-0.7807258264643763,0.9389536483070793]]},\"bias_h\":{\"rows\":5,\"cols\":1,\"data\":[[-0.17010871523157284],[-0.13322103530728338],[-0.29276108224674724],[1.0973840728555004],[0.8137739947113749]]},\"bias_o\":{\"rows\":1,\"cols\":1,\"data\":[[-0.6924736567446685]]},\"learning_rate\":0.1,\"activation_function\":{}}"

*/
// P5 exported functions (eslint flags)
/* exported preload, setup, draw, keyPressed */

// const { pipelinePrimaryTopicReference } = require("@babel/types");

// const { pipelinePrimaryTopicReference } = require("@babel/types");

// Exported sprites (eslint flags)
/* exported birdSprite, pipeBodySprite, pipePeakSprite */
const flockSize = 1;
let birds = [];
let pipes = [];
// let parallax = 0.8;
let score = 0;
let maxScore = 0;
let mutationRate = 0.01;
// let birdSprite;
// let pipeBodySprite;
// let pipePeakSprite;
// let bgImg;
// let bgX;
let spacing = 400;
let gameoverFrame = 0;
let isOver = false;

let touched = false;
let prevTouched = touched;
let speed = 1;
let gen = 0;
let player;

let keyDown = false;

let jumpSound;

function preload() {}

function setup() {
    jumpSound = loadSound("jump.mp3");
    jumpSound.setVolume(0.1);
    isOver = false;
    score = 0;
    pipes = [];
    player = new Bird();
    player.color = color(69, 141, 230, 200);
    for (let i = 0; i < flockSize; i++) {
        birds[i] = new Bird(
            NeuralNetwork.deserialize(
                '{"input_nodes":5,"hidden_nodes":5,"output_nodes":1,"weights_ih":{"rows":5,"cols":5,"data":[[-1.6619402200420317,0.7390169710896597,0.9483762207456197,-1.1940682102508817,-0.8152099165773804],[2.2118390622478525,-0.5573236540766879,-0.5525344238656618,1.2448626327809573,1.3036054450943537],[1.6233575258882638,-0.8984323917347106,0.30021814256081303,0.5091093576322385,-0.3625494923317749],[-0.01913038791679056,-0.7082260496924235,-0.015674651499585926,-0.3548572882232145,-0.9443355063668104],[-2.1379043734212404,0.8426322805518529,-0.7880482705094874,0.10411405755216929,0.44549565257843354]]},"weights_ho":{"rows":1,"cols":5,"data":[[-0.622666250110643,0.2726988745473151,0.830606759851563,-1.6488099035184187,0.9389536483070793]]},"bias_h":{"rows":5,"cols":1,"data":[[-0.17010871523157284],[-0.36702667143998013],[-0.31878103150290354],[1.2653231841914088],[0.8137739947113749]]},"bias_o":{"rows":1,"cols":1,"data":[[-0.6905399269024785]]},"learning_rate":0.1,"activation_function":{}}'
            )
        );
    }
    gameoverFrame = frameCount - 1;
    createCanvas(800, 600);
    stroke(50);
    strokeWeight(3);
}

function draw() {
    background("#46b0c3");
    for (let i = 0; i < speed; i++) {
        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();
            for (let j = 0; j < flockSize; j++) {
                if (!birds[j].dead) {
                    if (!pipes[i].passed && pipes[i].hits(birds[j])) {
                        birds[j].dead = true;
                    }
                }
            }

            if (!player.dead && !pipes[i].passed && pipes[i].hits(player)) {
                player.dead = true;
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for (let i = 0; i < flockSize; i++) {
            birds[i].think(pipes);
            birds[i].update();
        }
        if (!keyDown && (keyIsDown(32) || keyIsDown(38))) {
            keyDown = true;
            jumpSound.play();
            player.up();
        }
        if (!keyIsDown(32) && !keyIsDown(38)) {
            keyDown = false;
        }
        player.update();

        if (player.dead) {
            reset();
        }

        if (pipes.length == 0 || pipes[pipes.length - 1].x < width - spacing) {
            pipes.push(new Pipe());
        }
    }
    maxScore = max(score, maxScore);
    // for (let i = 0; i < flockSize; i++) {
    birds[0].show();
    player.show();
    // }
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].show();
    }
    if (birds[0].dead && !player.dead) {
        maxScore = Infinity;
        score = Infinity;
        showScores();
        textSize(64);
        fill(0, 220);
        noStroke();
        rect(0, height / 2 - 75, width, 150);
        textAlign(CENTER, CENTER);
        fill(0, 208, 20);
        text("YOU WON!", width / 2, height / 2);
        textAlign(LEFT, BASELINE);
        noLoop();
    }
    showScores();
}

function showScores() {
    textSize(32);
    fill(50);
    noStroke();
    text("score: " + score, 16, 32);
    text("record: " + maxScore, 16, 64);
    stroke(50);
}

function gameover() {
    textSize(64);
    fill(0, 220);
    noStroke();
    rect(0, height / 2 - 75, width, 150);
    textAlign(CENTER, CENTER);
    fill(208, 0, 20);
    text("YOU DIED", width / 2, height / 2);
    textAlign(LEFT, BASELINE);
    stroke(50);
    maxScore = max(score, maxScore);
    isOver = true;
    reset();
    // noLoop();
}

function reset() {
    isOver = false;
    score = 0;
    bgX = 0;
    pipes = [];
    NextGeneration();
    player = new Bird();
    player.color = color(69, 141, 230, 200);
    pipes.push(new Pipe());
    gameoverFrame = frameCount - 1;
}

// function keyPressed() {
//   if (key === ' ') {
//     bird.up();
//     if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
//   }
// }

function touchStarted() {
    if (isOver) reset();
}
