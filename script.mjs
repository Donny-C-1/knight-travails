export default init;

function init() {
    let pos = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
    Knight.pos = pos;
    displayKnight(pos);
    // console.log(pos);
    // console.table(getNextMoves(pos));
    // console.log('Game has started');
    [...document.getElementsByClassName('tile')].forEach((elmn, index) => {
        elmn.dataset.x = index % 8;
        elmn.dataset.y = Math.floor(index * 0.125);
        elmn.addEventListener('click', moveTo)
    });
}

const Knight = {
    pos: undefined,
    path: []
}

function displayKnight([x, y]) {
    let row = document.getElementsByClassName('row')[y];
    let tile = row.getElementsByClassName('tile')[x];
    tile.innerHTML = "&#9822;";
}

function clearTile([x, y]) {
    const element = document.getElementsByClassName('row')[y].getElementsByClassName('tile')[x];
    element.innerText = "";
    element.classList.remove('path');
}


function getNextMoves([x, y]) {
    const movesArray = [];
    if (y - 2 >= 0) {
        if (x - 1 >= 0) movesArray.push([x - 1, y - 2]);
        if (x + 1 <= 7) movesArray.push([x + 1, y - 2]);
    }
    if (y + 2 <= 7) {
        if (x - 1 >= 0) movesArray.push([x - 1, y + 2]);
        if (x + 1 <= 7) movesArray.push([x + 1, y + 2]);
    }
    if (x - 2 >= 0) {
        if (y - 1 >= 0) movesArray.push([x - 2, y - 1]);
        if (y + 1 <= 7) movesArray.push([x - 2, y + 1]);
    }
    if (x + 2 <= 7) {
        if (y - 1 >= 0) movesArray.push([x + 2, y - 1]);
        if (y + 1 <= 7) movesArray.push([x + 2, y + 1]);
    }
    return movesArray;

}

function getPath([startX, starty], [endX, endY]) {
    //todo move from start pos to end pos
    const queue = [[[startX, starty]]];
    const finalPath = [];
    let currentPath;
    while (finalPath.length <= 0) {
        currentPath = queue.shift();
        let moves = getNextMoves(currentPath[currentPath.length - 1]);
        for (let pos of moves) {
            if (currentPath.find(([x, y]) => x === pos[0] && y === pos[1]) !== undefined) continue;
            let path = [...currentPath, pos];
            if (pos[0] === endX && pos[1] === endY) {
                finalPath.push(...path);
                // console.log(finalPath);
                break;
            }
            queue.push(path);
        }
    }
    return finalPath;
}

function clearPath() {
    if (Knight.path.length <= 0) return;
    for (let pos of Knight.path) {
        clearTile(pos);
    }
}

function moveTo() {
    clearPath();
    const finalPos = [Number(this.dataset.x), Number(this.dataset.y)];
    if (Knight.pos[0] === finalPos[0] && Knight.pos[1] === finalPos[1]) {
        displayKnight(finalPos);
        return;
    }
    let path = getPath(Knight.pos, finalPos);
    let index = 0;
    for (let step of path) {
        let element = document.getElementsByClassName('row')[step[1]].getElementsByClassName('tile')[step[0]];
        element.dataset.step = index;
        element.classList.add('path');
        index++;
        if (index == path.length - 1) break;
    }
    displayKnight(finalPos);
    Knight.path = path
    Knight.pos = finalPos;
}