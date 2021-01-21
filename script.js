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
/*
    HEADING_direction consts are used for boundary checking to ensure snake stays within bounds.
    as teh GRID_SIZE determines number of rows/columns heading left or right ina  row is one step.
    Theirfore, 
        HEADING_RIGHT = +1, HEADING_LEFT = -1;
        heading Up or Down is jumping rows so your offset is the grid size.
        HEADING_UP = -GRID_SIZE, HEADING_DOWN = GRID_SIZE;
*/
const HEADING_RIGHT = 1, HEADING_LEFT = -1;
const HEADING_UP = -GRID_SIZE, HEADING_DOWN = GRID_SIZE;

console.log( `Heading Up ${HEADING_UP} down ${HEADING_DOWN}`);



// Game Global Variables
let gEvent; // used to save off events for code development
let allCells;  // Used to store All cell NodeLists from our grid
let head; // keep track of head position
let statusMsg; // status msg Used for outputting the results of the game

let playAgainButton;// For now I will keep the button, but expect to lose it.  ENTER to start

// let moves = [];

debug ? console.log(allCells) : null;




// Used to keep track of score and then test for a winner
// let gameWinner ;
// let row= [ 0, 0, 0 ]; // ROW ORDER 1, 2, 3, Top to bottom.
// let col = [ 0, 0, 0]; // ROW ORDER 1, 2, 3, Top to bottom.
// let diag = [ 0, 0 ]; // Diaginal ORDER 1, Top left to bottom right, 2 top right to bottom left

// Use variable to count number of valid moves so we can test
// if we have  draw and stop the game
// let gValidMove = 0;

//

//setup() - 1) set bgColor so we can test it.  2) Add click event to grid
function setUp () {
    //Get the grid from the
    if ( allCells == null ) {
        
        debug ? console.log("setup allCells and events") : null ;

        // Set up event listener for Keyboard input
        const input = document.querySelector('input');
        

        //Get all cells from DOM
        allCells = document.querySelectorAll('.cell');

        playAgainButton = document.querySelector('button');
        
        statusMsg = document.querySelector('h3');

        // Add click event for playing
        playAgainButton.addEventListener('click', playAgain);

        // set up keyboard input from document as a whole
        const log = document.getElementById('values');
    }

    // Set up event listener for Keyboard input
    // We will ensure it is enabled on new game play
    document.addEventListener('keydown', keyDown);
    
    
    head = null;
    
}

// KeyDown identifies the arrow keys for us which will direct snake
function keyDown(event) {
    // Save off existing head value
    let currentHead = head;

    debug ? console.log(event) : null ;
    debug ? console.log("KeyCode: " + event.keyCode) : null ;
    debug ? console.log("Current Head value: " + currentHead + "\n") : null;
    
    // Game starts
    if (head == null) {
        
        allCells[12].classList.add('snake');
        head = parseInt(allCells[12].id);
        console.log("Null head value assignment, after: " + head);
    }


    let returnValue = null;

    // Update snake head location
    try {
        switch ( event.keyCode) {
            case 37 : 
                console.log("Left Arrow"); 

                returnValue = outOfBoundsCheck(head, HEADING_LEFT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Left");
                    break;
                }

                allCells[head].classList.remove('snake');
                head = head + HEADING_LEFT;
                allCells[head].classList.add('snake');
                break;
            case 38 : 
                console.log("Up Arrow");

                returnValue = outOfBoundsCheck(head, HEADING_UP);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Up");
                    break;
                }

                allCells[head].classList.remove('snake');
                head = head + HEADING_UP;
                allCells[head].classList.add('snake');
                break;
            case 39 : 
                console.log("Right Arrow"); 

                returnValue = outOfBoundsCheck(head, HEADING_RIGHT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Right");
                    break;
                }

                allCells[head].classList.remove('snake');
                head = head + HEADING_RIGHT;
                allCells[head].classList.add('snake');
                break;
    
            case 40 : 
                console.log("Down Arrow"); 

                returnValue = outOfBoundsCheck(head, HEADING_DOWN);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Down");
                    break;
                }
                
                allCells[head].classList.remove('snake');
                head = head + HEADING_DOWN;
                allCells[head].classList.add('snake');
                break;
            default:
                console.log("Default hit in try/catch block of keydown")
        }
        debug ? console.log("New Head value: " + head) : null;     
    }// end of try
    catch (e) {
    //     console.log("Caught you.. you're dead!")
        summary("Catch:  You're dead! :Error:" + e.message )
        console.error();
    }
    

}


function outOfBoundsCheck(currentHeadLocation, direction) {

    if (direction == null ) throw new UserException( "Out of bounds check received null direction");
    if (currentHeadLocation == null ) throw new UserException( "Out of bounds check received null currentHeadLocation");
    
    /* Direction is passed in as:
        HEADING_RIGHT = +1, HEADING_LEFT = -1;
        heading Up or Down is jumping rows so your offset is the grid size.
        HEADING_UP = -GRID_SIZE, HEADING_DOWN = GRID_SIZE;
    */
   
    // Check if we are heading out of grid on the right hand side
    if ( direction == HEADING_RIGHT ) {
        for ( let i = 1, boundaryTest = 0; i <= GRID_SIZE ; i++) {

            boundaryTest = (GRID_SIZE * i) - direction;
        
            // Check we aren't currently in the last cell of the right most column and heading right
            if ( currentHeadLocation == (boundaryTest) ) { return true; }
        }
    }

    if ( direction == HEADING_LEFT ) {
        // We need to test for incrementing outside of playing grid
        for ( let i = 0, boundaryTest = 0; i < GRID_SIZE ; i++) {

            boundaryTest = (GRID_SIZE * i) + HEADING_LEFT; 
            
            // Check we aren't currently in the last cell of a row
            if ( currentHeadLocation + direction == (boundaryTest) ) { return true; }
        }
    }
    
    // Check only if we are heading off the top of the grid, negative value
    if ( direction == HEADING_UP && currentHeadLocation + direction < 0 ) { return true; }

    // Check only if we are heading off the bottom of the grid, values > gird.length
    if ( direction ==  HEADING_DOWN && currentHeadLocation + direction > (allCells.length - 1) ) { return true; }

    // All OK, go about our business
    return false

}





//summary() provides a summary of gameplay outcome and resets variables
function summary(msg) {

    debug ? console.log("Summary called by" + msg) : null ;

   
    // Update status
    statusMsg.innerText = msg;

    //Display play again button
    playAgainButton.style.display = "";

    //Reset values ready for the next game
    document.removeEventListener('keydown', keyDown);

}

//playAgain() Sam is called by teh event click on the button to strat a new game
function playAgain() {
    //call setup to restore default grid
    setUp();
    statusMsg.innerText = "Hit any key to start"
}

function UserException(message) {
    this.message = message;
    this.name = 'UserException' ;
}

// Let's run the game
setUp();