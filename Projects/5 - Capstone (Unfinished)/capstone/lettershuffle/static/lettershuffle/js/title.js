"use strict";
let welcomeDiv;
let letterShuffleTitleDiv;
let formForm;
let answerDiv;
let submitBtn;
let puzzleDiv;
document.addEventListener("DOMContentLoaded", () => {
    welcomeDiv = byId("welcome");
    letterShuffleTitleDiv = byId("letter-shuffle-title");
    formForm = byId("form");
    answerDiv = byId("answer");
    submitBtn = byId("submit");
    puzzleDiv = byId("puzzle");
    assembleTitle("LetterShuffle");
    addDrop(answerDiv);
    function welcomeSubmit(ev) {
        ev.preventDefault();
        const letterDivs = [...answerDiv.childNodes];
        const answer = letterDivs.map((val) => val.innerText).join("");
        if (answer === "LetterShuffle".toUpperCase()) {
            markSubmitBtn("success");
            formForm.removeEventListener("submit", welcomeSubmit);
        }
        else {
            markSubmitBtn("failure");
        }
    }
    function answerSubmit(ev) { }
    formForm.addEventListener("submit", welcomeSubmit);
});
/**
 * Assemble the title
 * @param {string} titleStr - Title name
 */
async function assembleTitle(titleStr) {
    const titleDiv = assemblePuzzle(titleStr);
    letterShuffleTitleDiv.appendChild(titleDiv);
}
