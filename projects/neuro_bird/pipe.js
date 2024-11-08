// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// Pipe is exported (eslint flags)
/* exported Pipe */

class Pipe {
  constructor() {
    this.spacing = 150;
    this.top = random(spacing, height-spacing);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 100;
    this.speed = 3;

    this.passed = false;
    // this.highlight = false;
  }

  hits(bird) {
    let halfBirdHeight = bird.height / 2;
    let halfBirdwidth = bird.width / 2;
    if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
      //if this.w is huge, then we need different collision model
      if (bird.x + halfBirdwidth > this.x && bird.x - halfBirdwidth < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    if(!this.passed && bird.x - halfBirdwidth > this.x + this.w )
    {
      this.passed = true;
      //bird.score += 100
      score+=10
    }
    this.highlight = false;
    return false;
  }

  //this function is used to calculate scores and checks if we've went through the pipes
  pass(bird) {
    if (bird.x > this.x + this.w/2 && !this.passed) {
      this.passed = true;
      return true;
    }
    return false;
  }

  drawHalf() {
    let howManyNedeed = 0;
    // let peakRatio = pipePeakSprite.height / pipePeakSprite.width;
    // let bodyRatio = pipeBodySprite.height / pipeBodySprite.width;
    //this way we calculate, how many tubes we can fit without stretching
    // howManyNedeed = Math.round(height / (this.w * bodyRatio));
    // //this <= and start from 1 is just my HACK xD But it's working
    // for (let i = 0; i < howManyNedeed; ++i) {
    //   let offset = this.w * (i * bodyRatio + peakRatio);
    //   rect( -this.w / 2, offset, this.w, this.w * bodyRatio);
    // }
    fill("#86ad42")
    rect( -this.w / 2, 0, this.w, height,3,3);
  }

  show() {
    push();
    translate(this.x + this.w / 2, this.bottom);
    this.drawHalf();
    translate(0, -this.spacing);
    rotate(PI);
    this.drawHalf();
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    // return 31;
    return (this.x < -this.w);
  }
}
