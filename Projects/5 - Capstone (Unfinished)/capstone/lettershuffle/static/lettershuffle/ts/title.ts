let welcomeDiv: HTMLDivElement;
let letterShuffleTitleDiv: HTMLDivElement;
let formForm: HTMLFormElement;
let answerDiv: HTMLDivElement;
let submitBtn: HTMLButtonElement;

let puzzleDiv: HTMLDivElement;

document.addEventListener("DOMContentLoaded", (): void => {
    welcomeDiv = <HTMLDivElement>byId("welcome")!;
    letterShuffleTitleDiv = <HTMLDivElement>byId("letter-shuffle-title")!;
    formForm = <HTMLFormElement>byId("form")!;
    answerDiv = <HTMLDivElement>byId("answer")!;
    submitBtn = <HTMLButtonElement>byId("submit")!;
    puzzleDiv = <HTMLDivElement>byId("puzzle")!;

    assembleTitle("LetterShuffle");

    addDrop(answerDiv);

    function welcomeSubmit(ev: Event): void {
        ev.preventDefault();

        const letterDivs = [...answerDiv.childNodes];
        const answer = letterDivs.map((val: ChildNode): string => (<HTMLDivElement>val).innerText).join("");
        if (answer === "LetterShuffle".toUpperCase()) {
            markSubmitBtn("success");
            formForm.removeEventListener("submit", welcomeSubmit);
        } else {
            markSubmitBtn("failure");
        }
    }

    function answerSubmit(ev: Event): void { }

    formForm.addEventListener("submit", welcomeSubmit);
});

/**
 * Assemble the title
 * @param {string} titleStr - Title name
 */
async function assembleTitle(titleStr: string): Promise<void> {
    const titleDiv = assemblePuzzle(titleStr);
    letterShuffleTitleDiv.appendChild(titleDiv);
}
