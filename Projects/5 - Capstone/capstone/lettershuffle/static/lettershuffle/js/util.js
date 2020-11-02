"use strict";
/**
 * Shuffle array using Fisher-Yates
 */
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
};
/**
 * Append text to Div
 * @param {string} str - The string to be appended
 */
Node.prototype.appendText = function (str) {
    const text = document.createTextNode(str);
    this.appendChild(text);
};
/**
 * Remove all children of a node
 */
Node.prototype.clearChildren = function () {
    while (this.lastChild !== null) {
        this.removeChild(this.lastChild);
    }
};
/**
 * Shorthand for `document.getElementById`
 * @param {string} id            - ID of the element
 * @returns {HTMLElement | null} - The element with the given ID
 */
const byId = (id) => document.getElementById(id);
/**
 * Create a new element with given tag and classes
 * @param {keyof HTMLElementTagNameMap} tag - Tag name
 * @param {string[]?} classes               - Optional classes
 * @returns {HTMLElementTagNameMap[tag]}    - Corresponding element
 */
function newEl(tag, classes) {
    const el = document.createElement(tag);
    if (classes !== undefined) {
        el.classList.add(...classes);
    }
    return el;
}
/**
 * Find the closest number in an array to a number
 * @param {number[]} arr - The array of number to check from
 * @param {number} val   - The number to check with
 * @returns {number}     - The closest number
 */
const closestInArray = (arr, val) => arr.reduce((prev, cur) => Math.abs(cur - val) < Math.abs(prev - val) ? cur : prev);
