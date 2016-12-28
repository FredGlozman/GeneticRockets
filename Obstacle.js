function Obstacle(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.show = function() {
		fill('orange');
		rect(this.x, this.y, this.width, this.height);
	}
}