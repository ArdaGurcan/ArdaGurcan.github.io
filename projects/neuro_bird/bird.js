// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// Class is exported (eslint flag)
/* exported Bird */

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;

    this.gravity = 0.6;
    this.lift = -8;
    this.velocity = 0;

  
    this.width = 60;
    this.height = 50;
  }

  show() {
    // draw the icon CENTERED around the X and Y coords of the bird object
    fill("#e64562")
    push()
    let vel = createVector(40, this.velocity)
    translate(this.x , this.y )
    rotate(vel.heading())
    rect(-this.width / 2,- this.height / 2, this.width, this.height,5,5);

    pop()
  }

  up() {
    this.velocity = this.lift;
  }

  update() {
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
  }
}