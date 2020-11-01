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
 * Awaitable setTimeOut
 * @param {number} ms - Amount of time to be waited
 */
const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));