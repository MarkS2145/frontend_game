// debug flag - set true to enable console logs for debugging
let debug = true;  
debug ? console.log('hello world') : null;

// Game CONSTANTS

/* GRID_SIZE 
    Currently set for a 5 * 5 ...specifies # of columns/rows.
   1) We work ONLY w/ squares.  NOT currently used in setup of grid.
   2) Used for error bounds checking of head position within grid
*/
const GRID_SIZE = 5; 


// Game Global Variables
let gEvent; // used to save off events for code development
let allCells;  // Used to store All cell NodeLists from our grid
let head; // keep track of head position
let statusMsg; // status msg Used for outputting the results of the game

let playAgainButton;// For now I will keep the button, but expect to lose it.  ENTER to start

let moves = [];

debug ? console.log(allCells) : null;




// Used to keep track of score and then test for a winner
let gameWinner ;
let row= [ 0, 0, 0 ]; // ROW ORDER 1, 2, 3, Top to bottom.
let col = [ 0, 0, 0]; // ROW ORDER 1, 2, 3, Top to bottom.
let diag = [ 0, 0 ]; // Diaginal ORDER 1, Top left to bottom right, 2 top right to bottom left

// Use variable to count number of valid moves so we can test
// if we have  draw and stop the game
let gValidMove = 0;

//

//setup() - 1) set bgColor so we can test it.  2) Add click event to grid
function setUp () {
    //Get the grid from the
    if ( allCells == null ) {
        
        debug ? console.log("setup allCells and events") : null ;

        // Set up event listener for Keyboard input
        document.addEventListener('keydown', keyDown);

        //Get all cells from DOM
        allCells = document.querySelectorAll('.cell');

        playAgainButton = document.querySelector('button');
        
        statusMsg = document.querySelector('h3');

        // Add click event for playing
        playAgainButton.addEventListener('click', playAgain);

        // set up keyboard input from document as a whole
        const input = document.querySelector('input');
        const log = document.getElementById('values');
    }
    
    head = null;
    
}

// KeyDown identifies the arrow keys for us which will direct snake
function keyDown(event) {
    
    debug ? console.log(event) : null ;
    debug ? console.log("KeyCode:" + event.keyCode) : null ;
    debug ? console.log("Head value: " + head) : null;
    
    // Game starts
    if (head == null) {
        allCells[12].classList.add('snake');
        head = parseInt(allCells[12].id);
    }


    // Update snake head location
    try {
        switch ( event.keyCode) {
            case 37 : 
                console.log("Left Arrow"); 
                allCells[head].classList.remove('snake');
                head = head - 1;
                allCells[head].classList.add('snake');
                break;
            case 38 : 
                console.log("Up Arrow");
                allCells[head].classList.remove('snake');
                head = head - 5;
                allCells[head].classList.add('snake');
                break;
            case 39 : 
                console.log("Right Arrow"); 
                allCells[head].classList.remove('snake');
                head = head + 1;
                allCells[head].classList.add('snake');
                break;
    
            case 40 : 
                console.log("Down Arrow"); 
                allCells[head].classList.remove('snake');
                head = head + 5;
                allCells[head].classList.add('snake');
                break;
        }

    } // end of try
    catch {
        console.log("You're dead!")
        summary("You're dead!")
    }
    

}



// Change color of grid cell when allowed, else msg.  Check for winner()
function boxClicked(e) {
    
    debug ? console.log(e) : null ;
    
    if (e.target.id != '' ) {

        debug ? console.log("click ID: " + e.target.id + " bgColor: " + grid.children[e.target.id].style.backgroundColor ) : null ;

        // grid.children[e.target.id].style.background = 'red';
        if (grid.children[e.target.id].style.backgroundColor == 'lightgray') {
            // We have a valid move, update counter
            gValidMove++;
            // Toggle the player color each turn, only when a valid move is made
            grid.children[e.target.id].style.backgroundColor = playerColor;
            
            if (playerColor == 'red') {
                grid.children[e.target.id].innerText = -1;
                grid.children[e.target.id].style.color = 'red';
                playerColor = 'blue' ;
                message.innerText = playerColor + " move" ;
                //Call to check win()
                updateScore(e.target.id, -1);
            }
            else if ( playerColor == 'blue' ) {
                grid.children[e.target.id].innerText = 1;
                grid.children[e.target.id].style.color = 'blue';
                playerColor = 'red' ;
                message.innerText = playerColor + " move" ;
                //Call to check win()
                updateScore(e.target.id, 1 );
            }
            else {
                debug ? console.log("square taken, try again") : null ;
            }
            
            
            
        }
    }

}

// updateScore sums rows columns and diagnoals looking for an abs score of 3
//  if three is found, then the sign determines the winner
//      red is negative, blue positive
function updateScore(scoreTarget, currentValue){

    debug ? console.log("winner() called" + scoreTarget + "currentValue: " + currentValue ) : null ;
        

    switch ( scoreTarget )  {
        case 'c1r1' : 
        col[0] += currentValue; row[0] += currentValue;  diag[0] += currentValue; break;
        case 'c1r2' : 
        col[0] += currentValue; row[1] += currentValue;  break;
        case 'c1r3' : 
        col[0] += currentValue; row[2] += currentValue;  diag[1] += currentValue; break;
        case 'c2r1' : 
        col[1] += currentValue; row[0] += currentValue;  break;
        case 'c2r2' : 
        col[1] += currentValue; row[1] += currentValue;  diag[0] += currentValue; diag[1] += currentValue; break;
        case 'c2r3' : 
        col[1] += currentValue; row[2] += currentValue;  break;
        case 'c3r1' : 
        col[2] += currentValue; row[0] += currentValue;  diag[1] += currentValue; break;
        case 'c3r2' : 
        col[2] += currentValue; row[1] += currentValue;  break;
        case 'c3r3' : 
        col[2] += currentValue; row[2] += currentValue;  diag[0] += currentValue; break;
        
    }
    //}
    debug ? console.log("row: " + row + "col: " + col + "diag: " + diag) : null ;

    checkForWinner(row, col, diag);  // Pass in arrays

} // end of updateScore()

// checkForWinner() holds the winning combinations to check against
function checkForWinner(row, col, diag) {

   
    winmsg = "Winner! Congratulations ";


    for ( let i = 0 ; i < 3 ; i++ ) {

        if ( Math.abs(row[i]) == 3 ) {
            // We have a winner
            gameWinner = row[i];
        }
        if ( Math.abs(col[i]) == 3 ) {
           // We have a winner
           gameWinner = col[i];
       }
       if ( i < 2) {
           if ( Math.abs(diag[i]) == 3 ) {
               // We have a winner
               gameWinner = diag[i];
           } 
       }
   }
      
    if( gameWinner < -2) {
           // Red wins
           summary(winmsg + "Red") ;
        }
    else if( gameWinner > 2) {
            // else if blue wins
            summary(winmsg + "Blue") ;
        }
    else if ( gValidMove >= 9 ) {
            // Must be a tie if we have got here.  
            // Stop game and ask to play again
            summary("Ahh, tied game!") ;
        }

}

//summary() provides a summary fo gameplay outcome and resets variables
function summary(msg) {

    debug ? console.log("Summary called by" + msg) : null ;

   
    // Update status
    statusMsg.innerText = msg;

    //Display play again button
    playAgainButton.style.display = "";

    //Reset values ready for the next game

    
}

//playAgain() Sam is called by teh event click on the button to strat a new game
function playAgain() {
    //call setup to restore default grid
    setUp();
    statusMsg.innerText = "Hit any key to start"
}


// Let's run the game
setUp();