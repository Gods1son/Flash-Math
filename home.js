/*global variables*/
var bestScore = 0;
var nickname ="";
var bestStreak = 0;
/*global variables*/

$(document).ready(function () {
    
    //resize button
    //var long = $(".chooseType").eq(2).outerWidth() + 20;
    //$(".chooseType").css("width", long + "px")
    
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
    
    $(".chooseType").on("click", function(){
        var data = $(this).attr("data-type");
        window.location.href = "index.html?type=" + data;
    })
    
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
        $("#myNickName").focus();
    }
}