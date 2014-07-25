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

/*$.fn.preloadVids = function() {
  this.each(function(){
        $('<video/>')[0].src = this;
    });
};*/

/* strips off the directory and suffix of image/sound/etc file names */
trim = function(item) {
  var tmp = item;
  return tmp.slice(tmp.lastIndexOf("/")+1,tmp.lastIndexOf(".")); 
};

// Variable assignment for use later in experiment

var imgsPerSlide = 2;
var numBlocks = 4;
var numOccurs = 2;

var numUsedImgs = ((imgsPerSlide*numOccurs)-1)*numBlocks; //((imgsPerSlide*numOccurs)-1)*numBlocks;
var numUsedSounds = numBlocks;

var numImgs = 28;
var numSounds = 6;

allImgs = range(1,numImgs);
allImgs = shuffle(allImgs);
allImgs = allImgs.slice(0,numUsedImgs);

allSounds = range(1,numSounds);
allSounds = shuffle(allSounds);
allSounds = allSounds.slice(0,numUsedSounds);

allImgs = allImgs.map(function(elem){return 'Novel'+elem;});
$(allImgs.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

var allTypes = [[1, 1, 2, 2]]; //only same first

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
var cont = 0;
var testCondition;

var audioSprite = $("#sound_player")[0];
var handler;

var testFaceIdx;

exampleImages2Double = ['lion','flower',
          'tomato','flower',
          'scissors','truck',
          'truck','tie'],

//$(exampleImagesSingle.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();
$(exampleImages2Double.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

exampleFaces = [['RDkids', 'RDkids', 'RDkids', 'LDkids']],
testFaces = ['RDkids', 'LDkids'],

// preload face movies into cache

/*videoElement = document.getElementById("video1");

if (videoElement.canPlayType("video/mp4")) {
    $(testFaces.map(function(elem){return 'stimuli/videos/'+elem+'.mov';l})).preloadVids();
       }
       else if (videoElement.canPlayType("video/ogg")) {
          $(testFaces.map(function(elem){return 'stimuli/videos/'+elem+'.ogv';l})).preloadVids();
       }
       else {
           window.alert("Can't play anything");
       }
*/

showSlide("instructions"); //Show instruction slide

// This is where we define the experiment variable, which tracks all the information we want to know about the experiment.

var experiment = {
  
  conditionClick: function() {
    showSlide("condition")
    $(".conditionButton").click(function() {
          testCondition = this.id;
    })
  },

  conditionTouch: function() {
    showSlide("condition")
    $(".conditionButton").one("touchstart", function(event) {
          testCondition = $(this).attr('id')
    })
  },


  cond: 'soc_xsit_2_0',
  social_cond: testCondition,
  trialOrder: trialOrder,
  trials: allSpacings[0],
  trialTypes: allTypes[trialOrder],
  samePosOrderOne: samePosOrderOne,
  samePosOrderTwo: samePosOrderTwo,
  samePos: [allSamePosOne[samePosOrderOne][0], allSamePosOne[samePosOrderOne][1],
            allSamePosOne[samePosOrderTwo][0], allSamePosOne[samePosOrderTwo][1]],
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
  //exampleImages: exampleImagesSingle,
  exampleImages2: exampleImages2Double,
  exampleFace: 0,
  exampleFaces: exampleFaces[0], // chooses which example faces to show
  faceCenter: 'straightaheadkids', // eyes center for example/same/switch trials
  faceVids: testFaces, //directed looks for exposure trials

  /*The function that gets called when the sequence is finished. */
  end: function() {
    experiment.comments = $('#comments')[0].value;
    showSlide("finished"); //Show the finish slide.
    
    experiment.browser=BrowserDetect.browser;
  
    videoE = document.getElementById("endvideo");

   if (videoE.canPlayType("video/mp4")) {
          $("#endvideo")[0].src = "stimuli/videos/smilenew.mov";          
       }
       else if (videoE.canPlayType("video/ogg")) {
            $("#endvideo")[0].src = "stimuli/videos/smilenew.ogv";          
       }
       else {
           window.alert("Can't play anything");
       }
    $("#endvideo")[0].load();

    setTimeout(function(){
      $("#endvideo")[0].play();
    }, 1300)

    // finish audio 
    endaud = document.getElementById("finish_player");
    endaud.volume=1.0;
    $("#finish_player")[0].play();


    // submit to turk
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


   training: function() {
    var xcounter = 0;
    var dotCount = 5;

    var dotx = [];
    var doty = [];

    audioSprite.play();
    audioSprite.pause();

    for (i = 0; i < dotCount; i++) {
      createDot(dotx, doty, i);
    }
    showSlide("training");
    $('.dot').bind('click', function(event) {
        var dotID = $(event.currentTarget).attr('id');
        document.getElementById(dotID).src = "images/dots/x.jpg";
        xcounter++
        if (xcounter === dotCount) {
          $("#reward_player")[0].play();
          setTimeout(function () {
             training.removeChild(dot_1)
             training.removeChild(dot_2)
             training.removeChild(dot_3)
             training.removeChild(dot_4)
             training.removeChild(dot_5)
            $("#training").hide();
          //  document.body.style.background = "black";
            setTimeout(function() {
            showSlide("instructions2");
          }, 1500);
        }, 1500);
      }
      });    
  },

  /* lets the participant select a picture and records which one was chosen */
  makeChoice: function(event) {
    $(".xsit_pic").unbind("click");
    var endTime = (new Date()).getTime();
    
    //visually indicates the participant's choice
    event.target.style.border = '5px solid green';
    img = trim(event.target.src);

    // chimes 
    $("#reward_player")[0].play();
    
    //find the screen position of the clicked object
    var i,tmpImg;
    for(i = 0; i < imgsPerSlide; i++) {
      tmpImg = trim($(".xsit_pic")[i].children[0].src);
      if(tmpImg == img){break;}
    }
    
    var new_i = i, new_img = img, face_vid, faceLookIdx;
    
    /* keepPic and keepIdx track what was shown and what position it was in. 
    Then, you can check if experiment.keepPic[experiment.item].length == 0. If it is, 
    this is the first trial for this object (exposure). Otherwise, it's a same/switch trial. 
    */
    
    /* Exposure trial */
    if(Math.floor(experiment.exampleItem) <= numExamples) {
      face_vid = experiment.faceCenter; 
      faceLookIdx = -1; // if center, then face index is -1 
    } 
    //put in if statement: experiment.keepPic[experiment.item].length == 0 
    else if(experiment.keepPic[experiment.item].length == 0 & testCondition == "Social") {
            face_vid = experiment.faceVids[faceLook];
            faceLookIdx = faceLook;
    } else {
        face_vid = experiment.faceCenter; // non-social condition, the faceLook is always center
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
   
    //store everything we want about the trial
    data = {
        itemNum: experiment.item,
        trialType: experiment.trialTypes[experiment.item],
        samePos: experiment.samePos[experiment.item],
        chosen: img,
        chosen_idx: i,
        kept: experiment.keepPic[experiment.item],
        kept_idx: experiment.keepIdx[experiment.item],
        rt: endTime - startTime,
        face: experiment.face_vid,
        faceIdx: experiment.faceLookIdx,
    };  
    experiment.data.push(data);
    
    //update progress bar
    $("#progressbar").progressbar("option", "value", 
        ($("#progressbar").progressbar( "option", "value")+1));
    setTimeout(experiment.blank, 500);

  },

  /*The work horse of the sequence: what to do on every trial.*/
  next: function() {
    console.log("Item is: " + experiment.item);

    var i, next_imgs = [],sound, face_vid, blank;

    //show example trials
    if(Math.floor(experiment.exampleItem) < numExamples) { 
        sound = experiment.exampleSounds2[Math.floor(experiment.exampleItem)]
        face_vid = experiment.exampleFaces[experiment.exampleFace];
        for(i = 0; i < imgsPerSlide; i++) { //update the images shown
            next_imgs[i] = experiment.exampleImages2.shift();
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

        console.log("Experiment keep pic is: " + experiment.keepPic[0]);
    
      // if exposure trial and in the social condition, then show a directed look. if not exposure, then show a center look
      if(experiment.keepPic[experiment.item].length == 0 & testCondition == "Social") {
        faceLook = random(2);
        face_vid = experiment.faceVids[faceLook];
      } else {
        face_vid = experiment.faceCenter;
          }
        
        console.log("Face vid is " + face_vid);


        var idx;
        
        //this was a continuation
        if(experiment.keepPic[experiment.item].length > 0){ 
          idx = experiment.keepIdx[experiment.item];
           
          //need to put the kept object in a new place
          if(experiment.samePos[experiment.item] != 1){         
            var all_pos = range(0,imgsPerSlide-1); 
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

    
  // get appropriate video 
  experiment.browser=BrowserDetect.browser;
  
  videoElement = document.getElementById("video1");

   if (videoElement.canPlayType("video/mp4")) {
          $("#video1")[0].src = "stimuli/videos/"+face_vid+".mov";          
       }
       else if (videoElement.canPlayType("video/ogg")) {
            $("#video1")[0].src = "stimuli/videos/"+face_vid+".ogv";          
       }
       else {
           window.alert("Can't play anything");
       }

    $("#video1")[0].load();

  if(experiment.keepPic[experiment.item].length != 0){
    sound=sound+'_find';
  }
  else{
    if(Math.floor(experiment.exampleItem) <= numExamples)
      sound=sound+'_this';
    else
      sound=sound+'_one'; // chose "one" framing to make less pedagogical

    if(Math.floor(experiment.exampleItem) > numExamples & Math.floor(experiment.exampleItem2) >=numExamples){
      console.log("Pocky");
      var idx = random(0, experiment.trialTypes[experiment.item]-1);
      experiment.keepIdx[experiment.item] = idx;
      experiment.keepPic[experiment.item] = next_imgs[idx];
    }
  }

  //get the appropriate sound
  //  if(BrowserDetect.browser == "Chrome" ||
  //      BrowserDetect.browser == "Firefox"){
  //    $("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";
  //  } else {
  //    $("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";
  //  }
             
   //blank out all borders so no item is pre-selected
      $(".xsit_pic").each(function(){this.children[0].style.border = '5px solid white';});

    //Re-Display the experiment slide
      showSlide("stage");


    //Wait, Play eye gaze video 
    setTimeout(function(){
      $("#video1")[0].play();
    }, 1300)

    //Start recording responses when video finishes (at end of longest eye gaze)
    setTimeout(function(){
      startTime = (new Date()).getTime();
      $(".xsit_pic").bind("click", experiment.makeChoice);
    }, 2500) //used to be 5300

    //Wait, Play a sound
      setTimeout(function(){
        audioSprite.removeEventListener('timeupdate', handler);
        audioSprite.currentTime = spriteData[sound].start;
        audioSprite.play();

        handler = function(){
          if(this.currentTime >= spriteData[sound].start + spriteData[sound].length){
              this.pause();
          }
        };
        audioSprite.addEventListener('timeupdate', handler, false);

        //$("#sound_player")[0].play();      
      }, 500); //used to be 2000
    }
  };