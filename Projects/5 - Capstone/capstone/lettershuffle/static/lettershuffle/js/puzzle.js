"use strict";
function assemblePuzzle(puzzle) {
    const puzzleArr = [...puzzle.toUpperCase()];
    puzzleArr.shuffle();
    const parentDiv = newEl("div", ["letter-box-container"]);
    puzzleArr.forEach((char, i) => {
        const div = newEl("div", ["letter-box"]);
        parentDiv.appendChild(div);
        div.appendText(char);
        div.id = `letter-${i}`;
        div.draggable = true;
        // ondragstart
        div.addEventListener("dragstart", (ev) => {
            ev.dataTransfer.setData("application/json", JSON.stringify([div.id, [ev.offsetX, ev.offsetY]]));
        });
    });
    addDrop(parentDiv);
    return parentDiv;
}
function addDrop(el) {
    // ondrop
    el.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("application/json");
        const [id, [offsetX, offsetY]] = JSON.parse(data);
        console.log("x:", ev.clientX - offsetX);
        console.log("y:", ev.clientY - offsetY);
        const node = byId(id);
        el.appendChild(node);
    });
    // ondragover
    el.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
}
