"use strict";
function showError(errorMsg) {
    console.error(errorMsg);
    alert(errorMsg);
}
function clearChildren(el) {
    while (el.lastChild)
        el.removeChild(el.lastChild);
}
function createElement(type, { text, classes } = {}) {
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
function createElementMultilineText(type, { text, classes } = {}) {
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
function createTableRow({ rowClasses, headers, cells } = {}) {
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
