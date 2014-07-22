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

var audioSprite = $("#sound_player")[0];
var handler;

// exampleImagesDouble = ['shoe','chair',
//                   'shoe','toaster',
//                   'cup','whistle',
//                   'sweater','cup'],

exampleImagesSingle = ['shoe',
                  'shoe','toaster',
                  'cup',
                  'sweater','cup'],


exampleImages2Double = ['lion','flower',
					'tomato','flower',
					'scissors','truck',
					'truck','tie'],

// exampleImages2Single = ['flower',
// 					'tomato','flower',
// 					'truck',
// 					'truck','tie'],
// exampleImages = [['shoe','chair',
//                   'shoe','toaster',
//                   'cup','whistle',
//                   'sweater','cup'],
//                  ['shoe','chair','grapes', 
//                   'shoe','toaster','truck',
//                   'whistle','cup','shoe',
//                   'sweater','lion','cup'],
//                  ['shoe','chair','grapes','flower',
//                   'shoe','toaster','truck','kettle',
//                   'whistle','cup','squirrel','bread',
//                   'sweater','tomato','cup','lion']],


$(exampleImagesSingle.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();
$(exampleImages2Double.map(function(elem){return 'stimuli/images/'+elem+'.jpg';})).preload();

showSlide("instructions"); //Show instruction slide
var experiment = {
  cond: 'xsit_ask_2_0',
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
  exampleVids: ['silentLDlong', 'slendRDlong'],
  exampleSounds: ['shoe','cup'],
  exampleSounds2: ['flower','truck'],
  trialImages: allImgs,
  exampleImages: exampleImagesSingle,
  exampleImages2: exampleImages2Double,

	/*The function that gets called when the sequence is finished. */
	end: function() {
	   //Show the finish slide.
	  // Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk 
	  // (mmturkey filters out the functions so we know we're just submitting properties [i.e. data])

	    experiment.qcode = $('#qcode')[0].value;

	  	showSlide("finished"); //Show the finish slide.
	    setTimeout(function() { turk.submit(experiment);}, 1500);
	},

	codeqs: function() {

	  showSlide("coding");
	  // Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk 
	  // (mmturkey filters out the functions so we know we're just submitting properties [i.e. data])
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
	    			training.removeChild(dot_1)
				training.removeChild(dot_2)
				training.removeChild(dot_3)
				training.removeChild(dot_4)
				training.removeChild(dot_5)
	    		setTimeout(function () {
	    			$("#training").hide();
	    		//	document.body.style.background = "black";
	    			setTimeout(function() {
						experiment.practice_start();
					}, 1500);
				}, 1500);
			}
	    });	   
	},

	practice_start: function() {
		showSlide("instructions2")
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
	  
	  // if(Math.floor(experiment.exampleItem) > numExamples & 
			//   experiment.trialTypes[experiment.item] != 1){
		  
		 //  var all_pos = range(0,imgsPerSlide-1);
		 //  all_pos.splice(i,1);
		 //  all_pos = shuffle(all_pos);
		 //  new_i = all_pos[0];	
		 //  new_img = trim($(".xsit_pic")[new_i].children[0].src);  
	  // } 
	  
	  if(Math.floor(experiment.exampleItem) > numExamples & 
			  experiment.keepPic[experiment.item].length == 0){
		  
		  	experiment.keepPic[experiment.item] = new_img;
		  	experiment.keepIdx[experiment.item] = new_i;
	  }
	  
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
	  
	  setTimeout(experiment.blank, 500);

	},

	/*The work horse of the sequence: what to do on every trial.*/
	next: function() {
		
		var i,next_imgs = [],sound;
		if(Math.floor(experiment.exampleItem) < numExamples){
			sound = 
				experiment.exampleSounds[Math.floor(experiment.exampleItem)];

				next_imgs[0] = experiment.exampleImages.shift();
				if(cont)
					next_imgs[1] = experiment.exampleImages.shift();
				
			
			experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
		}
		else if(Math.floor(experiment.exampleItem2) < numExamples){
			sound = 
				experiment.exampleSounds2[Math.floor(experiment.exampleItem2)];
			
			for(i = 0; i < 2; i++) {//update the images shown
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
	    	//this was a continuation

	    	if(cont){
	    		idx = experiment.keepIdx[experiment.item];
	    		
	    		//need to put the new object in a new place
	    		if(experiment.samePos[experiment.item] != 1){
	    			idx = (idx+1)%2; 			  
					//var all_pos = range(0,experiment.trialTypes[experiment.item]);
					//all_pos.splice(idx,1);
					//all_pos = shuffle(all_pos);
	    			//idx = all_pos[0];
	    		}

	    		for(i = 0; i < imgsPerSlide; i++) {//update the image set for this trial
					i == idx ? next_imgs[i] = experiment.keepPic[experiment.item] : 
						next_imgs[i] = experiment.trialImages.shift();
				}

	    	}   	
	    	else{
	    		for(i = 0; i < experiment.trialTypes[experiment.item]; i++) {//update the image set for this trial
					next_imgs[i] = experiment.trialImages.shift();
				}


	    	} //set up trial 1 for this object 	
	    	
			//grab all new images
			
			experiment.exampleItem = experiment.exampleItem + (1/numOccurs);
			if(experiment.exampleItem == numExamples + (numBlocks - 1)){
				experiment.exampleItem2 = 0;
			}
		}
		if(cont) {
			for (i = 0; i < 2; i++) {
				$(".xsit_pic")[i].children[0].src = 
					"stimuli/images/"+next_imgs[i]+".jpg";
				}
		}
		else if(Math.floor(experiment.exampleItem2) > numExamples){
			$(".xsit_pic")[2].children[0].src = 
				"stimuli/images/"+next_imgs[0]+".jpg";
		}
		else{
			for (i = 0; i < 2; i++) {
				$(".xsit_pic")[i].children[0].src = 
					"stimuli/images/"+next_imgs[i]+".jpg";
				}
				
		}

		
    	if(cont){
    		sound=sound+'_find';
    	}
    	else{

    		if(Math.floor(experiment.exampleItem2) <= numExamples)
    			sound=sound+'_one';
    		else
    			sound=sound+'_this';

    		if(Math.floor(experiment.exampleItem) >= numExamples & 
    			Math.floor(experiment.exampleItem2) >= numExamples) {

	    		var idx = random(0,experiment.trialTypes[experiment.item]-1);
	    		experiment.keepIdx[experiment.item] = idx;
	    		experiment.keepPic[experiment.item] = next_imgs[idx];
	    	}
    	}

    	//get the appropriate sound
		// if(BrowserDetect.browser == "Chrome" ||
		// 		BrowserDetect.browser == "Firefox"){
		// 	$("#sound_player")[0].src = "stimuli/sounds/"+sound+".ogg";}
		// else{
		// 	$("#sound_player")[0].src = "stimuli/sounds/"+sound+".mp3";}
    	   		
		//blank out all borders so no item is pre-selected
		$(".xsit_pic").each(function(){this.children[0].style.border = 
			'5px solid white';});


		//Re-Display the experiment slide
		if(cont)
			showSlide("stage2");
    	else{
    		if(Math.floor(experiment.exampleItem2) > numExamples)
    			showSlide("stage1");
    		else
    			showSlide("stage2");
    	}

		//Wait, Play a sound
		setTimeout(function(){
			audioSprite.removeEventListener('timeupdate',handler);
			audioSprite.currentTime = spriteData[sound].start;
			audioSprite.play();

			//console.log(sound);

			handler = function() {
			    if (this.currentTime >= spriteData[sound].start + spriteData[sound].length) {
			        this.pause();
			    }
			};
			audioSprite.addEventListener('timeupdate', handler, false);


			// $("#sound_player")[0].play(sound);
			
			//Get the current time so we can compute reaction time later.
			startTime = (new Date()).getTime();
			
			//Allow Response

			if(cont){
				cont = 0;
            	setTimeout(function(){$(".xsit_pic").bind("click",experiment.makeChoice);},2000);
			}
			else{
				cont = 1;
				setTimeout(experiment.blank, 4000);
			}
			
			},1000);
	  }
	};
