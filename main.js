/* SVG ICONS */
let playerX = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
let playerO = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>`;
/* -----------*/

/* ANIMATIONS HERE */
let animate = function(){
    
    let endAnimations = function(player){
        const playerChoicesX = document.querySelectorAll('.playerX');
        const playerChoicesO = document.querySelectorAll('.playerO');
        if(player == playerO) {
            playerChoicesO.forEach(svg => {
                svg.style.animation = "jump 1s 3 ease-in-out"; // Winning jump
            });
            playerChoicesX.forEach(svg => {
                svg.style.stroke = "gray"; // Losing gray out
            });
        } else {
            playerChoicesX.forEach(svg => { 
                svg.style.animation = "jump 1s 3 ease-in-out"; // Winning jump
            });

            playerChoicesO.forEach(svg => { 
                svg.style.stroke = "gray"; // Losing gray out
            });
        }         
    };

    let tieAnimations = function() {
        const svgs = document.querySelectorAll('svg');
        svgs.forEach(svg => {
            svg.style.animation = "gray-out 2s 2"
        })
    }

    

    let headerAnimations = function() {
        const header = document.querySelector('.header');
        const headerfirst = document.querySelector('.first');
        const headersecond = document.querySelector('.second');
        const headerthird = document.querySelector('.third');

        // Disable existing animations
        header.style.animation = "none";
        headerfirst.style.animation = "none";
        headersecond.style.animation = "none";
        headerthird.style.animation = "none";

        setTimeout(() => {
            header.style.animation = "jump 1s 3"; // Apply jump animation to header
            headerfirst.style.animation = "highlight 1s 1"; // Apply highlight animation to first header element
        }, 10);
        setTimeout(() => {
            headersecond.style.animation = "highlight 1s 1"; // Apply highlight animation to second header element after a delay
        }, 1010);
        setTimeout(() => {
            headerthird.style.animation = "highlight 1s 1"; // Apply highlight animation to third header element after a delay
        }, 2010);
    };

    return {
        endAnimations,
        headerAnimations,
        tieAnimations
    };
}();

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
                if (gameBoard[first][first1] == playerX) {
                    pageUpdate.playerWin(playerX);
                    console.log(`Player X wins!`)

                } else {
                    pageUpdate.playerWin(playerO);
                    console.log(`Player O wins!`)}
                return true;
            } 
        } if(!gameBoard.flat().some(item => item === null)) {

            setTimeout(() => {
                animate.tieAnimations();
            }, 1);
            return true;
        }
        return false;
    } 

    return {
        checkStatus
    }
}()

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

            analyze.checkStatus(gameBoard)
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
        count = 1;
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

    // INPUT MOVES
    let count = 1;
    let handleClick = function(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        let childSvg = document.createElement("svg");
        count % 2 == 0 ? childSvg.classList.add('playerO') : childSvg.classList.add('playerX');

        let result = board.move(row, col);
        if(result !== undefined) {
            childSvg.innerHTML = result;
            square.appendChild(childSvg);
            count++ 
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

    // RESET BOARD CALL
    document.addEventListener('DOMContentLoaded', function() {
        const square = document.querySelector('.reset-button');
        square.addEventListener('click', function() {
                resetBoard();
            });
    });

    let resetBoard = function() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            while (square.firstChild){
                square.removeChild(square.firstChild);     
            }
        square.disabled = false;   
        })
        count = 1;
        board.resetBoard()
    }

    // DISABLE AND CALL ANIMATIONS MODULE WHEN WIN
    let playerWin = function(player) {
        const squares = document.querySelectorAll('.square');

        squares.forEach(square => {
            square.disabled = true;   
        });

        // Delay because otherwise the last input does not get the animation idk why, the class is added before the function runs aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        setTimeout(() => {animate.endAnimations(player), 200, animate.headerAnimations()});
    };

    return {
        playerWin
    }
}();
