let welcomeDiv: HTMLDivElement;
let puzzleDiv: HTMLDivElement;

document.addEventListener("DONContentLoaded", (): void => {
    welcomeDiv = <HTMLDivElement>byId("welcome")!;
    puzzleDiv = <HTMLDivElement>byId("puzzle")!;
});