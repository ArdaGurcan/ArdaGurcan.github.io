const colors = [

	"#D14944",
	"#CAA638",
	"#CCD962",

	"#5BB79C",

]

class PhysicsObject {
	constructor(x, y, mass, fixed = false, followMouse = false) {
		this.location = createVector(x, y);
		this.velocity = createVector(Math.random() * 10 - 5, Math.random() * 10 - 5);
		this.acceleration = createVector(0, 0);
		this.mass = mass;
		this.forces = [];
		this.color = colors[Math.floor(rand(0, colors.length - 0.1))]
		this.fixed = fixed;
		this.followMouse = followMouse;
		this.grounded = this.followMouse || this.fixed;
		this.netForce = createVector(0, 0)
		this.gravity = false;
		this.charge = 0;
		this.hasCollision = true;
	}

	addForce(force) {
		this.forces.push(force);
		for (let i = 0; i < this.forces.length; i++) {
			this.netForce.add(this.forces[i]);

		}
	}

	move() {

		if (this.followMouse || this.fixed) {
			this.grounded = true;
		}
		if (!this.fixed && !this.followMouse) {
			for (let i = 0; i < this.forces.length; i++) {
				let f = this.forces[i].div(this.mass)
				this.acceleration.add(f);

			}
			this.velocity.add(this.acceleration);
			if (Math.abs(this.velocity.x) < .01) {
				this.velocity.x = 0
			}
			if (Math.abs(this.velocity.y) < .01) {
				this.velocity.y = 0
			}

			this.location.add(this.velocity);
			this.acceleration.mult(0);
			this.forces = [];
		}
		if (this.followMouse) {
			this.velocity = createVector(winMouseX - pwinMouseX, winMouseY - pwinMouseY)
			this.location = createVector(mouseX, mouseY)
		}
		this.acceleration.mult(0);
		this.forces = [];
	}
}

class Circle extends PhysicsObject {
	constructor(x, y, mass, radius) {
		super(x, y, mass);
		this.radius = radius;
	}
	wallCollision() {
		if (!this.fixed && !this.followMouse) {
			if (this.location.x < (this.radius)) {
				this.location.x = (this.radius);
				this.velocity.x = -this.velocity.x * 0.97;


			} else if (this.location.x > width - (this.radius)) {
				this.location.x = width - (this.radius);
				this.velocity.x = -this.velocity.x * 0.97;

			}
			if (this.location.y < (this.radius)) {
				this.grounded = false;
				this.location.y = (this.radius);
				this.velocity.y = -this.velocity.y * 0.97;


			}
			if (this.location.y > height - (this.radius)) {
				this.grounded = true;
				this.location.y = height - (this.radius);
				this.velocity.y = -this.velocity.y * 0.97;

			} else {
				this.grounded = false;
			}



			if (height - (this.radius) - this.location.y < 5) {
				if (Math.abs(this.velocity.y) < 2) {
					this.velocity.y = 0;
					this.grounded = true;
				}
			}

		}



	}

	display() {
		fill(color(this.color));
		ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);
	}
}

class Rectangle extends PhysicsObject {
	constructor(x, y, mass, width, height) {
		super(x, y, mass);
		this.width = width;
		this.height = height;
	}
	wallCollision() {
		if (this.location.x < 0) {
			this.location.x = 0;
			this.velocity.x = -this.velocity.x;
		} else if (this.location.x > width - (this.width)) {
			this.location.x = width - (this.width);
			this.velocity.x = -this.velocity.x;
		}
		if (this.location.y < 0) {
			this.location.y = 0;
			this.velocity.y = -this.velocity.y;
		}
		if (this.location.y > height - (this.height)) {
			this.grounded = true;
			this.location.y = height - (this.height);
			this.velocity.y = -this.velocity.y;
		} else {
			this.grounded = false;
		}

		if (height - this.height - this.location.y < 5) {
			if (Math.abs(this.velocity.y) < 2) {
				this.velocity.y = 0;
				this.grounded = true;
			}
		}
	}

	display() {
		fill(color(this.color));
		rect(this.location.x, this.location.y, this.width, this.height);
	}
}