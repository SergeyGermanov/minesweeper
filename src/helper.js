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

function horzReveal(arrRow, cell) {
    if (typeof arrRow !== 'undefined') {
        //arr of indexes for begining and end of empty spaces
        let idxs = [];
        //push index for the right side
        arrRow.map((el, i) => (el.item > 0 && !el.isBomb && i > cell) && idxs.push(i));
        //destruct/destroy the index array and create variable with the right index
        let [rightIdx] = idxs;
        idxs.length = 0;

        //reverser array and find the left index for empty space and push it to idxs array
        arrRow.reverse().map((el, i, a) => (el.item > 0 && !el.isBomb && i > a.length - 1 - cell) && idxs.push(i));
        //reverse back to normal
        arrRow.reverse();
        //convert index to a normal not reversed
        let leftIdx = arrRow.length - 1 - (idxs[0] || arrRow.length - 1);
        //update the key of isRevealed to true for the cells surrounding the clicked one
        arrRow.map((el, i, a) => i >= (leftIdx || 0) && i <= (rightIdx || a.length - 1) ? el.isRevealed = true : el);
    }
}


export { surroundBombs, grid, objectGrid, horzReveal }; 