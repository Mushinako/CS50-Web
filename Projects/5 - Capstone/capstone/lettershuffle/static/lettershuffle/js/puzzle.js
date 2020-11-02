"use strict";
let offsetX = 0;
let offsetY = 0;
const ghostNode = newEl("div", ["letter-box", "ghost"]);
/**
 * Assemble the puzzle given the problem string
 * @param {string} puzzle    - The puzzle string
 * @returns {HTMLDivElement} - The div containing all the letters
 */
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
            ev.dataTransfer.setData("text", div.id);
            offsetX = ev.offsetX;
            offsetY = ev.offsetY;
            div.classList.add("dragged");
        });
    });
    addDrop(parentDiv);
    return parentDiv;
}
/**
 * Make an element a drop receptor
 * @param {HTMLElement} el - The element to which to add
 */
function addDrop(el) {
    // ondrop
    el.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("text");
        const node = byId(id);
        el.removeChild(ghostNode);
        putDropDiv(ev, el, node);
        node.classList.remove("dragged");
    });
    // ondragover
    el.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        putDropDiv(ev, el, ghostNode);
    });
    // ondragleave
    el.addEventListener("dragleave", (ev) => {
        ev.preventDefault();
        if (ghostNode.parentNode === el) {
            el.removeChild(ghostNode);
        }
    });
}
function putDropDiv(ev, el, childEl) {
    const dropLeft = ev.clientX - offsetX;
    const dropTop = ev.clientY - offsetY;
    // el.removeChild(childEl);
    const children = [...el.childNodes].filter((val) => !val.classList.contains("ghost"));
    if (children.length === 0) {
        el.appendChild(childEl);
        return;
    }
    const divPositions = children.map((val) => val.getBoundingClientRect());
    // Rows
    const divPositionRows = [...new Set(divPositions.map((val) => val.top))];
    const divPositionClosestRow = closestInArray(divPositionRows, dropTop);
    // Columns
    const divPositionCols = divPositions.filter((val) => val.top === divPositionClosestRow).map((val) => val.left);
    const divPositionNextCol = smallestElementAfter(divPositionCols, dropLeft);
    if (divPositionNextCol === null) {
        const divPositionNextRow = smallestElementAfter(divPositionRows, divPositionClosestRow);
        if (divPositionClosestRow === null) {
            // After last row; append to last
            el.appendChild(childEl);
        }
        else {
            // After some row; append to the front of next row
            const divPositionNextRowCols = divPositions.filter((val) => val.top === divPositionNextRow).map((val) => val.left);
            const divPositionNextRowFirstCol = Math.min(...divPositionNextRowCols);
            let divAfter = undefined;
            for (const div of children) {
                const position = div.getBoundingClientRect();
                if (position.left === divPositionNextRowFirstCol && position.top === divPositionNextRow) {
                    divAfter = div;
                    break;
                }
            }
            if (divAfter === undefined) {
                console.error(`No matching div ${[divPositionNextRow, divPositionNextRowFirstCol]} in ${divPositions}`);
                return;
            }
            el.insertBefore(childEl, divAfter);
        }
    }
    else {
        // In the same row
        let divAfter = undefined;
        for (const div of children) {
            const position = div.getBoundingClientRect();
            if (position.left === divPositionNextCol && position.top === divPositionClosestRow) {
                divAfter = div;
                break;
            }
        }
        if (divAfter === undefined) {
            console.error(`No matching div ${[divPositionClosestRow, divPositionNextCol]} in ${divPositions}`);
            return;
        }
        el.insertBefore(childEl, divAfter);
    }
}
