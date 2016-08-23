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

function range(start, end){
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
var numImgsConds = [2, 4, 6];
var imgsPerSlide = numImgsConds[1]; // 4 images per slide 
var numBlocks = 16; 
var numOccurs = 2;

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

// an array to generate the order that should be used
var allOrders = [[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2], [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]]; //note doubled each array
//SamePos for One Kind of Trial (Switch or Keep)
var allSamePosOne = [[1, 1, 0, 0, 1, 1, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [1, 0, 0, 1, 1, 0, 0, 1],
                     [0, 1, 1, 0, 0, 1, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 1, 1, 0, 0, 1, 1]];

var numExamples = 2; // Number of examples 
var startTime = 0; // Starts the clock for recording RT 

/* Call Maker getter to get cond variables
 * Takes number and counts for each condition
 * Returns a condition number
 */

try { 
    var filename = "KM_soc_xsit_4_inspection_time_full";
    var condCounts = "1,50;2,50;3,50;4,50;5,50;6,50;7,50;8,50";  
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false );
    xmlHttp.send( null );
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(1,8);
}

cond = String(cond);

/* code for condition randomization. This is a 2 X 2 X 2 design (3 factors each with 2 levels):
* block: social first vs. no-social first
* delay: 0 vs. 3
* inspection time: short vs. long 
*/

switch (cond) {
        case "1": 
            cond_name = "Live";
            social_cond = "SocialFirst";
            int_cond = "Zero";
            inspection_time = "short";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16] //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1, 0, 1, 0, 1, 0 ,1 ]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "2": 
            cond_name = "Live";
            social_cond = "No-socialFirst";
            int_cond = "Zero";
            inspection_time = "short";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16]  //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "3": 
            cond_name = "Live";
            social_cond = "SocialFirst";
            int_cond = "Zero";
            inspection_time = "long";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16] //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1, 0, 1, 0, 1, 0 ,1 ]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
        case "4": 
            cond_name = "Live";
            social_cond = "No-socialFirst";
            int_cond = "Zero";
            inspection_time = "long";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16]  //note from 8
            test_trials = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; //note from 8
            exposure_trials = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //note from 8
            break;
          case "5": 
            cond_name = "Live";
            social_cond = "SocialFirst";
            int_cond = "Three";
            inspection_time = "short";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 14, 15, 16, 13, 14, 15, 16];
            test_trials = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
            exposure_trials = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
            break;
        case "6": 
            cond_name = "Live";
            social_cond = "No-socialFirst";
            int_cond = "Three";
            inspection_time = "short";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 14, 15, 16, 13, 14, 15, 16];
            test_trials = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
            exposure_trials = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
            break;
           case "7": 
            cond_name = "Live";
            social_cond = "SocialFirst";
            int_cond = "Three";
            inspection_time = "long";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 14, 15, 16, 13, 14, 15, 16];
            test_trials = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
            exposure_trials = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
            break;
        case "8": 
            cond_name = "Live";
            social_cond = "No-socialFirst";
            int_cond = "Three";
            inspection_time = "long";
            exampleFaceIdx = 0;
            testFaceIdx = 0;
            delay = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 14, 15, 16, 13, 14, 15, 16];
            test_trials = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
            exposure_trials = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
            break;
        default:
};


// We set inspection time to short and long based on previous studies
// Long is based on the average inspection time in the no-gaze condition 
// Short is based on the average inspection time in the gaze condition
if (inspection_time == "short") {
  var inspection_time_seconds = 4;
} else {
  var inspection_time_seconds = 7;
}
        
/* Randomize trial order */
var trialOrder = random();       // same/switch order 
var samePosOrderOne = random(6); // keep/move order
var samePosOrderTwo = random(6); // keep/move order

//initialize progress bar
$("#progressbar").progressbar();
$("#progressbar").progressbar( "option", "max", numBlocks*numOccurs + 
    numOccurs*numExamples);


exampleImages = [['squirrel','chair',
                  'squirrel','toaster',
                  'tomato','whistle',
                  'sweater','tomato'],
                 ['squirrel','chair','tie','trumpet',
                  'squirrel','toaster','truck','crown',
                  'whistle','tomato','tree','spoon',
                  'sweater','oven','tomato','well'],
                 ['chair','tie','trumpet','squirrel',' basket', 'door',
                  'toaster','truck', 'crown','squirrel','ruler', 'grapes', 
                  'helicopter', 'lion','whistle','tomato','tree','spoon',
                  'plug', 'shoe', 'guitar', 'kettle', 'sweater','oven']],

exampleFaces = [['up-left-4sec', 'up-left-4sec', 'up-right-4sec', 'down-left-4sec']],

testFaces = [['up-left-4sec', 'up-right-4sec', 'down-left-4sec', 'down-right-4sec']],

//make sure all images are loaded at runtime
allImgs = allImgs.map(function(elem){return 'Novel'+elem;});
allImgs = allImgs.concat(exampleImages[1]);
$(allImgs.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

// flatten the faces array
var allFaces = testFaces.reduce(function(a, b) {
  return a.concat(b);
});
// preload movies into cache
videoElement = document.getElementById("video1");

if (videoElement.canPlayType("video/mp4")) {
    $(allFaces.map(function(elem){return 'stimuli/videos/'+elem+'.mov';l})).preloadVids();
       }
       else if (videoElement.canPlayType("video/ogg")) {
          $(allFaces.map(function(elem){return 'stimuli/videos/'+elem+'.ogv';l})).preloadVids();
       }
       else {
           window.alert("Can't play anything");
       }

// show first screen
showSlide("instructions"); //Show instruction slide

// check if turker is in preview mode and if so don't let them continue the hit 
$("#start_button").click(function() {
  if (BrowserDetect.browser != 'Chrome' && BrowserDetect.browser != 'Safari') {
      showSlide("instructions"); //Show instruction slide
      alert ("Warning: We have not tested this HIT with your browser. Please use Chrome or Safari");
    } else if (turk.previewMode) {
      showSlide("instructions"); //Show instruction slide
      alert("Please accept HIT to view");
    }
});


// This is where we define the experiment variable, which tracks all the information we want to know about the experiment.

var experiment = {
  condition: cond_name,
  trialOrder: trialOrder,   
  delay_condition: int_cond,
  numReferents: imgsPerSlide,
  trials: delay, // controls the number of intervening trials 
  inspection_time: inspection_time,
  social_cond: social_cond,
  test_trials: test_trials,
  exposure_trials: exposure_trials,
  trialTypes: allOrders[trialOrder], // allOrders: two arrays, alternating 1 and 2
  samePosOrderOne: samePosOrderOne, 
  samePosOrderTwo: samePosOrderTwo,
  samePos: [allSamePosOne[samePosOrderOne][0], allSamePosOne[samePosOrderTwo][0],
            allSamePosOne[samePosOrderOne][1], allSamePosOne[samePosOrderTwo][1],
            allSamePosOne[samePosOrderOne][2], allSamePosOne[samePosOrderTwo][2],
            allSamePosOne[samePosOrderOne][3], allSamePosOne[samePosOrderTwo][3], 
            allSamePosOne[samePosOrderOne][4], allSamePosOne[samePosOrderTwo][4],
            allSamePosOne[samePosOrderOne][5], allSamePosOne[samePosOrderTwo][5],
            allSamePosOne[samePosOrderOne][6], allSamePosOne[samePosOrderTwo][6],
            allSamePosOne[samePosOrderOne][7], allSamePosOne[samePosOrderTwo][7]], 
  data: [],
  about: "",
  broken: "",
  keepPic: ['','','','','','','','', '','','','','','','',''], //note from 8
  keepIdx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //note from 8
  item: 0,
  exampleItem: 0,
  trialSounds: allSounds.map(function(elem){return 'Sound'+elem;}),
  exampleSounds: ['squirrel','tomato'],
  exampleFace: 0,
  exampleFaces: exampleFaces[exampleFaceIdx], // chooses which example faces to show
  trialImages: allImgs,
  exampleImages: exampleImages[1], // chooses the set of example images to display on the example slide
  faceVids: testFaces[testFaceIdx], //directed looks for exposure trials
  faceCenter: 'straight-ahead', // eyes center for example/same/switch trials
  browser:"",

  /*The function that gets called when the sequence is finished. */
  end: function() {
    experiment.about = $('#about')[0].value;
    experiment.broken = $('#broken')[0].value;
    showSlide("finished"); //Show the finish slide.
    
    setTimeout(function() {   
      // Decrement maker - getter	
      var xmlHttp = null;
			xmlHttp = new XMLHttpRequest()
			xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
			xmlHttp.send(null)
      turk.submit(experiment)
        }, 1500);
    },

  /*shows a blank screen for 500 ms*/
  blank: function() {
    showSlide("blankSlide");
    if(experiment.exampleItem == numExamples){
      experiment.exampleItem = numExamples+1;
      setTimeout(showSlide("instructions3"),500);
    }else{setTimeout(experiment.next, 500);}
        
  },

  /* lets the participant select a picture and records which one was chosen */
  makeChoice: function(text) {
    // unbind event handlers
    $(".xsit_pic").unbind("click");
    $('#countdown').unbind("click");

    // create variables
    var endTime = (new Date()).getTime();
    var i,tmpImg, answer_type, trial_category, gaze_tar;

    // if no response on training, then randomly select one of the 4 images
    if ( text == "timed_out" ) {
        i = random(0,3);
        img = trim($(".xsit_pic")[i].children[0].src);
        answer_type = "timed_out";
    } else { // otherwise get the image that the participant selected
        //visually indicates the participant's choice
        answer_type = "participant_response";
        event.target.style.border = '5px dotted red';
        img = trim(event.target.src);

        //find the screen position of the clicked object
        for(i = 0; i < imgsPerSlide; i++) {
          tmpImg = trim($(".xsit_pic")[i].children[0].src);
          if(tmpImg == img){break;}
        }
    }
      
      var new_i = i, new_img = img, face_vid, faceLookIdx;

      /* keepPic and keepIdx track what was shown and what position it was in. 
      Then, you can check if experiment.keepPic[experiment.item].length == 0. If it is, 
      this is the first trial for this object (exposure). Otherwise, it's a same/switch trial. 
      */
      
      /* Exposure trial */
      if(Math.floor(experiment.exampleItem) <= numExamples) {
              trial_category = "example";
              face_vid =  experiment.exampleFaces[experiment.exampleFace - 1]; 
              faceLookIdx = exampleFaceIdx; 
      } else if(experiment.keepPic[experiment.item].length == 0 & social_cond == "SocialFirst" & experiment.item < 8) { //note add & number is 1-8;; then add condition is no-social & number is 9-16
              face_vid = experiment.faceVids[faceLook];
              faceLookIdx = faceLook;
      } else if(experiment.keepPic[experiment.item].length == 0 & social_cond == "No-socialFirst" & experiment.item >= 8) {
              face_vid = experiment.faceVids[faceLook];
              faceLookIdx = faceLook;
      } else { //note this will happen in 9-16 on social condition and 1-8 on no-social
              face_vid = experiment.faceCenter; // non-social condition, the faceLook is always center
              faceLookIdx = -1;
      }

      // get the gaze target image
        if (face_vid == "up-left-4sec") {
            gaze_tar = trim($(".xsit_pic")[0].children[0].src);
        } else if (face_vid == "up-right-4sec") {
            gaze_tar = trim($(".xsit_pic")[1].children[0].src);
        } else if (face_vid == "down-left-4sec") {
          gaze_tar = trim($(".xsit_pic")[2].children[0].src);
        } else if (face_vid == "down-right-4sec") {
          gaze_tar = trim($(".xsit_pic")[3].children[0].src);
        } else {
          gaze_tar = "NA"; // if video is straight ahead there is no gaze target
        }

      
      /* Same/Switch trial */
      if(Math.floor(experiment.exampleItem) > numExamples & experiment.trialTypes[experiment.item] != 1){ 
        var all_pos = range(0,imgsPerSlide-1);
        all_pos.splice(i,1); // splice() adds/removes items to/from an array and returns that item
        all_pos = shuffle(all_pos);
        new_i = all_pos[0];  
        new_img = trim($(".xsit_pic")[new_i].children[0].src);
      } 
      
      //first trial for an object, exposure trial
      if(Math.floor(experiment.exampleItem) > numExamples & experiment.keepPic[experiment.item].length == 0){
          experiment.keepPic[experiment.item] = new_img;
          experiment.keepIdx[experiment.item] = new_i;
          trial_category = "exposure";
      }

      // check trial category. if not exposure and example, then it must be a test trial
      if (trial_category != "exposure" && trial_category != "example") {
        trial_category = "test";
      }

      //store eveyrthing we want about the trial
      data = {
          itemNum: experiment.item,
          trialType: experiment.trialTypes[experiment.item],
          samePos: experiment.samePos[experiment.item],
          chosen: img,
          chosen_idx: i,
          kept: experiment.keepPic[experiment.item],
          kept_idx: experiment.keepIdx[experiment.item],
          rt: (endTime - startTime) + 2000, // add 2 seconds since we don't start accepting responses until 2 secs into the trial
          face: face_vid,
          faceIdx: faceLookIdx,
          answer_type: answer_type,
          trial_category: trial_category,
          gaze_target: gaze_tar
      };  
      experiment.data.push(data);
      
      //update progress bar
      $("#progressbar").progressbar("option", "value", ($("#progressbar").progressbar( "option", "value")+1));

      // need to check if we are in a test trial, if so,then we advance once participant has made a choice
      if (trial_category == "test") {
        setTimeout(experiment.blank, 500);
      }

  },

  // countdown timer 
  startCountdown: function () {
      countdown = $("#countdown").countdown360({
          radius      : 40,
          strokeWidth : 0.1,
          seconds     : inspection_time_seconds + 2,
          fontColor   : '#FFFFFF',
          autostart   : false,
          onComplete  : function () { 
              // unbind click so ss can't advance by clicking on an image
              $(".xsit_pic").unbind("click");
              experiment.timesUp();
        }})
      countdown.start();
    },

  stopCountdown: function () {
    countdown.stop();
  },

  timesUp: function() {
    // check if participant has made a choice. 
    for(i = 0; i < imgsPerSlide; i++) {
      var imgBorder = $(".xsit_pic")[i].children[0].style.border;
      if(imgBorder == "5px dotted red"){break;}
    };

    // if response then there will be a red box around it, so we should advance
    if (imgBorder == "5px dotted red") {
      setTimeout(experiment.blank, 500);
    } else {  
      // if not, show error message
      $('#countdown_text').text("Time ran out! Please respond within the time window.").css({"color":"red", "font-weight":"bold"});

      // make choice, with time out tag
      experiment.makeChoice("timed_out");

      // wait a second and then advance
      setTimeout(function(){
        experiment.blank();
      }, 2000)
    }
  },

  /*The work horse of the sequence: what to do on every trial.*/
  next: function() {
    //reset timer text
    $('#countdown_text').text("Time left in trial").css({"color":"black", "font-weight":"bold"});
    // set up variables
    var i, next_imgs = [],sound, face_vid, blank;
    //show example trials
    if(Math.floor(experiment.exampleItem) < numExamples) { 
        experiment.startCountdown();
        sound = experiment.exampleSounds[Math.floor(experiment.exampleItem)]
        face_vid = experiment.exampleFaces[experiment.exampleFace];
        for(i = 0; i < imgsPerSlide; i++) { //update the images shown
            next_imgs[i] = experiment.exampleImages.shift();
        }
        experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
        experiment.exampleFace = experiment.exampleFace + 1;
    } else {
      //Get the current trial: shift() removes the first element of the array and returns it.
      trial = experiment.trials.shift();
      //If the current trial is undefined, it means the trials array was empty, which means that we're done, so call the end function.
      if (typeof trial == "undefined") {return showSlide("qanda");}
      // get item and sound values     
      experiment.item = trial-1;
      sound = experiment.trialSounds[experiment.item];
      // if exposure trial and in the social condition, then show a directed look. if not exposure, then show a center look
      if(experiment.keepPic[experiment.item].length == 0 & social_cond == "SocialFirst" & experiment.item < 8) { 
        faceLook = random(4);
        face_vid = experiment.faceVids[faceLook];
      } else if(experiment.keepPic[experiment.item].length == 0 & social_cond == "No-socialFirst" & experiment.item >= 8) { 
        faceLook = random(4);
        face_vid = experiment.faceVids[faceLook];
      } else {
          face_vid = experiment.faceCenter;
      }
      
        var idx;
        
        //this was a continuation
        if(experiment.keepPic[experiment.item].length > 0){ 
          $('#countdown').hide()
          $('#countdown_text').hide()
          idx = experiment.keepIdx[experiment.item]; 
          //need to put the kept object in a new place
          if(experiment.samePos[experiment.item] != 1){         
            var all_pos = range(0,imgsPerSlide-1); 
            all_pos.splice(idx,1);
            all_pos = shuffle(all_pos);
            idx = all_pos[0];
          }
        } else {
          $('#countdown').show()
          $('#countdown_text').show()
          experiment.startCountdown();
          idx = -1;   // this is how to set up the first trial for this object!
        }  
    
    //grab all new images
    for(i = 0; i < imgsPerSlide; i++) {//update the image set for this trial
        i == idx ? next_imgs[i] = experiment.keepPic[experiment.item] :
          next_imgs[i] = experiment.trialImages.shift();
             }
    }

    // for loop to update on-screen objects
    for (i = 0; i < imgsPerSlide; i++) {
      $(".xsit_pic")[i].children[0].src = "stimuli/images/"+next_imgs[i]+".jpg";
    }

    
  // get appropriate video 
  experiment.browser=BrowserDetect.browser;
  experiment.os=BrowserDetect.dataOS;
  videoElement = document.getElementById("video1");
      
  if (videoElement.canPlayType("video/mp4")) {
      $("#video1")[0].src = "stimuli/videos/"+face_vid+".mov";           
   } else if (videoElement.canPlayType("video/ogg")) {
        $("#video1")[0].src = "stimuli/videos/"+face_vid+".ogv";          
   } else {
       window.alert("Can't play anything");
   }2
  
  $("#video1")[0].load();
  
    //get the appropriate sound
    if(BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Firefox"){
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";
    } else {
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";
    }
             
   //blank out all borders so no item is pre-selected
      $(".xsit_pic").each(function(){this.children[0].style.border = '5px solid white';});

    //Re-Display the experiment slide
      showSlide("stage");

    //Wait, Play eye gaze video 
    setTimeout(function(){
      //myVideo.play();
      $("#video1")[0].play();
    }, 1300)

    // Start recording responses when video finishes (at end of longest eye gaze)
    // We also stop the timer once ss clicks on an img
    setTimeout(function(){
      startTime = (new Date()).getTime();
      $(".xsit_pic").bind("click", experiment.makeChoice);
    }, 2000) 

    //Wait, Play a sound
      setTimeout(function(){
        $("#sound_player")[0].play();      
      }, 2700); 
    }
  };
