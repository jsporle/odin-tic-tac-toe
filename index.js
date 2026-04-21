//Game Controller
const GameController = (function() {
    let currentPlayer = "X"
    let xSelections = [];
    let oSelections = [];
 
    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    };

    const winningCombos = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],        //row wins
        [1, 4, 7], [2, 5, 8], [3, 6, 9],        //column wins
        [1, 5, 9], [3, 5, 7]                    //diagonal wins
    ];

    const checkVictory = (playerSelections) => {
        return winningCombos.some (combo => {
            return combo.every(id => playerSelections.includes(id.toString()));
        })
    };

    const logSelection = (id) => {
        const currentArray = (currentPlayer === "X") ? xSelections : oSelections;
        currentArray.push(id);

        if (checkVictory(currentArray)) {
            console.log(`${currentPlayer} has won!`);
        }
        
    };

    

    
    return { logSelection, getCurrentPlayer, switchPlayer };

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
        if (cell.classList.contains("cell-taken")) return; 

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
        if (cell.classList.contains("cell-taken")) return;

        cell.style.color = "black";
        cell.textContent = GameController.getCurrentPlayer();
        cell.classList.add("cell-taken");
        GameController.logSelection(cell.id);
        GameController.switchPlayer();
    });

    return {
        getBoard: () => arrGameboard,
        resetBoard: () => {
            arrGameboard.forEach(cell => cell.textContent = ""); 
        }
    };
})();




console.log(gameBoard.getBoard());


// Display


