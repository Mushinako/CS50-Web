"use strict";
function toCurrency(inputEl) {
    inputEl.value = parseFloat(inputEl.value).toFixed(2);
}
document.addEventListener("DOMContentLoaded", () => {
    const bidInput = document.getElementById("id-bid");
    toCurrency(bidInput);
    bidInput.addEventListener("change", () => {
        toCurrency(bidInput);
    });
});
