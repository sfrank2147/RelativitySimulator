//set the text input so it sets the speed
$("#speed").keyup(function(event) {
    if(event.keyCode == 13) {
        //speed is relative to c
        //i.e. speed = 0.9 means going 90% the speed of light
        var rawSpeed = parseFloat(document.getElementById('speed').value);
        speed = 10 * rawSpeed;
        radius = SHIP_RADIUS * Math.sqrt(1.0 - (rawSpeed*rawSpeed));
    }
});