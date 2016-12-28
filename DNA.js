function DNA(genes) {
	this.size = 200;
	
	if(genes != null) {
		this.genes = genes;
	} else {
		this.genes = []

		for(var i = 0; i < this.size; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(0.2);
		}
	}

	this.crossWith = function(partner) {
		var newGenes = [];

		var division = random(this.size);

		for(var i = 0; i < this.size; i++) {
			if(i < division) {
				newGenes[i] = partner.genes[i];
			} else {
				newGenes[i] = this.genes[i];
			}
		}

		var newDNA = new DNA();
		newDNA.genes = newGenes;

		return newDNA;
	}
}