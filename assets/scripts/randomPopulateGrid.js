const gridLeft = document.querySelector('.box-left');
const gridRight = document.querySelector('.box-right');


const divNumber = 100;

let randomNumbersColumn = [];
let randomNumbersRow = [];

function startColumn() {
    let max = 40;
    let min = 1;
    let randomNumber = Math.floor(Math.random() * max + min);
    return randomNumber;
}

function startRow() {
    let max = 15;
    let min = 2;
    let randomNumber = Math.floor(Math.random() * max + min);
    return randomNumber;
}

function spanColumn() {
    let max = 0;
    let min = 0;
    let randomNumber = Math.floor(Math.random() * max + min);
    return randomNumber;
}

function spanRow() {
    let max = 6;
    let min = 3;
    let randomNumber = Math.floor(Math.random() * max + min);
    return randomNumber;
}

let idDiv = 0;

function populateGrid(gridElement) {

    for (var i = 0; i < divNumber; i++) {
        let randomStartColumn = startColumn();
        let randomStartRow = startRow();


        // if (!randomNumbersColumn.includes(randomStartColumn) && !randomNumbersRow.includes(randomStartRow)) {
        // console.log(true)
        // randomNumbersColumn.push(randomStartColumn)
        // randomNumbersRow.push(randomStartRow)
        idDiv = idDiv + 1;
        let cell = document.createElement("div");
        cell.className = "random-linear-gradient";
        // cell.innerHTML = idDiv;
        cell.style.gridColumn = randomStartColumn;
        cell.style.gridRow = randomStartRow + " / span " + spanRow();

        gridElement.appendChild(cell);

        // }
        // else {
        //     i--;
        //     // console.log(false)
        // }
    }
}

populateGrid(gridLeft);
populateGrid(gridRight);