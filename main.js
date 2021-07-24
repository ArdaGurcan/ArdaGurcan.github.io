/*
©️ 2020 Arda Gürcan All rights reserved
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
let capsLock = false;

let normalMode = true;
let isMobile = false;
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
    console.log("* * * * * * * * * * * * * * * * * * * * * * * * *\n*\tCUBE CONTROLS:\t\t\t\t\t\t\t\t*\n*\t\tKeyboard:\t\t\t\t\t\t\t\t*\n*\t\t\tl,r,u,d,f,b,+shift,tab\t\t\t\t*\n*\t\tConsole:\t\t\t\t\t\t\t\t*\n*\t\t\tscramble()\t\t\t\t\t\t\t*\n*\t\t\tscrollFactor = 2\t\t\t\t\t*\n*\t\t\tscrollFactor = 0.5\t\t\t\t\t*\n*\t\tURL:\t\t\t\t\t\t\t\t\t*\n*\t\t\twww.ardagurcan.com/?dim=2\t\t\t*\n*\t\t\twww.ardagurcan.com/?dim=5\t\t\t*\n*\t\t\twww.ardagurcan.com/404.html?dim=3\t*\n*\t\t\t\t\t\t\t\t\t\t\t\t*\n* * * * * * * * * * * * * * * * * * * * * * * * *")
    let c = createCanvas(300, 250, WEBGL);
    c.parent("cube");
    frameRate(30);
    angleMode(DEGREES);
    easyCam = createEasyCam();
    easyCam.setRotationConstraint(true, false, false);
    easyCam.setDistance(700, 0);
    easyCam.removeMouseListeners();
    noLoop();

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
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
            $(".controls")[0].innerHTML=""
    }
    
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
    redraw()
}

function pressKey(targetKey) {
    if(targetKey.innerHTML == "Shift")
    {
        capsLock = !capsLock
        targetKey.classList.toggle("active")
        if(capsLock)
        {
            let buttons = $("button#letter-controls")
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].innerHTML = buttons[i].innerHTML.toUpperCase()
            }
        }
        else
        {
            let buttons = $("button#letter-controls")
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].innerHTML = buttons[i].innerHTML.toLowerCase()
            }
        }
        
    }
    else
    {
        key = targetKey.innerHTML
        if(capsLock && key != "Tab")
        {
            key = key.toUpperCase()
        }
        keyPressed()
    }
    
}

function draw() {
    if(!isMobile)
    {
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
            isMobile = true;
        }
        translate(0, -20, 0);
        rotateY(48 + (window.scrollY / 2) * scrollFactor);
        rotateX(-22.5);
        rotateZ(-22.5);
    
        // background(bgColor);
        clear()
        strokeWeight(5);
        for (let i = 0; i < cube.length; i++) {
            if (cube[i]) {
                cube[i].display();
            }
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
