let welcomeDiv: HTMLDivElement;
let letterShuffleTitleDiv: HTMLDivElement;
let formForm: HTMLFormElement;

let puzzleDiv: HTMLDivElement;

document.addEventListener("DOMContentLoaded", (): void => {
    welcomeDiv = <HTMLDivElement>byId("welcome");
    letterShuffleTitleDiv = <HTMLDivElement>byId("letter-shuffle-title")!;
    formForm = <HTMLFormElement>byId("form")!;
    welcomeDiv = <HTMLDivElement>byId("welcome")!;
    puzzleDiv = <HTMLDivElement>byId("puzzle")!;

    assembleTitle("LetterShuffle");
});

async function assembleTitle(titleStr: string): Promise<void> {
    const titleDiv = assemblePuzzle(titleStr);
    letterShuffleTitleDiv.appendChild(titleDiv);
}