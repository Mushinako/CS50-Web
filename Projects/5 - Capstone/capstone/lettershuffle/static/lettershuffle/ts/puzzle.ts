let offsetX = 0;
let offsetY = 0;
const ghostNode = newEl("div", ["letter-box", "ghost"]);

/**
 * Assemble the puzzle given the problem string
 * @param {string} puzzle    - The puzzle string
 * @param {boolean} shuffle  - Whether to shuffle the characters
 * @returns {HTMLDivElement} - The div containing all the letters
 */
function assemblePuzzle(puzzle: string, shuffle: boolean = true): HTMLDivElement {
    const puzzleArr = [...puzzle.toUpperCase()];
    if (shuffle) {
        puzzleArr.shuffle();
    }

    const parentDiv = newEl("div", ["letter-box-container"]);
    puzzleArr.forEach((char: string, i: number): void => {
        const div = newEl("div", ["letter-box"]);
        parentDiv.appendChild(div);
        div.appendText(char);
        div.id = `letter-${i}`;
        div.draggable = true;
        const divColor = letter2Color(char);
        div.style.backgroundColor = divColor;
        div.style.borderColor = divColor;

        // ondragstart
        div.addEventListener("dragstart", (ev: DragEvent): void => {
            ev.dataTransfer!.setData("text", div.id);
            offsetX = ev.offsetX;
            offsetY = ev.offsetY;
            div.classList.add("dragged");
        });

        // ondragend
        div.addEventListener("dragend", (): void => {
            div.classList.remove("dragged");
            ghostNode.remove();
        });
    });

    addDrop(parentDiv);

    return parentDiv;
}

/**
 * Make an element a drop receptor
 * @param {HTMLElement} el - The element to which to add
 */
function addDrop(el: HTMLElement): void {
    // ondrop
    el.addEventListener("drop", (ev: DragEvent): void => {
        ev.preventDefault();

        const id: string = ev.dataTransfer!.getData("text");
        const node = byId(id)!;
        putDropDiv(ev, el, node);
    });

    // ondragover
    el.addEventListener("dragover", (ev: DragEvent): void => {
        ev.preventDefault();

        putDropDiv(ev, el, ghostNode);
    });
}

function putDropDiv(ev: DragEvent, el: HTMLElement, childEl: HTMLElement): void {
    const dropLeft = ev.clientX - offsetX;
    const dropTop = ev.clientY - offsetY;
    // el.removeChild(childEl);
    const children = [...el.childNodes].filter((val: ChildNode): boolean => !(<HTMLElement>val).classList.contains("ghost"));
    if (children.length === 0) {
        el.appendChild(childEl);
        return;
    }
    const divPositions = children.map((val: ChildNode): DOMRect => (<HTMLDivElement>val).getBoundingClientRect());
    // Rows
    const divPositionRows = [...new Set(divPositions.map((val: DOMRect): number => val.top))];
    const ghostNodePosition = ghostNode.getBoundingClientRect();
    if (ghostNodePosition.width !== 0) {
        const maxPositionRow = Math.max(...divPositionRows);
        if (ghostNodePosition.top > maxPositionRow && Math.abs(dropTop - ghostNodePosition.top) < Math.abs(dropTop - maxPositionRow)) {
            el.appendChild(childEl);
            return;
        }
    }
    const divPositionClosestRow = closestInArray(divPositionRows, dropTop);
    // Columns
    const divPositionCols = divPositions.filter((val: DOMRect): boolean => val.top === divPositionClosestRow).map((val: DOMRect): number => val.left);
    const divPositionNextCol = smallestElementAfter(divPositionCols, dropLeft);
    if (divPositionNextCol === null) {
        const divPositionNextRow = smallestElementAfter(divPositionRows, divPositionClosestRow);
        if (divPositionNextRow === null) {
            // After last row; append to last
            el.appendChild(childEl);
        } else {
            // After some row; append to the front of next row
            const divPositionNextRowCols = divPositions.filter((val: DOMRect): boolean => val.top === divPositionNextRow).map((val: DOMRect): number => val.left);
            const divPositionNextRowFirstCol = Math.min(...divPositionNextRowCols);
            let divAfter: HTMLDivElement | undefined = undefined;
            for (const div of children) {
                const position = (<HTMLDivElement>div).getBoundingClientRect();
                if (position.left === divPositionNextRowFirstCol && position.top === divPositionNextRow) {
                    divAfter = <HTMLDivElement>div;
                    break;
                }
            }
            if (divAfter === undefined) {
                console.error(`No matching div ${[divPositionNextRow, divPositionNextRowFirstCol]} in ${divPositions}`);
                return;
            }
            el.insertBefore(childEl, divAfter);
        }
    } else {
        // In the same row
        let divAfter: HTMLDivElement | undefined = undefined;
        for (const div of children) {
            const position = (<HTMLDivElement>div).getBoundingClientRect();
            if (position.left === divPositionNextCol && position.top === divPositionClosestRow) {
                divAfter = <HTMLDivElement>div;
                break;
            }
        }
        if (divAfter === undefined) {
            console.error(`No matching div ${[divPositionClosestRow, divPositionNextCol]} in ${divPositions}`);
            return;
        }
        el.insertBefore(childEl, divAfter);
    }
}

/**
 * Convert letter to `hsl` color
 * @param {string} letter - The letter to be converted
 * @returns {string}      - CSS color string;
 */
function letter2Color(letter: string): string {
    const code = letter.toUpperCase().charCodeAt(0);
    if (code > 64 && code < 91) {
        const alphabetIndex = code - 65;
        const h = Math.ceil(alphabetIndex / 26 * 360);
        return `hsl(${h}, 80%, 40%)`;
    } else {
        return "#000000";
    }
}

/**
 * Mark submit as success/failure
 * @param {string} clsName - The class name that indicates success/failure
 */
function markSubmitBtn(clsName: string): void {
    if (submitBtn.classList.contains(clsName)) return;
    submitBtn.classList.add(clsName);
    setTimeout(() => {
        submitBtn.classList.remove(clsName);
    }, 1000);
}