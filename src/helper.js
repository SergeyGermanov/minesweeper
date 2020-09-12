// version 0.2 (grid made with nested for loop; grid shows how many bombs around)

//create bobms array
function createArr(bombs, height, width) {
    let gridCells = height * width - bombs;
    return [...Array.from({ length: bombs }, x => '✳'), ...Array.from({ length: gridCells }, o => 0)];
}

//shuffle bombs inside array randomly
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//shuffle grid array creation
function grid(bombs = 10, height = 9, width = 9) {
    let arr = createArr(bombs, height, width);
    let shuffleArr = shuffle(arr);
    return Array.from({ length: height }, _ => Array.from({ length: width }, _ => shuffleArr.pop()));
}

//show a number of bombs around this cell
function surroundBombs(arr = grid()) {
    let result = [...arr];
    let count = 0;
    result.forEach((el, idx, arr) => el.forEach((e, i) => {
        //same row
        if (el[i + 1] === '✳') {
            count++;
        }
        if (el[i - 1] === '✳') {
            count++;
        }
        //one row down
        if (idx - 1 >= 0 && arr[idx - 1][i] === '✳') {
            count++;
        }
        if (idx - 1 >= 0 && arr[idx - 1][i + 1] === '✳') {
            count++;
        }
        if (idx - 1 >= 0 && arr[idx - 1][i - 1] === '✳') {
            count++;
        }
        //one row up
        if (idx + 1 <= arr.length - 1 && arr[idx + 1][i] === '✳') {
            count++;
        }
        if (idx + 1 <= arr.length - 1 && arr[idx + 1][i + 1] === '✳') {
            count++;
        }
        if (idx + 1 <= arr.length - 1 && arr[idx + 1][i - 1] === '✳') {
            count++;
        }
        if (result[idx][i] !== '✳') {
            result[idx][i] += count;
            count = 0;
        }
        count = 0;
    }));

    return result
}

//onject created not used yet
function objectGrid(arr) {
    return arr.map(el => el.map(e => ({
        item: e,
        isRevealed: false,
        isBomb: e === '✳',
        isBoom: false
    })));
}

function revealBombs(arr, item) {
    if (item.isBomb) {
        item.isBoom = true;
        arr.map(el => el.map(e => e.isBomb ? e.isRevealed = true : e));
    }
}

function floodReveal(newGrid, row, cell) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let y = +row + i;
            let x = +cell + j;

            if (y > -1 && y < newGrid.length - 1 && x > -1 && j < newGrid[row].length - 1) {
                let neighbor = newGrid[y][x];
                if (!neighbor.isBomb && !neighbor.isRevealed) {
                    neighbor.isRevealed = true;
                }
            }
        }
    }
}

function reveal(arr, row, cell) {
    arr[row][cell].isRevealed = true;
    if (arr[row][cell].item === 0) {
        floodReveal(arr, row, cell);
    }
}




export { surroundBombs, grid, objectGrid, revealBombs, reveal }; 