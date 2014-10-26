var offset = 0;
var GRID_WIDTH = 500;
var GRID_HEIGHT = 500;
var SHIP_RADIUS = 30.0;

energy = 1.0; //energy in the space shuttle
speed = 0.0; //the speed the space shuttle is traveling at
radius = 30.0; //the radius of the clocks
lorentzCoefficient = 1.0;
objTime = 0.0; //used to track animation progress

flameWaver = 0; //0 or 1, depending on if flame is red or orange

//initialize a bunch of random stars in the night sky
stars = new Set();
for(var x = 0; x < 100; x++) {
    stars.add({
        'x': Math.random() * 500,
        'y': Math.random() * 500
    })
}

//add energy to the shuttle
function addEnergy() {
    energy += 0.02;
    updateSpeed();
}

//subtract energy from the shuttle
function removeEnergy() {
    if(energy > 1.0) {
        energy = Math.max(energy - 0.02, 1.0);
    }
    updateSpeed();
}

//recalculate the shuttle's speed, along with the clock sizes
//and the lorentz coefficient
function updateSpeed() {
    //speed is relative to c
    //i.e. speed = 0.9 means going 90% the speed of light
    speed = Math.sqrt(1 - (1/(energy * energy)));
    lorentzCoefficient = Math.sqrt(1.0 - (speed*speed));
    radius = SHIP_RADIUS * lorentzCoefficient;

    //update the stats
    $("#energyStat").text("Energy: " + energy.toFixed(2) + " times the mass of the shuttle.");
    $("#speedStat").text("Speed: " + (speed * 670616629.0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " miles per hour (" + (speed * 100.0).toFixed(2) + "% of the speed of light)");
}

function drawDemo(offsetGrowth) {
    //draws the clocks, as well as the spaceship and its flame
    var timeAngle = (-0.5 * Math.PI + objTime) % (2 * Math.PI);
    var demoCanvas = document.getElementById('demoCanvas');
    var demoContext = demoCanvas.getContext('2d');
    demoContext.clearRect(0, 0, 500, 500);

    //draw the background, including the stars
    demoContext.fillStyle = 'black';
    demoContext.fillRect(0, 0, 500, 500);

    demoContext.fillStyle = 'white';
    stars.forEach(function(star) {
        demoContext.fillRect(star['x'], (star['y'] + offset) % 500, 1, 1);
    })

    var movingRadius = radius;
    for(var x = 50; x < GRID_WIDTH; x += 100) {
        if(Math.abs(x - GRID_WIDTH/2) <= 50) {
            continue;
        }
        for(var y = -150; y <= GRID_HEIGHT + 150; y += 100) {
            drawClock(x, (y + offset) % 500, movingRadius, 'grey', true);
        }
    }

    //draw fire for the space ship
    demoContext.moveTo(250, 250);
    demoContext.beginPath();
    demoContext.strokeStyle = flameWaver ? 'orange' : 'red';
    demoContext.fillStyle = flameWaver ? 'orange' : 'red';
    demoContext.lineTo(240, 230 + energy * 60.0);
    demoContext.lineTo(260, 230 + energy * 60.0);
    demoContext.lineTo(250, 250);
    demoContext.fill();
    demoContext.strokeStyle = 'orange';
    demoContext.stroke();

    //alternate whether the flame is red or orange
    flameWaver = 1 - flameWaver;

    //draw spaceship
    var shuttleImg = new Image();
    shuttleImg.src = 'assets/shuttle.png';
    demoContext.drawImage(shuttleImg, 225, 200, 50, 100);

    //increment the circle offset and the time
    offset += 5.0 * offsetGrowth;
    objTime += 0.02 * lorentzCoefficient;
}

function drawClock(centerX, centerY, radius, color, drawTime) {
    //draws a single clock
    //the center of the clock is (centerX, centerY)
    //the radius of the clock is radius
    //``color'' is the background color of the clock
    //drawTime is used to determine the angle of the clock that is filled in
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