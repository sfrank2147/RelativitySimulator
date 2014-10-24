var offset = 0;
var GRID_WIDTH = 500;
var GRID_HEIGHT = 500;
var SHIP_RADIUS = 30.0;

//this variable will change as the user toggles the settings
speed = 0.0;
radius = 30.0

function drawCircles(offsetGrowth) {
    var demoCanvasg = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.clearRect(0, 0, 500, 500);
    var movingRadius = radius;
    for(var x = 50; x < GRID_WIDTH; x += 100) {
        if(Math.abs(x - GRID_WIDTH/2) <= 50) {
            continue;
        }
        for(var y = -150; y <= GRID_HEIGHT + 150; y += 100) {
            drawCircle(x, (y + offset) % 500, movingRadius, 'black');
        }
    }
    drawCircle(250, 250, SHIP_RADIUS, 'red');
    offset += Math.floor(offsetGrowth);
}

function drawCircle(centerX, centerY, radius, color) {
    var demoCanvas = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.beginPath();
    demoContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    demoContext.fillStyle = color;
    demoContext.fill();
    demoContext.lineWidth = 1;
    demoContext.strokeStyle = color;
    demoContext.stroke();
}