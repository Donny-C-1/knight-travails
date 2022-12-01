export default init;

function init() {
    let pos = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
    const board = document.getElementById('board');
    Knight.pos = pos;
    displayKnight(pos);

    board.addEventListener('dblclick', TravailPath);
    [...document.getElementsByClassName('tile')].forEach((elmn, index) => {
        elmn.dataset.x = index % 8;
        elmn.dataset.y = Math.floor(index * 0.125);
    });
}

const Knight = {
    element: document.getElementById('knightPiece'),
    pos: undefined,
    path: [],
    step: 0,
    status: "fixed",
    timer: null,
}

function displayKnight([x, y]) {
    Knight.element.dataset.x = x;
    Knight.element.dataset.y = y;
}

function clearTile([x, y]) {
    const element = document.getElementsByClassName('row')[y].getElementsByClassName('tile')[x];
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

function TravailPath(evt) {
    if (Knight.status === "moving") return;
    if (evt.target.classList.contains('tile') === false) return;
    clearTimeout(Knight.timer);
    resetTiles();
    const finalPos = [Number(evt.target.dataset.x), Number(evt.target.dataset.y)];
    if (Knight.pos[0] === finalPos[0] && Knight.pos[1] === finalPos[1]) {
        displayKnight(finalPos);
        return;
    }
    let path = getPath(Knight.pos, finalPos);
    Knight.path = path
    Knight.pos = finalPos;
    Knight.element.addEventListener('transitionend', move);
    Knight.status = "moving";
    move();
}

function move(evt) {
    if (evt && evt.propertyName !== "top") return;
    const step = Knight.path[Knight.step];
    const element = gE(step);
    element.dataset.step = Knight.step;
    switch (Knight.step) {
        case (Knight.path.length - 1):
            element.classList.add('end');
            break;
        default:
            element.classList.add('path');
    }
    displayKnight(step);
    Knight.step++;
    if (Knight.step < 2) move();
    if (Knight.step == Knight.path.length) {
        setTimeout(() => Knight.status = "fixed", Math.floor(evt.elapsedTime * 1000) + 100)
        Knight.element.removeEventListener('transitionend', move);
        Knight.step = 0;
        Knight.timer = setTimeout(resetTiles, 3000);
    }
    return;
}

function gE(step) {
    return document.getElementsByClassName('row')[step[1]].getElementsByClassName('tile')[step[0]];
}

function resetTiles() {
    Knight.path.forEach(step => gE(step).className = "tile");
}