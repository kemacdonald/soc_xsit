// Ref_complex #15
// Overview: (i) Parameters (ii) Helpers (iii) Control Flow

// ---------------- PARAMETERS ------------------

var numTrials = 12;
var pauseTime = 1500; 
var password = "Test";

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function carrier() {
	var carriers = ["f", "w", "p"]; 
	return carriers[Math.floor(Math.random()*carriers.length)] + ' ';
}

//returns the word array for trial, with 4 short words, 4 long words, and 4 fillers (with the first 2 trials guaranteed to be fillers)
makeWordList = function() {
	var short_words = [ "tupa", "gabu", "fepo", "paku", "mipa", "kiba", "tibu", "bapi"];
	var long_words =  [ "tupabugorn", "gaburatum", "fepolopus", "pakuwugnum", "mipatorun", "kibagronan", "tiburalex", "bapidokum"];

	var indices = [0, 1, 2, 3, 4, 5, 6, 7]
	indices = shuffle(indices);

	var wordList = new Array();
	for (i = 0; i < indices.length; i++) {
		if (i < 4) {
			wordList[i] = long_words[indices[i]];
		} else {	
			wordList[i] = short_words[indices[i]];
		}
	}

	wordList = wordList.concat(["dog", "bicycle"]);
	wordList = shuffle(wordList);
	//first two rounds guaranteed as fillers
  	wordList.unshift("banana", "shoe");

	return wordList;
}

function createDot(dotx, doty, i) {
	var dots = [1, 2, 3, 4, 5];

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	dot.src = "dots/dot_" + dots[i] + ".jpg";

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

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {

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
	    	document.getElementById(dotID).src = "dots/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
	    		setTimeout(function () {
	    			$("#training").hide();
	    			document.body.style.background = "black";
	    			setTimeout(function() {
						experiment.next();
					}, pauseTime*2);
				}, pauseTime);
			}
	    });	   
	},


    end: function () {
    	showSlide("finish");
    	document.body.style.background = "black";
    },

	// MAIN DISPLAY FUNCTION
  	next: function() {
  		document.body.style.background = "white";
  		//for where xxxxx should be added
  		var short_words = [ "tupa", "gabu", "fepo", "paku", "mipa", "kiba", "tibu", "bapi"];

  		//input subject ID
  		var subjectID = document.getElementById("subjectID").value;
  	
  		if (document.getElementById("pswd").value !== password) {
  			$("#checkMessage").html('<font color="red">Wrong Password</font>');
  			return;
  		}

  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}

  		//picture array set up 
  		var simple_pics = [3, 6, 13, 15, 19, 20, 22, 28, 29, 37, 44, 46, 54, 57, 59];
		var complicated_pics =  [14, 18, 23, 25, 27, 31, 32, 33, 35, 36, 38, 43, 51, 52, 53];
		simple_pics = shuffle(simple_pics);
		complicated_pics = shuffle(complicated_pics);

		var critImages = shuffle([simple_pics[0], complicated_pics[0]]);
		
		var fillerImages = [101, 102, 103, 104, 105, 106, 107, 108];

  		var wordList = makeWordList();

  		//change fillerImages to correspond to order of word list if necessary; swap pairs 105 and 106 with 107 and 108
  		if (wordList.indexOf("dog") > wordList.indexOf("bicycle")) {
  			fillerImages.splice(4,2);
  			fillerImages = fillerImages.concat([105, 106]);
  		}

   		showSlide("stage");

    	var result_string = "";
		var label_html = "";
		var objects_html = "";
		var counter = 0;
 			
	    // Create the object table (tr=table row; td= table data)
		objects_html = '<table class = "centered" ><tr><td id=word colspan="2">' + carrier() + wordList[0] + '</td></tr><tr>';;
	    
	   	//HTML for the object on the left
		leftname = "refComplex processed objects2/obj_" + fillerImages[0] + "_p2.jpg";
		objects_html += '<td align="center"><img class="pic" src="' + leftname +  '"alt="' + leftname + '" id= "leftPic"/></td>';
	
		//HTML for the object on the right
		rightname = "refComplex processed objects2/obj_" + fillerImages[1] + "_p2.jpg";
	   	objects_html += '<td align="center"><img class="pic" src="' + rightname +  '"alt="' + rightname + '" id= "rightPic"/></td>';
		
    	objects_html += '</tr></table>';
	    $("#objects").html(objects_html); 
		


	    $('.pic').bind('click', function(event) {

	    	var picID = $(event.currentTarget).attr('id');
	    	counter++;
	    	//defaults to simple object guess
	    	var guesstype = "S";
	    	if (picID === "leftPic") {

	    		if (wordList[counter-1] === "banana" || wordList[counter-1] === "bicycle") {
					result_string += subjectID + "," + counter + ",filler," + wordList[counter-1] + "," + fillerImages[0] + "," + fillerImages[1] + ",NA,NA" + ",L" + ",N";
					fillerImages.splice(0,2);
				} else if (wordList[counter-1] === "shoe" || wordList[counter-1] === "dog") {
					result_string += subjectID + "," + counter + ",filler," + wordList[counter-1] + "," + fillerImages[0] + "," + fillerImages[1] + ",NA,NA" + ",L" + ",Y";
					fillerImages.splice(0,2);
				} else {
					result_string += subjectID + "," + counter + ",critical," + wordList[counter-1] + "," + critImages[0] + "," + critImages[1]; 

					if (critImages[0] === simple_pics[counter-1]) {
						result_string += ",S,C,L,S";
					} else {
						guesstype = "C";
						result_string += ",C,S,L,C";
					}
				}
				
	    	} else if (picID === "rightPic") {

				if (wordList[counter-1] === "banana" || wordList[counter-1] === "bicycle") {
					result_string += subjectID + "," + counter + ",filler," + wordList[counter-1] + "," + fillerImages[0] + "," + fillerImages[1] + ",NA,NA" + ",R" + ",Y";
					fillerImages.splice(0,2);
				} else if (wordList[counter-1] === "shoe" || wordList[counter-1] === "dog") {
					result_string += subjectID + "," + counter + ",filler," + wordList[counter-1] + "," + fillerImages[0] + "," + fillerImages[1] + ",NA,NA" + ",R" + ",N";
					fillerImages.splice(0,2);
				} else {
					result_string += subjectID + "," + counter + ",critical," + wordList[counter-1] + "," + critImages[0] + "," + critImages[1];
				
					if (critImages[0] === simple_pics[counter-1]) {
						guesstype = "C";
						result_string += ",S,C,R,C";
					} else {
						result_string += ",C,S,R,S";
					}
				}
			}
			
			var fillerWords = ["banana", "bicycle", "shoe", "dog"];

			if (fillerWords.indexOf(wordList[counter-1]) === -1) {
				//word type
				if (wordList[counter-1].length < 5) {
					var wordtype = "Sh";
					result_string += ",S";
				} else {
					var wordtype = "L";
					result_string += ",L";
				}
				//predicted response
				if ((wordtype === "Sh" && guesstype === "S") || (wordtype === "L" && guesstype === "C")) {
					result_string += ",C,";
				} else {
					result_string += ",I,";
				}
			} else {
				result_string += ",NA,NA,"
			}

			//date and time, added to every trial
			result_string += getCurrentDate() + ",";
			result_string += getCurrentTime() + "\n";

			if (counter === numTrials) {
				$.post("http://langcog.stanford.edu/cgi-bin/MLL_refComplex/exp15process.php", {postresult_string : result_string});
				$("#stage").fadeOut();	
				experiment.end();
				return;
			}

			if (wordList[counter] === "shoe" || wordList[counter] === "dog" || wordList[counter] === "bicycle") {
				critImages = [fillerImages[0], fillerImages[1]];
			} else {
				critImages = shuffle([simple_pics[counter], complicated_pics[counter]]);
			}

			$("#stage").fadeOut();			
			setTimeout(function() {
				document.getElementById("leftPic").src = "refComplex processed objects2/obj_" + critImages[0] + "_p2.jpg";
				document.getElementById("rightPic").src = "refComplex processed objects2/obj_" + critImages[1] + "_p2.jpg";

				if (short_words.indexOf(wordList[counter]) !== -1) {
					document.getElementById("word").innerHTML = carrier() + wordList[counter] + "xxxxx";
				} else {
					document.getElementById("word").innerHTML = carrier() + wordList[counter];
				}
				$("#stage").fadeIn();
			}, pauseTime);
	    });
    },
}
		