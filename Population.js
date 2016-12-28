function Population(obstacles, targetV, targetDiameter) {
	this.obstacles = obstacles;

	this.targetV = targetV;
	this.targetDiameter = targetDiameter;

	//size of the population (number of rockets to be launched simultaneously)
	this.size = 100;

	this.generation = 1;
	
	//currently active rockets
	this.rockets = []
	//rockets that have flown off screen and that have reached the target
	this.completedRockets = []

	//mating pool. generated after all rockets have completed their flight
	this.matingPool = [];

	//initialize the rockets
	for(var i = 0; i < this.size; i++) {
		this.rockets[i] = new Rocket(this.obstacles, this.targetV, this.targetDiameter);
	}

	//incremented each time a rocket hits the target
	this.numberOfHits = 0;

	this.updateAndShow = function() {
		textSize(24);
		fill('white');
		textAlign(LEFT, TOP);
		text("Generation: " + this.generation, 0, 0, width, height);
		text("\nCurrent Hit Count: " + this.numberOfHits, 0, 0, width, height);

		if(this.rockets.length > 0) {
			for(var i = 0; i < this.rockets.length; i++) {
				this.rockets[i].update();
				this.rockets[i].show();

				if(this.rockets[i].hitTarget) {
					this.numberOfHits++;
				}

				//if a rocket has flown off screen or has hit the targer or has acted out all of its genes, remove it from the rockets list
				if(this.rockets[i].hitTarget || this.rockets[i].didExplode) {
					this.completedRockets.push(this.rockets[i]);
					this.rockets.splice(i, 1);
				}
			}
		} else {
			this.performEvolution();
			this.generation++; 

			//reset
			this.numberOfHits = 0;
			this.completedRockets = [];
			this.matingPool = [];
		}
	}

	this.performEvolution = function() {
		//find the max fitness
		var maxFitness = -1;
		for(var i = 0; i < this.completedRockets.length; i++) {
			var fitness = this.completedRockets[i].fitness;
			if(fitness > maxFitness) {
				maxFitness = fitness;
			}
		}

		//normalize the fitness values such that they lie in the range [0,1]
		for(var i = 0; i < this.completedRockets.length; i++) {
			this.completedRockets[i].fitness = this.completedRockets[i].fitness/maxFitness;
		}

		//add a rocket to the mating pool proportinally to it's fitness level
		for(var i = 0; i < this.completedRockets.length; i++) {
			for(var j = 0; j < this.completedRockets[i].fitness*100; j++) {
				this.matingPool.push(this.completedRockets[i]);
			}
		}

		//generate new rockets from the mating pool
		for(var i = 0; i < this.size; i++) {
			var parentA = random(this.matingPool).dna;
			var parentB = random(this.matingPool).dna;

			//to ensure that parentA and parentB are not the same
			while(parentA == parentB) {
				parentB = random(this.matingPool).dna;
			}

			var newDNA = parentA.crossWith(parentB);
			var newRocket = new Rocket(this.obstacles, this.targetV, this.targetDiameter, newDNA);

			this.rockets[i] = newRocket;
		}
	}
}