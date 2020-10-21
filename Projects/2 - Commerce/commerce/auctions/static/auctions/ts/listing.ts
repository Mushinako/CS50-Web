"use strict";

function toCurrency(inputEl: HTMLInputElement): void {
    inputEl.value = parseFloat(inputEl.value).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
    const bidInput = <HTMLInputElement>document.getElementById("id-bid");
    toCurrency(bidInput)
    bidInput.addEventListener("change", (): void => {
        toCurrency(bidInput);
    });
});
