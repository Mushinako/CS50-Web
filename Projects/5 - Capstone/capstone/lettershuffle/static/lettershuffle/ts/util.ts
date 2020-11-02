/**
 * Shuffle array using Fisher-Yates
 */
Array.prototype.shuffle = function (): void {
    for (let i = this.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
}

/**
 * Append text to Div
 * @param {string} str - The string to be appended
 */
Node.prototype.appendText = function (str: string): void {
    const text = document.createTextNode(str);
    this.appendChild(text);
}

/**
 * Remove all children of a node
 */
Node.prototype.clearChildren = function (): void {
    while (this.lastChild !== null) {
        this.removeChild(this.lastChild);
    }
}

/**
 * Shorthand for `document.getElementById`
 * @param {string} id            - ID of the element
 * @returns {HTMLElement | null} - The element with the given ID
 */
const byId = (id: string): HTMLElement | null => document.getElementById(id);

/**
 * Create a new element with given tag and classes
 * @param {keyof HTMLElementTagNameMap} tag - Tag name
 * @param {string[]?} classes               - Optional classes
 * @returns {HTMLElementTagNameMap[tag]}    - Corresponding element
 */
function newEl<K extends keyof HTMLElementTagNameMap>(tag: K, classes?: string[]): HTMLElementTagNameMap[K] {
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
const closestInArray = (arr: number[], val: number): number => arr.reduce((prev: number, cur: number): number => Math.abs(cur - val) < Math.abs(prev - val) ? cur : prev);

/**
 * Find the smallest number no less than provided value in an array
 * @param {number[]} arr - The number array to be checked
 * @param {number} val   - The number to check
 * @returns {number}     - The smallest satisfactory number
 */
function smallestElementAfter(arr: number[], val: number): number | null {
    arr.sort();
    for (const el of arr) {
        if (val <= el) {
            return el;
        }
    }
    return null;
}

/**
 * Simple function to check whether a number array is sorted
 * @param {number[]} arr - The number array to be checked
 * @returns {boolean}    - The result
 */
function arrayIsSorted(arr: number[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}