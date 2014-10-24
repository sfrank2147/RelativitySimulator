var offset = 0;
var GRID_WIDTH = 500;
var GRID_HEIGHT = 500;
var SHIP_RADIUS = 30.0;

//this variable will change as the user toggles the settings
speed = 0.0;
radius = 30.0;
lorentzCoefficient = 1.0;
objTime = 0.0;

function drawCircles(offsetGrowth) {
    var timeAngle = (-0.5 * Math.PI + objTime) % (2 * Math.PI);
    var demoCanvas = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.clearRect(0, 0, 500, 500);
    var movingRadius = radius;
    for(var x = 50; x < GRID_WIDTH; x += 100) {
        if(Math.abs(x - GRID_WIDTH/2) <= 50) {
            continue;
        }
        for(var y = -150; y <= GRID_HEIGHT + 150; y += 100) {
            drawCircle(x, (y + offset) % 500, movingRadius, 'black', true);
        }
    }

    //draw fire for the circle
    demoContext.moveTo(250, 250);
    demoContext.beginPath();
    demoContext.strokeStyle = 'orange';
    demoContext.fillStyle = 'orange';
    demoContext.lineTo(240, 280 + speed * 10.0);
    demoContext.lineTo(260, 280 + speed * 10.0);
    demoContext.lineTo(250, 250);
    demoContext.fill();
    demoContext.strokeStyle = 'orange';
    demoContext.stroke();

    //draw circle
    drawCircle(250, 250, SHIP_RADIUS, 'blue', false);
    offset += Math.floor(offsetGrowth);
    objTime += 0.02 * lorentzCoefficient;
}

function drawCircle(centerX, centerY, radius, color, drawTime) {
    var demoCanvas = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.beginPath();
    demoContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    demoContext.fillStyle = color;
    demoContext.fill();
    demoContext.lineWidth = 1;
    demoContext.strokeStyle = color;
    demoContext.stroke();

    //fill in the time component
    if(drawTime) {
        demoContext.beginPath();
        var timeAngle = (-0.5 * Math.PI + objTime) % (2.0 * Math.PI);
        //canvas has a quirk where if the starting angle is negative,
        //and the ending angle is positive and past the starting angle,
        //it'll fill in the whole arc
        if(timeAngle > 1.5 * Math.PI) {
            timeAngle -= 2.0 * Math.PI;
        }
        demoContext.arc(
            centerX, centerY, radius, -0.5 * Math.PI, timeAngle, false
        );
        demoContext.lineTo(centerX, centerY);
        demoContext.lineTo(centerX, centerY + radius);
        demoContext.fillStyle = 'red';
        demoContext.fill();
        demoContext.lineWidth = 1;
        demoContext.strokeStyle = color;
        demoContext.stroke();
    }
}