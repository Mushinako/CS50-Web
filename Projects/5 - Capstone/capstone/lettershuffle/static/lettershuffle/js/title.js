"use strict";
let welcomeDiv;
let letterShuffleTitleDiv;
let formForm;
let puzzleDiv;
document.addEventListener("DOMContentLoaded", () => {
    welcomeDiv = byId("welcome");
    letterShuffleTitleDiv = byId("letter-shuffle-title");
    formForm = byId("form");
    welcomeDiv = byId("welcome");
    puzzleDiv = byId("puzzle");
    assembleTitle("LetterShuffle");
});
async function assembleTitle(titleStr) {
    const titleDiv = assemblePuzzle(titleStr);
    letterShuffleTitleDiv.appendChild(titleDiv);
}
