let dim = 4;

let cube = [];
let sideLength = 80;
let locked = false;
let angle = 3;
let interval = 5
var easyCam;

let colors = [];

let rotXCW;
let rotXCCW;

let rotYCW;
let rotYCCW;

let rotZCW;
let rotZCCW;

let canvasSize;
let bgColor = "#141518"
let lastScroll = 0;

function matmul(mat, vec) {
    return createVector(
        mat[0][0] * vec.x + mat[0][1] * vec.y + mat[0][2] * vec.z,
        mat[1][0] * vec.x + mat[1][1] * vec.y + mat[1][2] * vec.z,
        mat[2][0] * vec.x + mat[2][1] * vec.y + mat[2][2] * vec.z
    );
    
}

function deviceSize() {
    let envs = ['xs', 'sm', 'md', 'lg', 'xl'];

    let el = document.createElement('div');
    document.body.appendChild(el);

    let curEnv = envs.shift();

    for (let env of envs.reverse()) {
        el.classList.add(`d-${env}-none`);

        if (window.getComputedStyle(el).display === 'none') {
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

function fixCanvas(x,y)
{
    
    resizeCanvas(x,y)
    perspective(48)
    redraw()
}

function setup() {
    

    let c = createCanvas(300, 250, WEBGL);
    c.parent("cube")
    frameRate(30);
    angleMode(DEGREES);
    easyCam = createEasyCam();
    easyCam.setRotationConstraint(true, false, false);
    easyCam.setDistance(700,0)
    easyCam.removeMouseListeners()
    // noLoop();

    let canvasScale = (deviceSize() == 'xs' || deviceSize() == 'sm' || deviceSize() == 'md') ? .65 : .4
          // console.log(canvasScale)
    fixCanvas($("#cube").width()*canvasScale,$("#cube").width() * 5/6 * canvasScale)

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
        color("#ffee83"), // yellow
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
                        createVector(i,j,k)
                    )
                );
            }
        }
    }
    // for (let i = 0; i < cube.length; i++) {
    //     if(cube[i].up == colors[6] && 
    //         cube[i].down == colors[6] && 
    //         cube[i].left == colors[6] && 
    //         cube[i].right == colors[6] && 
    //         cube[i].front == colors[6] && 
    //         cube[i].back == colors[6])
    //     {
    //         cube[i] = null
    //     }
        
    // }

    //#region logo
    if(dim == 4)
    {
        cube[5].left = colors[4]
        cube[6].left = colors[4]
        cube[13].left = colors[4]
        cube[14].left = colors[4]
    
        cube[5+48].right = colors[5]
        cube[6+48].right = colors[5]
        cube[13+48].right = colors[5]
        cube[14+48].right = colors[5]
    
    
        cube[23].front = colors[3]
        cube[27].front = colors[3]
        cube[39].front = colors[3]
        cube[43].front = colors[3]
        cube[55].front = colors[3]
    
        cube[23-3].back = colors[2]
        cube[27-3].back = colors[2]
        cube[39-3].back = colors[2]
        cube[43-3].back = colors[2]
        cube[55-3].back = colors[2]
    }
    ///#endregion
}

function draw() {
    if(locked)
    {
        frameRate(30)
    }
    else{
        frameRate(10)
    }
    translate(0,-20,0)
    rotateY(48 + window.scrollY);
    rotateX(-22.5);
    rotateZ(-22.5);
    // easyCam.
    // stroke(colors[6]);
    // background(20, 21, 24);
    background(bgColor)

    // strokeWeight(10)
    // line(0,-height,0,height)
    // line(-width,0,width,0)

    strokeWeight(5);


    for (let i = 0; i < cube.length; i++) {
        if(cube[i]){
            cube[i].display();

        }
    }
}
window.onscroll = function(){
    if(Math.abs(window.scrollY-lastScroll) > 5)
    {
        redraw()
        lastScroll = window.scrollY;
    }
}

function keyPressed() {
    if (!locked) {
        if (key == "f") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if ((i +1) % dim == 0) {
                        index++
                        if (cube[i].rot.z >= 90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].zCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotZCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, 0, angle));
                            
                        }
                    }
                }
                redraw()
            }, interval);            
        }

        if (key == "F") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if ((i +1) % dim == 0) {
                        index++
                        if (cube[i].rot.z <= -90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].zCCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotZCCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, 0, -angle));
                            
                        }
                    }
                }
                redraw()
            }, interval);   
        }

        if (key == "b") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if ((i ) % dim == 0) {
                        index++
                        if (cube[i].rot.z <= -90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].zCCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotZCCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, 0, -angle));
                            
                        }
                    }
                }
                redraw()
            }, interval);   
        }

        if (key == "B") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if ((i ) % dim == 0) {
                        index++
                        if (cube[i].rot.z >= 90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].zCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotZCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, 0, angle));
                            
                        }
                    }
                }
                redraw()
            }, interval);
        }

        if (key == "r") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = dim ** 2 * (dim - 1); i < dim ** 3; i++) {
                    index++
                    if (cube[i].rot.x >= 90) {
                        cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                        cube[i].rot = createVector(0, 0, 0);
                        cube[i].xCCW();
                        if(index == dim**2)
                        {
                            clearInterval(f);
                            locked = false
                            cube = cube.sort(compareVectors);
                        }
                    }
                    else
                    {
                        cube[i].pos = matmul(rotXCW, cube[i].pos);
                        cube[i].rot.add(createVector(angle, 0, 0));
                        
                    }
                }
                redraw()
            }, interval);
        }
        if (key == "R") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = dim ** 2 * (dim - 1); i < dim ** 3; i++) {
                    index++
                    if (cube[i].rot.x <= -90) {
                        cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                        cube[i].rot = createVector(0, 0, 0);
                        cube[i].xCW();
                        if(index == dim**2)
                        {
                            clearInterval(f);
                            locked = false
                            cube = cube.sort(compareVectors);
                        }
                    }
                    else
                    {
                        cube[i].pos = matmul(rotXCCW, cube[i].pos);
                        cube[i].rot.add(createVector(-angle, 0, 0));
                        
                    }
                }
                redraw()
            }, interval);
        }

        if (key == "l") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 2; i++) {
                    index++
                    if (cube[i].rot.x <= -90) {
                        cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                        cube[i].rot = createVector(0, 0, 0);
                        cube[i].xCW();
                        if(index == dim**2)
                        {
                            clearInterval(f);
                            locked = false
                            cube = cube.sort(compareVectors);
                        }
                    }
                    else
                    {
                        cube[i].pos = matmul(rotXCCW, cube[i].pos);
                        cube[i].rot.add(createVector(-angle, 0, 0));
                        
                    }
                }
                redraw()
            }, interval);

        }
        if (key == "L") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 2; i++) {
                    index++
                    if (cube[i].rot.x >= 90) {
                        cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                        cube[i].rot = createVector(0, 0, 0);
                        cube[i].xCCW();
                        if(index == dim**2)
                        {
                            clearInterval(f);
                            locked = false
                            cube = cube.sort(compareVectors);
                        }
                    }
                    else
                    {
                        cube[i].pos = matmul(rotXCW, cube[i].pos);
                        cube[i].rot.add(createVector(angle, 0, 0));
                        
                    }
                }
                redraw()
            }, interval);
        }

        if (key == "u") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if (i % dim ** 2 < dim) 
                    {
                        index++
                        if (cube[i].rot.y <= -90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].yCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotYCCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, -angle, 0));
                            
                        }
                    }
                }
                redraw()
            }, interval);

            cube = cube.sort(compareVectors);
        }

        if (key == "U") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if (i % dim ** 2 < dim) 
                    {
                        index++
                        if (cube[i].rot.y >= 90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].yCCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotYCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, angle, 0));
                            
                        }
                    }
                }
                redraw()
            }, interval);

            cube = cube.sort(compareVectors);
        }

        if (key == "d") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if (dim ** 2 - (i % dim ** 2) <= dim) 
                    {
                        index++
                        if (cube[i].rot.y >= 90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].yCCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotYCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, angle, 0));
                            
                        }
                    }
                }
                redraw()
            }, interval);

            cube = cube.sort(compareVectors);
        }

        if (key == "D") {
            locked = true;
            let f = setInterval(() => {
                let index = 0;
                for (let i = 0; i < dim ** 3; i++) {
                    if (dim ** 2 - (i % dim ** 2) <= dim) 
                    {
                        index++
                        if (cube[i].rot.y <= -90) {
                            cube[i].pos = createVector(round(cube[i].pos.x), round(cube[i].pos.y), round(cube[i].pos.z))
                            cube[i].rot = createVector(0, 0, 0);
                            cube[i].yCW();
                            if(index == dim**2)
                            {
                                clearInterval(f);
                                locked = false
                                cube = cube.sort(compareVectors);
                            }
                        }
                        else
                        {
                            cube[i].pos = matmul(rotYCCW, cube[i].pos);
                            cube[i].rot.add(createVector(0, -angle, 0));
                            
                        }
                    }
                }
                redraw()
            }, interval);

            cube = cube.sort(compareVectors);
        }
    }
}
