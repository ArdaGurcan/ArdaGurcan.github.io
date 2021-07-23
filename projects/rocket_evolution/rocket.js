let maxSpeed = 10;
let target;
function preload() {
    img = loadImage('rocket.png');
  }
class Rocket {
    constructor(_dna) {
        if (_dna) {
            this.dna = _dna;
        } else {
            this.dna = new DNA();
        }
        this.pos = createVector(width / 2, height);
        this.vel = createVector();
        this.acc = createVector();
        this.fitness;
        this.done = false;
        this.crashed = false;
        this.reachTime = lifespan;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.done && !this.crashed) {
            // this.acc.mult(0);
            this.applyForce(this.dna.genes[time]);
            this.vel.add(this.acc);
            this.vel.limit(maxSpeed);
            this.pos.add(this.vel);
            if (this.pos.x > width || this.pos.x < 0) {
                this.crashed = true;
            }
            if (this.pos.y > height || this.pos.y < 0) {
                this.crashed = true;
            }
            if (dist(this.pos.x, this.pos.y, target.x, target.y) < 20) {
                this.done = true;
                this.pos = target.copy();
                this.reachTime = time;
            }
            for (let i = 0; i < obstacles.length; i++) {
                if (
                    dist(
                        this.pos.x,
                        this.pos.y,
                        obstacles[i].x,
                        obstacles[i].y
                    ) < 42
                ) {
                    this.crashed = true;
                }
            }
            allDone = false;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        fill(255, 150);
        noStroke();
        rectMode(CENTER);
        scale(-1)
        translate(38,0)
        // tint(255, 250);
        image(img, 0, 0,-38,14);
        pop();
    }

    calcFitness() {
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = 10000 / (d + 1);
        if (this.done) {
            this.fitness *= 10 / Math.pow(this.reachTime / lifespan, 3);
        }
        // If rocket does not get to target decrease fitness
        if (this.crashed) {
            this.fitness /= 10;
        }
        totalFitness += this.fitness;
        this.fitness = Math.pow(this.fitness, 6);
    }
}
