// Initialize Firebase
var whoAmI = "";
var buttonSet = false;
var players = {

    name: "",
    loss: 0,
    wins: 0,
    selection: ""

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

database.ref().on("value", function(snapshot) {

//Final Review and Game Reset

if(snapshot.val().gameProgress.turn ===3 )
{
	    database.ref().child("/gameProgress/").update({

        turn:0

    });

	var player1Choice = snapshot.val().players.player1.selection;
	var player2Choice = snapshot.val().players.player2.selection;

	console.log("Player1" + player1Choice + "Player2" + player2Choice + " Selected!");

	if(player1Choice === player2Choice) {
		$("#gameResultPanel").append("<h1> TIE !!</h1>");

	} else if(player1Choice==="Rock" && player2Choice==="Scissors") {

		setupWin("player1",snapshot);

	} else if(player1Choice==="Rock" && player2Choice==="Paper") {

		setupWin("player2",snapshot);

	} else if(player1Choice==="Paper" && player2Choice==="Rock") {

		setupWin("player1",snapshot);

	} else if(player1Choice==="Paper" && player2Choice==="Scissors") {

		setupWin("player2",snapshot);

	} else if(player1Choice==="Scissors" && player2Choice==="Paper") {

		setupWin("player1",snapshot);

	} else if(player1Choice==="Scissors" && player2Choice==="Rock") {

		setupWin("player2",snapshot);

	}


} else if(snapshot.val().gameProgress.turn ===4 )
{	
	$("#gameResultPanel").empty();
	$("#playercurrentChoice").remove();
	database.ref().child("/gameProgress/").update({

        turn:1

    });
}

});


function setupWin (playerId,snapshot) {
	console.log("Alright Here")
	if(playerId==="player1") 
	{
		$("#gameResultPanel").append("<h1> "+  snapshot.val().players.player1.name + "  WINS!!</h1>");
		    database.ref().child("/players/player1").update({

        wins: snapshot.val().players.player1.wins + 1

    });
		    database.ref().child("/players/player2").update({

        losses: snapshot.val().players.player2.losses + 1

    });

	}
	else
	{
		$("#gameResultPanel").append("<h1> "+  snapshot.val().players.player2.name + "  WINS!!</h1>");	
		database.ref().child("/players/player2").update({
        wins: snapshot.val().players.player2.wins + 1

    });
		    database.ref().child("/players/player1").update({

        losses: snapshot.val().players.player1.losses + 1

    });
	}
	
}

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

        } else {
        	
        }



    })

    database.ref("/gameProgress").on("value", function(snapshot) {


        if (snapshot.val().turn == 1)

        {	
        	//Clear all defaults
		
            //setup Player 1;
            console.log("My condition");
            if (whoAmI === "player1" && !buttonSet) {
                buttonSet = true;
                setupGame("player1");
            }

        } else if (snapshot.val().turn == 2 && !buttonSet) {

            //setup Player 2;
            //Clear all defaults
		
		

            if (whoAmI === "player2") {
                buttonSet = true;
                setupGame("player2");
            }
        } else if (snapshot.val().turn == 0){

        	buttonSet = false;
        	
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
        losses: 0,
        selection: ""

    });

    var presenceRef = firebase.database().ref("/players/" + playerId);
    presenceRef.onDisconnect().remove(function(err) {

    });

    var turnRef = firebase.database().ref("/gameProgress");
    turnRef.onDisconnect().update({turn:0});
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
    $("#player1Panel").append("<h1 id='playercurrentChoice'> " + buttonText + "</h1>");
        database.ref().child("/players/player1").update({

        selection: buttonText

    });

});


$("#player2Panel").on("click", "button", function() {
    console.log("Button Click from Player 1");
    
    var buttonText = $(this).text();
    $("#player2Panel .btn").remove();
    $("#player2Panel").append("<h1 id='playercurrentChoice'> " + buttonText + "</h1>");
        database.ref().child("/players/player2").update({

        selection: buttonText

    });
    
    database.ref().child("/gameProgress/").set({

        turn: 3

    });
 	
 	//Reset Game after 5 seconds

 	 	setTimeout(function(){

 		database.ref().child("/gameProgress/").set({

        turn: 4

    });

    }

 		,6000);


});

function calculateResultReset() {
	var player1Choice = "";
	var player2Choice = "";

	console.log("Calculating Result")
}