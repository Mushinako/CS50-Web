let welcomeDiv: HTMLDivElement;
let letterShuffleTitleDiv: HTMLDivElement;
let puzzleGetForm: HTMLFormElement;

let puzzleDiv: HTMLDivElement;

document.addEventListener("DOMContentLoaded", (): void => {
    welcomeDiv = <HTMLDivElement>byId("welcome")!;
    letterShuffleTitleDiv = <HTMLDivElement>byId("letter-shuffle-title")!;
    puzzleGetForm = <HTMLFormElement>byId("puzzle-get")!;
    puzzleDiv = <HTMLDivElement>byId("puzzle")!;
});

async function assembleTitle(titleString: string): Promise<void> {
    for (const char of titleString) {
        const div = newEl("div", ["letter-box"]);
        div.appendText(char);
        letterShuffleTitleDiv.appendChild(div);
    }
}