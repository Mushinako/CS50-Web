"use strict";
let welcomeDiv;
let letterShuffleTitleDiv;
let puzzleGetForm;
let puzzleDiv;
document.addEventListener("DOMContentLoaded", () => {
    welcomeDiv = byId("welcome");
    letterShuffleTitleDiv = byId("letter-shuffle-title");
    puzzleGetForm = byId("puzzle-get");
    puzzleDiv = byId("puzzle");
});
async function assembleTitle(titleString) {
    for (const char of titleString) {
        const div = newEl("div", ["letter-box"]);
        div.appendText(char);
        letterShuffleTitleDiv.appendChild(div);
    }
}
