// Initialize Firebase
var whoAmI = "";
var buttonSet = false;
var players = {

    name: "",
    loss: 0,
    wins: 0

}
var playerList = [];
var config = {
    apiKey: "AIzaSyDSOJ-rHLSLRtlVV9CRomqZAYMK7uyA3Kc",
    authDomain: "myawesomeproject-b0c75.firebaseapp.com",
    databaseURL: "https://myawesomeproject-b0c75.firebaseio.com",
    projectId: "myawesomeproject-b0c75",
    storageBucket: "myawesomeproject-b0c75.appspot.com",
    messagingSenderId: "339452888573"
};


firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();



database.ref("/players").on("value", function(snapshot) {



    $.each(["player1", "player2"], function(index, value) {



        if (playerList.length < 2) {

            if (snapshot.child(value).exists()) {
                console.log(value + " Exists in Firebase")



                pushIfNew(snapshot.child(value).val());

                console.log(playerList);
                $("#" + value + "Selection").html(snapshot.child(value).val().name);
            } else

            {

                $("#" + value + "Selection").html("Waiting for " + value);
            }
            if (playerList.length === 2) {

                database.ref().child("/gameProgress/").set({

                    turn: 1

                });


            } else if (playerList.length === 1) {
                database.ref().child("/gameProgress/").set({

                    turn: 0

                });
            }

        }


    })

    database.ref("/gameProgress").on("value", function(snapshot) {


        if (snapshot.val().turn == 1)

        {
            //setup Player 1;
            console.log("My condition");
            if (whoAmI === "player1" && !buttonSet) {
                buttonSet = true;
                setupGame("player1");
            }

        } else if (snapshot.val().turn == 2 && !buttonSet) {
            //setup Player 2;
            if (whoAmI === "player2") {
                buttonSet = true;
                setupGame("player2");
            }
        }


    })


    function pushIfNew(obj) {
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].name === obj.name) { // modify whatever property you need
                return;
            }
        }
        playerList.push(obj);
    }


    // If any errors are experienced, log them to console.
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});


//Player Start Button Click Event
$("#PlayerStartSubmit").on("click", function() {

    if ($("#playerNameText").val() != "") {
        $(this).hide();
        $("#playerNameText").hide();
        $("#playerHeader").text("Welcome " + $("#playerNameText").val());

        //Create the player Object
        if (playerList.length == 0) {

            setPlayer("player1");
            whoAmI = "player1";

        } else {
            setPlayer("player2");
            whoAmI = "player2";
        }




    }

});


var setPlayer = function(playerId) {
    console.log("Set Player Player Id " + playerId);
    database.ref().child("/players/" + playerId).set({


        name: $("#playerNameText").val(),
        wins: 0,
        losses: 0


    });

    var presenceRef = firebase.database().ref("/players/" + playerId);
    presenceRef.onDisconnect().remove(function(err) {

    });
}

function setupGame(playerId) {

    //Create Buttons
    $.each(["Rock", "Paper", "Scissors"], function(index, value) {

        var gameButton = $("<button class='btn btn-primary'> </button>").text(value);
        console.log("Hello");
        $("#" + playerId + "Panel").append(gameButton);


    });
}

$("#player1Panel").on("click", "button", function() {
    console.log("Button Click from Player 1");
    database.ref().child("/gameProgress/").set({

        turn: 2

    });
    var buttonText = $(this).text();
    $("#player1Panel .btn").remove();
    $("#player1Panel").append("<h1> " + buttonText + "</h1>");


});


$("#player2Panel").on("click", "button", function() {
    console.log("Button Click from Player 1");
    database.ref().child("/gameProgress/").set({

        turn: 0

    });
    var buttonText = $(this).text();
    $("#player2Panel .btn").remove();
    $("#player2Panel").append("<h1> " + buttonText + "</h1>");


});