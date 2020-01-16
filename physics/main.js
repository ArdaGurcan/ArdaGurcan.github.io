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

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function drawArrow(start, target, offset, coefficient, color = "#22963f", weight = 2) {

    let end = createVector(start.x + target.x * coefficient, start.y + target.y * coefficient)

    strokeWeight(weight)
    stroke("green")
    fill("green")
    push() //start new drawing state
    line(start.x, start.y, end.x, end.y)
    var angle = atan2(start.y - end.y, start.x - end.x); //gets the angle of the line
    translate(end.x, end.y); //translates to the destination vertex
    rotate(angle - HALF_PI); //rotates the arrow point
    triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); //draws the arrow point as a triangle
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
    if (o1.hasCollision && o2.hasCollision) { //(o1.constructor.name == o2.constructor.name && o1.constructor.name == "Circle") {
        const xVelocityDiff = o1.velocity.x - o2.velocity.x;
        const yVelocityDiff = o1.velocity.y - o2.velocity.y;

        const xDist = o2.location.x - o1.location.x;
        const yDist = o2.location.y - o1.location.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(o2.location.y - o1.location.y, o2.location.x - o1.location.x);

            // Store mass in var for better readability in collision equation
            const m1 = o1.mass;
            const m2 = o2.mass;

            // Velocity before equation
            const u1 = rotateVelocity(o1.velocity, angle);
            const u2 = rotateVelocity(o2.velocity, angle);

            // Velocity after 1d collision equation
            const v1 = {
                x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
                y: u1.y
            };
            const v2 = {
                x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
                y: u2.y
            };

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotateVelocity(v1, -angle);
            const vFinal2 = rotateVelocity(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            let c= 0.97
            o1.velocity.x = vFinal1.x*c;
            o1.velocity.y = vFinal1.y*c;

            o2.velocity.x = vFinal2.x*c;
            o2.velocity.y = vFinal2.y*c;
        }
    }
    // else if (o1.constructor.name == o2.constructor.name && o1.constructor.name == "Rectangle") {

    // }


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
    // balls[0].fixed = true;

    //balls[5].followMouse = true;
}

function restart() {
    balls = []
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


        for (let j = 0; j < balls.length; j++) {


            if (balls[i] != balls[j] && areColliding(balls[i], balls[j])) {
                if (balls[i].grounded || balls[j].grounded) {
                    // console.log(balls[i].location.y, balls[j].location.y)
                    if (balls[i].location.y > balls[j].location.y) {
                        balls[j].grounded = true;
                    }

                    if (balls[j].location.y > balls[i].location.y) {
                        balls[i].grounded = true;
                    }
                }
                // {

                // }
                // console.log(balls[i].location.dist(balls[j].location)); //!(balls[i].x < balls[j].x + balls[j].width || balls[j].x < balls[i].x + balls[i].width)

                let a1 = balls[i].location;
                let a2 = createVector(a1.x + balls[i].width, a1.y + balls[i].height);
                let b1 = balls[j].location;
                let b2 = createVector(b1.x + balls[j].width, b1.y + balls[j].height);

                // if (!(a2.x < b1.x || a1.x > b2.x) && (a1.y > b2.y || a2.y < b1.y)) {
                //     if (balls[i].y > balls[j].y) {
                //         balls[j].addForce(createVector(0, -9.8));
                //         balls[j].color = "#000";
                //         balls[i].color = "#fff";
                //     } else {
                //         balls[i].addForce(createVector(0, -9.8));
                //         balls[i].color = "#000";
                //         balls[j].color = "#fff";
                //     }
                // } else {
                //     balls[i].color = "#900";
                //     balls[j].color = "#900";
                // }




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
                    // push()
                    // var angle = atan2(balls[j].y - balls[i].y, balls[j].x - balls[i].x); //gets the angle of the line
                    // let m1 = balls[j].mass
                    // let m2 = balls[i].mass
                    // let d = Math.abs(balls[j].location.y-balls[i].location.y)
                    // rotate(angle-HALF_PI)
                    // console.log(balls[j].location,balls[i].location)

                    // let f1 = createVector(0,0)
                    // if(balls[i].y > balls[j].y)
                    // {
                    //     f1 = createVector(0,(G*m1*m2/d**2))
                    // }
                    // else{
                    //     f1 = createVector(0,-(G*m1*m2/d**2))
                    // }

                    // console.log(f1)
                    // pop()
                    // let final = rotateVector(f1,(-angle))
                    // console.log(final)
                    // balls[j].addForce(final);


                }
            }

        }
        if (!balls[i].grounded && gravity) {
            balls[i].addForce(createVector(0, G * 0.098 * balls[i].mass))

        }
        balls[i].wallCollision();
        let x1 = balls[i].location
        balls[i].move();
        balls[i].display();
        if (arrowType == "netForce") {
            drawArrow(x1, balls[i].netForce, 5, arrowLength)
        } else if (arrowType == "velocity") {
            drawArrow(x1, balls[i].velocity, 5, arrowLength)
        }


        let target = balls[i].velocity;

        // console.log(balls[0].forces)
        balls[i].netForce = createVector(0, 0)


    }


}

function mousePressed() {
    
    if (mouseX < w && mouseX > 0 && mouseY < h && mouseY > 0){
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
        // balls[i].fixed = true;

    }
}