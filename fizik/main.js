let balls = [];
var G = 6;
var gravity = true;
var arrowType = "netForce"
var arrowLength = 1;
var objectCount = 10;
var objectSize = 30;
var selectedIndex = -1;
var previousSelection = -1;
var w = 700;
var h = 700;
var elasticity = 1;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function drawArrow(start, target, offset, coefficient, color = "#22963f", weight = 2) {

    let end = createVector(start.x + target.x * coefficient, start.y + target.y * coefficient)

    strokeWeight(weight)
    stroke("green")
    fill("green")
    push()
    line(start.x, start.y, end.x, end.y)
    var angle = atan2(start.y - end.y, start.x - end.x);
    translate(end.x, end.y);
    rotate(angle - HALF_PI);
    triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2);
    pop();
    strokeWeight(1)
    stroke("black")
}

function rotateVelocity(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function rotateVector(vector, angle) {
    const rotated = createVector(
        vector.x * cos(angle) - vector.y * sin(angle),
        vector.x * sin(angle) + vector.y * cos(angle)
    );

    return rotated;
}

function resolveCollision(o1, o2) {
    if (o1.hasCollision && o2.hasCollision) {
        const xVelocityDiff = o1.velocity.x - o2.velocity.x;
        const yVelocityDiff = o1.velocity.y - o2.velocity.y;

        const xDist = o2.location.x - o1.location.x;
        const yDist = o2.location.y - o1.location.y;

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            const angle = -Math.atan2(o2.location.y - o1.location.y, o2.location.x - o1.location.x);

            const m1 = o1.mass;
            const m2 = o2.mass;

            const u1 = rotateVelocity(o1.velocity, angle);
            const u2 = rotateVelocity(o2.velocity, angle);

            const v1 = {
                x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
                y: u1.y
            };
            const v2 = {
                x: v1.x+u1.x-u2.x,///*u2.x * (m1 - m2) / (m1 + m2) +*/ u1.x * 2 * m1 / (m1 + m2),
                y: u2.y
            };

            const vFinal1 = rotateVelocity(v1, -angle);
            const vFinal2 = rotateVelocity(v2, -angle);

            
            o1.velocity.x = vFinal1.x * elasticity;
            o1.velocity.y = vFinal1.y * elasticity;

            o2.velocity.x = vFinal2.x * elasticity;
            o2.velocity.y = vFinal2.y * elasticity;
        }
    }



}

function areColliding(o1, o2) {
    if (o1.constructor.name == o2.constructor.name && o1.constructor.name == "Circle") {
        if (Math.abs(o1.location.x - o2.location.x) ** 2 + Math.abs(o1.location.y - o2.location.y) ** 2 < (o1.radius + o2.radius) ** 2) {
            return true;
        }
    } else if (o1.constructor.name == o2.constructor.name && o1.constructor.name == "Rectangle") {
        let a1 = o1.location;
        let a2 = createVector(a1.x + o1.width, a1.y + o1.height);
        let b1 = o2.location;
        let b2 = createVector(b1.x + o2.width, b1.y + o2.height);
        if (a2.x < b1.x || a1.x > b2.x || a1.y > b2.y || a2.y < b1.y) {
            return false;
        } else {
            return true;
        }
    }
}

function setup() {
    frameRate(30)
    c = createCanvas(w, h);
    c.parent('physics')
    for (let i = 0; i < 0; i++) {
        let cw = rand(30, 50);
        let ch = rand(30, 50);
        let x = rand(0, w - cw);
        let y = rand(0, h - ch);

        balls.push(new Rectangle(x, y, (cw + ch) / 2, cw, ch));
    }
    for (let i = 0; i < objectCount; i++) {
        let r = rand(objectSize - 10, objectSize + 10);
        let x = rand(r, w - r);
        let y = rand(r, h - r);

        balls.push(new Circle(x, y, Math.floor(r), Math.floor(r)));
        balls[i].gravity = false;

    }

}

function restart() {
    balls = []

    selectedIndex = -1;

    for (let i = 0; i < objectCount; i++) {
        let r = rand(objectSize + 1, objectSize + 20);
        let x = rand(r, w - r);
        let y = rand(r, h - r);

        balls.push(new Circle(x, y, Math.floor(r), Math.floor(r)));



    }
}

function draw() {
    background(50);

    for (let i = 0; i < balls.length; i++) {

        
        let x1 = balls[i].location
        
        for (let j = 0; j < balls.length; j++) {


            if (balls[i] != balls[j] && areColliding(balls[i], balls[j])) {
                if (balls[i].grounded || balls[j].grounded) {
                    balls[j].grounded = true;
                    balls[i].grounded = true;
                    if (balls[i].location.y > balls[j].location.y) {
                        balls[j].grounded = true;
                    }

                    if (balls[j].location.y > balls[i].location.y) {
                        balls[i].grounded = true;
                    }
                }

                // let a1 = balls[i].location;
                // let a2 = createVector(a1.x + balls[i].width, a1.y + balls[i].height);
                // let b1 = balls[j].location;
                // let b2 = createVector(b1.x + balls[j].width, b1.y + balls[j].height);

                resolveCollision(balls[i], balls[j]);
            } else if (balls[i] != balls[j]) {
                if (balls[j].gravity || balls[i].gravity) {
                    let m1 = balls[j].mass
                    let m2 = balls[i].mass
                    let dy = Math.abs(balls[j].location.y - balls[i].location.y)
                    let dx = Math.abs(balls[j].location.x - balls[i].location.x)
                    let fx = G * m1 * m2 / (dx ** 2);
                    let fy = G * m1 * m2 / (dy ** 2);
                    let fi = createVector(0, 0)
                    let fj = createVector(0, 0)

                    if (dx > balls[i].radius + balls[j].radius) {
                        if (balls[i].location.x > balls[j].location.x) {
                            fi.x = -fx
                            fj.x = fx
                        } else {
                            fi.x = fx
                            fj.x = -fx
                        }
                    }


                    if (dy > balls[i].radius + balls[j].radius) {
                        if (balls[i].location.y > balls[j].location.y) {
                            fi.y = -fy
                            fj.y = fy
                        } else {
                            fi.y = fy
                            fj.y = -fy
                        }
                    }

                    balls[i].addForce(fi)
                    balls[j].addForce(fj)

                }
            }

        }
        balls[i].wallCollision();
        balls[i].move();
        balls[i].display();
        if (!balls[i].grounded && gravity) {
            balls[i].addForce(createVector(0, G * 0.098 * balls[i].mass))

        }
        
        if (arrowType == "netForce") {
            drawArrow(x1, balls[i].netForce, 5, arrowLength)
        } else if (arrowType == "velocity") {
            drawArrow(x1, balls[i].velocity, 5, arrowLength)
        }


        let target = balls[i].velocity;

        balls[i].netForce = createVector(0, 0)


    }


}

function mousePressed() {

    if (mouseX < w && mouseX > 0 && mouseY < h && mouseY > 0) {
        if (selectedIndex >= 0) {
            balls[selectedIndex].fixed = false;
            balls[selectedIndex].grounded = false;
        }
        selectedIndex = -1;
    }
    for (let i = 0; i < balls.length; i++) {

        console.log(dist(balls[i].location.x, balls[i].location.y, mouseX, mouseY))
        if (dist(balls[i].location.x, balls[i].location.y, mouseX, mouseY) < balls[i].radius) {
            balls[i].followMouse = true;
            selectedIndex = i;
        }

    }

}

function mouseReleased() {
    for (let i = 0; i < balls.length; i++) {

        balls[i].followMouse = false;

    }
}