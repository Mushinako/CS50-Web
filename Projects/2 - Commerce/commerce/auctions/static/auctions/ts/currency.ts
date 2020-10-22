"use strict";

function toCurrency(inputEl: HTMLInputElement): void {
    const float = parseFloat(inputEl.value)
    if (!isNaN(float)) {
        inputEl.value = float.toFixed(2);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const bidInput = <HTMLInputElement>document.getElementById("id-bid");
    toCurrency(bidInput)
    bidInput.addEventListener("change", (): void => {
        toCurrency(bidInput);
    });
});
