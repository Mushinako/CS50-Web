"use strict";
// A few shorthand functions due to my laziness
const byId = (id) => document.getElementById(id);
const newEl = (tag, classes = []) => {
    const el = document.createElement(tag);
    el.classList.add(...classes);
    return el;
};
/**
 * Append text node to a node
 * @param str {string} - The string to be added to the node
 */
Node.prototype.appendText = function (str) {
    const text = document.createTextNode(str);
    this.appendChild(text);
};
/**
 * Clear all children of an node
 */
Node.prototype.clearChildren = function () {
    while (this.lastChild)
        this.removeChild(this.lastChild);
};
/**
 * Display error to the end user
 * @param errorMsg {string} - The error message string
 */
function showError(errorMsg) {
    console.error(errorMsg);
    alert(errorMsg);
}
/**
 * Check if fetch response indicates an error
 * @param response {PotentialErrorResponse} - The response that potentially indicates an error
 * @returns - The good response, or `null` for bad response
 */
function checkError(response) {
    if (response === undefined) {
        showError("No response got from server.");
        return null;
    }
    if ("err" in response) {
        showError(response.err);
        return null;
    }
    return response;
}
/**
 * Create an SVG given the paths
 * @param paths {string[]} - Array of the paths
 * @param viewBox {string} - Viewbox, default "0 0 16 16"
 */
function createSvg(paths, viewBox = "0 0 16 16") {
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
