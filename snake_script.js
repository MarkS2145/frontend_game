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
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

// Timer f() constants
const TIMER_ON = true;
const TIMER_OFF = false;
const TIMER_UPDATE = 1 ; //Seconds, will be converted to milliseconds in the timerF()
const FOOD_COUNT = 5; //S Seconds to put food out, after last food is eaten




console.log( `Heading Up ${HEADING_UP} down ${HEADING_DOWN}`);



// Game Global Variables
let gEvent; // used to save off events for code development
let gameInProgress;
let allCells;  // Used to store All cell NodeLists from our grid
let head; // keep track of head position
let previousHeading;  //used to keep track of the previous head position sow e can test for eating ourself
let statusMsg; // status msg Used for outputting the results of the game
let foodCount;

let playAgainButton;// For now I will keep the button, but expect to lose it.  ENTER to start

//Handler f() Variables
let handlerActive;  // USed to stop the impact of the timer on game updates withotu actually stopping the timer.



debug ? console.log(allCells) : null;

// //Class SnakeSegment will hold details of where our snake head and body will be
// function SnakeSegment( currentLocation, nextLocation, head = false) {
//     this.class = 'snake';
//     this.head = head;
//     this.currentLocation = currentLocation;
//     this.nextLocation = nextLocation;
// }


// New simplified appraoch should be much less prone to errors
// Add head to snake array.  Head always keeps zeroth array location.
// When we move we add new location to zerith element
// then remove the snake class from the last element and delete it
// Simples! :-)
// Define a Snake Array 
let snakeArray = [];


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

    //Clear the grid
    allCells.forEach(element => {
        element.classList.remove('snake');
        element.classList.remove('food');
        
    });

    
    
    //Reset variables back to defaults
    // head = null;
    snakeArray = [];
    // snakeArray[0] = null;
    previousHeading = null;
    foodCount = 0;
    foodOut = false; 
    eatenFoodCounter = 0;  // resets score
    foodIndex = 0; // reset counter till next food is put on grid
    gameInProgress = true;


    // start updating game play
    //Turn on game timer.
    timer(true);
    handlerActive = true; //

}

// KeyDown identifies the arrow keys for us which will direct snake
function keyDown(event) {
    // Save off existing head value
    let currentHead = head;
    let foodEaten = 0;
 
    debug ? console.log(event) : null ;
    debug ? console.log("KeyCode: " + event.keyCode) : null ;
    debug ? console.log("Current Head value: " + currentHead + "\n") : null;
    
    // Game starts
    // if (head == null) {
    if (snakeArray[0] == null) {
        
        // allCells[12].classList.add('snake');
        //head = 12;
        // console.log("Null head value assignment, after: " + head);

        snakeArray[0] = 12; // add 12 to the zeroth location

        console.log(snakeArray);
        allCells[(snakeArray[0])].classList.add('snake');

        console.log(`Snake Head started at: ${snakeArray}`);

        
    }

    

    let returnValue = null;

    // Update snake head location
    try {
        switch ( event.keyCode) {
            case LEFT_ARROW : 
                console.log("Left Arrow"); 

                // returnValue = outOfBoundsCheck(head, HEADING_LEFT);
                returnValue = outOfBoundsCheck(snakeArray[0], HEADING_LEFT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Left");
                    break;
                }

                returnValue = eatSelfCheck(HEADING_LEFT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Canibalization Left");
                    break;
                }

                //Update previousHeading for cannibalization check
                previousHeading = HEADING_LEFT;

                // Refactored updateSnakePosition code into a f()
                returnValue = updateSnakePosition( HEADING_LEFT );
                if ( returnValue ) {
                    summary("Death by Canibalization body");
                    break;
                }
                
                //allCells[snakeArray[0]].classList.add('snake');
                snakeArray.forEach( (element)=>allCells[element].classList.add('snake'))
                
                foodEaten = checkForFood(allCells[ (snakeArray[0]) ]);
                break;
            case UP_ARROW : 
                console.log("Up Arrow");

                // returnValue = outOfBoundsCheck(head, HEADING_UP);
                returnValue = outOfBoundsCheck( (snakeArray[0]) , HEADING_UP);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Up");
                    break;
                }

                returnValue = eatSelfCheck(HEADING_UP);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Canibalization Up");
                    break;
                }

                previousHeading = HEADING_UP;

                returnValue = updateSnakePosition( HEADING_UP );
                if ( returnValue ) {
                    summary("Death by Canibalization body");
                    break;
                }
                
                // foodEaten = checkForFood(allCells[head]);
                foodEaten = checkForFood(allCells[ (snakeArray[0]) ]);
                break;
            case RIGHT_ARROW : 
                console.log("Right Arrow"); 

                // returnValue = outOfBoundsCheck(head, HEADING_RIGHT);
                returnValue = outOfBoundsCheck((snakeArray[0]), HEADING_RIGHT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Right");
                    break;
                }

                returnValue = eatSelfCheck(HEADING_RIGHT);

                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Canibalization Right");
                    break;
                }

                previousHeading = HEADING_RIGHT;

                returnValue = updateSnakePosition( HEADING_RIGHT );
                if ( returnValue ) {
                    summary("Death by Canibalization body");
                    break;
                }

                foodEaten = checkForFood(allCells[ (snakeArray[0]) ] );
                break;
    
            case DOWN_ARROW : 
                console.log("Down Arrow"); 

                // returnValue = outOfBoundsCheck(head, HEADING_DOWN);
                returnValue = outOfBoundsCheck(  (snakeArray[0])  , HEADING_DOWN);
                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Out of Bounds Down");
                    break;
                }

                returnValue = eatSelfCheck(HEADING_DOWN);
                if ( returnValue ) {
                    // we are out of bounds, call summary()
                    summary("Death by Canibalization Down");
                    break;
                }

                previousHeading = HEADING_DOWN;
                
                returnValue = updateSnakePosition( HEADING_DOWN )
                if ( returnValue ) {
                    summary("Death by Canibalization body");
                    break;
                }
                
                foodEaten = checkForFood(allCells[ (snakeArray[0]) ]);
                break;
            default:
                console.log("Default hit in try/catch block of keydown")
        }
        debug ? console.log("New Head value: " +  (snakeArray[0]) ) : null;  
        console.log("snakes eaten " + foodEaten + " pieces of food")   
    }// end of try
    catch (e) {
    //     console.log("Caught you.. you're dead!")
        summary("Catch:  You're dead! :Error:" + e.message )
        console.error();
    }
    return;

}

function updateSnakePosition( argumentHeading ) {
    // argument passed in is the keyboard arrow direction
    // This way we can generalize the function, I believe.

    // if only head then
    if ( snakeArray.length == 1) { allCells[ (snakeArray[0]) ].classList.remove('snake'); }
    else { snakeArray.forEach( (element)=>allCells[element].classList.remove('snake')) } // Snake is longer so remove last body section
    
    
    //Update snake locations
    for ( let i = (snakeArray.length - 1) ; i > 0 ; i-- ) {
        // Here we need to take last snakeArray Element and set it to the previous array value
        snakeArray[i] = snakeArray[i-1]
    }
    
    console.log("SNAKE EATING OWN BODY?: " + snakeArray.some(element => element == parseInt(snakeArray[0] + argumentHeading) ) );
    // Check if we have eaten our body
    // if ( snakeArray.find(element => (snakeArray[0] + argumentHeading) )) {
    //     return true;
    // } else { 
    if ( snakeArray.some(element => element == parseInt( snakeArray[0] + argumentHeading )) ) {
        // We have eaten ourself
        return true;
    }
    snakeArray[0] = snakeArray[0] + argumentHeading;// }
    
    //allCells[snakeArray[0]].classList.add('snake');
    snakeArray.forEach( (element)=>allCells[element].classList.add('snake'))

} // End of updateSnakePosition()


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

// Checks to see if head eats head, e.g. you can't turn back on yourself
function eatSelfCheck(newHeading) {
    //we have these cases to check

    //direction is null
    if ( newHeading == null ) throw new UserException( "eatSelfCheck received null newHeading");


    // If we reverse direction on ourselves we die, e.g. left <=> right, or up <=> down
    // previousHeading is assigned on setup and on change of direction
    if ( ( newHeading * -1) == previousHeading ) { return true }

    //If our head will touch our body


    // else, all good
    return false;

}

//summary() provides a summary of gameplay outcome and resets variables
function summary(msg) {

    //Reset values ready for the next game
    document.removeEventListener('keydown', keyDown);

    // Disable handler from updating anything
    handlerActive = false;

    debug ? console.log("Summary called by" + msg) : null ;

   
    // Update status
    statusMsg.innerText = msg;

    //Show play button
    playAgainButton.style.display = "";

    //halt timer
    timer(false);
    gameInProgress = false; // Used sow e don't restart a game in rpogress

}

//playAgain() Sam is called by the event click on the button to strat a new game
function playAgain() {
    //call setup to restore default grid ONLy if game is NOT in progress
    !gameInProgress ? ( setUp(), statusMsg.innerText = "Hit any key to start" ) : null ;
}

function UserException(message) {
    this.message = message;
    this.name = 'UserException'  ;
}


// We don't put food out until previous food is eaten
let foodOut = false;
let foodIndex = 0;
let foodLocations = [ 1, 19, 13, 17, 6, 21, 11, 5, 23, 0 ]

// Add food for the snake
function addFood() {

    // for now I will simply hard code an array of food in given locations
    // and deal with error checking later
    console.log("Food called, index: " + foodIndex)

    if ( !foodOut ) {
        // Only put out one piece of food at a time
        if (foodIndex < foodLocations.length ) {
            if (updateCounter == (FOOD_COUNT/TIMER_UPDATE) ){
                // Put food out
                allCells[ foodLocations[foodIndex] ].classList.add('food');
                foodOut = true;       
                foodIndex++;
                updateCounter = 0;
            }
        } else {
            // reset index into food location array
            foodIndex = 0;
        }

    }
    
}

let eatenFoodCounter = 0;

let gHeadLocation = null;

function checkForFood(headLocation){
    //console.group("checkForFood() called")

    gHeadLocation = headLocation;  // so we can debug

    if ( headLocation.classList[1] == 'food') {
        headLocation.classList.remove('food')
        eatenFoodCounter++;
        foodOut = false; // We have just eaten it
        updateCounter = 0;  // reset index counter so we get next food item put up
        // increase snake length
        snakeArray.splice(1, 0, parseInt(headLocation.id))
        
    }
    return eatenFoodCounter;
}
    

let timerVar;
// add Timer f() to make updates to code
function timer(state){
    // State asses in whether we are in progress or stopped
    // TIMER_ON or TIMER_OFF
    // TTIMER_UPDATE is defined in Seconds and converted to needed mSecs within f()
    console.log('timer called with state: ' + state + " and duration" + (TIMER_UPDATE * 1000) + "mSecs." );

    state ? timerVar = setInterval(updateHandler, (TIMER_UPDATE * 1000) ) : clearInterval(timerVar);

    return;
}

let updateCounter = 0;
// function to control stuff
function updateHandler() {
    updateCounter++;
    console.log("UpdateHandler is: " + handlerActive + " called from timing event: " + updateCounter );

    handlerActive ? addFood() : console.log("halted") ;
    
    return;
}


// Let's run the game
setUp(); 