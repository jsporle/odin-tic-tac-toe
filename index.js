// Display
const DisplayController = (function() {
    const xWinsText = document.querySelector(".display-x-wins");
    const oWinsText = document.querySelector(".display-o-wins");
    const drawsText = document.querySelector(".display-match-draw");
    const statusText = document.querySelector(".display-current-state");

    let xScore = 0;
    let oScore = 0;
    let drawCount = 0;

    const updateScore = (winner) => {
        let targetElement;
        let newValue;

        if (winner === "X") {
            xScore++;
            targetElement = xWinsText;
            newValue = xScore;
        } else if (winner === "O") {
            oScore++;
            targetElement = oWinsText
            newValue = oScore;
        } else {
            drawCount++;
            targetElement = drawsText;
            newValue = drawCount;
        }

        targetElement.classList.remove("animate-score");
        void targetElement.offsetWidth;
        targetElement.classList.add("animate-score");

        setTimeout(() => {
            targetElement.textContent = newValue;
        }, 200);
    };

    const setStatus = (message) => {
        statusText.textContent = message;
    };

    return { 
        updateScore, 
        setStatus,
        resetScores: () => {
            xScore = 0;
            oScore = 0;
            drawCount = 0;
            xWinsText.textContent = "0";
            oWinsText.textContent = "0";
            drawsText.textContent = "0";
        }
    }; 
})();

// Gameboard array
const gameBoard = (function createGameboard() {
    let arrGameboard = [];
    let cellCount = 1; 
    const contGameboard = document.querySelector(".container-gameboard");

    while (cellCount < 10) {
        const gameCell = document.createElement("div");
        gameCell.classList.add("game-cell");
        gameCell.id = cellCount;
        contGameboard.appendChild(gameCell);
        arrGameboard.push(gameCell.id);
        cellCount++;
    };

    contGameboard.addEventListener("mouseover", (e) => {
        const cell = e.target.closest(".game-cell")
        if (!cell) return;
        if (cell.classList.contains("cell-taken") || (GameController.getEndOfPlay()))  return; 

        cell.style.color = "lightgray";
        cell.textContent = GameController.getCurrentPlayer();
    })

    contGameboard.addEventListener("mouseout", (e) => {
        const cell = e.target.closest(".game-cell");
        if (!cell) return;
        if (cell.classList.contains("cell-taken")) return;

        cell.textContent = ""
    })

    contGameboard.addEventListener("click", (e) => {
        const cell = e.target.closest(".game-cell");
        if (!cell) return;
        if (cell.classList.contains("cell-taken") || (GameController.getEndOfPlay())) return;

        cell.style.color = "black";
        cell.innerHTML = `<span>${GameController.getCurrentPlayer()}</span>`;
        cell.classList.add("cell-taken");
        GameController.logSelection(cell.id);

        if (!GameController.getEndOfPlay()) {
        GameController.switchPlayer();
        }
    });

    const highlightWinner = (combo) => {
        
        document.querySelector(".container-gameboard").classList.add("game-over");

        combo.forEach(id => {
            const cell = document.getElementById(id);
            const span = cell.querySelector("span");
            if (span) {
                span.classList.add("winner-animation");
                GameController.setEndOfPlay();
            };
        });
    }

    return {
        getBoard: () => arrGameboard, 
        highlightWinner,
        resetBoard: () => {
            arrGameboard.forEach(cell => cell.textContent = ""); 
        },
        clearGrid: () => {
            const cells = document.querySelectorAll(".game-cell");
            cells.forEach(cell => {
                cell.textContent = "";
                cell.classList.remove("cell-taken", "winner-animation");
            });
            document.querySelector(".container-gameboard").classList.remove("game-over");
        }
    };
})();

//Reset Panel

const ResetPanel = (function() {
    const btnReset = document.querySelector(".btn-reset-grid");
    const btnDelete = document.querySelector(".btn-reset-game");
    const allCells = document.querySelectorAll(".game-cell")
    const allCounters = document.querySelectorAll(".counter");

    
    btnReset.addEventListener("click", () => {
        gameBoard.clearGrid();
        GameController.resetLogic();
        DisplayController.setStatus("Grid reset. It's X's turn.");
    });
    
    btnReset.addEventListener("mouseenter", () => {
        allCells.forEach(cell => {
            cell.classList.add("reset-indicator")
        });
    });

    btnReset.addEventListener("mouseleave", () => {
        allCells.forEach(cell => {
            cell.classList.remove("reset-indicator")
        });
    });

    btnDelete.addEventListener("click", () => {
        DisplayController.resetScores();
        DisplayController.setStatus("Scores reset")
    })

    btnDelete.addEventListener("mouseenter", () => {
        allCounters.forEach(counter => {
            counter.classList.add("delete-indicator")
        });
    });

    btnDelete.addEventListener("mouseleave", () => {
        allCounters.forEach(counter => {
            counter.classList.remove("delete-indicator")
        });
    });




})();

//Game Controller
const GameController = (function() {
    let currentPlayer = "X"
    let xSelections = [];
    let oSelections = [];
    let endOfPlay = false;
 
    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        DisplayController.setStatus(`It's ${currentPlayer}'s turn to play`)
    };

    const winningCombos = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],        //row wins
        [1, 4, 7], [2, 5, 8], [3, 6, 9],        //column wins
        [1, 5, 9], [3, 5, 7]                    //diagonal wins
    ];

    const checkVictory = (playerSelections) => {
        const winningCombo = winningCombos.find(combo => {
            return combo.every(id => playerSelections.includes(id.toString()));
        });

        return winningCombo || null;
    };

    const logSelection = (id) => {
        const currentArray = (currentPlayer === "X") ? xSelections : oSelections;
        currentArray.push(id);

        const winningCombo = checkVictory(currentArray);

        if (winningCombo) {
            console.log(`${currentPlayer} has won!  `, winningCombo);
            DisplayController.setStatus(`${currentPlayer} won!`);
            DisplayController.updateScore(currentPlayer);
            gameBoard.highlightWinner(winningCombo);
            GameController.setEndOfPlay();
        } else if (xSelections.length + oSelections.length === 9) {
            DisplayController.setStatus("It's a draw!");
            DisplayController.updateScore("draw");
            GameController.setEndOfPlay();
        }
        
    };
    
    return { 
        logSelection, 
        getCurrentPlayer, 
        switchPlayer,
        getEndOfPlay: () => endOfPlay,
        setEndOfPlay: () => endOfPlay = true,
        resetLogic: () => {
            xSelections = [];
            oSelections = [];
            endOfPlay = false;
            currentPlayer = "X";
        },
        resetScores: () => {}
    };
})();

console.log(gameBoard.getBoard());

