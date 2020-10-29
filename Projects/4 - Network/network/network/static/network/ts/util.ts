// A few shorthand functions due to my laziness
const byId = (id: string) => document.getElementById(id);
const newEl = <K extends keyof HTMLElementTagNameMap>(tag: K, classes: string[] = []) => {
    const el = document.createElement(tag);
    el.classList.add(...classes);
    return el;
};

/**
 * Append text node to a node
 * @param {string} str - The string to be added to the node
 */
Node.prototype.appendText = function (str: string): void {
    const text = document.createTextNode(str);
    this.appendChild(text);
};

/**
 * Clear all children of an node
 */
Node.prototype.clearChildren = function (): void {
    while (this.lastChild) this.removeChild(this.lastChild);
};

/**
 * Gets the time part of a date object
 * @returns {number} - The time part in milliseconds
 */
Date.prototype.getTimePart = function (): number {
    return this.getTime() % (1000 * 60 * 60 * 24);
}

/**
 * Display error to the end user
 * @param {string} errorMsg - The error message string
 */
function showError(errorMsg: string): void {
    console.error(errorMsg);
    alert(errorMsg);
}

/**
 * Check if fetch response indicates an error
 * @param {PotentialErrorResponse<T>} response - The response that potentially indicates an error
 * @returns {T | null} - The good response, or `null` for bad response
 */
function checkError<T extends object>(response: PotentialErrorResponse<T>): T | null {
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
 * @param {string[]} paths - Array of the paths
 * @param {string} viewBox - Viewbox, default "0 0 16 16"
 */
function createSvg(paths: string[], viewBox: string = "0 0 16 16"): SVGSVGElement {
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

/**
 * Calculate time difference and present in human-readable form
 *   Rounded down to the nearest unit
 * @param {number} now  - Current Unix timestamp (in seconds)
 * @param {number} time - Unix timestamp to compare to (in seconds)
 */
function timeDiff(now: number, time: number): string {
    let diffSecs = Math.trunc(now - time);
    let suffix: string;
    let future: number;
    if (diffSecs < 0) {
        future = -1;
        suffix = "in the future";
        diffSecs = -diffSecs;
    } else if (diffSecs > 0) {
        future = 1;
        suffix = "ago";
    } else {
        return "Now";
    }
    if (diffSecs < 60) {
        return `${diffSecs} second${diffSecs === 1 ? "" : "s"} ${suffix}`;
    }
    const diffMins = Math.trunc(diffSecs / 60);
    if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? "" : "s"} ${suffix}`;
    }
    const diffHrs = Math.trunc(diffMins / 60);
    if (diffHrs < 24) {
        return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ${suffix}`;
    }
    const nowDate = new Date(now * 1000);
    const timeDate = new Date(time * 1000);
    const fullDayPad = +((nowDate.getTimePart() - timeDate.getTimePart()) * future >= 0) - 1;
    const fullMonthPad = +((nowDate.getDate() - timeDate.getDate()) * future + fullDayPad >= 0) - 1;
    const diffDays = Math.trunc(diffHrs / 24);
    const diffMonths = (nowDate.getMonth() - timeDate.getMonth()) * future + fullMonthPad;
    if (diffDays < 31 && diffMonths === 0) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ${suffix}`;
    }
    const fullYearPad = +(diffMonths >= 0) - 1;
    const diffYears = (nowDate.getFullYear() - timeDate.getFullYear()) * future + fullYearPad;
    if (!diffYears) {
        const diffMonthsPositive = (diffMonths + 12) % 12;
        return `${diffMonthsPositive} month${diffMonthsPositive === 1 ? "" : "s"} ${suffix}`;
    } else {
        return `${diffYears} year${diffYears === 1 ? "" : "s"} ${suffix}`;
    }
}
