function assemblePuzzle(puzzle: string): HTMLDivElement {
    const puzzleArr = [...puzzle.toUpperCase()];
    puzzleArr.shuffle();

    const parentDiv = newEl("div", ["letter-box-container"]);
    for (const char of puzzleArr) {
        const div = newEl("div", ["letter-box"]);
        parentDiv.appendChild(div);
        div.appendText(char);
        div.draggable = true;
    }

    return parentDiv;
}