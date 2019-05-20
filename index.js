/*global variables*/
var maxCardAllowed = 10;
var minCardAllowed = 3;
var question = [];
var finalAnswer = 0;
var blueColor = ["#58C9C9","#BCF3F3","#84E0E0","#36AFAF","#1A9595","#58C9C9","#BCF3F3","#84E0E0","#36AFAF","#1A9595","#84E0E0"];
var bestScore = 0;
var shownBestScore = false;
var shownBestStreak = false;
var nickname = "";
var congratsMessages = ["YAAAAY!!!", "EXCELLENT", "CORRECT", "NICE"];
var streakCount = 0;
var bestStreak = 0;
var minStreak = 5;
/*global variables*/


$(document).ready(function () {
    //show range
    
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 10,
      values: [ 0, 10 ],
      slide: function( event, ui ) {
        $( "#low" ).text( ui.values[ 0 ]);
        $( "#high" ).text( ui.values[ 1 ]);
      }
    });
     
    //show range
    $("#number").text(minCardAllowed);
    $("#showCards").attr("disabled","disabled");
    //$("#bringCards").attr("disabled","disabled");

    //get bestScore
    if(localStorage.getItem("bestScore") == null){
        localStorage.setItem("bestScore", "0");
    }else{
        bestScore = parseInt(localStorage.getItem("bestScore"));
    }
    $("#bestScore").text(bestScore);
    //end of best score
    
    //get bestStreak
    if(localStorage.getItem("bestStreak") == null){
        localStorage.setItem("bestStreak", "0");
    }else{
        bestStreak = parseInt(localStorage.getItem("bestStreak"));
    }
    $("#bestStreak").text(bestStreak);
    //end of bestStreak
    
    //get nickname
    if(localStorage.getItem("nickname") == null){
        $('#collectUserName').click();
    }else{
        nickname = localStorage.getItem("nickname");
        $("#nickname").text(nickname);
    }
    //end of get nickname
    $("#timer").text("0");
})

function saveNickName(){
    var name = $("#myNickName").val().trim();
    if(name != ""){
        localStorage.setItem("nickname", name);
        $('#collectNickName').hide();
        $("#nickname").text(name);
        $('#collectUserName').click();
    }else{
        alert("please choose nickname");
    }
}

function showSettings(){
    $(".settingsPage").slideToggle("slow");
}

function getCards(streak){
    //clear timer
    if(tm != null){
        clearInterval(tm);
        $("#timer").text("0");
       }
      
    $(".cardHolder").empty();
    //$(".cardHolder").animate({left: 0 + "%"},1000);
    var number = parseInt($("#number").text());
    var maxWidth = 150;
    var top = 4;
    var zindex = 0;
    question = [];
    for(var i = number; i > 0; i--){
        zindex = i;
        var card = $("<div class='flipCard'></div");
        var spanSign = $("<span class='cardSignSpan'></span");
        //var width = ($(".cardHolder").width() - (5 * number)) / number;
        var width = 90 / number;
        var topDim = (top * i) - 4;
        //var width = (maxWidth - (i * 10)) + 10;
        //var margin = (maxWidth-width)/2;
        if(i == 1){
            var randNum = randomNumbers();
            var span = $("<span class='cardSpan'></span");
            $(span).text(randNum);
            question.push(randNum);
            spanSign = null;
        }else{
            var randNum = randomNumbers();
            var randSign = randomSign();
            var span = $("<span class='cardSpan'></span");
            $(span).text(randNum);
            $(spanSign).text(randSign);
            question.push(randNum);
            question.push(randSign);
        }
        
        $(card).append(span);
        
        if(spanSign != null){
            $(card).append(spanSign);
        }
        
        //$(card).css({"width": width + "px", "margin-left": margin + "px", "top": top + "px", "z-index" : zindex});
        $(card).css({"top": topDim + "px", "z-index" : zindex, "width" : width + "vw", "background-color" : blueColor[i]});
        $(".cardHolder").append(card);
    }
    calculate();
}

function cardNumber(sign){
    var number = parseInt($("#number").text());
    if(sign == '-'){
        number -= 1;
        number = number < minCardAllowed ? minCardAllowed : number;
    }
    if(sign == '+'){
        number += 1;
        number = number > maxCardAllowed ? maxCardAllowed : number;
    }
    $("#number").text(number);
}

function randomNumbers(){
    //var rand = Math.floor(Math.random() * 11);
    var min = parseInt($("#low").text());
    var max = parseInt($("#high").text()) + 1;
    var rand = Math.floor(Math.random() * (max - min) + min);
    return rand;
}

function randomSign(){
    var searchParams = new URLSearchParams(window.location.search);
    var type = searchParams.get('type');
    var signs = ["+", "-", "*"];
    var rand = 0;
    if(type == "1"){
        rand = 0;
    } else if(type == "2"){
        rand = 1;
    } else if(type == "3"){
        rand = 2;
    } else if(type == "4"){
        rand = Math.floor(Math.random() * 2);
    }else{
        rand = Math.floor(Math.random() * 2);
    }
        
    return signs[rand];
}

function calculate(){
    var total = 0;
    for(var i = 0; i < question.length; i++){
        if(i % 2 != 0 && i - 1 == 0){
            var before = question[i - 1];
            var aft = (i + 1 ) > question.length ? question.length : (i + 1);
            var after = question[aft];
            total = maths(before, question[i], after);
        }else if(i % 2 != 0 && i - 1 > 0){
            var before = total;
            var aft = (i + 1 ) > question.length ? question.length : (i + 1);
            var after = question[aft];
            total = maths(total, question[i], after);
        }
    }
    createAnswers(total);
}

function maths(first, sign, second){
    var res = 0;
    if(sign == "+"){
        res = first + second;
    }else if(sign == "-"){
        res = first - second;
    }else if(sign == "*"){
        res = first * second;
    }else if(sign == "\*"){
        //res = first \ second;
    }
    return res;
}

function createAnswers(value){
    var options = [];
    options.push(value - 4);
    options.push(value - 2);
    options.push(value);
    options.push(value + 4);
    options.push(value + 2);
    var optionShuff = shuffle(options);
    $(".optionsHolder").empty();
    for(var i = 0; i < optionShuff.length; i++){
        var but = $('<button/>', {
        text: optionShuff[i], //set text 1 to 10
        id: 'option_'+i,
        class: 'answers',
        click: function () { findAnswer(this); }
        });
        var but = $("<div class='answers'></div>");
        $(but).text(optionShuff[i]);
        $(but).click(function(){
            findAnswer(this);
        })
       // var but = $("<button class='optionsButton'>" + optionShuff[i] + "</button");
        $(".optionsHolder").append(but);
    }
    //var addTop = Math.floor($("#cardHolderOutside").height()) + 40;
    //$(".congratsHolder").css("margin-top", addTop + "px");
    console.log(value);
    finalAnswer = value;
    showCards();
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var trial = 0;
var maxScore = 5;
var maxAttainable = 0;
function findAnswer(but){
    var opt = parseInt($(but).text());
    if(opt == finalAnswer){
        //alert("right");
       
        //random congrats message
        var rand = Math.floor(Math.random() * congratsMessages.length);
        var msg = congratsMessages[rand];
        $("#congratsHolderMessage").text(msg);
        $("#congratsHolderMessage").show();
        //random congrats message
        
        $(".cardHolder").removeClass("open");
        var score = maxScore - trial;
        var totscore = parseInt($("#score").text()) + score;
        $("#score").text(totscore);
        $("#currScore").text(score);
        
        //creating best score
        if(totscore > bestScore){
            //celebrate new best score
            if(!shownBestScore){
                alert("new best score");
                shownBestScore = true;
            }
            bestScore = totscore;
            localStorage.setItem("bestScore", bestScore);
           }
           
		   maxAttainable += 5;
           $("#bestScore").text(bestScore);
           $("#maxScore").text(maxAttainable);
        trial = 0;
        
        //record streak
       	streakCount += 1;
        if(streakCount > minStreak && streakCount > bestStreak){
            if(!shownBestStreak){
                alert("new best streak");
                shownBestStreak = true;
            }
            localStorage.setItem("bestStreak", streakCount);
            $("#bestStreak").text(streakCount);
        }
       
       $("#streakCount").text(streakCount);
        
        //show congrats and start again
        setTimeout(function(){
            $("#congratsHolderMessage").hide();
            getCards(true);
        },500)
        //show congrats and start again
        
    }else{
        //failed answer
        $(but).css({"background": "red", "color" : "white"});
        trial += 1;
    }
}

var secondsopener = 1000;
var timer = 0;
var tm = null;

//var seconds = parseInt($("#seconds").val());
function showCards(){
    //$(".cardHolder").css("margin-left", "");
    $(".cardHolder").animate({left: 0 + "%"},1000);
    var seconds = parseInt($("#seconds").val());
    for(var i = $(".flipCard").length; i > 0; i--){
        var w = $(".flipCard").eq(0).css("width");
        w = parseInt(w.replace("px",""));
        w += 5;
        w *= i;
        //$(".card").eq(i).css("left", w + "px");
        $(".flipCard").eq(i).animate({left: w + "px"},secondsopener);
    }
    //setTimeout(closeCards, seconds * $(".card").length);
    //closeCards();
    $(".cardHolder").addClass("open");
   
    //adjust parent height
    var h = $(".flipCard").eq(0).css("height");
    h = parseInt(h.replace("px",""));
    h+= 50;
    //$(".cardHolder").css("height", h + "px");
    
    //adjust parent height
    setTimeout(closeCards, secondsopener + 3000);
    $("#showCards").attr("disabled","disabled");
    $("#bringCards").attr("disabled","disabled");
}

function closeCards(){
    if($(".cardHolder").hasClass("open")){
        var seconds = parseInt($("#seconds").val());
        $(".flipCard").delay((seconds * $(".flipCard").length)).animate({left: "0px"},1000)
        timer = ((seconds * $(".flipCard").length) / 1000) + 1;
        tm = setInterval(countDown,1000);
    }
}


function middle(){
    var par = $(".cardHolder").width();
       var child = $(".flipCard").eq(0).width();
       var mar = (par/2)-(child/2);
        mar = (mar/par) * 100;
       //$(".cardHolder").css("margin-left", mar + "%");
    $(".cardHolder").animate({left: mar + "%"},1000, function(){
        $("#showCards").attr("disabled",false);
        $("#bringCards").attr("disabled",false);
    });
}

function countDown(){
    timer--;
   if(timer == 0){
      clearInterval(tm);
        //$("#showCards").attr("disabled",false);
        //setTimeout(middle, 4000);
       $("#showCards").attr("disabled",false);
        $("#bringCards").attr("disabled",false);
   }
    $("#timer").text(timer);
}
