//from http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

/*Shows slides. We're using jQuery here the $ is the jQuery selector function, 
which takes as input either a DOM element or a CSS selector string. */
function showSlide(id) {

	$(".slide").hide();	//Hide all slides
	$("#"+id).show(); //Show just the slide we want to show
}

/*Get random integers. When called with no arguments, it returns either 0 or 1. 
When called with one argument, a, it returns a number in [0,a-1]. 
When called with two arguments, a and b, returns a random value in [a,b]. */
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

function range(start, end)
{
    var foo = [];
    for (var i = start; i <= end; i++)
        foo.push(i);
    return foo;
}

//from
//http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function createDot(dotx, doty, i) {
	var dots = [1, 2, 3, 4, 5];

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	dot.src = "images/dots/dot_" + dots[i] + ".jpg";

    var x = Math.floor(Math.random()*950);
    var y = Math.floor(Math.random()*550);

    var invalid = "true";
    //make sure dots do not overlap
    while (true) {
    	invalid = "true";
	   	for (j = 0; j < dotx.length ; j++) {
    		if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 200) {
    			var invalid = "false";
    			break; 
    		}
		}
		if (invalid === "true") {
 			dotx.push(x);
  		  	doty.push(y);
  		  	break;	
  	 	}
  	 	x = Math.floor(Math.random()*400);
   		y = Math.floor(Math.random()*400);
	}

    dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");

    training.appendChild(dot);
}

/*Randomly return an element from an array. Useful for condition randomization.*/
Array.prototype.random = function() {
  return this[random(this.length)];
};

$.fn.preload = function() {
  this.each(function(){
        $('<img/>')[0].src = this;
    });
};

trim = function(item) {
	var tmp = item;
	return tmp.slice(tmp.lastIndexOf("/")+1,tmp.lastIndexOf("."));
};

var imgsPerSlide = 2;
var numBlocks = 4;
var numOccurs = 2;

var numUsedImgs = ((imgsPerSlide*numOccurs)-1)*numBlocks;
var numUsedSounds = numBlocks;

var numImgs = 28;
var numSounds = 4;

allImgs = range(1,numImgs);
allImgs = shuffle(allImgs);
allImgs = allImgs.slice(0,numUsedImgs);

allSounds = range(1,numSounds);
allSounds = shuffle(allSounds);
allSounds = allSounds.slice(0,numUsedSounds);

allImgs = allImgs.map(function(elem){return 'Novel'+elem;});
$(allImgs.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

var allOrders = [[1, 2, 1, 2]]; //only same first

//SamePos for One Kind of Trial (Switch or Keep)
var allSamePosOne = [[1, 0], [0, 1]];

var allSpacings = [[1, 1, 2, 2, 3, 3, 4, 4],
                   [1, 2, 1, 2, 3, 4, 3, 4],
                   [1, 2, 3, 4, 1, 2, 3, 4]];


var numExamples = 2;
var startTime = 0;

var trialOrder = 0;//random();
var samePosOrderOne = random(2);
var samePosOrderTwo = random(2);

//$("#progressbar").progressbar();
//$("#progressbar").progressbar( "option", "max", numBlocks*numOccurs + 
//		numOccurs*numExamples);

exampleImages = [['shoe','chair',
                  'shoe','toaster',
                  'cup','whistle',
                  'sweater','cup'],
                 ['shoe','chair','grapes', 
                  'shoe','toaster','truck',
                  'whistle','cup','shoe',
                  'sweater','lion','cup'],
                 ['shoe','chair','grapes','flower',
                  'shoe','toaster','truck','kettle',
                  'whistle','cup','squirrel','bread',
                  'sweater','tomato','cup','lion']],

exampleImages2 = [['lion','flower',
					'tomato','flower',
					'scissors','truck',
					'truck','tie']],

showSlide("instructions"); //Show instruction slide
var experiment = {
  trialOrder: trialOrder,
  trials: allSpacings[0],
  trialTypes: allOrders[trialOrder],
  samePosOrderOne: samePosOrderOne,
  samePosOrderTwo: samePosOrderTwo,
  samePos: [allSamePosOne[samePosOrderOne][0], allSamePosOne[samePosOrderTwo][0],
            allSamePosOne[samePosOrderOne][1], allSamePosOne[samePosOrderTwo][1]],
  data: [],
  keepPic: ['','','',''],
  keepIdx: [0, 0, 0, 0],
  item: 0,
  exampleItem: 0,
  exampleItem2: 80,
  trialSounds: allSounds.map(function(elem){return 'Sound'+elem;}),
  exampleSounds: ['shoe','cup'],
  exampleSounds2: ['flower','truck'],
  trialImages: allImgs,
  exampleImages: exampleImages[imgsPerSlide-2],
  exampleImages2: exampleImages2[imgsPerSlide-2],

	/*The function that gets called when the sequence is finished. */
	end: function() {

	  showSlide("finished"); //Show the finish slide.

	  // Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk 
	  // (mmturkey filters out the functions so we know we're just submitting properties [i.e. data])
	  setTimeout(function() { turk.submit(experiment);}, 1500);
	},

	/*shows a blank screen for 500 ms*/
	blank: function() {
		showSlide("blankSlide");
	//	numExamples--;
		//alert(experiment.numExamples);
		//setTimeout(experiment.next, 500);
		if(experiment.exampleItem == numExamples){
			experiment.exampleItem = numExamples+1;
			setTimeout(showSlide("instructions3"),500);
		}else{setTimeout(experiment.next, 500);}
				
	},

	training: function() {
		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		for (i = 0; i < dotCount; i++) {
			createDot(dotx, doty, i);
		}
		showSlide("training");
		$('.dot').bind('click', function(event) {
	    	var dotID = $(event.currentTarget).attr('id');
	    	document.getElementById(dotID).src = "images/dots/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
	    		setTimeout(function () {
	    			$("#training").hide();
	    		//	document.body.style.background = "black";
	    			setTimeout(function() {
						showSlide("instructions2");
					}, 1500);
				}, 1500);
			}
	    });	   
	},

	makeChoice: function(event) {
        //alert(JSON.stringify(experiment.samePos, null, 4));
	  $(".xsit_pic").unbind("click");
	  var endTime = (new Date()).getTime();
  
	  event.target.style.border = '5px dotted red';
	  img = trim(event.target.src);
	  
	  //find the screen position of the clicked object
	  var i,tmpImg;
	  for(i = 0; i < imgsPerSlide; i++) {
		  tmpImg = trim($(".xsit_pic")[i].children[0].src);
		  if(tmpImg == img){break;}
	  }
	  
	  var new_i = i, new_img = img;
	  
	  if(Math.floor(experiment.exampleItem) > numExamples & 
			  experiment.trialTypes[experiment.item] != 1){
		  
		  var all_pos = range(0,imgsPerSlide-1);
		  all_pos.splice(i,1);
		  all_pos = shuffle(all_pos);
		  new_i = all_pos[0];	
		  new_img = trim($(".xsit_pic")[new_i].children[0].src);  
	  } 
	  
	  if(Math.floor(experiment.exampleItem) > numExamples & 
			  experiment.keepPic[experiment.item].length == 0){
		  
		  	experiment.keepPic[experiment.item] = new_img;
		  	experiment.keepIdx[experiment.item] = new_i;
	  }
	  
	  console.log("trialType is: " + experiment.trialTypes[experiment.item]);

	  data = {
			  itemNum: experiment.item,
			  trialType: experiment.trialTypes[experiment.item],
			  samePos: experiment.samePos[experiment.item],
			 // imgs: $(".xsit_pic").map(function(){return 
			//	  trim(this.children[0].src);}),
			  chosen: img,
			  chosen_idx: i,
			  kept: experiment.keepPic[experiment.item],
			  kept_idx: experiment.keepIdx[experiment.item],
			  rt: endTime - startTime
	  };  
	  experiment.data.push(data);
	  
	  
	 /* $("#progressbar").progressbar("option", "value",
			  ($("#progressbar").progressbar( "option", "value")+1)); */
	  setTimeout(experiment.blank, 500);

	},

	/*The work horse of the sequence: what to do on every trial.*/
	next: function() {
		
		var i,next_imgs = [],sound;
		if(Math.floor(experiment.exampleItem) < numExamples){
			sound = 
				experiment.exampleSounds[Math.floor(experiment.exampleItem)];
			
			for(i = 0; i < imgsPerSlide; i++) {//update the images shown
				next_imgs[i] = experiment.exampleImages.shift();
			}	
			
			experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
		}

		else if(Math.floor(experiment.exampleItem2) < numExamples){
			sound = 
				experiment.exampleSounds2[Math.floor(experiment.exampleItem2)];
			
			for(i = 0; i < imgsPerSlide; i++) {//update the images shown
				next_imgs[i] = experiment.exampleImages2.shift();
			}	
			
			experiment.exampleItem2 = experiment.exampleItem2 + (1/numOccurs);
		}

		else {

			//Get the current trial: shift() removes the first element of the array 
			//and returns it.
	    	trial = experiment.trials.shift();
	    	
			//If the current trial is undefined, it means the trials array was 
	    	//empty, which means that we're done, so call the end function.
	    	if (typeof trial == "undefined") {return showSlide("qanda");}
			
	    	experiment.item = trial-1;
	    	sound = experiment.trialSounds[experiment.item];
	    	
	    	var idx;

	    	console.log("keep pic is: " + experiment.keepIdx[experiment.item]);

	    	//this was a continuation
	    	if(experiment.keepPic[experiment.item].length > 0){
	    		idx = experiment.keepIdx[experiment.item];
	    		
	    		//need to put the new object in a new place
	    		if(experiment.samePos[experiment.item] != 1){ 			  
					var all_pos = range(0,imgsPerSlide-1);
					all_pos.splice(idx,1);
					all_pos = shuffle(all_pos);
	    			idx = all_pos[0];
	    		}
	    		
	    	}   	
	    	else{idx = -1;} //set up trial 1 for this object 	
	    	
			//grab all new images
			for(i = 0; i < imgsPerSlide; i++) {//update the image set for this trial
				
				i == idx ? next_imgs[i] = experiment.keepPic[experiment.item] : 
					next_imgs[i] = experiment.trialImages.shift();
			}

			experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
			if(experiment.exampleItem == numExamples + (numBlocks - 1)){
				experiment.exampleItem2 = 0;
		}	
		}
		for (i = 0; i < imgsPerSlide; i++) {
			$(".xsit_pic")[i].children[0].src = 
				"stimuli/images/"+next_imgs[i]+".jpg";
			
		}
		
    	//get the appropriate sound
		if(BrowserDetect.browser == "Chrome" ||
				BrowserDetect.browser == "Firefox"){
			$("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";}
		else{
			$("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";}
    	   		
		//blank out all borders so no item is pre-selected
		$(".xsit_pic").each(function(){this.children[0].style.border = 
			'5px solid white';});


		//Re-Display the experiment slide
    	showSlide("stage");

		//Wait, Play a sound
		setTimeout(function(){
			$("#sound_player")[0].play();
			
			//Get the current time so we can compute reaction time later.
			startTime = (new Date()).getTime();
			
			//Allow Response
            setTimeout(function(){$(".xsit_pic").bind("click",experiment.makeChoice);},2500);
			
			},1000);
	  }
	};
