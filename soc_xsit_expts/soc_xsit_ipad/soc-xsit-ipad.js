// soc_xsit iPad

// ---------------- HELPER FUNCTIONS ------------------

// show slide function
function showSlide(id) {
	$(".slide").hide() //jquery - all elements with class of slide - hide
	$("#" + id).show() //jquery - element with given id - show
}

//array shuffle function
/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */

//I got this from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

/* Get random integers. When called with no arguments, it returns either 0 or 1. 
 * When called with one argument, a, it returns a number in [0,a-1]. 
 * When called with two arguments, a and b, returns a random value in [a,b]. 
 */

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

// returns selected elements and creates a new array with those elements (called 'foo')

function range(start, end)
{
    var foo = [];
    for (var i = start; i <= end; i++)
        foo.push(i);
    return foo;
}

/* loads all of the images into the cache so they don't need to be individually
 * loaded at time of presentation. Ensures that experiment time happens as intended
 */

$.fn.preload = function() {
  this.each(function(){
        $('<img/>')[0].src = this;
    });
};

/* loads all of the videos into the cache so they don't need to be individually
 * loaded at time of presentation. Ensures that experiment time happens as intended
 */

$.fn.preloadVids = function() {
  this.each(function(){
        $('<video/>')[0].src = this;
    });
};

/* strips off the directory and suffix of image/sound/etc file names */

trim = function(item) {
  var tmp = item;
  return tmp.slice(tmp.lastIndexOf("/")+1,tmp.lastIndexOf(".")); 
};

//For training:
function createDot(dotx, doty, i) {
	var dots = [1, 2, 3, 4, 5]

	var dot = document.createElement("img")
	dot.setAttribute("class", "dot")
	dot.id = "dot_" + dots[i]
	dot.src = "dots/dot_" + dots[i] + ".jpg"

	var x = Math.floor(Math.random() * 950)
	var y = Math.floor(Math.random() * 550)

	var invalid = "true"
		//make sure dots do not overlap
	while (true) {
		invalid = "true"
		for (j = 0; j < dotx.length; j++) {
			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 200) {
				var invalid = "false"
				break
			}
		}
		if (invalid === "true") {
			dotx.push(x)
			doty.push(y)
			break
		}
		x = Math.floor(Math.random() * 400)
		y = Math.floor(Math.random() * 400)
	}

	dot.setAttribute("style", "position:absolute;left:" + x + "px;top:" + y + "px;")

	training.appendChild(dot)
}


// ---------------- EXPERIMENT PARAMETERS ------------------

var password = "soc-xsit";
var pauseTime = 500;


// TODO: add soc-xsit experiment parameters


// ---------------- MAIN EXPERIMENT ------------------

//Show the first instructions slide (this is where you enter pswd and subid)
showSlide("instructions")

//The button is disabled until all of the images are preloaded
$("#startButton").button()
$("#startButton").button('disable')
$("#pleaseWait").html("Please wait...")
$(window).load(function() {
	$("#startButton").button('enable')
	$("#pleaseWait").html("")
})

