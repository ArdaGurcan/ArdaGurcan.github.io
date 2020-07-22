

class Cubelet {
    constructor(vec,len,rot,index)
    {
        this.pos = vec
        this.sideLength = len
        this.rot = rot
        this.highlighted = false;
        this.index = index

        this.up = colors[0]
        this.down = colors[1]
        this.right = colors[3]
        this.left = colors[2]
        this.front = colors[5]
        this.back = colors[4]

        if(index.x != dim-1)
        {
            this.right = colors[6]
        }

        if(index.x != 0)
        {
            this.left = colors[6]
        }

        if(index.y != dim-1)
        {
            this.down = colors[6]
        }

        if(index.y != 0)
        {
            this.up = colors[6]
        }

        if(index.z != dim-1)
        {
            this.front = colors[6]
        }

        if(index.z != 0)
        {
            this.back = colors[6]
        }

        
    }

    display()
    {
        
        if(this.highlighted)
        {
            stroke("#F02")
        }
        else{
            stroke("#000")
        }
        push()
        translate(this.pos.x, this.pos.y, this.pos.z)
        rotateX(this.rot.x)
        rotateY(this.rot.y)
        rotateZ(this.rot.z)
        let r = this.sideLength/2

        fill(this.front) // front
        beginShape()
        vertex(r, r, r)
        vertex(-r, r, r)
        vertex(-r, -r, r)
        vertex(r, -r, r)
        vertex(r, r, r)

        endShape()

        fill(this.back) // back
        beginShape()
        vertex(r, r, -r)
        vertex(-r, r, -r)
        vertex(-r, -r, -r)
        vertex(r, -r, -r)
        vertex(r, r, -r)

        endShape()

        fill(this.right) // right
        beginShape()
        vertex(r, r, r)
        vertex(r, -r, r)
        vertex(r, -r, -r)
        vertex(r, r, -r)
        vertex(r, r, r)

        endShape()

        fill(this.left) // left
        beginShape()
        vertex(-r, r, r)
        vertex(-r, -r, r)
        vertex(-r, -r, -r)
        vertex(-r, r, -r)
        vertex(-r, r, r)

        endShape()

        fill(this.down) // down
        beginShape()
        vertex(r, r, r)
        vertex(-r, r, r)
        vertex(-r, r, -r)
        vertex(r, r, -r)
        vertex(r, r, r)

        endShape()

        fill(this.up) // up
        beginShape()
        vertex(r, -r, r)
        vertex(-r, -r, r)
        vertex(-r, -r, -r)
        vertex(r, -r, -r)
        vertex(r, -r, r)

        endShape()

        
        pop()
    }

    xCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.up = tBack;
        this.front = tUp;
        this.down = tFront;
        this.back = tDown;
    }

    xCCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.up = tFront;
        this.front = tDown;
        this.down = tBack;
        this.back = tUp;
    }

    yCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.front = tRight;
        this.right = tBack;
        this.back = tLeft;
        this.left = tFront;
    }

    yCCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.front = tLeft;
        this.right = tFront;
        this.back = tRight;
        this.left = tBack;
    }

    zCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.up = tLeft;
        this.right = tUp;
        this.down = tRight;
        this.left = tDown;       
    }

    zCCW(){
        let tUp = this.up;
        let tDown = this.down;
        let tLeft = this.left;
        let tRight = this.right
        let tFront = this.front;
        let tBack = this.back

        this.up = tRight;
        this.right = tDown;
        this.down = tLeft;
        this.left = tUp;
    }
}