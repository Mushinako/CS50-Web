function assemblePuzzle(puzzle: string): HTMLDivElement {
    const puzzleArr = [...puzzle.toUpperCase()];
    puzzleArr.shuffle();

    const parentDiv = newEl("div", ["letter-box-container"]);
    puzzleArr.forEach((char: string, i: number): void => {
        const div = newEl("div", ["letter-box"]);
        parentDiv.appendChild(div);
        div.appendText(char);
        div.id = `letter-${i}`;
        div.draggable = true;

        // ondragstart
        div.addEventListener("dragstart", (ev: DragEvent): void => {
            ev.dataTransfer!.setData("application/json", JSON.stringify([div.id, [ev.offsetX, ev.offsetY]]));
        });
    });

    addDrop(parentDiv);

    return parentDiv;
}

function addDrop(el: HTMLElement): void {
    // ondrop
    el.addEventListener("drop", (ev: DragEvent): void => {
        ev.preventDefault();

        const data = ev.dataTransfer!.getData("application/json");
        const [id, [offsetX, offsetY]]: [string, [number, number]] = JSON.parse(data);
        const dropLeft = ev.clientX - offsetX;
        const dropTop = ev.clientY - offsetY;
        const divPositions = [...el.childNodes].map((val: ChildNode): DOMRect => (<HTMLDivElement>val).getBoundingClientRect());
        // Rows
        const divPositionRows = [...new Set(divPositions.map((val: DOMRect): number => val.top))];
        const divPositionClosestRow = closestInArray(divPositionRows, dropTop);
        // Columns
        const divPositionCols = divPositions.filter((val: DOMRect): boolean => val.top === divPositionClosestRow).map((val: DOMRect): number => val.left);

        const node = byId(id)!;
        el.appendChild(node);
    });

    // ondragover
    el.addEventListener("dragover", (ev: DragEvent): void => {
        ev.preventDefault();
    });
}