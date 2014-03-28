/*  from http://www.quirksmode.org/js/detect.html
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

/* strips off the directory and suffix of image/sound/etc file names */
trim = function(item) {
  var tmp = item;
  return tmp.slice(tmp.lastIndexOf("/")+1,tmp.lastIndexOf(".")); 
};

// Variable assignment for use later in experiment
var numImgsConds = [2, 4, 6];
var imgsPerSlide = numImgsConds[0]; // 4 images per slide 
var numBlocks = 8;
var numOccurs = 2;

var numUsedImgs = ((imgsPerSlide*numOccurs)-1)*numBlocks;
var numUsedSounds = numBlocks;

var numImgs = 140;
var numSounds = 87;

allImgs = range(1,numImgs);
allImgs = shuffle(allImgs);
allImgs = allImgs.slice(0,numUsedImgs); // slice() returns selected elements as a new array object.

var blank = blank;

allSounds = range(1,numSounds);
allSounds = shuffle(allSounds);
allSounds = allSounds.slice(0,numUsedSounds);

//make sure all images are loaded at runtime
allImgs = allImgs.map(function(elem){return 'Novel'+elem;});
$(allImgs.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

// an array to generate the order that should be used
var allOrders = [[1, 2, 1, 2, 1, 2, 1, 2], [2, 1, 2, 1, 2, 1, 2, 1]];

//SamePos for One Kind of Trial (Switch or Keep)
var allSamePosOne = [[1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 0, 1],
                     [0, 1, 1, 0], [0, 1, 0, 1], [0, 0, 1, 1]];

// controls the number of intervening words between exposure and test
var allSpacings = [[1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                   [1, 2, 1, 2, 3, 4, 3, 4, 5, 6, 5, 6, 7, 8, 7, 8],
                   [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8],
                   [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]];
var allSpacingsConds = ['Zero', 'One', "Three", "Seven"];

// conditions: social vs. no-social
var socialConds = ["Social", "No-Social"];

/* Number of examples */
var numExamples = 2;

/* Starts the clock for recording RT */ 
var startTime = 0;

/* code for experiment randomization */
var socialCondIdx = random();    // 0 - social , 1 = no social
var trialOrder = random();       // same/switch order 
var numIntWordsIdx = random(4);  // randomizes number of intervening words
var samePosOrderOne = random(6); // keep/move order
var samePosOrderTwo = random(6); // keep/move order

//initialize progress bar
$("#progressbar").progressbar();
$("#progressbar").progressbar( "option", "max", numBlocks*numOccurs + 
    numOccurs*numExamples);

exampleImages = [['squirrel','chair',
                  'squirrel','toaster',
                  'whistle','tomato',
                  'tomato','sweater'],
                 ['squirrel','chair','tie','trumpet',
                  'squirrel','toaster','truck','crown',
                  'whistle','tomato','tree','spoon',
                  'sweater','oven','tomato','well'],
                 ['chair','tie','trumpet','squirrel',' basket', 'door',
                  'toaster','truck', 'crown','squirrel','ruler', 'grapes', 
                  'helicopter', 'lion','whistle','tomato','tree','spoon',
                  'plug', 'shoe', 'guitar', 'kettle', 'sweater','oven']],

showSlide("instructions"); //Show instruction slide

// This is where we define the experiment variable, which has all the information about our experiment.

var experiment = {
  trialOrder: trialOrder, // random() = returns either a 0 or 1
  numIntWordsIdx: numIntWordsIdx,
  numIntWordsCond: allSpacingsConds[numIntWordsIdx],
  numReferents: imgsPerSlide,
  trials: allSpacings[numIntWordsIdx], // controls the number of intervening trials 
  socialCond: socialConds[socialCondIdx],
  trialTypes: allOrders[trialOrder], // allOrders: two arrays, alternating 1 and 2
  samePosOrderOne: samePosOrderOne, 
  samePosOrderTwo: samePosOrderTwo,
  samePos: [allSamePosOne[samePosOrderOne][0], allSamePosOne[samePosOrderTwo][0],
            allSamePosOne[samePosOrderOne][1], allSamePosOne[samePosOrderTwo][1],
            allSamePosOne[samePosOrderOne][2], allSamePosOne[samePosOrderTwo][2],
            allSamePosOne[samePosOrderOne][3], allSamePosOne[samePosOrderTwo][3]],
  data: [],
  about: "",
  broken: "",
  keepPic: ['','','','','','','',''],
  keepIdx: [0, 0, 0, 0, 0, 0, 0, 0],
  item: 0,
  exampleItem: 0,
  trialSounds: allSounds.map(function(elem){return 'Sound'+elem;}),
  exampleSounds: ['squirrel','tomato'],
  exampleFace: 0,
  exampleFaces: ['eyes_down_left','eyes_down_left','eyes_down_right','eyes_down_left'],
  trialImages: allImgs,
  exampleImages: exampleImages[0], // chooses the set of example images to display on the example slide
  faceOther: ['eyes_down_left','eyes_down_right'], //directed looks for exposure trials
  faceCenter: 'eyescenter', // eyes center for example/same/switch trials

  /*The function that gets called when the sequence is finished. */
  end: function() {
    experiment.about = $('#about')[0].value;
    experiment.broken = $('#broken')[0].value;
    
    showSlide("finished"); //Show the finish slide.

    // Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk 
    // (mmturkey filters out the functions so we know we're just submitting properties [i.e. data])
    setTimeout(function() { turk.submit(experiment);}, 1500);
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
  makeChoice: function(event) {
       
    $(".xsit_pic").unbind("click");
    var endTime = (new Date()).getTime();
  
      //visually indicates the participant's choice
    event.target.style.border = '5px dotted red';
    img = trim(event.target.src);
    
    //find the screen position of the clicked object
    var i,tmpImg;
    for(i = 0; i < imgsPerSlide; i++) {
      tmpImg = trim($(".xsit_pic")[i].children[0].src);
      if(tmpImg == img){break;}
    }
    
    var new_i = i, new_img = img, face_img, faceLookIdx;
    
    /* keepPic and keepIdx that tell it what it showed and what position it was in. 
    Then, you can check if experiment.keepPic[experiment.item].length == 0. If it is, 
    this is the first trial for this object (exposure). Otherwise, it's a same/switch trial. 
    */
    
    /* Exposure trial */
    if(Math.floor(experiment.exampleItem) <= numExamples) {
      face_img = experiment.faceCenter; 
      faceLookIdx = -1; // if center, then face index is -1 
    } 
    else if(experiment.keepPic[experiment.item].length == 0 & socialCondIdx == 0) {
            face_img = experiment.faceOther[faceLook];
            faceLookIdx = faceLook;
    } else {
        face_img = experiment.faceCenter;
        faceLookIdx = -1;
    }
      
    /* Same/Switch trial */
    if(Math.floor(experiment.exampleItem) > numExamples &
        experiment.trialTypes[experiment.item] != 1){ 
      var all_pos = range(0,imgsPerSlide-1);
      all_pos.splice(i,1); // splice() adds/removes items to/from an array and returns that item
      all_pos = shuffle(all_pos);
      new_i = all_pos[0];  
      new_img = trim($(".xsit_pic")[new_i].children[0].src);
    } 
    
    //first trial for an object, exposure trial
    
    if(Math.floor(experiment.exampleItem) > numExamples & 
        experiment.keepPic[experiment.item].length == 0){
      
        experiment.keepPic[experiment.item] = new_img;
        experiment.keepIdx[experiment.item] = new_i;
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
        rt: endTime - startTime,
        face: face_img,
        faceIdx: faceLookIdx,
    };  
    experiment.data.push(data);
    
    //update progress bar
    $("#progressbar").progressbar("option", "value", 
        ($("#progressbar").progressbar( "option", "value")+1));
    setTimeout(experiment.blank, 500);

  },

  /*The work horse of the sequence: what to do on every trial.*/
  next: function() {
    
    var i,
        next_imgs = [],
        sound,
        face_img,
        blank;
    
    //show example trials
    if(Math.floor(experiment.exampleItem) < numExamples) { 
        sound = experiment.exampleSounds[Math.floor(experiment.exampleItem)]
        face_img = experiment.exampleFaces[experiment.exampleFace];
        for(i = 0; i < imgsPerSlide; i++) { //update the images shown
            next_imgs[i] = experiment.exampleImages.shift();
        }
        experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
        experiment.exampleFace = experiment.exampleFace + 1;
    } else {
      //Get the current trial: shift() removes the first element of the array 
      //and returns it.
        trial = experiment.trials.shift();
    
      //If the current trial is undefined, it means the trials array was 
        //empty, which means that we're done, so call the end function.
        if (typeof trial == "undefined") {return showSlide("qanda");}
      
        experiment.item = trial-1;
        sound = experiment.trialSounds[experiment.item];
    
      // if exposure trial and in the social condition, then show a directed look. if not exposure, then show a center look
      if(experiment.keepPic[experiment.item].length == 0 & socialCondIdx == 0) {
        faceLook = random(2);
        face_img = experiment.faceOther[faceLook];
      } else {
        face_img = experiment.faceCenter;
          }
      
        var idx;
        
        //this was a continuation
        if(experiment.keepPic[experiment.item].length > 0){ 
          idx = experiment.keepIdx[experiment.item];
           
          //need to put the kept object in a new place
          if(experiment.samePos[experiment.item] != 1){         
          
            var all_pos = range(0,imgsPerSlide-1); // 
          all_pos.splice(idx,1);
          all_pos = shuffle(all_pos);
            idx = all_pos[0];
          }
        } else{idx = -1;}    // this is how to set up the first trial for this object!
    
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
    
   // get face image 
    $(".face_pic")[0].children[0].src = "stimuli/images/"+face_img+".jpg";
    
  //get the appropriate sound
    if(BrowserDetect.browser == "Chrome" ||
        BrowserDetect.browser == "Firefox"){
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";
    } else {
      $("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";
    }
             
   //blank out all borders so no item is pre-selected
      $(".xsit_pic").each(function(){this.children[0].style.border = '5px solid white';});

    //Re-Display the experiment slide
      showSlide("stage");

    //Wait, Play a sound
      setTimeout(function(){$("#sound_player")[0].play();
      
    //Get the current time so we can compute reaction time later.
      startTime = (new Date()).getTime();
      
    //Allow Response
      $(".xsit_pic").bind("click",experiment.makeChoice);
      
      }, 1000);
    }
  };