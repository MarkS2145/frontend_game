// console.log('hello world');
let moves = [];
let allCells = document.querySelectorAll('.cell');
// console.log(allCells)
let player = 'blue';
let count = 0;
let button = document.getElementsByTagName('button')[0];
// console.log(button)
button.addEventListener('click',reset);
let turn = document.getElementsByTagName('h2')[0];
reset();
console.log(turn)


function runGame(event){  
    if (player == 'blue'){
        moves[this.id]= 'blue'
        event.target.classList.add('blue');
        player = 'red'
        turn.innerText = "Player Red's turn"
       
    }
    else if (player == 'red'){
        moves[this.id]= 'red'
        event.target.classList.add('red');
        player = 'blue';
        turn.innerText = "Player Blue's turn"
       
    }
    count += 1;
    if (count >=9){
        turn.innerText= 'game over';
    }
    checkWinner();
}

function checkWinner(){
    if (moves.length > 3) {
        if(moves[0] == moves[1] && moves[1]== moves[2]){
            // turn.innerText= `${moves[0]} is the winner!`;
            turn.innerText = moves[0] + ' is the winner';
        }
        else if (moves[3]==moves[4] && moves[3]==moves[5]){
            turn.innerText= `${moves[3]} is the winner!`;
        }
        else if (moves[6]==moves[7] && moves[6]==moves[8]){
            turn.innerText= `${moves[3]} is the winner!`;
        }
    }
}

// clear the ClassList
function reset(){
    moves = [];
    player = 'blue';
    turn.innerText = "Player Blue's turn"

    for (let i=0; i<9; i++){
        // console.log(allCells[i].classList)
        allCells[i].classList.remove('blue');
        allCells[i].classList.remove('red');
        // console.log(allCells[i].classList)
        allCells[i].addEventListener('click', runGame, {once: true})
    }
}
