// Negtracker Ipad
// Overview: (i) Helper Functions (ii) Parameters (iii) Control Flow

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

//preload images: 
var myimages = new Array()

function preloading() {
	for (x = 0; x < preloading.arguments.length; x++) {
		myimages[x] = new Image()
		myimages[x].src = preloading.arguments[x]
	}
}

preloading("images/apples.png", "images/bananas.png", "images/bread.png", "images/cupcakes.png", "images/carrots.png", "images/cheese.png", "images/cookies.png", "images/crackers.png", "images/eggs.png", "images/empty.png", "images/grapes.png", "images/oranges.png", "images/pasta.png", "images/peas.png", "images/pizza.png", "images/strawberries.png", "images/watermelon.png", "images/abby.png", "images/elmo.png", "images/bbird.png", "images/zoe.png", "images/rosita.png", "images/tellymonster.png", "images/snuffy.png", "images/grover.png", "images/count.png", "images/oscar.png", "images/ernie.png", "images/bert.png", "images/cookiemonster.png"); 

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


// ---------------- PARAMETERS ------------------

var pauseTime = 500
var password = "Negpad"

//Practice variables
//counter starts at zero
var practiceCounter = 0
	//Total number of practice trials:
var practiceNumber = 3

//Practice items & sentence type
var practiceItems = [
		["bread", "positive"],
		["cupcakes", "negative"],
		["cookies", "negative"]
	]
	//During test trial, whether plate with "something" (items) is on Left or Right (counterbalancing)
var practiceOrder = ["itemL", "itemR", "itemL"]

//Experiment variables
//counter starts at zero
var counter = 0
	//total number of trials
var number = 16

//Create item lists.  Each item occurs once as positive and once as negative.  
//The list is created so that all of the items are cycled through before they are repeated.
var items1 = shuffle([
	["apples", "positive"],
	["bananas", "positive"],
	["carrots", "positive"],
	["cheese", "positive"],
	["grapes", "negative"],
	["oranges", "negative"],
	["strawberries", "negative"],
	["watermelon", "negative"],
])

var items2 = shuffle([
	["apples", "negative"],
	["bananas", "negative"],
	["carrots", "negative"],
	["cheese", "negative"],
	["grapes", "positive"],
	["oranges", "positive"],
	["strawberries", "positive"],
	["watermelon", "positive"],
])

var items = items1.concat(items2)

var characters = ["bbird", "zoe", "abby", "rosita", "tellymonster", "snuffy", "grover", "count", "oscar", "ernie", "bert", "cookiemonster"];

//During test trial, whether plate with "something" (items) is on Left or Right (counterbalancing)
var order = shuffle(["itemL", "itemL", "itemL", "itemL", "itemL", "itemL", "itemL", "itemL", "itemR", "itemR", "itemR", "itemR", "itemR", "itemR", "itemR", "itemR"])

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

//Start the experiment
var experiment = {

	initStars: function(starNumber) {
		$("#progress").html("");
		for (i = 0; i < starNumber; i++) {
			$("#progress").append("<img class='star' src = 'images/starOff.png' id='star" + i + "'/>");
		}
	},

	check: function() {
		//Make sure a subid and a password were entered
		subjectID = $("#subjectID").val()
		if (document.getElementById("pswd").value != password) {
			alert("Wrong Password")
			return
		} else if (document.getElementById("subjectID").value.length < 1) {
			alert("Please enter a subject ID")
			return
		} else {
			experiment.condition()
			document.getElementById("pswd").value == ""
			document.getElementById("subjectID").value == ""
		}
	},

	condition: function() {
		showSlide("condition")
		$(".conditionButton").one("touchstart", function(event) {
			testCondition = $(this).attr('id')
		})

	},

	//We start with a training game to make sure children know how to use the iPad
	training: function() {
		var xcounter = 0
		var dotCount = 5

		var dotx = []
		var doty = []

		for (i = 0; i < dotCount; i++) {
			createDot(dotx, doty, i)
		}
		showSlide("training")
		$('.dot').one('touchstart', function(event) {
			var dotID = $(event.currentTarget).attr('id')
			document.getElementById(dotID).src = "images/dots/x.jpg"
			xcounter++
			if (xcounter === dotCount) {
				training.removeChild(dot_1)
				training.removeChild(dot_2)
				training.removeChild(dot_3)
				training.removeChild(dot_4)
				training.removeChild(dot_5)
				setTimeout(function() {
					$("#training").hide()
					setTimeout(function() {
						experiment.practice_start()
					}, pauseTime * 2)
				}, pauseTime)
			}
		})
	},

	//Show the second instructions slide.
	//This allows you to either play the training game again, or start the practice trials.
	practice_start: function() {
		showSlide("instructions2")
	},

	//A blank slide between trials (1000ms)
	practice_blank: function() {
		showSlide("blankSlide")
		//reset startTime & endTime
		startTime = ""
		endTime = ""
		//Check if the practice trials are completed, and go to experiment.start if they are
		if (practiceCounter === practiceNumber) {
			return experiment.start()
		} else {
			setTimeout(experiment.practice_context, 1000)
		}

	},

	// MAIN DISPLAY FUNCTION
	practice_context: function() {
		//The main "stage" where the experiment takes place.  This contains a table where stimuli images are placed.
		showSlide("stage")		

		//Determine which context pictures will be used.  
		var contextPictures
		if (testCondition == "noContext") {
			contextPictures = "empty"
		} else if (testCondition == "context") {
			contextPictures = practiceItems[practiceCounter][0]
		}

		//update button displays
		$("#listenButton").hide();
		$("#leftPic").show();
		$("#centerPic").show();
		$("#rightPic").show();

		//Place the context images in the table
		//HTML for the object on the left
		var leftname = "images/" + contextPictures + ".png";
		$("#leftPic").attr("src", leftname);

		//HTML for the object in the center
		var centername = "images/" + contextPictures + ".png";
		$("#centerPic").attr("src", centername)

		//HTML for the object on the right
		var rightname = "images/" + contextPictures + ".png";
		$("#rightPic").attr("src", rightname)


		//create characters
		characters = shuffle(characters);

		var leftCharName = "images/" + characters[0] + ".png";
		$("#leftChar").attr("src", leftCharName);
		var centerCharName = "images/" + characters[1] + ".png";
		$("#centerChar").attr("src", centerCharName);
		var rightCharName = "images/" + characters[2] + ".png";
		$("#rightChar").attr("src", rightCharName);

		//This is a counter that tells us when all context images have been clicked
		var ccounter = 0
		var ctotal = 3

		//When images are clicked, replace with new images and play the "bloop" noise
		$('.pic').one('touchstart', function(event) {
			var cpicID = $(event.currentTarget).attr('id')
			$("#bloop_player")[0].play()
			if (cpicID == "leftPic") {
				$("#leftChar").show()
			} else if (cpicID == "centerPic") {
				$("#centerChar").show()
			} else if (cpicID == "rightPic") {
				$("#rightChar").show()
			}
			ccounter++
			//Once all context pictures have been clicked, start the test trial
			if (ccounter === ctotal) {
				setTimeout(function() {
					$("#leftPic").hide();
					$("#leftChar").hide();
					$("#centerPic").hide();
					$("#centerChar").hide();
					$("#rightPic").hide();
					$("#rightChar").hide();
					experiment.practice_next()
				}, 1000)
			}
		})
	},

	practice_next: function() {

		setTimeout(function() {			
			//This determines the placement of the pictures, depending on the order counterbalancing (Item left or Item right)
			var trialPictures = ""
			if (practiceOrder[practiceCounter] == "itemL") {
				trialPictures = [practiceItems[practiceCounter][0], "empty"]
			} else if (practiceOrder[practiceCounter] == "itemR") {
				trialPictures = ["empty", practiceItems[practiceCounter][0]]
			}

			//Place images

			var leftname = "images/" + trialPictures[0] + ".png";
			$("#leftPic").attr("src", leftname);
			$("#leftPic").show();

			//HTML for the object on the right
			var rightname = "images/" + trialPictures[1] + ".png";
			$("#rightPic").attr("src", rightname)
			$("#rightPic").show();

			//show listen button
			$("#listenButton").show();

			//new version of objects to show when sentence has ended

			$("#leftChar").attr("src", "images/elmo.png");
			$("#rightChar").attr("src", "images/elmo.png");

			//place holder for sound
			var targetSentence = 'sentences/target_sentences/' + practiceItems[practiceCounter][0] + '_' + practiceItems[practiceCounter][1] + '.mp3';
			$("#sound_player")[0].src = targetSentence

			//When button is touchstartped, play sentence
			$('#listenButton').one('touchstart', function() {

				//load sound
				$("#sound_player")[0].load()

				//change listen button image
				$('#listenButton').attr("src", "images/listening.jpg")

				setTimeout(function() {
					$("#sound_player")[0].play()

					//if sentence ends before choice is made, mark the time that the sentence ended
					$('#sound_player').one('ended', function() {
						startTime = (new Date()).getTime()
					});

					//wait until "Elmo's plate has..." to allow touchstart event (1870 ms)
					setTimeout(function() {
						$('.pic').on('touchstart', function(event) {

							//these things should happen regardless of whether the sentence has ended:

							//mark the time at which the touchstart event occurred
							endTime = (new Date()).getTime()
							$(this).addClass('selectedPic')
							var picID = $(this).attr('id');

							//what picture was selected?
							var selectionType = "";
							if (picID === "leftPic") {
								selectionType = trialPictures[0]
							} else if (picID === "rightPic") {
								selectionType = trialPictures[1]
							}

							//was the selection corect?
							var correct = "";
							if (practiceItems[practiceCounter][1] === "positive") {
								if (selectionType === "empty") {
									correct = "incorrect"
								} else {
									correct = "correct"
								}
							} else if (practiceItems[practiceCounter][1] === "negative") {
								if (selectionType === "empty") {
									correct = "correct"
								} else {
									correct = "incorrect"
								}
							}

							//These are all of the things that should happen after sentence has ended
							function sentenceDone() {
								//calculate reaction time
								var reactionTime = endTime - startTime

								//elmo pops up behind correct plate
								if (picID === "leftPic") {
									if (correct === "correct") {
										$("#leftChar").show();
										$("#reward_player")[0].play();

									} else if (correct === "incorrect") {
										$("#rightChar").show();
										$("#wrong_player")[0].play();

									}
								} else if (picID === "rightPic") {
									if (correct === "correct") {
										$("#rightChar").show();
										$("#reward_player")[0].play();

									} else if (correct === "incorrect") {
										$("#leftChar").show();
										$("#wrong_player")[0].play();

									}
								}

								// if (correct === "correct") {
								// 	$("#star" + practiceCounter).attr("src", "images/starOn.png");
								// }
								$("#star" + practiceCounter).attr("src", "images/starOn.png");

								//results, sent to .csv using php script
								result_string = subjectID + "," + testCondition + ",Practice trial," + picID + "," + practiceCounter + "," + practiceItems[practiceCounter][0] + "," + practiceItems[practiceCounter][1] + "," + selectionType + "," + correct + "," + reactionTime + "\n";

								//increase trial counter
								practiceCounter++

								//debug mode will pop up results in an alert box. 
								//Otherwise, post results using php
								if (subjectID == "debug") {
									alert(result_string)
								} else {
									$.post("http://langcog.stanford.edu/cgi-bin/AEN/NEGPAD_kids/negpad_process.php", {
										postresult_string: result_string
									})
								}

								//move to next trial
								setTimeout(function() {
									//clear the pictures
									$("#leftPic").hide();
									$("#leftChar").hide();
									$("#centerPic").hide();
									$("#centerChar").hide();
									$("#rightPic").hide();
									$("#rightChar").hide();
									$("#listenButton").hide();
									$("#listenButton").attr("src", "images/listen.jpg");
									$("#leftPic").removeClass("selectedPic");
									$("#rightPic").removeClass("selectedPic");
									experiment.practice_blank()
								}, 2000)
							}

							//If the sentence has NOT finished yet, wait until the sentence finishes to do these things.
							if (startTime == "") {
								//Mark the time that the sentence ends
								$('#sound_player').one('ended', function() {
									startTime = (new Date()).getTime()

									//do all the things
									sentenceDone()
								})

								//If the sentence was already finished, the experiment can proceed as soon as the touchstart even occurs	
							} else {
								//do all the things
								sentenceDone()
							}
							$('.pic').off('touchstart');
						})
					}, 1870)
				}, 200)
			})
		}, 500)
	},

	start: function() {
		//Show the third instructions slide, which allows you to start the game.
		//THIS IS THE REAL DATA COLLECTION.  We do collect data on practice trials, but it won't be a part of the primary analyses.
		showSlide("instructions3")
	},

	blank: function() {
		showSlide("blankSlide")
		//reset startTime & endTime
		startTime = ""
		endTime = ""
		//Check if the trials are completed, and go to experiment.end if they are
		if (counter === number) {
			return experiment.end()
		} else {
			setTimeout(experiment.context, 1000)
		}
	},

	// MAIN DISPLAY FUNCTION
	context: function() {

		//The main "stage" where the experiment takes place.  This contains a table where stimuli images are placed.
		showSlide("stage")

		//Determine which context pictures will be used.  
		var contextPictures
		if (testCondition == "noContext") {
			contextPictures = "empty"
		} else if (testCondition == "context") {
			contextPictures = items[counter][0]
		}

		//update button displays
		$("#listenButton").hide();
		$("#leftPic").show();
		$("#centerPic").show();
		$("#rightPic").show();
		
		//Place the context images in the table
		//HTML for the object on the left
		var leftname = "images/" + contextPictures + ".png";
		$("#leftPic").attr("src", leftname);

		//HTML for the object in the center
		var centername = "images/" + contextPictures + ".png";
		$("#centerPic").attr("src", centername)

		//HTML for the object on the right
		var rightname = "images/" + contextPictures + ".png";
		$("#rightPic").attr("src", rightname)


		//create characters
		characters = shuffle(characters);

		var leftCharName = "images/" + characters[0] + ".png";
		$("#leftChar").attr("src", leftCharName);
		var centerCharName = "images/" + characters[1] + ".png";
		$("#centerChar").attr("src", centerCharName);
		var rightCharName = "images/" + characters[2] + ".png";
		$("#rightChar").attr("src", rightCharName);

		//This is a counter that tells us when all context images have been clicked
		var ccounter = 0
		var ctotal = 3

		//When images are clicked, replace with new images and play the "bloop" noise
		$('.pic').one('touchstart', function(event) {
			var cpicID = $(event.currentTarget).attr('id')
			$("#bloop_player")[0].play()
			if (cpicID == "leftPic") {
				$("#leftChar").show()
			} else if (cpicID == "centerPic") {
				$("#centerChar").show()
			} else if (cpicID == "rightPic") {
				$("#rightChar").show()
			}
			ccounter++
			//Once all context pictures have been clicked, start the test trial
			if (ccounter === ctotal) {
				setTimeout(function() {
					$("#leftPic").hide();
					$("#leftChar").hide();
					$("#centerPic").hide();
					$("#centerChar").hide();
					$("#rightPic").hide();
					$("#rightChar").hide();
					experiment.next()
				}, 1000)
			}
		})
	},

	next: function() {
		setTimeout(function() {			
			//This determines the placement of the pictures, depending on the order counterbalancing (Item left or Item right)
			var trialPictures = ""
			if (order[counter] == "itemL") {
				trialPictures = [items[counter][0], "empty"]
			} else if (order[counter] == "itemR") {
				trialPictures = ["empty", items[counter][0]]
			}

			//Place images

			var leftname = "images/" + trialPictures[0] + ".png";
			$("#leftPic").attr("src", leftname);
			$("#leftPic").show();

			//HTML for the object on the right
			var rightname = "images/" + trialPictures[1] + ".png";
			$("#rightPic").attr("src", rightname)
			$("#rightPic").show();

			//show listen button
			$("#listenButton").show();

			//new version of objects to show when sentence has ended

			$("#leftChar").attr("src", "images/elmo.png");
			$("#rightChar").attr("src", "images/elmo.png");

			//place holder for sound
			var targetSentence = 'sentences/target_sentences/' + items[counter][0] + '_' + items[counter][1] + '.mp3';
			$("#sound_player")[0].src = targetSentence

			//When button is touchstartped, play sentence
			$('#listenButton').one('touchstart', function() {

				//load sound
				$("#sound_player")[0].load()

				//change listen button image
				$('#listenButton').attr("src", "images/listening.jpg")

				setTimeout(function() {
					$("#sound_player")[0].play()

					//if sentence ends before choice is made, mark the time that the sentence ended
					$('#sound_player').one('ended', function() {
						startTime = (new Date()).getTime()
					});

					//wait until "Elmo's plate has..." to allow touchstart event (1870 ms)
					setTimeout(function() {
						$('.pic').on('touchstart', function(event) {

							//these things should happen regardless of whether the sentence has ended:

							//mark the time at which the touchstart event occurred
							endTime = (new Date()).getTime()
							$(this).addClass('selectedPic')
							var picID = $(this).attr('id');

							//what picture was selected?
							var selectionType = "";
							if (picID === "leftPic") {
								selectionType = trialPictures[0]
							} else if (picID === "rightPic") {
								selectionType = trialPictures[1]
							}

							//was the selection corect?
							var correct = "";
							if (items[counter][1] === "positive") {
								if (selectionType === "empty") {
									correct = "incorrect"
								} else {
									correct = "correct"
								}
							} else if (items[counter][1] === "negative") {
								if (selectionType === "empty") {
									correct = "correct"
								} else {
									correct = "incorrect"
								}
							}

							//These are all of the things that should happen after sentence has ended
							function sentenceDone() {
								//calculate reaction time
								var reactionTime = endTime - startTime

								//elmo pops up behind correct plate
								if (picID === "leftPic") {
									if (correct === "correct") {
										$("#leftChar").show();
										$("#reward_player")[0].play();

									} else if (correct === "incorrect") {
										$("#rightChar").show();
										$("#wrong_player")[0].play();

									}
								} else if (picID === "rightPic") {
									if (correct === "correct") {
										$("#rightChar").show();
										$("#reward_player")[0].play();

									} else if (correct === "incorrect") {
										$("#leftChar").show();
										$("#wrong_player")[0].play();

									}
								}

								// if (correct === "correct") {
								// 	$("#star" + counter).attr("src", "images/starOn.png");
								// }
								$("#star" + counter).attr("src", "images/starOn.png");

								//results, sent to .csv using php script
								result_string = subjectID + "," + testCondition + ",Test trial," + picID + "," + counter + "," + items[counter][0] + "," + items[counter][1] + "," + selectionType + "," + correct + "," + reactionTime + "\n";

								//increase trial counter
								counter++

								//debug mode will pop up results in an alert box. 
								//Otherwise, post results using php
								if (subjectID == "debug") {
									alert(result_string)
								} else {
									$.post("http://langcog.stanford.edu/cgi-bin/AEN/NEGPAD_kids/negpad_process.php", {
										postresult_string: result_string
									})
								}

								//move to next trial
								setTimeout(function() {
									//clear the pictures
									$("#leftPic").hide();
									$("#leftChar").hide();
									$("#centerPic").hide();
									$("#centerChar").hide();
									$("#rightPic").hide();
									$("#rightChar").hide();
									$("#listenButton").hide();
									$("#listenButton").attr("src", "images/listen.jpg");
									$("#leftPic").removeClass("selectedPic");
									$("#rightPic").removeClass("selectedPic");
									experiment.blank()
								}, 2000)
							}

							//If the sentence has NOT finished yet, wait until the sentence finishes to do these things.
							if (startTime == "") {
								//Mark the time that the sentence ends
								$('#sound_player').one('ended', function() {
									startTime = (new Date()).getTime()

									//do all the things
									sentenceDone()
								})

								//If the sentence was already finished, the experiment can proceed as soon as the touchstart even occurs	
							} else {
								//do all the things
								sentenceDone()
							}
							$('.pic').off('touchstart');
						})
					}, 1870)
				}, 200)
			})
		}, 500)
	},

	end: function() {
		showSlide("finished");
	},

}