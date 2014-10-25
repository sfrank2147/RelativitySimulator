var offset = 0;
var GRID_WIDTH = 500;
var GRID_HEIGHT = 500;
var SHIP_RADIUS = 30.0;

//this variable will change as the user toggles the settings
energy = 1.0
speed = 0.0;
radius = 30.0;
lorentzCoefficient = 1.0;
objTime = 0.0;

flameWaver = 0;

function addEnergy() {
    energy += 0.02;
    updateSpeed();
}
function removeEnergy() {
    if(energy > 1.0) {
        energy = Math.max(energy - 0.02, 1.0);
    }
    updateSpeed();
}

function updateSpeed() {
    var rawSpeed = Math.sqrt(1 - (1/(energy * energy)));
    //speed is relative to c
    //i.e. speed = 0.9 means going 90% the speed of light
    // var rawSpeed = parseFloat(document.getElementById('speed').value);
    speed = 5.0 * rawSpeed;
    lorentzCoefficient = Math.sqrt(1.0 - (rawSpeed*rawSpeed));
    radius = SHIP_RADIUS * lorentzCoefficient;

    //update the stats
    $("#energyStat").text("Energy: " + energy.toFixed(2) + " times the mass of the shuttle.");
    $("#speedStat").text("Speed: " + (rawSpeed * 299792458).toFixed(0) + " m/s (" + rawSpeed.toFixed(4) + " times the speed of light)");
}

function drawCircles(offsetGrowth) {
    var timeAngle = (-0.5 * Math.PI + objTime) % (2 * Math.PI);
    var demoCanvas = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.clearRect(0, 0, 500, 500);

    //draw the background
    var starsImg = new Image();
    starsImg.src = 'assets/stars.jpg';
    demoContext.drawImage(starsImg, 0, 0, 500, 500);

    var movingRadius = radius;
    for(var x = 50; x < GRID_WIDTH; x += 100) {
        if(Math.abs(x - GRID_WIDTH/2) <= 50) {
            continue;
        }
        for(var y = -150; y <= GRID_HEIGHT + 150; y += 100) {
            drawCircle(x, (y + offset) % 500, movingRadius, 'grey', true);
        }
    }

    //draw fire for the space ship
    demoContext.moveTo(250, 250);
    demoContext.beginPath();
    demoContext.strokeStyle = flameWaver ? 'orange' : 'red';
    demoContext.fillStyle = flameWaver ? 'orange' : 'red';
    demoContext.lineTo(240, 230 + energy * 60.0 + flameWaver*2.0);
    demoContext.lineTo(260, 230 + energy * 60.0 + flameWaver*2.0);
    demoContext.lineTo(250, 250);
    demoContext.fill();
    demoContext.strokeStyle = 'orange';
    demoContext.stroke();

    //alternate whether the flame is wavering
    flameWaver = 1 - flameWaver;

    //draw spaceship
    var shuttleImg = new Image();
    shuttleImg.src = 'assets/shuttle.png';
    demoContext.drawImage(shuttleImg, 225, 200, 50, 100);
    // drawCircle(250, 250, SHIP_RADIUS, 'blue', false);

    //increment the circle offset and the time
    offset += offsetGrowth;
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
    }
}