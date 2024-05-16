const boardTable = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');

var boardArray = []; // -1 = bomb
var rows = 10;
var cols = 10;
var mines = 10;

function start() {
    createBoard();
    populateMines();
    calculateAdjacentMines();
    console.log(boardArray);
}

function reset() {
    boardArray = [];
    boardTable.innerHTML = '';
    start();
}

function revealCell(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows)
        return;

    let cell = boardTable.rows[y].cells[x];
    if (cell.textContent !== '')
        return;

    let value = boardArray[y][x];
    if (value === -1) {
        cell.textContent = 'X';
        cell.classList.add('revealed', 'bomb');
        alert('Game Over');
        return;
    } else {
        cell.textContent = value;
        cell.style.color = colours[value];
        cell.classList.add('revealed');
    }

    if (value === 0) {
        cell.classList.add('empty');
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(x + i, y + j);
            }
        }
    }

}

// Event Listeners

boardTable.addEventListener('click', function (e) {
    let cell = e.target;
    let x = cell.cellIndex;
    let y = cell.parentNode.rowIndex;
    revealCell(x, y);
});

resetBtn.addEventListener('click', function () {
    reset();
});

// Init 

function createBoard() {
    for (let i = 0; i < rows; i++) {
        const row = boardTable.insertRow();
        boardArray.push([]);
        for (let j = 0; j < cols; j++) {
            const cell = boardTable.insertCell();
            boardArray[i].push(0);
        }
        board.appendChild(row);
    }
}

function populateMines() {
    let toPopulate = mines;
    while (toPopulate > 0) {
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);
        if (boardArray[x][y] !== -1) {
            boardArray[x][y] = -1;
            toPopulate--;
        }
    }
}

function calculateAdjacentMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (boardArray[i][j] === -1)
                continue;

            let count = 0;
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (i + k >= 0 && i + k < rows && j + l >= 0 && j + l < cols) {
                        if (boardArray[i + k][j + l] === -1)
                            count++;
                    }
                }
            }
            boardArray[i][j] = count;
        }
    }
}

const colours = {
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'purple',
    5: 'maroon',
    6: 'turquoise',
    7: 'black',
    8: 'gray'
}