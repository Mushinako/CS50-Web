let welcomeDiv: HTMLDivElement;
let letterShuffleTitleDiv: HTMLDivElement;

let puzzleDiv: HTMLDivElement;

document.addEventListener("DOMContentLoaded", (): void => {
    welcomeDiv = <HTMLDivElement>byId("welcome");
    letterShuffleTitleDiv = <HTMLDivElement>byId("letter-shuffle-title")!;
    welcomeDiv = <HTMLDivElement>byId("welcome")!;
    puzzleDiv = <HTMLDivElement>byId("puzzle")!;

    assembleTitle("LetterShuffle");
});

async function assembleTitle(titleStr: string): Promise<void> {
    const titleDiv = assemblePuzzle(titleStr);
    letterShuffleTitleDiv.appendChild(titleDiv);
}