
// GAME LOGIC HERE
let analyze = function() {

    // LIST OF POSSIBLE WINNING PATTERNS TO CHECK AGAINST ON checkStatus()
    const winningPatterns = [
        [[0, 0], [0, 1], [0, 2]], // Horizontal wins
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], // Vertical wins
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], // Diagonal wins
        [[0, 2], [1, 1], [2, 0]]
    ];

    let checkStatus = function(gameBoard) {
        for (let pat of winningPatterns) {
            // Destructure to compare
            const [[first, first1], [second, second1], [third, third1]] = pat;
    
            if (
                gameBoard[first][first1] !== null &&
                gameBoard[first][first1] === gameBoard[second][second1] &&
                gameBoard[first][first1] === gameBoard[third][third1]
            ) {
                let player;
                gameBoard[first][first1] == playerX ? player = "X" : player = "O"
                console.log(`Player ${player} wins!`)
                return true;
            } 
        } if(!gameBoard.flat().some(item => item === null)) {
            console.log("It is a tie!")
            return true;
        }
        return false;
    } 

    return {
        checkStatus
    }
}()


/* SVG ICONS */
let playerX = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="yellow" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
let playerO = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#FF6103" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>`;
/* -----------*/

// MANIPULATE BOARD HERE
let board = function() {
    let gameBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    let count = 1;
    let move = function(index, index2) {
        if(gameBoard[index][index2] == null) {
            let player;
            count % 2 == 0 ? (player = playerO) : (player = playerX);
            gameBoard[index][index2] = player;
            count++;

            if(analyze.checkStatus(gameBoard) === true) {
                pageUpdate.playerWin(player);
            }
            return player;
            
        } else {
            console.log("INVALID MOVE")
            return undefined
        }
    };

    let resetBoard = function() {
        console.log("Board has been reset!")
        gameBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    let getArrayCopy = function() {
        return JSON.parse(JSON.stringify(gameBoard));
    };

    return {
        move,
        getArrayCopy,
        resetBoard
    };
}();

// INTERACT WITH DOM HERE
let pageUpdate = function(){
    let handleClick = function(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        let childSvg = document.createElement("svg");
        let result = board.move(row, col);
        
        if(result !== undefined) {
            childSvg.innerHTML = result;
            square.appendChild(childSvg);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const squares = document.querySelectorAll('.square');

        squares.forEach(square => {
            square.addEventListener('click', function() {
                handleClick(square);
            });
        });
    });

    let playerWin = function() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.disabled = true;
        });
    };
    
    return {
        playerWin
    }
}();
