var challangerArray = []; //contains name of participants  
var victoryArray = []; // not in use... yet 
var bracketIDcount = 0;// used in giving each bracketDiv an unique ID
var turningPoint = 0; // an incrimented number that when it reaches its middle decresses down to starting point. 1,2,3,4,5,5,5,4,3,2,1 depending on value of rounds 
var lastColumnID;  // used to check if we should move right to left when locking a button and changing button content
var winDivDownCount = 0; // used to check when we want to create a new win Div for the winner 
// runs when site has loaded and hides divs that shouldn't be used yet
$(document).ready(function () {
    $("#nameContainer").hide();
    $("#battleContainer").hide();
});

// gets participation count 
function SubmitParticipantsCount() {
    var parNumber = $("#parCount").val(); // gets value that user has entered in textbox

    $("#parCount").val(""); // if it needs to be used again, erase previous number

    CreateNameInput(parNumber);

    $("#queryContainer").hide();
    $("#nameContainer").show();
}

// creates textfields that user inputs participants names in 
function CreateNameInput(parNum) {
    for (var i = 0; i < parNum; i++) {
        $("#nameContainer").append('<input type="text" name="Enter name here" value="" class="form-control">'); // creates and appends a textbox to container div 
    }
}

function SubmitNames() {
    // checks the value of each input that has type text and is a child of nameContainer tag
    $("#nameContainer").find('input[type=text]').each(function () { // looks for each child of container that is of type=text 
        challangerArray.push($(this).val()); // puts the value of current textfield into the array
        $(this).val(""); // sets the text of the current textfield to an empty string 
    });

    if (!isEven(challangerArray.length)) { //if the array is uneven puts an walkover text in the array to even it out 
        challangerArray.push("-------");
    }

    ShuffleArray(challangerArray); // shuffles the array

    $("#nameContainer").hide(); // hides the name input container and all text fields 
    createNewBoard(challangerArray.length); // calls function
    // createBoard(0,0);
}

function isEven(n) {
    return n % 2 == 0; // if it is even then modules will have no byproduct and returns true otherwise returns false  
}

function ShuffleArray(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array; // returns the shuffled array 
}

// sets up how the board will be created visually and per amount of participants 
function createNewBoard(participants) { // gets passed how many participants there is 
    var round; // how many rounds should be created, this value is one of following numbers: 5,7,9,11 and represents 8,16,32,64 players 
    var btnCount; // one button for each participant  
    var leftNameArr = challangerArray.splice(0, challangerArray.length / 2); // removes first half of challangerArray and puts it in leftnameArr
    var rightNameArr = challangerArray;// puts the rest of the names in rigthNameArr 
    var yArr = [50, 100, 200, 400, 800]; // holds the how much each divbox in each round should be placed vertically...             YARGHH i pirate i want to be, to trim the sails and roam the sea
    var arr; // placeholder array that is used later

    // check participants and sets values of rounds and turningpint and btnCount acording to participants
    if (participants > 4 && participants <= 8) {
        round = 5;
        turningPoint = 2;
        btnCount = 4;
    }
    if (participants > 8 && participants <= 16) {
        round = 7;
        turningPoint = 3;
        btnCount = 8;
    }
    if (participants > 16 && participants <= 32) {
        round = 9;
        turningPoint = 4;
        btnCount = 16;
    }
    if (participants > 32 && participants <= 64) {
        round = 11;
        turningPoint = 5;
        btnCount = 32;
    }
    lastColumnID = round; // since round represents how wide our tournament bracket is. we set our lastColumnID to its value 


    var j = 0; // could have as easily been i in forloop downbelow 
    var wrtName = false; // if round should have names in buttons during creation
    var s = 0; // a value that is used as an modifier in createBoardfunctions paramaters 
    var k = 0; // a reversed s value that is used as an modifier in createBoardfunctions paramaters 

    for (var i = 0; i < round; i++) {

        // s = from small to big to small
        // k = from big to small to big
        if (j < turningPoint) {
            s = (j + 1)
            k = turningPoint - j;
        } else if (j >= turningPoint + 2) { // here we have entered past the turning point and begins reversing its values 
            s = (turningPoint + turningPoint + 1) - j;
            k = turningPoint - s + 1;
        } else { // here we are att the turning point 
            s = turningPoint;
            k = 1;
        }

        // being the first iteration of loop we sets that the buttons in this round have participants name in them
        if (i === 0) {
            wrtName = true;
            arr = leftNameArr; // being first iteration we wants the names in leftNameArr in the first round column
        } else if (i === round - 1) {
            wrtName = true; // being last iteration we wants the names in rigtNameArr in the last round column
            arr = rightNameArr;
        } else {
            arr = []; // if we dont want names in buttons during creation we pass an empty array 
            wrtName = false;
        }

        createBoard(
            (220) * i, // sets the x position of each divbox that are created from this function 
            yArr[s - 1], // sets the y position of each divbox that are created from this function 
            i, // i is used as an extra number to create unique ID's for the created html elements 
            wrtName, // if true add names to buttons 
            arr, // pass array with names if wrtName is true otherwise pass empty array
            Math.pow(2, k) // passes a value that defines how many divboxes should be created, this value works by adding the power of k which begins big ands walks to small the to big again
            // 2^5=32, 2^4=16, 2^3=8, 2^2=4, 2^1=2, 2^1=2, 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32   
        );
        j++;
    }
}
/*  
function countHeats(participants) {
    var leftNameArr = challangerArray.splice(0, challangerArray.length / 2);
    var rightNameArr = challangerArray;

    var playerGameArr8 = [4, 2, 1, 2, 4];
    var playerGameArr16 = [8, 4, 2, 1, 2, 4, 8];
    var playerGameArr32 = [16, 8, 4, 2, 1, 2, 4, 8, 16];
    var playerGameArr64 = [32, 16, 8, 4, 2, 1, 2, 4, 8, 16, 32];

    var moveYarr8 = [50, 90, 90, 90, 50];
    var moveYarr16 = [50, 10, 85, 85, 85, 10, 50];
    var moveYarr32 = [50, 10, 50, 90, 90, 90, 50, 10, 50];
    var moveYarr64 = [50, 10, 50, 90, 130, 130, 130, 90, 50, 10, 50];
    //var moveYarr16 = [50,90,130,130,130,90,50];
    if (participants > 4 && participants <= 8) {

        for (var i = 0; i < 5; i++) {
            switch (i) {
                case 0:
                    createBoard((220) * i, moveYarr8[i], i, true, leftNameArr, playerGameArr8[i], 0);
                    break;
                case 4:
                    createBoard((220) * i, moveYarr8[i], i, true, rightNameArr, playerGameArr8[i], 0);
                    break;
                default:
                    createBoard((220) * i, moveYarr8[i], i, false, [], playerGameArr8[i], 0);
                    break;
            }
        }
    }
    else if (participants > 8 && participants <= 16) {
        // 7
        for (var i = 0; i < 7; i++) {
            switch (i) {
                case 0:
                    createBoard((220) * i, moveYarr16[i], i, true, leftNameArr, playerGameArr16[i], 0);
                    break;
                case 6:
                    createBoard((220) * i, moveYarr16[i], i, true, rightNameArr, playerGameArr16[i], 0);
                    break;
                default:
                    createBoard((220) * i, moveYarr16[i], i, false, [], playerGameArr16[i], 80);
                    break;
            }
        }
    }
    else if (participants > 16 && participants <= 32) {
        // 9 brackets
        for (var i = 0; i < 10; i++) {
            switch (i) {
                case 0:
                    createBoard((220) * i, moveYarr32[i], i, true, leftNameArr, playerGameArr32[i], 0);
                    break;
                case 9:
                    createBoard((220) * i, moveYarr32[i], i, true, rightNameArr, playerGameArr32[i], 0);
                    break;
                default:
                    createBoard((220) * i, moveYarr32[i], i, false, [], playerGameArr32[i], 80);
                    break;
            }
        }
    }
    else if (participants > 32 && participants <= 64) {
        // 11 brackets
        for (var i = 0; i < 11; i++) {
            switch (i) {
                case 0:
                    createBoard((220) * i, moveYarr64[i], i, true, leftNameArr, playerGameArr64[i], 0);
                    break;
                case 10:
                    createBoard((220) * i, moveYarr64[i], i, true, rightNameArr, playerGameArr64[i], 0);
                    break;
                default:
                    createBoard((220) * i, moveYarr64[i], i, false, [], playerGameArr64[i], 80);
                    break;
            }
        }
    }
}
*/
// uses to check were our mouse cordinates are when clicking anywhere on the body element 
function logCords(event) {
    var x = event.clientX;
    var y = event.clientY;
    var coords = "X coords: " + x + ", Y coords: " + y;
    console.log("X: " + x + "  Y: " + y);
}

// function that dynamicly creates the contents of the tournamnet bracket
function createBoard(x, y, a, writeName, nameArray, bracketCount) {
    var n = 10; // since we want to slice the id we need to make sure that all the ID's is two characters long 
    var k = 10; // same as above but for column ID instead 
    k += a; // increases column id 
    winDivDownCount++;

    for (var i = 0; i < bracketCount; i += 2) {
        // creates divbox with unique IDs that appends to container div 
        $("#matchHolder").append("<div id='box0" + i + "_" + a + "' class='bracketDIV' style='position:absolute; left:" + x + "; top:" + (y * (i + 1)) + "'></div> ");
        for (var j = 0; j < 2; j++) {

            var parName = nameArray[i + j]; // if there is more buttons then names in array sets a walkover string 
            if (writeName) {
                if ((i + j) >= nameArray.length) {
                    parName = "-------" // walkover string 
                }
                // if user forgets to type in an name when asked set that empty string to walkover string 
                if (nameArray[i + j] === "") {
                    parName = "-------";
                }
                // creates and fills a button with name then appends to newly created divbox 
                $("#box0" + i + "_" + a + "").append("<input id='btn0" + n + "_" + k + "' type='button' name='nameButton' class='bracketBtn btn-primary' value='" + parName + "' onclick='matchWinner(this)'>");
            }
            else if (!writeName) {
                // creates a button with no name then appends to newly created divbox 
                $("#box0" + i + "_" + a + "").append("<input id='btn0" + n + "_" + k + "' type='button' name='nameButton' class='bracketBtn btn-primary disabled' value='' onclick='matchWinner(this)'>");
                $("#btn0" + n + "_" + k + "").prop('disabled', true); // sets button in disabled state
                $("#btn0" + n + "_" + k + "").css('background-color', "#000085");
            }
            n++; // increase ID name
        }
    }
    // if we are at start of the middle create a new div that displays the winner when appropiate 
    if (winDivDownCount === turningPoint) {
        $("#matchHolder").append("<div id ='winDivBox' style='position:absolute; left:" + x + "; top:" + (y + 70) + "; width:640; height: 400; background-color: red;'></div>")
        $("#winDivBox").hide(); // hides the div as soon as it is created 
    }
}
// Oh lord does this need cleaning 
function matchWinner(btn) {

    // when user is clicking on the winner of the current match, we slice the button ID's number and by using Math.trunc(ID/2)
    // by doing we get the buttonID of the next column and so we can take the value of the currently clicked button
    // and set into the next button. for example we click button 7 in col00, Math.trunc(ID/2) gives us 7/2 = 3.5 which truncated down
    // gets us 3. and so points us to button 3 in COL01 
    //       COL00         COL01       COL02     
    //        0             0           0
    //        1             1           1
    //        2             2           2
    //        3             3
    //        4             4   
    //        5             5
    //        6     
    //        7
    //        8
    //        9
    //        10
    //        11

    var CurrentBtnID;       // the id of clicked button                                       
    var modChangeID = 0;    // used to get the id of the the other non clicked button in current match   
    var unchangedFutureColumnID;    // the column ID of the button in  the next column                                           
    var futureBtnId = btn.id.slice(4, 6);  // here we get the number part of the button id                               
    var futureColumnID = btn.id.slice(7, 9);     // here we get the number part of the buttons column id                            
    CurrentBtnID = Math.abs(futureBtnId);  // since we slice a string we need to convert it to a real number and we get this by using a Math function                        

    futureBtnId = Math.trunc((futureBtnId - 10) / 2);   // get us the next columns button id and also returns it as a real number                                                                  
    futureColumnID = Math.abs(futureColumnID);          // gets us a real number instead of string                   
    unchangedFutureColumnID = futureColumnID;

    // moves names from left to right 
    if ((futureColumnID - 10) < turningPoint) {
        futureColumnID += 1;
        futureBtnId += 10;
        $("#btn0" + futureBtnId + "_" + futureColumnID + "").val(btn.value);
    }
    // moves names from rigth to left 
    else if ((futureColumnID - 10) > turningPoint) {
        futureColumnID -= 1;
        futureBtnId += 10;
        if ((futureColumnID - 10) === turningPoint) {
            futureBtnId += 1; // makes sure that it will place the text at the lower button 
        }
        $("#btn0" + futureBtnId + "_" + futureColumnID + "").val(btn.value);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // when pressing a buttons the code below checks on what column pressed button is. And if it is not on the first or last column. 
    // it lock preceding buttons so no changes can be done 
    // it does this by first checking if clicked button is an odd or even number, if odd it goes to preceding button id, it then multiplies by two to get the previous btnId 
    // from there we loop through the next four buttons and locks them 
    // for example, we click button three in col02,  since it is odd we take button id -1 and so we get btnID 2, 2*2 = 4, so now we have the correct btnID of Col00
    // from here we loop through button 4,5,6,7 in col00 and disables them all  

    //       COL00         COL01       COL02     
    //        0             0           0
    //        1             1           1
    //        2             2           2
    //        3             3
    //        4             4   
    //        5             5
    //        6     
    //        7
    //        8
    //        9
    //        10
    //        11

    // checks if we clicked upper or lower button 
    if (isEven(CurrentBtnID)) {
        modChangeID = CurrentBtnID + 1;
    } else {
        modChangeID = CurrentBtnID - 1;
    }

    // if both buttons has a value in them then check if previous buttons should be locked 
    // checks current pressed button value                                                  //checks other button in divbox 
    if (($("#btn0" + CurrentBtnID + "_" + unchangedFutureColumnID + "").val() !== "" && ($("#btn0" + modChangeID + "_" + unchangedFutureColumnID + "").val() !== ""))) {

        // gets us the unclicked button in the same div box 
        var w = 0;
        if (isEven(futureBtnId)) {
            w = 1;
        } else {
            w = -1;
        }

        // if both buttons has a value in them, then we unlock them so we can select a winner in the next match 
        if (($("#btn0" + futureBtnId + "_" + futureColumnID + "").val() !== "") && ($("#btn0" + (futureBtnId + w) + "_" + futureColumnID + "").val() !== "")) {
            $("#btn0" + futureBtnId + "_" + futureColumnID + "").prop('disabled', false);
            $("#btn0" + (futureBtnId + w) + "_" + futureColumnID + "").prop('disabled', false);
            $("#btn0" + futureBtnId + "_" + futureColumnID + "").css('background-color', '#428bca');
            $("#btn0" + (futureBtnId + w) + "_" + futureColumnID + "").css('background-color', '#428bca');

        }

        // if pressing a button on turning point column a winner has been declared 
        if (unchangedFutureColumnID - 10 === turningPoint) {
            $("#winDivBox").show();
            $("#winDivBox").append("<h3>Congratulations " + $("#btn0" + CurrentBtnID + "_" + unchangedFutureColumnID + "").val() + " You Win !!!</h3>");
        }
        // checks left buttons should be locked 
        else if (unchangedFutureColumnID - 10 < turningPoint && unchangedFutureColumnID !== 10) {
            var f = 0;
            if (isEven(CurrentBtnID)) {
                f = 0;
            } else {
                f = 1;
            }
            // goes back one column and disables buttons there 
            unchangedFutureColumnID -= 1;
            var u = CurrentBtnID;
            u -= 10;
            // gets the preceding linked buttons id and locks the other previous four linked buttons 
            u = ((u - f) * 2) + 10;
            for (var i = 0; i < 4; i++) {
                $("#btn0" + u + "_" + unchangedFutureColumnID + "").prop('disabled', true);
                $("#btn0" + u + "_" + unchangedFutureColumnID + "").css("background-color","#000085");
                u += 1;
            }
        }
        // checks if right buttons should be locked 
        else if (unchangedFutureColumnID - 10 > turningPoint && unchangedFutureColumnID !== lastColumnID) {
            var f = 0;
            if (isEven(CurrentBtnID)) {
                f = 0;
            } else {
                f = 1;
            }
            // goes forward one column and disables buttons there
            unchangedFutureColumnID += 1;
            var u = CurrentBtnID;
            u -= 10;
            // gets the preceding linked buttons id and locks the other previous four linked buttons 
            u = ((u - f) * 2) + 10;
            for (var i = 0; i < 4; i++) {
                $("#btn0" + u + "_" + unchangedFutureColumnID + "").prop('disabled', true);
                $("#btn0" + u + "_" + unchangedFutureColumnID + "").css("background-color","#000085");
                u += 1;
            }
        }
    }
}


