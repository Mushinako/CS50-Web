"use strict";
function showError(errorMsg) {
    console.error(errorMsg);
    clearChildren(errorViewDiv);
    const errorText = document.createTextNode(errorMsg);
    errorViewDiv.appendChild(errorText);
    errorViewDiv.style.display = "block";
}
function clearChildren(el) {
    while (el.lastChild)
        el.removeChild(el.lastChild);
}
