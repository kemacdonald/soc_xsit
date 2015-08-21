/*some slider functionality stuff*/
$(function() {
    $( "#single_slider" ).slider({
      range : "min",
      min : 0,
      max : 1,
      step: 0.01,
      value : 0.5,
      change: function( event, ui ) {}
    });
}); 

var slider_check = false;

$( "#single_slider" ).on( "slidechange", function( event, ui ) {
  slider_check = true;
});

/*  from http://www.quirksmode.org/js/detect.html testing again
  Need to know the user's browser so we know what kind of sound (mp3/ogg) to play */
var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++)  {
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
    {   string: navigator.userAgent,
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
    {    // for newer Netscapes (6+)
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
    {     // for older Netscapes (4-)
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

  $(".slide").hide();  //Hide all slides
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

// returns selected elements and creates a new array with those elements (called 'foo')

function range(start, end)
{
    var foo = [];
    for (var i = start; i <= end; i++)
        foo.push(i);
    return foo;
}

/**
*  from
*  http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
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

/*Randomly return an element from an array. Useful for condition randomization.*/
Array.prototype.random = function() {
  return this[random(this.length)];
};

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

// Variable assignment for use later in experiment
var imgsPerSlideFam = 2;
var imgsPerSlide = 4 
var numBlocks = 16; // number of training/test pairs
var numOccurs = 2;
var numExamples = 2;

var numUsedImgs = ((imgsPerSlide*numOccurs)-1)*numBlocks;
var numUsedSounds = numBlocks;

var numImgs = 140;
var numSounds = 87;

var allImgs = range(1,numImgs);
    allImgs = shuffle(allImgs);
    allImgs = allImgs.slice(0,numUsedImgs); // slice() returns selected elements as a new array object.

var blank = blank;
var allSounds = range(1,numSounds);
    allSounds = shuffle(allSounds);
    allSounds = allSounds.slice(0,numUsedSounds);

// an array of arrays to generate the order that should be used, same (1), switch (2) trials
var exposure_orders = [[2, 2, 2, 2, 2, 2, 2, 2], // 0%_reliable
                       [1, 1, 2, 2, 2, 2, 2, 2], // 25% reliable
                       [1, 1, 1, 1, 2, 2, 2, 2], // 50% reliable 
                       [1, 1, 1, 1, 1, 1, 2, 2], // 75% reliable 
                       [1, 1, 1, 1, 1, 1, 1, 1], // 100%reliable 
                      ];

// only need two test orders - counterbalance Same/Switch trial first
var test_orders = [[2, 1, 2, 1, 2, 1, 2, 1],
                   [1, 2, 1, 2, 1, 2, 1, 2]]

// array to control whether we move the selected object for test trial
var allSamePosOne = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
allSamePosOne = shuffle(allSamePosOne);

var startTime = 0; // Starts the clock for recording RT 

/* Call Maker getter to get cond variables
 * Takes number and counts for each condition
 * Returns a condition number 
 */

try { 
    var filename = "KM_soc_xsit_reliability_parametric_full_replication";
    var condCounts = "1,100;2,100;3,100;4,100;5,100";  
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false );
    xmlHttp.send( null );
    var cond = xmlHttp.responseText; // For actual experimental runs
    //var cond = random(1,2); // note for testing experiment
} catch (e) {
    var cond = 1;
}


// make sure the cond variable is a string
if(cond == 1){var cond = "1"};
if(cond == 2){var cond = "2"};
if(cond == 3){var cond = "3"};
if(cond == 4){var cond = "4"};
if(cond == 5){var cond = "5"};

/* code for condition randomization. */
switch (cond) {
        case "1": 
            cond_name = "Live";
            prop_cond = "100%_reliable";
            int_cond = "Zero";
            exampleFaceIdx = 0;
            exposure_order = exposure_orders[4];
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16] //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1, 0, 1, 0, 1, 0 ,1 ]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "2": 
            cond_name = "Live";
            prop_cond = "0%_reliable";
            int_cond = "Zero";
            exampleFaceIdx = 0;
            exposure_order = exposure_orders[0];
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16]  //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "3": 
            cond_name = "Live";
            prop_cond = "25%_reliable";
            int_cond = "Zero";
            exampleFaceIdx = 0;
            exposure_order = exposure_orders[1];
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16] //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1, 0, 1, 0, 1, 0 ,1 ]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "4": 
            cond_name = "Live";
            prop_cond = "50%_reliable";
            int_cond = "Zero";
            exampleFaceIdx = 0;
            exposure_order = exposure_orders[2];
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16]  //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "5": 
            cond_name = "Live";
            prop_cond = "75%_reliable";
            int_cond = "Zero";
            exampleFaceIdx = 0;
            exposure_order = exposure_orders[3];
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16] //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1, 0, 1, 0, 1, 0 ,1 ]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        default:
};


/* Randomize trial order */
var test_order_idx = random(); // randomly choose whether same/switch trial is presented first
var test_order = test_orders[test_order_idx]; // set test trial order
exposure_order = shuffle(exposure_order);

// now we merge exposure trial order and test trial order 
var trial_order = exposure_order.concat(test_order); 

console.log("cond is: " + cond);
console.log("prop_cond is: " + prop_cond);
console.log("exposure_order is: " + exposure_order);
console.log("test order is: " + test_order);
console.log("trial order is: " + trial_order);

//initialize progress bar for both test and familiarization slides
$("#progressbar").progressbar();
$("#progressbar").progressbar( "option", "max", numBlocks*numOccurs + 
    numOccurs*numExamples);

//set up images/vids used on example trials
exampleImages = ['squirrel','chair','tie','trumpet','whistle','tomato','tree','spoon'],
exampleFaces = ['up-left-4sec', 'up-right-4sec'],

// set up vids arrays
famFaces = ['down-left-4sec','down-right-4sec'],
testFaces = ['down-left-4sec', 'up-left-4sec', 'down-right-4sec', 'up-right-4sec'],
allFaces = ['down-left-4sec', 'up-left-4sec', 'down-right-4sec', 'up-right-4sec', 'straight-ahead'],


//make sure all images are loaded at runtime
allImgs = allImgs.map(function(elem){return 'Novel'+elem;});
allImgs = allImgs.concat(exampleImages[1]);
$(allImgs.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();


// restricts hits to chrome 
if (BrowserDetect.browser != 'Chrome') {
    alert ("Warning: this HIT will not work with your browser. Please use Google Chrome");
    $("#start_button").attr("disabled", "disabled");
}

//Show instruction slide
showSlide("instructions"); 

//disable accept button if in turk preview mode
$("#start_button").click(function() {
    if (turk.previewMode) {
      alert("Please accept HIT to view");
      showSlide("instructions");
    } else {
      showSlide("instructions2");
    }
  });

// This is where we define the experiment variable, 
// which tracks all the information we want to know about the experiment.

var experiment = {
  condition: cond_name, 
  delay_condition: int_cond,
  numReferents: imgsPerSlide,
  trials: delay,  
  prop_cond: prop_cond,
  test_trials: test_trials,
  exposure_trials: exposure_trials,
  trialTypes: trial_order, 
  samePos: allSamePosOne,
  data: [],
  about: "",
  broken: "",
  keepPic: ['','','','','','','','', '','','','','','','',''], 
  keepIdx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  item: 0,
  exampleItem: 0,
  trialSounds: allSounds.map(function(elem){return 'Sound'+elem;}),
  exampleSounds: ['squirrel','tomato'],
  exampleFace: 0,
  exampleFaces: exampleFaces, // chooses which example faces to show
  trialImages: allImgs,
  exampleImages: exampleImages,       // chooses the set of example images to display on the example slide
  faceVidsTest: testFaces, // directed looks for exposure trials
  faceVidsFam: famFaces,             // only need 2 directed looks for exposure trials
  faceCenter: 'straight-ahead',         // eyes center for example/same/switch trials
  browser:"",
  reliability:"",

  /*The function that gets called when the sequence is finished. */
  end: function() {
    if (slider_check == false) {
      alert("Please adjust the slider before continuing")
      showSlide("qanda");
    } else {
        experiment.broken = $('#broken')[0].value;
        experiment.reliability = $('#single_slider').slider("option", "value");
        showSlide("finished"); 
    }

  // Decrement maker - getter  
    setTimeout(function() {   
      var xmlHttp = null;
			xmlHttp = new XMLHttpRequest()
			xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
			xmlHttp.send(null)
      turk.submit(experiment)
        }, 1500);
    },

  /*shows a blank screen for 750 ms*/
  blank: function() {
      //hide progress bar
      $(document).ready(function () {$("#text1").hide();});
      $(document).ready(function () {$("#text_test").hide();});
      $(document).ready(function () {$("#text_fam").hide();});
      $(document).ready(function () {$("#progressbar").hide();});

    showSlide("blankSlide");
    if(experiment.exampleItem == numExamples){
      experiment.exampleItem = numExamples+1;
      setTimeout(showSlide("instructions3"),500);
    } else {
      setTimeout(experiment.next, 750);
    }   
  },


  /* lets the participant select a picture and records which one was chosen */
  makeChoiceFamTest: function(event) {
    //unbind clicked image
    $(".xsit_pic_fam_test").unbind("click");

    //get rt
    var endTime = (new Date()).getTime();

    // variable creation 
    var face_vid, faceLookIdx, trial_type, img, gaze_tar;
    
    //visually indicates the participant's choice
    event.target.style.border = '5px dotted red';
    img = trim(event.target.src);

    // check trial type
    if(Math.floor(experiment.exampleItem) > numExamples & 
      experiment.keepPic[experiment.item].length == 0) {
          trial_type = "exposure";
    } else {
          trial_type = "test";
    }

    // get the face vid that was shown 
    if (trial_type == "exposure") { 
            face_vid = experiment.faceVidsFam[faceLook];
            faceLookIdx = faceLook;
    } else { 
            face_vid = experiment.faceCenter; 
            faceLookIdx = -1;
    }

    // get the gaze target image
    if (face_vid == "up-left-4sec") {
        gaze_tar = trim($(".xsit_pic_fam")[0].children[0].src);
    } else if (face_vid == "up-right-4sec") {
        gaze_tar = trim($(".xsit_pic_fam")[1].children[0].src);
    } else if (face_vid == "down-left-4sec") {
    	gaze_tar = trim($(".xsit_pic_fam")[2].children[0].src);
    } else if (face_vid == "down-right-4sec") {
    	gaze_tar = trim($(".xsit_pic_fam")[3].children[0].src);
    } else {
    	gaze_tar = "NA"; // if video is straight ahead there is no gaze target
    }
    
    //find the screen position of the clicked object
    var i,tmpImg;
    for(i = 0; i < imgsPerSlideFam; i++) {
      tmpImg = trim($(".xsit_pic_fam_test")[i].children[0].src);
      if(tmpImg == img){break;}
    }
    
    // define variables for use within the choice function
    var new_i = i, new_img = img;
    
    /* Same/Switch trial */
    if(Math.floor(experiment.exampleItem) > numExamples &
        experiment.trialTypes[experiment.item] != 1) { 
      var all_pos = range(0,imgsPerSlideFam-1);
      all_pos.splice(i,1); // splice() adds/removes items to/from an array and returns that item
      all_pos = shuffle(all_pos);
      new_i = all_pos[0];  
      new_img = trim($(".xsit_pic_fam_test")[new_i].children[0].src);
    } 
    
    //first trial for an object, exposure trial
    
    if(trial_type == "exposure") {
        experiment.keepPic[experiment.item] = new_img;
        experiment.keepIdx[experiment.item] = new_i;
    }

    // figure out if reponse is correct
    var correct;
    if (trial_type == "example") {
      if(Math.floor(experiment.exampleItem) == 1) {
        correct = img == "squirrel";
      } else {
        correct = img == "tomato";
      }
    } else if (trial_type == "exposure") {
      if (experiment.item <= 7) {
        correct == "NA";
      } else {
        correct = img == gaze_tar; 
      }
    } else {
      correct = img == experiment.keepPic[experiment.item];
    }

    //store eveyrthing we want about the trial
    data = {
        itemNum: experiment.item,
        trialType: experiment.trialTypes[experiment.item],
        samePos: experiment.samePos[experiment.item],
        chosen: img,
        correct: correct,
        trial_category: trial_type,
	      gaze_target: gaze_tar,
        chosen_idx: i,
        trial_category: trial_type,
        kept: experiment.keepPic[experiment.item],
        kept_idx: experiment.keepIdx[experiment.item],
        rt: endTime - startTime,
        face: face_vid,
        faceIdx: faceLookIdx,
    };  

    console.log(data);

    experiment.data.push(data);

    // testing data storage
   // console.log(data);
    
    //update progress bar
    $("#progressbar").progressbar("option", "value", 
        ($("#progressbar").progressbar( "option", "value")+1));
    setTimeout(experiment.blank, 500);

  },

  /* lets the participant select a picture and records which one was chosen */
  makeChoiceFamExpo: function(event) {

    $(":button").unbind("click");

    //get rt
    var endTime = (new Date()).getTime();

    var face_vid, faceLookIdx, trial_type, gaze_tar;

    // check trial type
    if(Math.floor(experiment.exampleItem) > numExamples & 
      experiment.keepPic[experiment.item].length == 0) {
          trial_type = "exposure";
    } else {
          trial_type = "test";
    }

    // get the face vid that was shown 
    if (trial_type == "exposure") { 
            face_vid = experiment.faceVidsFam[faceLook];
            faceLookIdx = faceLook;
    } else { 
            face_vid = experiment.faceCenter; 
            faceLookIdx = -1;
    }

    // get the gaze target image
    if (face_vid == "down-left-4sec") {
        img = trim($(".xsit_pic_fam")[0].children[0].src);
        gaze_tar = img;
    } else {
        img = trim($(".xsit_pic_fam")[1].children[0].src);
        gaze_tar = img;
    }

    //find the screen position of the clicked object
    var i,tmpImg;
    for(i = 0; i < imgsPerSlideFam; i++) {
      tmpImg = trim($(".xsit_pic_fam")[i].children[0].src);
      if(tmpImg == img){break;}
    }

    // define variables for use within the choice function
    var new_i = i, new_img = img;    

    /* keepPic and keepIdx track what was shown and what position it was in. 
    Then, you can check if experiment.keepPic[experiment.item].length == 0. If it is, 
    this is the first trial for this object (exposure). Otherwise, it's a same/switch trial. 
    */
   
    /* Same/Switch trial */
    if(Math.floor(experiment.exampleItem) > numExamples &
        experiment.trialTypes[experiment.item] != 1) { 
      var all_pos = range(0,imgsPerSlideFam-1);
      all_pos.splice(i,1); // splice() adds/removes items to/from an array and returns that item
      all_pos = shuffle(all_pos);
      new_i = all_pos[0];  
      new_img = trim($(".xsit_pic_fam")[new_i].children[0].src);
    } 
    
    //first trial for an object, exposure trial
    
    if(trial_type == "exposure") {
        experiment.keepPic[experiment.item] = new_img;
        experiment.keepIdx[experiment.item] = new_i;
    }

   // figure out if reponse is correct
    var correct;
    if (trial_type == "example") {
      if(Math.floor(experiment.exampleItem) == 1) {
        correct = img == "squirrel";
      } else {
        correct = img == "tomato";
      }
    } else if (trial_type == "exposure") {
      if (experiment.item <= 7) {
        correct == "NA";
      } else {
        correct = img == gaze_tar; 
      }
    } else {
      correct = img == experiment.keepPic[experiment.item];
    }

    //store eveyrthing we want about the trial
    data = {
        itemNum: experiment.item,
        trialType: experiment.trialTypes[experiment.item],
        samePos: experiment.samePos[experiment.item],
        chosen: "NA",
        correct: correct,
        trial_category: trial_type,
	      gaze_target: gaze_tar,
        chosen_idx: i,
        trial_category: trial_type,
        kept: experiment.keepPic[experiment.item],
        kept_idx: experiment.keepIdx[experiment.item],
        rt: endTime - startTime,
        face: face_vid,
        faceIdx: faceLookIdx,
    };  


    experiment.data.push(data);

    console.log(data);
    
    //update progress bar
    $("#progressbar").progressbar("option", "value", 
        ($("#progressbar").progressbar( "option", "value")+1));
    setTimeout(experiment.blank, 500);

  },



  /* lets the participant select a picture and records which one was chosen */
  makeChoice: function(event) {
   
    $(".xsit_pic_test").unbind("click");

    //get rt
    var endTime = (new Date()).getTime();

    // variable creation 
    var face_vid, faceLookIdx, trial_type, img, gaze_tar;
    
    //visually indicates the participant's choice
    event.target.style.border = '5px dotted red';
    img = trim(event.target.src);

    console.log("example item is: " + Math.floor(experiment.exampleItem));

    // check trial type
    if(Math.floor(experiment.exampleItem) <= numExamples) {
      trial_type = "example";
    } else if (Math.floor(experiment.exampleItem) > numExamples & 
    	experiment.keepPic[experiment.item].length == 0) {
      trial_type = "exposure"
    } else {
      trial_type = "test"
    }

    // get the face vid that was shown 
    if(trial_type == "example") {
      face_vid = experiment.exampleFaces[experiment.exampleFace - 1];
      faceLookIdx = experiment.exampleFace-1;
    } else if (trial_type == "exposure") { 
            face_vid = experiment.faceVidsTest[faceLook];
            faceLookIdx = faceLook;
    } else { 
            face_vid = experiment.faceCenter; 
            faceLookIdx = -1;
    }

    // get the gaze target image
    if (face_vid == "up-left-4sec") {
        gaze_tar = trim($(".xsit_pic_test")[0].children[0].src);
    } else if (face_vid == "up-right-4sec") {
        gaze_tar = trim($(".xsit_pic_test")[1].children[0].src);
    } else if (face_vid == "down-left-4sec") {
    	gaze_tar = trim($(".xsit_pic_test")[2].children[0].src);
    } else if (face_vid == "down-right-4sec") {
    	gaze_tar = trim($(".xsit_pic_test")[3].children[0].src);
    } else {
    	gaze_tar = "NA"; // if video is straight ahead there is no gaze target
    }
    
    //find the screen position of the clicked object
    var i,tmpImg;
    for(i = 0; i < imgsPerSlideFam; i++) {
      tmpImg = trim($(".xsit_pic_test")[i].children[0].src);
      if(tmpImg == img){break;}
    }
    
    // define variables for use within the choice function
    var new_i = i, new_img = img; 
    
    /* Same/Switch trial */
    if(Math.floor(experiment.exampleItem) > numExamples &
        experiment.trialTypes[experiment.item] != 1) { 
      var all_pos = range(0,imgsPerSlideFam-1);
      all_pos.splice(i,1); // splice() adds/removes items to/from an array and returns that item
      all_pos = shuffle(all_pos);
      new_i = all_pos[0];  
      new_img = trim($(".xsit_pic_test")[new_i].children[0].src);
    } 
    
    //first trial for an object, exposure trial
    
    if(trial_type == "exposure") {
        experiment.keepPic[experiment.item] = new_img;
        experiment.keepIdx[experiment.item] = new_i;
    }

    // figure out if reponse is correct
    var correct;
    if (trial_type == "example") {
      if(Math.floor(experiment.exampleItem) == 1) {
        correct = img == "squirrel";
      } else {
        correct = img == "tomato";
      }
    } else if (trial_type == "exposure") {
      if (experiment.item <= 7) {
        correct == "NA";
      } else {
        correct = img == gaze_tar; 
      }
    } else {
      correct = img == experiment.keepPic[experiment.item];
    }

    //store eveyrthing we want about the trial
    data = {
        itemNum: experiment.item,
        trialType: experiment.trialTypes[experiment.item],
        samePos: experiment.samePos[experiment.item],
        chosen: img,
        correct: correct,
        trial_category: trial_type,
        gaze_target: gaze_tar,
        chosen_idx: i,
        trial_category: trial_type,
        kept: experiment.keepPic[experiment.item],
        kept_idx: experiment.keepIdx[experiment.item],
        rt: endTime - startTime,
        face: face_vid,
        faceIdx: faceLookIdx,
    };  
    experiment.data.push(data);

    

    console.log(data);
    
    //update progress bar
    $("#progressbar").progressbar("option", "value", 
        ($("#progressbar").progressbar( "option", "value")+1));
    setTimeout(experiment.blank, 500);

  },

  /*The work horse of the sequence: what to do on every trial.*/
  next: function() {
    // variable creation
    var i, next_imgs = [],sound, face_vid, blank, trial_block, trial_type;

    // check which block it is
    if(Math.floor(experiment.exampleItem) < numExamples) {
        trial_block = "example";
        trial_type = "example";
    }

    // show example trials
    if(trial_block == "example") {
        sound = experiment.exampleSounds[Math.floor(experiment.exampleItem)];
        face_vid = experiment.exampleFaces[experiment.exampleFace];
        //update the images shown
        for(i = 0; i < imgsPerSlide; i++) { 
            next_imgs[i] = experiment.exampleImages.shift();
        }
        //change counters for example block
        //experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
        experiment.exampleItem = experiment.exampleItem + 1;
        experiment.exampleFace = experiment.exampleFace + 1;
    } else {
        //Get the current trial
        trial = experiment.trials.shift();
      
            //If the current trial is undefined, we're done, so call the end function.
            if (typeof trial == "undefined") {
                return showSlide("qanda");
            }
        
        // decrement trial counter
        experiment.item = trial-1;
        sound = experiment.trialSounds[experiment.item];

        // check which block we are in 
        if (experiment.item <= 7) {
              trial_block = "familiarization";
        } else {
              trial_block = "test";
        }

        // check which trial type it is
        if (experiment.keepPic[experiment.item].length == 0) {
              trial_type = "exposure";
        } else if (experiment.keepPic[experiment.item].length > 0) {
              trial_type = "test";
        }
    
      // set up exposure trial  
      if(trial_type == "exposure" & trial_block == "test") { 
        faceLook = random(4);
        face_vid = experiment.faceVidsTest[faceLook];
      } else if (trial_type == "exposure" & trial_block == "familiarization") {
          faceLook = random(2);
          face_vid = experiment.faceVidsFam[faceLook];
      } else {
          face_vid = experiment.faceCenter;
      }

        var idx;
        
        //set up test trial for either fam/test block
        if(trial_type == "test") { 
          idx = experiment.keepIdx[experiment.item];
           
            //need to put the kept object in a new place
            if(experiment.samePos[experiment.item] != 1 & trial_block == "test"){         
                var all_pos = range(0,imgsPerSlide-1); 
                all_pos.splice(idx,1);
                all_pos = shuffle(all_pos);
                idx = all_pos[0];
            } else {
                var all_pos = range(0,imgsPerSlideFam-1); 
                all_pos.splice(idx,1);
                all_pos = shuffle(all_pos);
                idx = all_pos[0];
            }
        } else {
            idx = -1; // this is how to set up the first trial for this object!
        }    

    
      //grab all new images for each trial
      if (trial_block == "test") {
            for(i = 0; i < imgsPerSlide; i++) {
            i == idx ? next_imgs[i] = experiment.keepPic[experiment.item] :
            next_imgs[i] = experiment.trialImages.shift();
            }
      } else {
            for(i = 0; i < imgsPerSlideFam; i++) {
            i == idx ? next_imgs[i] = experiment.keepPic[experiment.item] :
            next_imgs[i] = experiment.trialImages.shift();
            }
      }
    }

    // for loop to update on-screen objects
    if (trial_block == "test" || trial_block == "example") {
        for (i = 0; i < imgsPerSlide; i++) {
        $(".xsit_pic_test")[i].children[0].src = "stimuli/images/"+next_imgs[i]+".jpg";
        }
    } else if (trial_type == "exposure") {
        for (i = 0; i < imgsPerSlideFam; i++) {
        $(".xsit_pic_fam")[i].children[0].src = "stimuli/images/"+next_imgs[i]+".jpg";
        }
    } else {
      for (i = 0; i < imgsPerSlideFam; i++) {
        $(".xsit_pic_fam_test")[i].children[0].src = "stimuli/images/"+next_imgs[i]+".jpg";
        }
    }
   
    
  // get appropriate video 
  experiment.browser=BrowserDetect.browser;

  if (trial_block == "test" || trial_block == "example") {
        videoElement = document.getElementById("video1_test");
         if (videoElement.canPlayType("video/mp4")) {
                $("#video1_test")[0].src = "stimuli/videos/"+face_vid+".mov";           
             } else if (videoElement.canPlayType("video/ogg")) {
                  $("#video1_test")[0].src = "stimuli/videos/"+face_vid+".ogg";          
             } else {
                 window.alert("Can't play anything");
             }
        $("#video1_test")[0].load();
  } else if (trial_type == "exposure") {
      videoElement = document.getElementById("video1_fam");
         if (videoElement.canPlayType("video/mp4")) {
                $("#video1_fam")[0].src = "stimuli/videos/"+face_vid+".mov";           
             } else if (videoElement.canPlayType("video/ogg")) {
                  $("#video1_fam")[0].src = "stimuli/videos/"+face_vid+".ogg";          
             } else {
                 window.alert("Can't play anything");
             }
        $("#video1_fam")[0].load();
  } else {
      videoElement = document.getElementById("video1_fam_test");
         if (videoElement.canPlayType("video/mp4")) {
                $("#video1_fam_test")[0].src = "stimuli/videos/"+face_vid+".mov";           
             } else if (videoElement.canPlayType("video/ogg")) {
                  $("#video1_fam_test")[0].src = "stimuli/videos/"+face_vid+".ogg";          
             } else {
                 window.alert("Can't play anything");
             }
        $("#video1_fam_test")[0].load();
  }
  
  
  //get the appropriate sound
    if(BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Firefox") {
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";
    } else {
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";
    }
             
   //blank out all borders so no item is pre-selected
    if (trial_block == "test" || trial_block == "example") {

          // show test/example progress bar
          $(document).ready(function () {$("#text1").show();});
          $(document).ready(function () {$("#progressbar").show();});
          $(document).ready(function () {$("#text_test").show();});

          //blank out borders
          $(".xsit_pic_test").each(function() {
            this.children[0].style.border = '5px solid white';
          });

          //Re-Display the experiment slide
          showSlide("test");

          //check video readystate before beginning the trial 
          $("#video1_test")[0].oncanplaythrough = function() {
                //Wait, Play eye gaze video 
                setTimeout(function(){
                  $("#video1_test")[0].play();
                }, 1300) 

                //Wait, Play a sound
                  setTimeout(function(){
                    $("#sound_player")[0].play();      
                  }, 3000); 

                //Start recording responses when video finishes (at end of longest eye gaze)
                setTimeout(function(){
                  startTime = (new Date()).getTime();
                  $(".xsit_pic_test").bind("click", experiment.makeChoice);
                }, 3300) 
          }

     } else if (trial_type == "exposure") {
          // show correct progress bar
          $(document).ready(function () {$("#text1").show();});
          $(document).ready(function () {$("#progressbar").show();});
          $(document).ready(function () {$("#text_fam").show();});

          // display the familiarization slide
          showSlide("fam");

          // check if video has loaded before starting trial
         $("#video1_fam")[0].oncanplaythrough = function() {
              setTimeout(function(){
                //myVideo.play();
                $("#video1_fam")[0].play();
              }, 1300)

              //Wait, Play a sound
                setTimeout(function(){
                  $("#sound_player")[0].play();      
                }, 3000);

                setTimeout(function(){
                        startTime = (new Date()).getTime();
                        $(":button").bind("click", experiment.makeChoiceFamExpo);
                }, 3300)
           }
      } else {
          // show correct progress bar
          $(document).ready(function () {$("#text1").show();});
          $(document).ready(function () {$("#progressbar").show();});
          $(document).ready(function () {$("#text_test").show();});

          $(".xsit_pic_fam_test").each(function() {
            this.children[0].style.border = '5px solid white';
          });

          // display the familiarization slide
          showSlide("famTest");

          // check if video can play through
          $("#video1_fam_test")[0].oncanplaythrough = function() {
                //Wait, Play eye gaze video 
                setTimeout(function(){
                  //myVideo.play();
                  $("#video1_fam_test")[0].play();
                }, 1300)

                //Wait, Play a sound
                  setTimeout(function(){
                    $("#sound_player")[0].play();      
                  }, 3000);

                  setTimeout(function(){
                          startTime = (new Date()).getTime();
                          $(".xsit_pic_fam_test").bind("click", experiment.makeChoiceFamTest);
                  }, 3300)
         }
      }   
  }
};