function showError(errorMsg: string): void {
    console.error(errorMsg);
    alert(errorMsg);
}

function clearChildren(el: Element): void {
    while (el.lastChild) el.removeChild(el.lastChild);
}

function createElement<K extends keyof HTMLElementTagNameMap>(type: K, { text, classes }: CreateElementArgs = {}): HTMLElementTagNameMap[K] {
    const el = document.createElement(type);
    if (classes !== undefined) {
        el.classList.add(...classes);
    }
    if (text !== undefined) {
        const textNode = document.createTextNode(text);
        el.appendChild(textNode);
    }
    return el;
}

function createElementMultilineText<K extends keyof HTMLElementTagNameMap>(type: K, { text, classes }: CreateElementArgs = {}): HTMLElementTagNameMap[K] {
    const el = document.createElement(type);
    if (classes !== undefined) {
        el.classList.add(...classes);
    }
    if (text !== undefined) {
        const lines = text.split("\n");
        for (const line of lines) {
            const p = document.createElement("p");
            el.appendChild(p);
            const textNode = document.createTextNode(line);
            p.appendChild(textNode);
        }
    }
    return el;
}

function createTableRow({ rowClasses, headers, cells }: CreateTableRowArgs = {}): HTMLTableRowElement {
    const row = createElement("tr", {
        classes: rowClasses
    });
    if (headers !== undefined) {
        for (const header of headers) {
            const th = createElement("th", header);
            row.appendChild(th);
        }
    }
    if (cells !== undefined) {
        for (const cell of cells) {
            const td = createElement("td", cell);
            row.appendChild(td);
        }
    }
    return row;
}

function createSvg(paths: string[], viewBox = "0 0 16 16"): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);

    for (const p of paths) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", p);
        svg.appendChild(path);
    }

    return svg;
}
