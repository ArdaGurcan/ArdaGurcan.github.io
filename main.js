/*
Copyright © Arda Gürcan 2020
*/

let dim = 4;

let cube = [];
let sideLength = 80;
let locked = false;
let angle = 3;
let interval = 5;
var easyCam;

let colors = [];

let rotXCW;
let rotXCCW;

let rotYCW;
let rotYCCW;

let rotZCW;
let rotZCCW;

let canvasSize;
let bgColor = "#141518";

let lastScroll = 0;
let scrollFactor = 1;

let normalMode = true;

function matmul(mat, vec) {
    return createVector(
        mat[0][0] * vec.x + mat[0][1] * vec.y + mat[0][2] * vec.z,
        mat[1][0] * vec.x + mat[1][1] * vec.y + mat[1][2] * vec.z,
        mat[2][0] * vec.x + mat[2][1] * vec.y + mat[2][2] * vec.z
    );
}

function deviceSize() {
    let envs = ["xs", "sm", "md", "lg", "xl"];

    let el = document.createElement("div");
    document.body.appendChild(el);

    let curEnv = envs.shift();

    for (let env of envs.reverse()) {
        el.classList.add(`d-${env}-none`);

        if (window.getComputedStyle(el).display === "none") {
            curEnv = env;
            break;
        }
    }

    document.body.removeChild(el);
    return curEnv;
}

function compareVectors(a, b) {
    return a.pos.x - b.pos.x || a.pos.y - b.pos.y || a.pos.z - b.pos.z;
}

function fixCanvas(x, y) {
    resizeCanvas(x, y);
    perspective(48 + (dim - 4) * 10);
    redraw();
}

function setup() {
    let c = createCanvas(300, 250, WEBGL);
    c.parent("cube");
    frameRate(30);
    angleMode(DEGREES);
    easyCam = createEasyCam();
    easyCam.setRotationConstraint(true, false, false);
    easyCam.setDistance(700, 0);
    easyCam.removeMouseListeners();
    // noLoop();

    tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === "dim") dim = parseInt(decodeURIComponent(tmp[1]));
        });

    let canvasScale =
        deviceSize() == "xs" || deviceSize() == "sm" || deviceSize() == "md"
            ? 0.65
            : 0.4;
    fixCanvas(
        $("#cube").width() * canvasScale,
        (($("#cube").width() * 5) / 6) * canvasScale
    );

    rotXCW = [
        [1, 0, 0],
        [0, cos(angle), -sin(angle)],
        [0, sin(angle), cos(angle)],
    ];
    rotXCCW = [
        [1, 0, 0],
        [0, cos(-angle), -sin(-angle)],
        [0, sin(-angle), cos(-angle)],
    ];

    rotYCW = [
        [cos(angle), 0, sin(angle)],
        [0, 1, 0],
        [-sin(angle), 0, cos(angle)],
    ];
    rotYCCW = [
        [cos(-angle), 0, sin(-angle)],
        [0, 1, 0],
        [-sin(-angle), 0, cos(-angle)],
    ];

    rotZCW = [
        [cos(angle), -sin(angle), 0],
        [sin(angle), cos(angle), 0],
        [0, 0, 1],
    ];
    rotZCCW = [
        [cos(-angle), -sin(-angle), 0],
        [sin(-angle), cos(-angle), 0],
        [0, 0, 1],
    ];

    colors = [
        color("#f9f9ff"), // white
        color("#ebeb46"), // yellow
        color("#eb4656"), // red
        color("#eb7d46"), // orange
        color("#46eb51"), // green
        color("#467ceb"), // blue
        color("#1b1b1b"), // black
    ];

    for (let i = 0; i < dim; i++) {
        let slice = [];
        for (let j = 0; j < dim; j++) {
            let row = [];
            for (let k = 0; k < dim; k++) {
                cube.push(
                    new Cubelet(
                        createVector(
                            (i - 0.5 * (dim - 1)) * sideLength,
                            (j - 0.5 * (dim - 1)) * sideLength,
                            (k - 0.5 * (dim - 1)) * sideLength
                        ),
                        sideLength,
                        createVector(0, 0, 0),
                        createVector(i, j, k)
                    )
                );
            }
        }
    }

    //#region logo
    if (dim == 4) {
        cube[5].left = colors[4];
        cube[6].left = colors[4];
        cube[13].left = colors[4];
        cube[14].left = colors[4];

        cube[5 + 48].right = colors[5];
        cube[6 + 48].right = colors[5];
        cube[13 + 48].right = colors[5];
        cube[14 + 48].right = colors[5];

        cube[23].front = colors[3];
        cube[27].front = colors[3];
        cube[39].front = colors[3];
        cube[43].front = colors[3];
        cube[55].front = colors[3];

        cube[23 - 3].back = colors[2];
        cube[27 - 3].back = colors[2];
        cube[39 - 3].back = colors[2];
        cube[43 - 3].back = colors[2];
        cube[55 - 3].back = colors[2];
    }
    ///#endregion
}

function f() {
    for (let i = 0; i < dim ** 3; i++) {
        if ((i + 1) % dim == 0) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotZCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].zCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function F() {
    for (let i = 0; i < dim ** 3; i++) {
        if ((i + 2) % dim == 0) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotZCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].zCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function b() {
    for (let i = 0; i < dim ** 3; i++) {
        if (i % dim == 0) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotZCCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].zCCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function B() {
    for (let i = 0; i < dim ** 3; i++) {
        if ((i - 1) % dim == 0) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotZCCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].zCCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function r() {
    for (let i = dim ** 2 * (dim - 1); i < dim ** 3; i++) {
        for (let j = 0; j < 90 / angle; j++) {
            cube[i].pos = matmul(rotXCW, cube[i].pos);
        }
        cube[i].pos = createVector(
            round(cube[i].pos.x),
            round(cube[i].pos.y),
            round(cube[i].pos.z)
        );
        cube[i].xCCW();
    }
    cube = cube.sort(compareVectors);
}

function R() {
    for (let i = dim ** 2 * (dim - 2); i < dim ** 2 * (dim - 1); i++) {
        for (let j = 0; j < 90 / angle; j++) {
            cube[i].pos = matmul(rotXCW, cube[i].pos);
        }
        cube[i].pos = createVector(
            round(cube[i].pos.x),
            round(cube[i].pos.y),
            round(cube[i].pos.z)
        );
        cube[i].xCCW();
    }
    cube = cube.sort(compareVectors);
}

function l() {
    for (let i = 0; i < dim ** 2; i++) {
        for (let j = 0; j < 90 / angle; j++) {
            cube[i].pos = matmul(rotXCCW, cube[i].pos);
        }
        cube[i].pos = createVector(
            round(cube[i].pos.x),
            round(cube[i].pos.y),
            round(cube[i].pos.z)
        );
        cube[i].xCW();
    }
    cube = cube.sort(compareVectors);
}

function L() {
    for (let i = dim ** 2; i < dim ** 2 * 2; i++) {
        for (let j = 0; j < 90 / angle; j++) {
            cube[i].pos = matmul(rotXCCW, cube[i].pos);
        }
        cube[i].pos = createVector(
            round(cube[i].pos.x),
            round(cube[i].pos.y),
            round(cube[i].pos.z)
        );
        cube[i].xCW();
    }
    cube = cube.sort(compareVectors);
}

function u() {
    for (let i = 0; i < dim ** 3; i++) {
        if (i % dim ** 2 < dim) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotYCCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].yCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function U() {
    for (let i = 0; i < dim ** 3; i++) {
        if (i % dim ** 2 < 2 * dim && i % dim ** 2 >= dim) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotYCCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].yCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function d() {
    for (let i = 0; i < dim ** 3; i++) {
        if (dim ** 2 - (i % dim ** 2) <= dim) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotYCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].yCCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function D() {
    for (let i = 0; i < dim ** 3; i++) {
        if (
            dim ** 2 - (i % dim ** 2) <= 2 * dim &&
            dim ** 2 - (i % dim ** 2) > dim
        ) {
            for (let j = 0; j < 90 / angle; j++) {
                cube[i].pos = matmul(rotYCW, cube[i].pos);
            }
            cube[i].pos = createVector(
                round(cube[i].pos.x),
                round(cube[i].pos.y),
                round(cube[i].pos.z)
            );
            cube[i].yCCW();
        }
    }
    cube = cube.sort(compareVectors);
}

function scramble() {
    let moves = [f, b, r, l, u, d, F, B, R, L, U, D];

    let length = random(20, 50);
    for (let i = 0; i < length; i++) {
        let n = Math.round(Math.random() * (moves.length - 1));
        moves[n]();
    }
}

function draw() {
    translate(0, -20, 0);
    rotateY(48 + (window.scrollY / 2) * scrollFactor);
    rotateX(-22.5);
    rotateZ(-22.5);

    background(bgColor);
    strokeWeight(5);

    for (let i = 0; i < cube.length; i++) {
        if (cube[i]) {
            cube[i].display();
        }
    }
}
window.onscroll = function () {
    if (Math.abs(window.scrollY - lastScroll) > 5) {
        redraw();
        lastScroll = window.scrollY;
    }
};

function keyPressed() {
    if (!locked) {
        if (key == "f") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i + 1) % dim == 0) {
                            index++;
                            if (cube[i].rot.z >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i + 2) % dim == 0) {
                            index++;
                            if (cube[i].rot.z >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "F") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i + 1) % dim == 0) {
                            index++;
                            if (cube[i].rot.z <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, -angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i + 2) % dim == 0) {
                            index++;
                            if (cube[i].rot.z <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, -angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "b") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim == 0) {
                            index++;
                            if (cube[i].rot.z <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, -angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i - 1) % dim == 0) {
                            index++;
                            if (cube[i].rot.z <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, -angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "B") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim == 0) {
                            index++;
                            if (cube[i].rot.z >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if ((i - 1) % dim == 0) {
                            index++;
                            if (cube[i].rot.z >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].zCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotZCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, 0, angle));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "r") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = dim ** 2 * (dim - 1); i < dim ** 3; i++) {
                        index++;
                        if (cube[i].rot.x >= 90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCW, cube[i].pos);
                            cube[i].rot.add(createVector(angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (
                        let i = dim ** 2 * (dim - 2);
                        i < dim ** 2 * (dim - 1);
                        i++
                    ) {
                        index++;
                        if (cube[i].rot.x >= 90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCW, cube[i].pos);
                            cube[i].rot.add(createVector(angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            }
        }
        if (key == "R") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = dim ** 2 * (dim - 1); i < dim ** 3; i++) {
                        index++;
                        if (cube[i].rot.x <= -90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCCW, cube[i].pos);
                            cube[i].rot.add(createVector(-angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (
                        let i = dim ** 2 * (dim - 2);
                        i < dim ** 2 * (dim - 1);
                        i++
                    ) {
                        index++;
                        if (cube[i].rot.x <= -90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCCW, cube[i].pos);
                            cube[i].rot.add(createVector(-angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "l") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 2; i++) {
                        index++;
                        if (cube[i].rot.x <= -90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCCW, cube[i].pos);
                            cube[i].rot.add(createVector(-angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = dim ** 2; i < dim ** 2 * 2; i++) {
                        index++;
                        if (cube[i].rot.x <= -90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCCW, cube[i].pos);
                            cube[i].rot.add(createVector(-angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            }
        }
        if (key == "L") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 2; i++) {
                        index++;
                        if (cube[i].rot.x >= 90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCW, cube[i].pos);
                            cube[i].rot.add(createVector(angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = dim ** 2; i < dim ** 2 * 2; i++) {
                        index++;
                        if (cube[i].rot.x >= 90) {
                            cube[i].pos = createVector(
                                round(cube[i].pos.x),
                                round(cube[i].pos.y),
                                round(cube[i].pos.z)
                            );
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].xCCW();
                            if (index == dim ** 2) {
                                clearInterval(f);
                                locked = false;
                                cube = cube.sort(compareVectors);
                            }
                        } else {
                            cube[i].pos = matmul(rotXCW, cube[i].pos);
                            cube[i].rot.add(createVector(angle, 0, 0));
                        }
                    }
                    redraw();
                }, interval);
            }
        }

        if (key == "u") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim ** 2 < dim) {
                            index++;
                            if (cube[i].rot.y <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, -angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim ** 2 < 2 * dim && i % dim ** 2 >= dim) {
                            index++;
                            if (cube[i].rot.y <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, -angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
            cube = cube.sort(compareVectors);
        }

        if (key == "U") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim ** 2 < dim) {
                            index++;
                            if (cube[i].rot.y >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (i % dim ** 2 < 2 * dim && i % dim ** 2 >= dim) {
                            index++;
                            if (cube[i].rot.y >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }
            cube = cube.sort(compareVectors);
        }

        if (key == "d") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (dim ** 2 - (i % dim ** 2) <= dim) {
                            index++;
                            if (cube[i].rot.y >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (
                            dim ** 2 - (i % dim ** 2) <= 2 * dim &&
                            dim ** 2 - (i % dim ** 2) > dim
                        ) {
                            index++;
                            if (cube[i].rot.y >= 90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }

            cube = cube.sort(compareVectors);
        }

        if (key == "D") {
            if (normalMode) {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (dim ** 2 - (i % dim ** 2) <= dim) {
                            index++;
                            if (cube[i].rot.y <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, -angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            } else {
                locked = true;
                let f = setInterval(() => {
                    let index = 0;
                    for (let i = 0; i < dim ** 3; i++) {
                        if (
                            dim ** 2 - (i % dim ** 2) <= 2 * dim &&
                            dim ** 2 - (i % dim ** 2) > dim
                        ) {
                            index++;
                            if (cube[i].rot.y <= -90) {
                                cube[i].pos = createVector(
                                    round(cube[i].pos.x),
                                    round(cube[i].pos.y),
                                    round(cube[i].pos.z)
                                );
                                cube[i].rot = createVector(0, 0, 0);
                                cube[i].yCW();
                                if (index == dim ** 2) {
                                    clearInterval(f);
                                    locked = false;
                                    cube = cube.sort(compareVectors);
                                }
                            } else {
                                cube[i].pos = matmul(rotYCCW, cube[i].pos);
                                cube[i].rot.add(createVector(0, -angle, 0));
                            }
                        }
                    }
                    redraw();
                }, interval);
            }

            cube = cube.sort(compareVectors);
        }
    }
    if (key == "Tab") {
        normalMode = !normalMode;
    }
}
