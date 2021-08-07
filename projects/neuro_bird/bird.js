// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// Class is exported (eslint flag)
/* exported Bird */

class Bird {
    constructor(brain) {
        this.color = color(230, 69, 98, 255)
        // this.playerControlled = false;
        this.y = height / 2;
        this.x = 64;

        this.gravity = 0.6;
        this.lift = -8;
        this.velocity = 0;
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(5, 5, 1);
        }

        this.width = 60;
        this.height = 50;

        this.score = 0;
        this.fitness = 0;
        this.dead = false;
    }

    show() {
        if (!this.dead) {
            // draw the icon CENTERED around the X and Y coords of the bird object
            fill(this.color);
            push();
            let vel = createVector(20, this.velocity);
            translate(this.x, this.y);
            rotate(vel.heading());
            rect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
                5,
                5
            );

            pop();
        }
    }

    up() {
        this.velocity = this.lift;
    }

    update() {
        if (!this.dead) {
            this.score++;

            this.velocity += this.gravity;
            this.y += this.velocity;

            if (this.y >= height - this.height / 2) {
                this.y = height - this.height / 2;
                this.velocity = 0;
            }

            if (this.y <= this.height / 2) {
                this.y = this.height / 2;
                this.velocity = 0;
            }
            if (
                this.y + this.height / 2 >= height ||
                this.y - this.height / 2 <= 0
            ) {
                this.dead = true;
            }
        }
    }

    think(pipeArray) {
        if (!this.dead) {
            let closestPipe = null;
            for (let i = 0; i < pipeArray.length; i++) {
                if (!pipeArray[i].passed) {
                    closestPipe = pipeArray[i];
                    break;
                }
            }
            let inputs;
            if (closestPipe) {
                inputs = [
                    closestPipe.x / width,
                    closestPipe.top / this.height,
                    closestPipe.bottom / this.height,
                    this.y / this.height,
                    this.velocity / 10,
                ];
            } else {
                inputs = [0, 0, 0, this.y / this.height, this.velocity / 10];
            }
            let output = this.brain.predict(inputs);
            if (output[0] > 0.5) {
                this.up();
            }
        }
    }
}
