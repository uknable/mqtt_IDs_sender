/***********************************************************************
  WEEK 04 - Example 04 - MQTT Sender

  Author: Luke Hespanhol
  Date: March 2022
***********************************************************************/
/*
	Disabling canvas scroll for better experience on mobile interfce.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23.
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});

document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});


//////////////////////////////////////////////////
//FIXED SECTION: DO NOT CHANGE THESE VARIABLES
//////////////////////////////////////////////////
var HOST = window.location.origin;
let xmlHttpRequest = new XMLHttpRequest();

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - BEGIN: ENTER OUR CODE HERE
////////////////////////////////////////////////////
// Sliders
let redSlider;
let greenSlider;
let blueSlider;

// Previous values for each slider
let previous_redSliderValue;
let previous_greenSliderValue;
let previous_blueSliderValue;

let pad;

// following line to create random string of numbers and letters sourced from user 'doubletap'
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
let userId = (Math.random() + 1).toString(36).substring(5);

console.log(userId); // remove after testing

class Pad {
	constructor(centerX, centerY, w, h) {
		this.centerX = centerX;
		this.centerY = centerY;
		this.w = w;
		this.h = h;
		this.xCoord = 0;
		this.yCoord = 0;
        this.previous_xCoord;
        this.previous_yCoord;
	}

	evaluate() {
		var mx = mouseX;
		var my = mouseY;
		if (touches.length > 0) {
			mx = touches[0].x;
			my = touches[0].y;
		}

		// Test if mouse/touch is within the pad area
		if ((abs(mx-this.centerX) < 0.5*this.w) && (abs(my-this.centerY) < 0.5*this.h)) {
			// Transform the position coordinates into values between -1 and 1
			this.xCoord = (mx-this.centerX)/(0.5*this.w);
			this.yCoord = (my-this.centerY)/(0.5*this.h);
		}
	}

	display() {
		// Draw the pad area
        push()
		fill(128);
		strokeWeight(10);
		stroke(255);
		rectMode(CENTER);
		rect(this.centerX, this.centerY, this.w, this.h);

		// Draw a small circle wherever the mouse/touch is within the pad
		strokeWeight(1);
        stroke(0);
		fill(redSlider.value(), greenSlider.value(), blueSlider.value());
		ellipse(this.centerX+this.xCoord*0.5*this.w, this.centerY+this.yCoord*0.5*this.h, 50, 50);
        pop();
	}
}

///////////////////////////////////////////
// SETUP FUNCTION
///////////////////////////////////////////
function setup() {
	/////////////////////////////////////////////
	// FIXED SECION - START: DO NOT CHANGE IT
	/////////////////////////////////////////////
	createCanvas(windowWidth, windowHeight);

	/////////////////////////////////////////////
	// FIXED SECION - END
	/////////////////////////////////////////////


	/////////////////////////////////////////////
	// ADD YOUR SETUP CODE HERE
	/////////////////////////////////////////////


	redSlider = createSlider(0, 255,254, 1);
	redSlider.position(0.2*windowWidth, 0.4*windowHeight);
	redSlider.style('width', '520px');
	previous_redSliderValue = -100; // deliberate different value

	greenSlider = createSlider(0, 255,254, 1);
	greenSlider.position(0.2*windowWidth, 0.6*windowHeight);
	greenSlider.style('width', '520px');
	previous_greenSliderValue = -100; // deliberate different value

	blueSlider = createSlider(0, 255,254, 1);
	blueSlider.position(0.2*windowWidth, 0.8*windowHeight);
	blueSlider.style('width', '520px');
	previous_blueSliderValue =-100; // deliberate different value

    textAlign(RIGHT, CENTER);
    textSize(32);

    
	pad = new Pad(0.5*windowWidth, 0.2*windowHeight, 0.25*windowHeight, 0.25*windowHeight);
}


///////////////////////////////////////////
// DRAW FUNCTION
///////////////////////////////////////////
function draw() {
	background(200, 140, 180);
    
    if (mouseIsPressed) {
        pad.evaluate();
    }
    
	pad.display();
    
	fill(255);
    
    noStroke();
	text('red', redSlider.x - 10, redSlider.y+10);
	text('green', greenSlider.x - 10, greenSlider.y+10);
	text('blue', blueSlider.x - 10, blueSlider.y+10);
}

function mouseReleased() {
	checkAndProcessColourChange();
}

function touchEnded() {
	checkAndProcessColourChange();
}

function checkAndProcessColourChange() {
	let changed = false;
	// RED slider
	if (redSlider.value() != previous_redSliderValue) {
		previous_redSliderValue = redSlider.value();
		changed = true;
	}

	// GREEN slider
	if (greenSlider.value() != previous_greenSliderValue) {
		previous_greenSliderValue = greenSlider.value();
		changed = true;
	}

	// BLUE slider
	if (blueSlider.value() != previous_blueSliderValue) {
		previous_blueSliderValue = blueSlider.value();
		changed = true;
	}	

    // x coordinates
    if (pad.xCoord != pad.previous_xCoord) {
        pad.previous_xCoord = pad.xCoord;
        changed = true;
    }

    // y coordinates
    if (pad.yCoord != pad.previous_yCoord) {
        pad.previous_yCoord = pad.yCoord;
        changed = true;
    }

    // if there is a change in any value, then send all values to the receiver
	if (changed) {
		let message = `${userId},${pad.xCoord},${pad.yCoord},${redSlider.value()},${greenSlider.value()},${blueSlider.value()}`

		sendMessage(message);
	}
}


////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - END: ENTER OUR CODE HERE
////////////////////////////////////////////////////

/***********************************************************************
  === PLEASE DO NOT CHANGE OR DELETE THIS SECTION ===
  This function sends a MQTT message to server
***********************************************************************/
function sendMessage(message) {
	let postData = JSON.stringify({ id: 1, 'message': message });

	xmlHttpRequest.open("POST", HOST + '/sendMessage', false);
    xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	xmlHttpRequest.send(postData);
}

