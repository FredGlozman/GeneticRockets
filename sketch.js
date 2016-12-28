const fps = 60;

var obstacles = [];
var rocketPopulation; 

//target position and dimensions
var targetV
var targetDiameter

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(fps);

	targetDiameter = min(width, height)/10;

	//place the target randomly in the upper half of the canvas
	var targetX = int(targetDiameter/2 + (random() * (((width-targetDiameter/2) - targetDiameter) + 1)));
	var targetY = int(targetDiameter/2 + (random() * ((height/2 - targetDiameter/2) + 1)));
	targetV = createVector(targetX, targetY);

	//obstacles
	var oWidth = width/4;
	var oHeight = oWidth/15;
	var oY = height/1.7 - oHeight/2;
	var oX = min(targetX-oWidth/2, width-oWidth);
	obstacles.push(new Obstacle(oX, oY, oWidth, oHeight));

	rocketPopulation = new Population(obstacles, targetV, targetDiameter);
}

function draw() {
	background('black');
	drawTarget();
	drawObstacles();
	rocketPopulation.updateAndShow();
}

function drawObstacles() {
	for(var i = 0; i < obstacles.length; i++) {
		obstacles[i].show();
	}
}

function drawTarget() {
	fill('red');
	ellipse(targetV.x, targetV.y, targetDiameter, targetDiameter);

	fill('white');
	ellipse(targetV.x, targetV.y, targetDiameter/1.5, targetDiameter/1.5);

	fill('red');
	ellipse(targetV.x, targetV.y, targetDiameter/3, targetDiameter/3);
}
