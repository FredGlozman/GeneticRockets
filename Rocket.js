function Rocket(obstacles, targetV, targetDiameter, dna) {
	//rocket height and width
	this.rocketHeight = min(width, height)/18;
	this.rocketWidth = this.rocketHeight/4;

	this.obstacles = obstacles;

	this.targetV = targetV;
	this.targetDiameter = targetDiameter;
	this.hitTarget = false;

	//explode if you hit a wall, an obstacle or the target
	this.didExplode = false;

	//rocket (x,y,z) position
	this.positionV = createVector(width/2, height-this.rocketHeight);

	//dna of the rocket
	if(dna != null) {
		this.dna = dna;
	} else {
		this.dna = new DNA();	
	}

	this.count = 0;

	this.fitness = -1;

	//velocity pointing upwards
	this.velocityV = createVector(0, -1);

	//rocket acceleration
	this.accelerationV = createVector();

	//applied force on the rocket by the rocket thrusters 
	this.applyForce = function(force) {
		this.accelerationV.add(force);
	}

	this.update = function() {

		//calculates the fitness of the rocket.
		//the fitness of the rocket is inversely proportional to the closest the rocket ever got to the target
		var f = this.calculateFitness();
		if(f > this.fitness) {
			this.fitness = f;
		}

		if(this.didExplode || this.hitTarget) {
			return;
		}

		//hit target
		if(this.positionV.x <= (this.targetV.x + this.targetDiameter/2) && this.positionV.x >= (this.targetV.x - this.targetDiameter/2) && this.positionV.y <= (this.targetV.y + this.targetDiameter/2) && this.positionV.y >= (this.targetV.y - this.targetDiameter/2)) {
			this.hitTarget = true;
			this.didExplode = true;

			this.fitness *= 10

			return;
		}

		//hit wall
		if(this.positionV.x <= 0 || this.positionV.x >= width || this.positionV.y <= 0 || this.positionV.y >= height) {
			this.didExplode = true;

			return;
		}

		//hit obstacle 
		for(var i = 0; i < this.obstacles.length; i++) {
			var o = this.obstacles[i]
			if(this.positionV.x <= (o.x + o.width) && this.positionV.x >= o.x && this.positionV.y <= (o.y + o.height) && this.positionV.y >= o.y) {
				this.didExplode = true; 

				this.fitness /= 10;

				return;
			}
		}

		if(this.count < this.dna.genes.length) {
			this.applyForce(this.dna.genes[this.count++]);
		} else {
			//apply gravity force
			var gravity = createVector(0, 0.01, 1);
			this.applyForce(gravity)
		}
		
		this.velocityV.add(this.accelerationV);
		this.positionV.add(this.velocityV);
		this.accelerationV.mult(0);
	}

	//displays the rocket on screen
	this.show = function() {
		if(!this.hitTarget && !this.didExplode) {
			push();

			fill('white')

			translate(this.positionV.x, this.positionV.y)
			rotate(this.velocityV.heading());

			//flipped height and width because angle of velocity is 90 degrees so rectangle gets flipped
			rect(0, 0, this.rocketHeight, this.rocketWidth);

			fill('red');
			ellipse(this.rocketWidth/2,this.rocketWidth/2,this.rocketWidth+1,this.rocketWidth+1);

			pop(); 
		}
	}

	this.calculateFitness = function() {
		var distanceFromTarget = dist(this.targetV.x, this.targetV.y, this.positionV.x, this.positionV.y);
		return 1/distanceFromTarget;
	}
}