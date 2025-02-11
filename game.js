const setupForm = document.getElementById("setupForm");

const boardElem = document.getElementById("board");
let boardNumbers = [];
let boardMines = [];

const rowsInput = document.getElementById("rows");
const columnsInput = document.getElementById("columns");
const minesInput = document.getElementById("mines");

const output = document.getElementById("output");

let rowCount = 0;
let colCount = 0;
let mineCount = 0;
let cellsToDiscover = 0;

let gameover = false;

function setup() {
    rowCount = rowsInput.value;
    colCount = columnsInput.value;
    mineCount = minesInput.value;

    if (mineCount >= rowCount * colCount) {
        alert(`Cannot have more than ${rowCount * colCount} mines for this board size.`);
        return false;
    }

    cellsToDiscover = rowCount * colCount;

    boardElem.innerHTML = "";
    boardNumbers = [];
    boardMines = [];
    output.innerHTML = "";
    gameover = false;

    // Board loop
    for (let i = 0; i < rowCount; i++) {
        let row = boardElem.insertRow();
        boardNumbers[i] = [];
        boardMines[i] = [];
        for (let j = 0; j < colCount; j++) {
            let cell = row.insertCell();
            cell.classList.add("cellHidden");
            boardNumbers[i][j] = 0;
            boardMines[i][j] = false;
        }
    }

    let mines = minesInput.value;
    populateMines(mines);
    populateNumbers();
    setupTableEvents();
    return false;
}

function populateMines(amount) {
    let ratio = mineCount / (rowCount * colCount);

    // Board loop
    for (let i = 0; i < rowCount; i++) {
        if (amount <= 0) break;
        for (let j = 0; j < colCount; j++) {
            if (amount <= 0) break;
            if (boardMines[i][j] === true) continue; // Already populated with a bomb.
            if (ratio >= Math.random()) {
                amount--;
                boardMines[i][j] = true;
            }
        }
    }

    if (amount > 0) populateMines(amount);
}

function populateNumbers() {
    // Board loop
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (boardMines[i][j] === true) {
                boardNumbers[i][j] = "X"; // For now anyway.
                continue;
            }
            // Adjacent cells loop
            let counter = 0;
            console.log("================");
            console.log("STEP ", i, j);

            for (let k = -1; k <= 1; k++) {
                if ((i + k) < 0 || (i + k) >= rowCount) continue; // Overflow
                for (let l = -1; l <= 1; l++) {
                    if ((j + l) < 0 || (j + l) >= colCount) continue; // Overflow
                    if (k === 0 && l === 0) continue; // Skip self.
                    console.log(i + k, j + l);

                    if (boardMines[i + k][j + l] === true) counter++;
                }
            }
            boardNumbers[i][j] = counter;
        }
    }
}

function setupTableEvents() {
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            boardElem.rows.item(i).cells.item(j).addEventListener("click", () => triggerCell(i, j));
        }
    }
}

function triggerCell(x, y, force = false) {
    if (gameover && !force) return;

    const cell = boardElem.rows.item(x).cells.item(y);
    if (cell.classList.contains("cellShown")) return; // Don't trigger twice.
    triggerCellElement(cell, boardNumbers[x][y]);

    cellsToDiscover--;

    // Empty cell, trigger all adjacents.
    if (boardNumbers[x][y] === 0) {
        for (let i = -1; i <= 1; i++) {
            if ((x + i) < 0 || (x + i) >= rowCount) continue; // Overflow
            for (let j = -1; j <= 1; j++) {
                if ((y + j) < 0 || (y + j) >= colCount) continue; // Overflow
                if (i === 0 && j === 0) continue; // Skip self.
                triggerCell(x + i, y + j);
            }
        }
    }

    if (boardMines[x][y] === true && !force) return lose();
    if (cellsToDiscover - mineCount <= 0 && !gameover) return win();
}

function triggerCellElement(elem, value) {
    elem.classList.remove("cellHidden");
    elem.classList.add("cellShown");
    if (value !== 0) elem.innerHTML = value;
    switch (value) {
        case 0: break;
        case 1: elem.style.color = "#22d"; break;
        case 2: elem.style.color = "#2a2"; break;
        case 3: elem.style.color = "#e22"; break;
        case 4: elem.style.color = "#009"; break;
        case 5: elem.style.color = "#900"; break;
        case 6: elem.style.color = "#29d"; break;
        case 7: elem.style.color = "#222"; break;
        case 8: elem.style.color = "#999"; break;
    }
}

function lose() {
    gameover = true;
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (boardMines[i][j] === true) {
                triggerCell(i, j, true);
                boardElem.rows.item(i).cells.item(j).classList.add("cellBombShownLose");
            }
        }
    }
}

function win() {
    gameover = true;
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (boardMines[i][j] === true) {
                triggerCell(i, j, true);
                boardElem.rows.item(i).cells.item(j).classList.add("cellBombShownWin");
            }
        }
    }
    output.innerHTML = "<h1>You win!</h1>";
}