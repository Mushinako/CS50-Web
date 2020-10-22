"use strict";
function toCurrency(inputEl) {
    const float = parseFloat(inputEl.value);
    if (!isNaN(float)) {
        inputEl.value = float.toFixed(2);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const bidInput = document.getElementById("id-bid");
    toCurrency(bidInput);
    bidInput.addEventListener("change", () => {
        toCurrency(bidInput);
    });
});
